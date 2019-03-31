from flask import Flask, request, g, abort
from models import db, User, Company, Product, Purchase, PurchaseItem
from functools import wraps
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()


def verify_token(func):
    """
    Used to decorate a http route where the user is needed to be signed in
    to deny access when a invalid access is caught.
    :param func: The inner function that should be access protected
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')
        g.user = User.verify_token(token)
        if not g.user:
            abort(401)
        return func(*args, **kwargs)
    return wrapper


@app.route("/user/sign-up", methods=['POST'])
def sign_up():
    result = "user not created", 400
    json_data = request.get_json()
    if User.valid_password(json_data['password']):
        new_user = User(json_data['email'], json_data['password'])
        if new_user:
            db.session.add(new_user)
            db.session.commit()
            result = "user signed up", 200
    return result


@app.route("/user/sign-in", methods=['POST'])
def sign_in():
    result = "json error", 400
    json_data = request.get_json()
    if 'email' in json_data and 'password' in json_data:
        result = "wrong password or user", 401
        user = User.query.filter(User.email == json_data['email']).first()
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
        if g.user.password == json_data['oldPassword']:
            result = 'invalid password', 400
            if g.user.valid_password(json_data['newPassword']):
                g.user.password = json_data['newPassword']
                db.session.add(g.user)
                db.session.commit()
                result = "password changed", 200
    return result


@app.route("/company/create", methods=['POST'])
@verify_token
def create_company():
    result = "company not created", 400
    json_data = request.get_json()
    new_company = Company(json_data['companyName'])
    if new_company:
        new_company.owner = g.user
        db.session.add(new_company)
        db.session.commit()
        result = json.dumps(new_company.serialize()), 200
    return result


@app.route("/company/<company_id>", methods=['GET'])
def get_company(company_id):
    # get a single company
    result = "company not found", 404
    company = Company.query.filter(Company.id == company_id).first()
    if company:
        result = json.dumps(company.serialize()), 200
    return result


@app.route("/companies", methods=['GET'])
def get_companies():
    # for now: get ALL companies
    companies = Company.query.all()
    result = json.dumps([company.serialize() for company in companies]), 200
    return result


@app.route("/company/<company_id>/products", methods=['GET'])
def get_products(company_id):
    result = "company not found", 404
    company = Company.query.filter(Company.id == company_id).first()
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
    new_product = Product(json_data['name'], json_data['price'], category)
    company = g.user.company
    if new_product and company:
        new_product.company = company
        db.session.add(new_product)
        db.session.commit()
        result = json.dumps(new_product.serialize()), 200
    return result


@app.route("/product/edit/<product_id>", methods=['POST'])
@verify_token
def edit_product(product_id):
    result = "product not edited", 400
    product = Product.query.filter(Product.id == product_id).first()
    if product:
        if g.user == product.company.owner:
            json_data = request.get_json()
            if 'category' in json_data: # category is optional
                product.category = json_data['category']
            if 'name' in json_data and 'price' in json_data:
                product.name = json_data['name']
                product.price = json_data['price']
                db.session.add(product)
                db.session.commit()
                result = json.dumps(product.serialize()), 200
    return result


@app.route("/product/delete/<product_id>", methods=['POST'])
@verify_token
def delete_product(product_id):
    result = "product not deleted", 400
    product = Product.query.filter(Product.id == product_id).first()
    if product:
        if g.user == product.company.owner:
            db.session.delete(product)
            db.session.commit()
            result = "product deleted", 200
    return result


@app.route("/purchase", methods=['POST'])
def purchase():
    # expected json:
    # {'products': [{'id': 1, 'quantity': 3}, {'id': 3, 'quantity': 1}]}
    json_data = request.get_json()
    result = "faulty json", 400
    if 'products' in json_data and len(json_data['products'] > 0):
        new_purchase = Purchase()
        company = None
        for product in json_data['products']:
            found_product = Product.query.filter(Product.id == product['id']).first()
            if found_product:
                if company:
                    if found_product.company != company:
                        abort(403) # forbidden to buy from two different companies at the same time
                else:
                    company = found_product.company
                new_purchase_item = PurchaseItem(product['quantity'], found_product.price)
                new_purchase_item.product = found_product
                new_purchase.purchase_items.append(new_purchase_item)
            else:
                abort(404) # a product was not found
        new_purchase.company = company
        new_purchase.setPrice()
        db.session.add(new_purchase)
        db.session.commit()
        result = new_purchase.serialize(), 200
    return result


@app.route("/pay/<string:payment_method>/<int:purchase_id>", methods=['POST'])
def pay(payment_method, purchase_id):
    if payment_method == "swish":
        found_purchase = Purchase.query.filter(Purchase.id == purchase_id).first()
        payment = found_purchase.paySwish()
        return payment.request_token, 200


@app.route("/swishcallback/paymentrequest", methods=['POST'])
def swishcbPaymentrequest():
    """IMPORTANT: ONLY GetSwish AB should be able to use this route"""
    json_data = request.get_json()
    if json_data.status == "PAID":
        # order is paid for
        # (1) notify foodtruck they have a new order
        # (2) notify the one that purchased it that payment has gone through
        return "", 200


if __name__ == "__main__": # pragma: no cover
    app.run()
