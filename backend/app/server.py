from flask import request, g, abort
from functools import wraps
from datetime import datetime
from pathlib import Path
import jwt, logging, json, os, swish, dateutil.parser
from app_config import app
import database_helper as db_helper
from push_notification import push_notification_worker
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

logging.basicConfig(filename='server.log', filemode='w', format='%(name)s - %(levelname)s - %(message)s')


connected_companys = {}


@app.route("/ws/connect/company")
def connect_company():
    """
    Connect a company to the server via a websocket.
    """
    if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket']
        while True:
            result = {'status': 401, 'statusText': 'Unauthorized', 'type': 'connect'}
            message = ws.receive()
            if not message: # connection closed
                ws.close()
                for id, socket in connected_companys.items():
                    if ws == socket:
                        connected_companys.pop(id, None)
                        break
                break
            message = json.loads(message)
            g.user = verify_user_token(message['token'])
            if g.user:
                result['status'] = 200
                result['statusText'] = 'OK'
                completed_purchases = db_helper.get_completed_purchases(g.user.company)
                purchases = [purchase.serialize() for purchase in completed_purchases]
                result['completed_purchases'] = purchases
                active_purchases = db_helper.get_active_purchases(g.user.company)
                purchases = [purchase.serialize() for purchase in active_purchases]
                result['active_purchases'] = purchases
                connected_companys[g.user.id] = ws
            ws.send(json.dumps(result))
        return ''


