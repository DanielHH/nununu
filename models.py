from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import jwt, logging

SECRET_KEY = 'nununu ar en bra app for den hungrige'
db = SQLAlchemy()


class Company(db.Model):
    __tablename__ = 'company'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    reg_date = db.Column(db.DateTime)
    # for now: a company has ONE owner and the user has A company
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    owner = db.relationship("User", backref=db.backref("company", uselist=False))
    # a company has many products
    products = db.relationship("Product", back_populates="company")

    def __init__(self, name):
        self.name = name
        self.reg_date = datetime.utcnow()


class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.DECIMAL, nullable=False) # important must be able to store decimals!
    create_date = db.Column(db.DateTime)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))
    company = db.relationship("Company", back_populates="products")

    def __init__(self, name, price, category=None):
        self.name = name
        self.price = price
        if category:
            self.category = category
        self.create_date = datetime.utcnow()

    def jsonify(self):
        return {'id': self.id, 'name': self.name, 'price': self.price}


class Purchase(db.Model):
    __tablename__ = 'purchase'
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(255), nullable=False)
    purchase_date = db.Column(db.DateTime)

    def __init__(self, order_number, status):
        self.order_number = order_number
        self.status = status
        self.purchase_date = datetime.utcnow()


class PurchaseItem(db.Model):
    __tablename__ = 'purchaseitem'
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    price_per_item = db.Column(db.DECIMAL, nullable=False) # important must be able to store decimals!

    def __init__(self, quantity, price_per_item):
        self.quantity = quantity
        self.price_per_item = price_per_item


class User(db.Model):
    """
    The User class is used to handle a user of Nununu.
    """
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    reg_date = db.Column(db.DateTime)

    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.reg_date = datetime.utcnow()

    def generate_token(self):
        token = jwt.encode({
            'exp': datetime.utcnow() + timedelta(days=7),
            'iat': datetime.utcnow(),
            'email': self.email,
            }, SECRET_KEY, algorithm='HS256').decode('utf-8')
        return token

    def verify_password(self, password):
        return self.password == password

    @staticmethod
    def valid_password(password):
        """ used to validate a password """
        result = False
        if len(password) > 2:
            result = True
        return result

    @staticmethod
    def verify_token(token):
        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            if datetime.utcnow() < datetime.fromtimestamp(decoded_token['exp']):
                return User.query.filter(User.email == decoded_token['email']).first()
        except Exception as e:
            logging.warning("Faulty token: " + repr(e))
