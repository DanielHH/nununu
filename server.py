from flask import Flask, request, g, abort
from models import db, User, Company, Product
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
        result = "company created", 200
    return result

@app.route("/company/<company_id>/products", methods=['GET'])
def get_products(company_id):
    result = "company not found", 404
    company = Company.query.filter(Company.id == company_id).first()
    if company:
        product_json = [product.jsonify() for product in company.products]
        json.dumps({'products': product_json}), 200
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
        result = "product created", 200
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
                result = "product edited", 200
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

if __name__ == "__main__":
    app.run()
