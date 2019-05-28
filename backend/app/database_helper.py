from app_config import db
from models import User, Company, Product, Purchase, PurchaseItem, Category

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


def reset_password(user, password):
    user.password = password
    save_to_db(user)


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


def get_company_by_user(user):
    return Company.query.filter_by(owner_id=user.id).first()


def get_all_companies():
    return Company.query.all()


##################################
### Category related functions ###
##################################
def create_category(name, position, company):
    new_category = Category(name, position, company)
    if new_category:
        save_to_db(new_category)
        return new_category


def get_category_by_id(category_id):
    return Category.query.filter_by(id=category_id).first()


def get_category_by_name_and_company(category_name, company_id):
    return Category.query.filter(Category.name == category_name,
            Category.company_id == company_id).first()


def reorder_categories(categories):
    for category in categories:
        category_in_db = get_category_by_id(category['id'])
        if category_in_db == None:
            return "product id does not map to product in db", 400
        category_in_db.position = category['position']
    db.session.commit()
    return "categories reordered", 200


def get_category_position(company):
    position = 0
    if company.categories:
        position = company.categories[-1].position + 1
    return position


#################################
### Product related functions ###
#################################
def create_product(name, price, description, company, position, category):
    new_product = Product(name, price, description, company, position, category)
    if new_product:
        save_to_db(new_product)
        return new_product


def get_product_by_id(product_id):
    return Product.query.filter_by(id=product_id).first()


def edit_product(product_id, owner, json_data):
    product = get_product_by_id(product_id)
    if product:
        if owner == product.company.owner:
            product.name = json_data['name']
            product.price = json_data['price']
            product.description = json_data['description']
            category = get_category_by_id(json_data['categoryId'])
            product.category = category
            db.session.commit()
            return product


def reorder_products(products):
    for product in products:
        product_in_db = get_product_by_id(product['id'])
        if product_in_db == None:
            return "product id does not map to product in db", 400
        product_in_db.position = product['position']
    db.session.commit()
    return "products reordered", 200

def delete_product(product_id, owner):
    product = get_product_by_id(product_id)
    if product:
        if owner == product.company.owner:
            delete_from_db(product)
            return product

def get_product_position(category):
    position = 0
    if category.products:
        position = category.products[-1].position + 1
    return position


##################################
### Purchase related functions ###
##################################
def create_purchase():
    purchase = Purchase()
    save_to_db(purchase)
    return purchase


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
    test_user_2 = create_user(**{'email': 'test2@test.test', 'password': '1234'})
    test_user_3 = create_user(**{'email': 'test3@test.test', 'password': '1234'})
    test_company = create_company(**{'name': 'test', 'owner': test_user, 'swishNumber': 1231181189})
    mastega_user = create_user(**{'email': 'mastega.nu@gmail.com', 'password': '1234'})
    mastega_company = create_company(**{'name': 'Mastega', 'owner': mastega_user, 'swishNumber': 1230450692})
    test_company_2 = create_company(**{'name': 'Feta Burgers', 'owner': test_user_2, 'swishNumber': 1234512345})
    test_company_3 = create_company(**{'name': 'Chok najs', 'owner': test_user_3, 'swishNumber': 1239067891})
    burgare = create_category(**{'name': 'Burgare', 'position': 0, 'company': mastega_company})
    indisk = create_category(**{'name': 'Indiskt', 'position': 0, 'company': test_company_2})
    dryck = create_category(**{'name': 'Dryck', 'position': 1, 'company': mastega_company})
    extra = create_category(**{'name': 'Extra', 'position': 0, 'company': test_company_3})
    blandat = create_category(**{'name': 'Blandat', 'position': 0, 'company': test_company})
    product1 = create_product(**{'name': 'Hamburgare', 'price': 0.30, 'description': 'vanlig burgare', 'company': mastega_company, 'position': 0, 'category': burgare})
    product2 = create_product(**{'name': 'Cheeseburgare', 'price': 0.25, 'description': 'ostig burgare', 'company': mastega_company, 'position': 1, 'category': burgare})
    product3 = create_product(**{'name': 'Vegoburgare', 'price': 0.25, 'description': 'vegetarisk burgare', 'company': mastega_company, 'position': 2, 'category': burgare})
    product4 = create_product(**{'name': 'Vatten', 'price': 0.10, 'description': 'H2O', 'company': mastega_company, 'position': 0, 'category': dryck})
    product5 = create_product(**{'name': 'Cola', 'price': 0.20, 'description': 'Not Pepsi', 'company': mastega_company, 'position': 1, 'category': dryck})
    product6 = create_product(**{'name': 'Bröd', 'price': 0.10, 'description': 'Ljust och lite mögligt', 'company': test_company, 'position': 0, 'category': blandat})
    product7 = create_product(**{'name': 'Vatten', 'price': 0.20, 'description': 'För det mesta rent', 'company': test_company, 'position': 1, 'category': blandat})