def verify_token(func):
    """
    Used to decorate a http route where the user is needed to be signed in
    to deny access when a invalid access is caught.
    :param func: The inner function that should be access protected
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')
        g.user = verify_user_token(token)
        if not g.user:
            abort(401)
        return func(*args, **kwargs)
    return wrapper


@app.route("/", methods=['GET'])
def hello():
    return "helooo", 200


@app.route("/user/sign-up", methods=['POST'])
def sign_up():
    result = "user not created", 400
    json_data = request.get_json()
    if valid_password(json_data['password']):
        if db_helper.create_user(json_data['email'], json_data['password']):
            result = "user signed up", 200
    return result


@app.route("/user/sign-in", methods=['POST'])
def sign_in():
    result = "json error", 400
    json_data = request.get_json()
    if 'email' in json_data and 'password' in json_data:
        result = "wrong password or user", 401
        user = db_helper.get_user_by_email(json_data['email'])
        if user:
            if user.verify_password(json_data['password']):
                token = user.generate_token()
                result = json.dumps({'token': token}), 200
    return result


@app.route("/user/change-password", methods=['POST'])
@verify_token
def change_password():
    result = "password not changed", 400
    json_data = request.get_json()
    if 'oldPassword' in json_data and 'newPassword' in json_data:
        result = 'invalid password', 400
        if valid_password(json_data['newPassword']):
            result = "old password doesn't match current password", 400
            if db_helper.change_password(g.user, json_data['oldPassword'], json_data['newPassword']):
                result = 'password changed', 200
    return result


@app.route("/company/create", methods=['POST'])
@verify_token
def create_company():
    result = "company not created", 400
    json_data = request.get_json()
    swish_number = None
    if 'swishNumber' in json_data:
        swish_number = json_data['swishNumber']
    new_company = db_helper.create_company(json_data['companyName'], g.user, swish_number)
    if new_company:
        result = json.dumps(new_company.serialize()), 200
    return result


@app.route("/company/<company_id>", methods=['GET'])
def get_company(company_id):
    # get a single company
    result = "company not found", 404
    company = db_helper.get_company_by_id(company_id)
    if company:
        result = json.dumps(company.serialize()), 200
    return result


@app.route("/companies", methods=['GET'])
def get_companies():
    # for now: get ALL companies
    companies = db_helper.get_all_companies()
    serialized_companies = [company.serialize() for company in companies]
    return json.dumps({'companies': serialized_companies}), 200


@app.route("/company/<company_id>/products", methods=['GET'])
def get_products(company_id):
    result = "company not found", 404
    company = db_helper.get_company_by_id(company_id)
    if company:
        product_json = [product.serialize() for product in company.products]
        result = json.dumps({'products': product_json}), 200
    return result


@app.route("/product/create", methods=['POST'])
@verify_token
def create_product():
    result = "product not created", 400
    json_data = request.get_json()
    category = None
    if 'category' in json_data: # category is optional
        category = json_data['category']
    company = g.user.company
    if company:
        new_product = db_helper.create_product(json_data['name'], json_data['price'], company, category)
        result = json.dumps(new_product.serialize()), 200
    return result


@app.route("/product/edit/<product_id>", methods=['POST'])
@verify_token
def edit_product(product_id):
    result = "product not edited", 400
    edited_product = db_helper.edit_product(product_id, g.user, request.get_json())
    if edited_product:
        result = json.dumps(edited_product.serialize()), 200
    return result


@app.route("/product/delete/<product_id>", methods=['POST'])
@verify_token
def delete_product(product_id):
    result = "product not deleted", 400
    if db_helper.delete_product(product_id, g.user):
        result = "product deleted", 200
    return result


@app.route("/purchases/active", methods=['GET'])
@verify_token
def get_active_purchases():
    active_purchases = db_helper.get_active_purchases(g.user.company)
    purchases = [purchase.serialize() for purchase in active_purchases]
    return json.dumps({'active_purchases': purchases}), 200


@app.route("/purchase/makecompleted/<purchase_id>", methods=['POST'])
@verify_token
def make_purchase_completed(purchase_id):
    result = "purchase not found", 404
    purchase = db_helper.get_purchase_by_id(purchase_id)
    if purchase:
        purchase.completed = True
        save_to_db(purchase)
        # try to notify the person who purchased it
        push_notification_worker.queue_task(
            push_notification_worker.send_push_notification,
            {'token': purchase.pushNotificationToken, 'message': 'Your purchase is done!'})
        result = json.dumps(purchase.serialize()), 200
    return result


@app.route("/purchases/completed", methods=['GET'])
@verify_token
def get_completed_purchases():
    completed_purchases = db_helper.get_completed_purchases(g.user.company)
    purchases = [purchase.serialize() for purchase in completed_purchases]
    return json.dumps({'completed_purchases': purchases}), 200


@app.route("/purchase", methods=['POST'])
def purchase():
    # expected json:
    # {'products': [{'id': 1, 'quantity': 3}, {'id': 3, 'quantity': 1}]}
    json_data = request.get_json()
    result = "faulty json", 400
    if 'products' in json_data and len(json_data['products']) > 0:
        new_purchase = db_helper.create_purchase()
        company = None
        for product in json_data['products']:
            found_product = db_helper.get_product_by_id(product['id'])
            if found_product:
                if company:
                    if found_product.company != company:
                        abort(403) # forbidden to buy from two different companies at the same time
                else:
                    company = found_product.company
                new_purchase_item = db_helper.create_purchase_item(product['quantity'], found_product)
                new_purchase.purchase_items.append(new_purchase_item)
            else:
                abort(404) # a product was not found
        new_purchase.company = company
        new_purchase.setPrice()
        new_purchase.pushNotificationToken = json_data['pushNotificationToken']
        db_helper.save_to_db(new_purchase)
        result = json.dumps(new_purchase.serialize()), 200
    return result


@app.route("/pay/<string:payment_method>/<int:purchase_id>", methods=['POST'])
def pay(payment_method, purchase_id):
    result = "not a valid payment method", 400
    if app.config['SKIP_PAY']:
        purchase = db_helper.get_purchase_by_id(purchase_id)
        purchase.payment_status = 'PAID'
        purchase.payment_date = datetime.utcnow()
        db_helper.save_to_db(purchase)
        result = json.dumps({'payment_skipped': True, 'purchase': purchase.serialize()}), 200
        if purchase.company.id in connected_companys:
            websocket = connected_companys[purchase.company.id]
            websocket.send(json.dumps({'type': 'new_purchase', 'purchase': purchase.serialize()}))
    elif payment_method == "swish":
        result = "purchase not found", 404
        found_purchase = db_helper.get_purchase_by_id(purchase_id)
        if found_purchase:
            result = "purchase already paid for", 409
            if found_purchase.payment_status != "PAID":
                result = start_pay_swish(found_purchase)
    return result


@app.route("/swishcallback/paymentrequest", methods=['POST'])
def swish_callback_payment_request():
    """IMPORTANT: ONLY GetSwish AB should be able to use this route"""
    json_data = request.get_json()
    logging.debug(json_data)
    result = "payeePaymentReference not found", 404
    if 'payeePaymentReference' in json_data:
        purchase_id = json_data['payeePaymentReference']
        purchase = db_helper.get_purchase_by_id(purchase_id)
        result = "purchase not found", 404
        if purchase:
            result = "", 200
            if json_data['status'] == 'PAID':
                purchase.payment_status = 'PAID'
                purchase.payment_date = dateutil.parser.parse(json_data['datePaid'])
                db_helper.save_to_db(purchase)
                if purchase.company.id in connected_companys:
                    # notify foodtruck they have a new order
                    websocket = connected_companys[purchase.company.id]
                    websocket.send(json.dumps({'type': 'new_purchase', 'purchase': purchase.serialize()}))
                # (2) notify the one that purchased it that the payment has gone through
            elif json_data['status'] == 'DECLINED':
                # The payer declined to make the payment
                pass
            elif json_data['status'] == 'ERROR':
                handle_swish_payment_request_error(
                    json_data['errorCode'], json_data['errorMessage'],
                    json_data['additionalInformation'], purchase)
    return result


def start_pay_swish(purchase):
    result = "swish number not found for the company", 404
    if purchase.company.swish_number:
        dirname = os.path.dirname(__file__)
        path_cert_pem = os.path.join(dirname, 'certs/' + purchase.company.name + '/merchant.pem')
        path_key_pem = os.path.join(dirname, 'certs/' + purchase.company.name + '/merchant.key')
        path_swish_pem = os.path.join(dirname, 'certs/' + purchase.company.name + '/swish.pem')
        # check if files exist
        result = "certificates not found for the company", 404
        if Path(path_cert_pem).is_file() and Path(path_key_pem).is_file() and Path(path_swish_pem).is_file():
            swish_client = swish.SwishClient(
                environment=swish.Environment.Test,
                merchant_swish_number=purchase.company.swish_number,
                cert=(path_cert_pem, path_key_pem),
                verify=path_swish_pem
            )
            payment = swish_client.create_payment(
                payee_payment_reference=purchase.id,
                callback_url='https://swish.mastega.nu/swishcallback/paymentrequest',
                amount=purchase.total_price,
                currency='SEK',
                message=purchase.createPurchaseMessage()
            )
            purchase.swish_payment_id = payment.id
            purchase.swish_payment_location = payment.location
            db_helper.save_to_db(purchase)
            result = json.dumps({'request_token': payment.request_token}), 200
    return result


def handle_swish_payment_request_error(error_code, error_message, additional_information, purchase):
    # save info about the error
    purchase.payment_status = 'ERROR'
    purchase.error_code = 'ERROR'
    purchase.error_message = error_message
    purchase.additional_information = additional_information
    db_helper.save_to_db(purchase)
    if error_code == 'ACMT03':
        # Payer not enrolled.
        pass
    elif error_code == 'ACMT01':
        # Counterpart is not activated
        pass
    elif error_code == 'ACMT07':
        # Payee not enrolled.
        pass
    elif error_code == 'RF07':
        """
        Transaction declined. The payment was unfortunately declined.
        A reason for the decline could be that the payer has exceeded
        their defined Swish limit. Please advise the payer to check
        with their bank.
        """
        pass
    elif error_code == 'BANKIDCL':
        # Payer cancelled BankID signing.
        pass
    elif error_code == 'FF10':
        # Bank system processing error.
        pass
    elif error_code == 'TM01':
        # Swish timed out before the payment was started.
        pass
    elif error_code == 'DS24':
        """
        Swish timed out waiting for an answer from the banks after payment was started.
        Note: If this happens Swish has no knowledge of whether the payment was
        successful or not. The merchant should inform its consumer about this and
        recommend them to check with their bank about the status of this payment.
        """
        pass
    elif error_code == 'BANKIDONGOING':
        # BankID already in use.
        pass
    elif error_code == 'BANKIDUNKN':
        # BankID is not able to authorize the payment.
        pass


def valid_password(password):
    """ used to validate a password """
    result = False
    if len(password) > 2:
        result = True
    return result


def verify_user_token(token):
    try:
        decoded_token = jwt.decode(token, app.config["SECRET_KEY"], algorithms=['HS256'])
        if datetime.utcnow() < datetime.fromtimestamp(decoded_token['exp']):
            return db_helper.get_user_by_email(decoded_token['email'])
    except Exception as e:
        logging.warning("Faulty token: " + repr(e))


def start_server(): # pragma: no cover
    db_helper.db_reset()
    db_helper.seed_database()
    """Start the server."""
    print('STARTING SERVER...')
    http_server = WSGIServer(('0.0.0.0', 5000), app, handler_class=WebSocketHandler)
    print("SERVER STARTED")
    http_server.serve_forever()

if __name__ == '__main__':
    start_server()
