from app_config import db
from models import User, Company, Product, Purchase, PurchaseItem

##############################
### User related functions ###
##############################
def create_user(email, password):
    new_user = User(email, password)
    if new_user:
        save_to_db(new_user)
        return new_user


def get_user_by_email(email):
    return User.query.filter_by(email=email).first()


def change_password(user, password, new_password):
    if user.verify_password(password):
        user.password = new_password
        save_to_db(user)
        return True
    else:
        return False


#################################
### Company related functions ###
#################################
def create_company(name, owner, swishNumber=None):
    new_company = Company(name, owner, swishNumber)
    if new_company:
        save_to_db(new_company)
        return new_company


def get_company_by_id(company_id):
    return Company.query.filter_by(id=company_id).first()


def get_all_companies():
    return Company.query.all()


#################################
### Product related functions ###
#################################
def create_product(name, price, company, category):
    new_product = Product(name, price, company, category)
    if new_product:
        save_to_db(new_product)
        return new_product


def get_product_by_id(product_id):
    return Product.query.filter_by(id=product_id).first()


def edit_product(product_id, owner, json_data):
    product = get_product_by_id(product_id)
    if product:
        if owner == product.company.owner:
            if 'category' in json_data: # category is optional
                product.category = json_data['category']
            if 'name' in json_data and 'price' in json_data:
                product.name = json_data['name']
                product.price = json_data['price']
            save_to_db(product)
            return product


def delete_product(product_id, owner):
    product = get_product_by_id(product_id)
    if product:
        if owner == product.company.owner:
            delete_from_db(product)
            return product


##################################
### Purchase related functions ###
##################################
def create_purchase():
    purchase = Purchase()
    save_to_db(purchase)
    return Purchase()


def get_purchase_by_id(purchase_id):
    return Purchase.query.filter_by(id=purchase_id).first()


def get_active_purchases(company):
    return Purchase.query.filter_by(company=company,
                                    payment_status='PAID',
                                    completed=False).all()


def get_completed_purchases(company):
    return Purchase.query.filter_by(company=company,
                                    payment_status='PAID',
                                    completed=True).all()


#######################################
### Purchase item related functions ###
#######################################
def create_purchase_item(quantity, product):
    purchase_item = PurchaseItem(quantity, product)
    save_to_db(purchase_item)
    return purchase_item


######################
### Misc functions ###
######################
def save_to_db(entry):
    db.session.add(entry)
    db.session.commit()

def delete_from_db(entry):
    db.session.delete(entry)
    db.session.commit()

def db_reset():
    db.drop_all()
    db.create_all()

def seed_database():
    test_user = create_user(**{'email': 'test@test.test', 'password': '1234'})
    test_company = create_company(**{'name': 'test', 'owner': test_user, 'swishNumber': 1231181189})
    product1 = create_product(**{'name': 'Hamburgare', 'price': 10.99, 'company': test_company, 'category': 'Mat'})
    product2 = create_product(**{'name': 'Sallad', 'price': 8.49, 'company': test_company, 'category': 'Mat'})
    product3 = create_product(**{'name': 'Falafel', 'price': 5.49, 'company': test_company, 'category': 'Mat'})
    product4 = create_product(**{'name': 'Vatten', 'price': 2, 'company': test_company, 'category': 'Dricka'})
    product5 = create_product(**{'name': 'Cola', 'price': 2.5, 'company': test_company, 'category': 'Dricka'})
