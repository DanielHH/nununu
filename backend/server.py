from flask import request, g, abort
from functools import wraps
from datetime import datetime
import jwt, logging
import json
from app_config import app
import database_helper as db_helper


def verify_token(func):
    """
    Used to decorate a http route where the user is needed to be signed in
    to deny access when a invalid access is caught.
    :param func: The inner function that should be access protected
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')
        g.user = verify_token(token)
        if not g.user:
            abort(401)
        return func(*args, **kwargs)
    return wrapper


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
        result = "newpassword not matching oldPassword", 400
        if valid_password(json_data['newPassword']):
            result = 'invalid password', 400
            if db_helper.change_password(g.user, json_data['oldPassword'], json_data['newPassword']):
                result = "password changed", 200
    return result


@app.route("/company/create", methods=['POST'])
@verify_token
def create_company():
    result = "company not created", 400
    json_data = request.get_json()
    owner = db_helper.get_user_by_email(json_data['owner']['email'])
    new_company = db_helper.create_company(json_data['companyName'], owner)
    if new_company:
        result = json.dumps(new_company.serialize()), 200
    return result


@app.route("/company/<company_id>", methods=['GET'])
def get_company(company_id=None):
    result = "no companies", 400
    if company_id:
        result = "company not found", 404
        company = db_helper.get_company_by_id(company_id)
        if company:
            result = json.dumps(company.serialize()), 200
    return result


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
    return db_helper.delete_product(product_id, g.user)


@app.route("/purchase", methods=['POST'])
def purchase():
    # expected json:
    # {'products': [{'id': 1, 'quantity': 3}, {'id': 3, 'quantity': 1}]}
    json_data = request.get_json()
    result = "faulty json", 400
    if 'products' in json_data and len(json_data['products'] > 0):
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
                new_purchase_item = db_helper.create_purchase_item(product['quantity'], found_product.price)
                new_purchase_item.product = found_product
                new_purchase.purchase_items.append(new_purchase_item)
            else:
                abort(404) # a product was not found
        new_purchase.company = company
        new_purchase.setPrice()
        db_helper.save_to_db(new_purchase)
        result = new_purchase.serialize(), 200
    return result


def valid_password(password):
    """ used to validate a password """
    result = False
    if len(password) > 2:
        result = True
    return result


def verify_token(token):
    try:
        decoded_token = jwt.decode(token, app.config["SECRET_KEY"], algorithms=['HS256'])
        if datetime.utcnow() < datetime.fromtimestamp(decoded_token['exp']):
            return db_helper.get_user_by_email(decoded_token['email'])
    except Exception as e:
        logging.warning("Faulty token: " + repr(e))


if __name__ == "__main__": # pragma: no cover
    app.run()
    db_helper.db_reset()
