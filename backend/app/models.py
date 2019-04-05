from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from decimal import Decimal
import jwt, logging, swish

SECRET_KEY = 'nununu ar en bra app for den hungrige'
db = SQLAlchemy()


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

    def __init__(self, name, swishNumber=None):
        self.name = name
        self.reg_date = datetime.utcnow()
        if swishNumber and name == "test":
            # TODO: Change,should NOT be done like this. This is ONLY for testing/dev purpose.
            # Certificates and swish number should be installed by us in contact with the company.
            self.swish_number = swishNumber

    def serialize(self):
        return {'id': self.id, 'name': self.name}


class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.DECIMAL, nullable=False) # important must be able to store decimals!
    category = db.Column(db.String(255), nullable=True)
    create_date = db.Column(db.DateTime)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))
    company = db.relationship("Company", back_populates="products")

    def __init__(self, name, price, category=None):
        self.name = name
        self.price = price
        if category:
            self.category = category
        self.create_date = datetime.utcnow()

    def serialize(self):
        return {'id': self.id, 'name': self.name, 'price': str(self.price), 'category': self.category}


class Purchase(db.Model):
    __tablename__ = 'purchase'
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(255), nullable=False)
    purchase_date = db.Column(db.DateTime)
    total_price = db.Column(db.DECIMAL)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))
    company = db.relationship("Company", back_populates="purchases")
    # A purchase can be composed of many products
    purchase_items = db.relationship("PurchaseItem", back_populates="purchase")

    def __init__(self):
        self.status = "not done"
        self.purchase_date = datetime.utcnow()

    def setPrice(self):
        # calculates and sets the total price for the purchase
        price = Decimal(0)
        for purchase_item in self.purchase_items:
            price += purchase_item.price_per_item * purchase_item.quantity
        self.total_price = price

    def paySwish(self):
        swish_client = swish.SwishClient(
            environment=swish.Environment.Test,
            merchant_swish_number=self.company.swish_number,
            cert=('/certs/' + self.company.name + '/merchant.pem', '/certs/' + self.company.name + '/merchant.key'),
            verify= '/certs/' + self.company.name + '/swish.pem'
        )
        payment = swish_client.create_payment(
            payee_payment_reference=self.id,
            callback_url='https://societygo.com/nununu/swishcallback/paymentrequest',
            amount=self.total_price,
            currency='SEK',
            message=self.createSwishMessage()
        )
        return payment

    def createSwishMessage(self):
        result = ""
        for item in self.purchase_items:
            item.quantity + " " + item.product.name + ","
        return result[:-1] # remove trailing comma

    def serialize(self):
        return {'id': self.id,
                'totalPrice': str(self.total_price),
                'company': self.company.serialize(),
                'items': [item.serialize() for item in self.purchase_items]}


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

    def __init__(self, quantity, price_per_item):
        self.quantity = quantity
        self.price_per_item = price_per_item

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
