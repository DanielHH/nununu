from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.orderinglist import ordering_list
from datetime import datetime, timedelta
from decimal import Decimal
import jwt, logging
from app_config import app, db

class Company(db.Model):
    __tablename__ = 'company'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    swish_number = db.Column(db.Integer)
    reg_date = db.Column(db.DateTime)
    # for now: a company has ONE owner and the user has A company
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    owner = db.relationship("User", backref=db.backref("company", uselist=False))
    # a company has many products
    products = db.relationship("Product", back_populates="company")
    # a company has many purchases
    purchases = db.relationship("Purchase", back_populates="company")
    # a company has many categories
    categories = db.relationship("Category", back_populates="company", order_by="Category.position", 
                                collection_class=ordering_list('position'))


    def __init__(self, name, owner, swishNumber=None):
        self.name = name
        self.owner = owner
        self.reg_date = datetime.utcnow()
        if swishNumber:
            # TODO: Change,should NOT be done like this. This is ONLY for testing/dev purpose.
            # Certificates and swish number should be installed by us in contact with the company.
            self.swish_number = swishNumber

    def serialize(self):
        return {'id': self.id, 'name': self.name}


class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    position = db.Column(db.Integer, nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))
    company = db.relationship("Company", back_populates="categories")
    products = db.relationship("Product", back_populates="category", order_by="Product.position", 
                                collection_class=ordering_list('position'))

    def __init__(self, name, position, company):
        self.name = name
        self.position = position
        self.company = company

    def serialize(self):
        return {'id': self.id, 'name': self.name, 'position': self.position}


class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.DECIMAL, nullable=False) # important must be able to store decimals!
    description = db.Column(db.String, nullable=False)
    create_date = db.Column(db.DateTime)
    position = db.Column(db.Integer, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    category = db.relationship("Category", back_populates="products")
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))
    company = db.relationship("Company", back_populates="products")

    def __init__(self, name, price, description, company, position, category):
        self.name = name
        self.price = price
        self.description = description
        self.company = company
        self.position = position
        self.category = category
        self.create_date = datetime.utcnow()

    def serialize(self):
        return {'id': self.id, 'name': self.name, 'price': str(self.price), 'description': self.description, 'position': self.position, 'categoryId': self.category.id}


class Purchase(db.Model):
    __tablename__ = 'purchase'
    id = db.Column(db.Integer, primary_key=True)
    purchase_date = db.Column(db.DateTime)
    total_price = db.Column(db.DECIMAL)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))
    company = db.relationship("Company", back_populates="purchases")
    # A purchase can be composed of many products
    purchase_items = db.relationship("PurchaseItem", back_populates="purchase")
    swish_payment_id = db.Column(db.String(255))
    swish_payment_location = db.Column(db.String(255))
    payment_status = db.Column(db.String(255))
    payment_date = db.Column(db.DateTime)
    error_code = db.Column(db.String(255))
    error_message = db.Column(db.String(255))
    completed = db.Column(db.Boolean, default=False)
    pushNotificationToken = db.Column(db.String(255))
    purchaser_id = db.Column(db.String(255))

    def __init__(self):
        self.purchase_date = datetime.utcnow()

    def setPrice(self):
        # calculates and sets the total price for the purchase
        price = Decimal(0)
        for purchase_item in self.purchase_items:
            price += purchase_item.price_per_item * purchase_item.quantity
        self.total_price = price


    def createPurchaseMessage(self):
        result = ""
        for item in self.purchase_items:
            result += str(item.quantity) + " " + item.product.name + ", "
        return result[:-2] # remove trailing comma

    def serialize(self):
        return {'id': self.id,
                'payment_status': self.payment_status,
                'completed': self.completed,
                'purchase_date': str(self.purchase_date),
                'totalPrice': str(self.total_price),
                'errorCode': self.error_code,
                'errorMessage': self.error_message,
                'company': self.company.serialize(),
                'items': [item.serialize() for item in self.purchase_items],
                'purchaseMessage': self.createPurchaseMessage()}


class PurchaseItem(db.Model):
    __tablename__ = 'purchaseitem'
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    price_per_item = db.Column(db.DECIMAL, nullable=False) # important must be able to store decimals!
    purchase_id = db.Column(db.Integer, db.ForeignKey('purchase.id'))
    purchase = db.relationship("Purchase", back_populates="purchase_items")
    # a relation to the purchased product
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    product = db.relationship("Product")

    def __init__(self, quantity, product):
        self.quantity = quantity
        self.product = product
        self.price_per_item = product.price

    def serialize(self):
        return {'id': self.id, 'name': self.product.name, 'quantity': self.quantity,
                'pricePerItem': str(self.price_per_item)}


class User(db.Model):
    """
    The User class is used to handle a user of Nununu.
    """
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    reg_date = db.Column(db.DateTime)

    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.reg_date = datetime.utcnow()

    def __eq__(self, other):
        return self.id == other.id

    def __hash__(self):
        return hash(str(self))

    def generate_token(self, exp=604800):
        token = jwt.encode({
            'exp': datetime.utcnow() + timedelta(seconds=exp),
            'iat': datetime.utcnow(),
            'email': self.email,
            }, app.config["SECRET_KEY"], algorithm='HS256').decode('utf-8')
        return token

    def verify_password(self, password):
        return self.password == password
