import json, unittest
import server
import app_config as server
from app_config import db
from decimal import Decimal

user1 = {'email': 'kalle@anka.se', 'password': '1234'}
user2 = {'email': 'kajsa@anka.se', 'password': '4321'}

company1 = {'companyName': 'Nununu'}
company2 = {'companyName': 'test', 'swishNumber': 1231181189}

product1 = {'name': 'hamburgare', 'price': 10.99, 'category': 'mat'}
product2 = {'name': 'falafel', 'price': 5.49}

class ServerTestCases(unittest.TestCase):

    ########################
    ### Helper functions ###
    ########################
    def sign_up_user(self, user):
        """
        Populates the tester db with a user
        """
        response = self.tester.post('/user/sign-up', data=json.dumps(user), content_type = 'application/json')

    def sign_in_user(self, user):
        """
        Sign in a user and returns a valid token
        """
        response = self.tester.post('/user/sign-in', data=json.dumps(user), content_type = 'application/json')
        token = json.loads(response.data.decode(encoding='UTF-8'))['token']
        return token

    def create_company(self, company, token):
        """
        Creates a company for the user whos token it is
        """
        response = self.tester.post('/company/create', data=json.dumps(company), headers={'Authorization': token}, content_type = 'application/json')
        created_company = json.loads(response.data.decode(encoding='UTF-8'))
        return created_company

    def create_product(self, product, token):
        """
        Creates a product for the company the user whos token it is is owner of
        """
        response = self.tester.post('/product/create', data=json.dumps(product), headers={'Authorization': token}, content_type = 'application/json')
        created_product = json.loads(response.data.decode(encoding='UTF-8'))
        return created_product

    def setUp(self):
        # 'DEBUG' True causes AssertionError: A setup function was called after the first request was handled.
        server.app.config['DEBUG'] = False
        server.app.config['TESTING'] = True
        server.db.init_app(server.app)
        with server.app.app_context():
            # Extensions like Flask-SQLAlchemy now know what the "current" app
            # is while within this block. Therefore, you can now run........
            server.db.drop_all()
            self.app = server.app.test_client()
            server.db.create_all()
            self.tester = server.app.test_client(self)

    ##################
    ### unit tests ###
    ##################

    def test_response_sign_up(self):
        response = self.tester.post('/user/sign-up', data=json.dumps(user1), content_type = 'application/json')
        self.assertEqual(response.status_code, 200)

    def test_response_sign_in(self):
        self.sign_up_user(user1)
        response = self.tester.post('/user/sign-in', data=json.dumps(user1), content_type = 'application/json')
        self.assertEqual(response.status_code, 200)
        token = json.loads(response.data.decode(encoding='UTF-8'))['token']
        self.assertIsNotNone(token)

    def test_response_fake_token(self):
        token = "FAKE-TOKEN"
        response = self.tester.post('/user/change-password', headers={'Authorization': token}, content_type = 'application/json')
        self.assertEqual(response.status_code, 401)

    def test_response_change_password(self):
        self.sign_up_user(user1)
        token = self.sign_in_user(user1)
        json_data = json.dumps({'oldPassword': user1['password'], 'newPassword': '123'})
        response = self.tester.post('/user/change-password', data=json_data, headers={'Authorization': token}, content_type = 'application/json')
        self.assertEqual(response.status_code, 200)

    def test_response_change_password_invalid(self):
        self.sign_up_user(user1)
        token = self.sign_in_user(user1)
        json_data = json.dumps({'oldPassword': user1['password'], 'newPassword': '12'})
        response = self.tester.post('/user/change-password', data=json_data, headers={'Authorization': token}, content_type = 'application/json')
        self.assertEqual(response.status_code, 400)

    def test_response_create_company(self):
        self.sign_up_user(user1)
        token = self.sign_in_user(user1)
        json_data = json.dumps(company1)
        response = self.tester.post('/company/create', data=json_data, headers={'Authorization': token}, content_type = 'application/json')
        self.assertEqual(response.status_code, 200)

    def test_response_get_a_company(self):
        self.sign_up_user(user1)
        token = self.sign_in_user(user1)
        company = self.create_company(company1, token)
        response = self.tester.get('/company/' + str(company['id']), content_type = 'application/json')
        self.assertEqual(response.status_code, 200)
        retrieved_company = json.loads(response.data.decode(encoding='UTF-8'))
        self.assertEqual(retrieved_company['id'], company['id'])
        self.assertEqual(retrieved_company['name'], company['name'])

    def test_response_get_all_companies(self):
        self.sign_up_user(user1)
        token = self.sign_in_user(user1)
        company_c1 = self.create_company(company1, token)
        company_c2 = self.create_company(company2, token)
        response = self.tester.get('/companies', content_type = 'application/json')
        self.assertEqual(response.status_code, 200)
        retrieved_companys = json.loads(response.data.decode(encoding='UTF-8'))
        self.assertEqual(len(retrieved_companys), 2)
        company_ids = [comp['id'] for comp in retrieved_companys]
        self.assertIn(company_c1['id'], company_ids)
        self.assertIn(company_c2['id'], company_ids)

    def test_response_create_product(self):
        self.sign_up_user(user1)
        token = self.sign_in_user(user1)
        self.create_company(company1, token)
        json_data = json.dumps(product1)
        response = self.tester.post('/product/create', data=json_data, headers={'Authorization': token}, content_type = 'application/json')
        self.assertEqual(response.status_code, 200)

    def test_response_edit_product(self):
        self.sign_up_user(user1)
        token = self.sign_in_user(user1)
        self.create_company(company1, token)
        prod = self.create_product(product2, token)
        edited_product = {'name': product2['name'], 'price': 10.9900001, 'category': 'varmmat'}
        json_data = json.dumps(edited_product)
        response = self.tester.post('/product/edit/' + str(prod['id']), data=json_data, headers={'Authorization': token}, content_type = 'application/json')
        self.assertEqual(response.status_code, 200)
        retrieved_edited_product = json.loads(response.data.decode(encoding='UTF-8'))
        self.assertNotEqual(Decimal(edited_product['price']), Decimal(retrieved_edited_product['price']))
        self.assertEqual(edited_product['name'], retrieved_edited_product['name'])
        self.assertEqual(edited_product['category'], retrieved_edited_product['category'])

    def test_response_delete_product(self):
        self.sign_up_user(user1)
        token = self.sign_in_user(user1)
        self.create_company(company1, token)
        prod1 = self.create_product(product1, token)
        response = self.tester.post('/product/delete/' + str(prod1['id']), headers={'Authorization': token}, content_type = 'application/json')
        self.assertEqual(response.status_code, 200)

    def test_response_get_a_companys_products(self):
        self.sign_up_user(user1)
        token = self.sign_in_user(user1)
        company = self.create_company(company1, token)
        prod1 = self.create_product(product1, token)
        prod2 = self.create_product(product2, token)
        response = self.tester.get('/company/' + str(company['id']) + '/products', headers={'Authorization': token}, content_type = 'application/json')
        self.assertEqual(response.status_code, 200)
        products = json.loads(response.data.decode(encoding='UTF-8'))['products']
        self.assertEqual(len(products), 2)
        product_ids = [prod['id'] for prod in products]
        self.assertNotEqual(prod1['id'], prod2['id'])
        self.assertTrue(prod1['id'] in product_ids)
        self.assertTrue(prod2['id'] in product_ids)

    def test_response_make_a_valid_purchase(self):
        self.sign_up_user(user1)
        token = self.sign_in_user(user1)
        company = self.create_company(company1, token)
        prod1 = self.create_product(product1, token)
        prod2 = self.create_product(product2, token)
        to_buy = {'products': [{'id': prod1['id'], 'quantity': 3}, {'id': prod2['id'], 'quantity': 1}]}
        response = self.tester.post('/purchase', data=json.dumps(to_buy), content_type = 'application/json')
        self.assertEqual(response.status_code, 200)
        purchase = json.loads(response.data.decode(encoding='UTF-8'))
        totPrice = Decimal(0)
        for item in purchase['items']:
            totPrice += item['quantity']*Decimal(item['pricePerItem'])
        self.assertEqual(company['name'], purchase['company']['name'])
        self.assertEqual(Decimal(purchase['totalPrice']), totPrice)

    def test_response_try_to_purchase_products_from_different_companies(self):
        # should be invalid
        self.sign_up_user(user1)
        self.sign_up_user(user2)
        token1 = self.sign_in_user(user1)
        token2 = self.sign_in_user(user2)
        comp1 = self.create_company(company1, token1)
        comp2 = self.create_company(company2, token2)
        prod1 = self.create_product(product1, token1)
        prod2 = self.create_product(product2, token2)
        to_buy = {'products': [{'id': prod1['id'], 'quantity': 3}, {'id': prod2['id'], 'quantity': 1}]}
        response = self.tester.post('/purchase', data=json.dumps(to_buy), content_type = 'application/json')
        self.assertEqual(response.status_code, 403)

    def test_response_try_to_purchase_non_existing_product(self):
        # should be invalid
        to_buy = {'products': [{'id': 1, 'quantity': 3}]}
        response = self.tester.post('/purchase', data=json.dumps(to_buy), content_type = 'application/json')
        self.assertEqual(response.status_code, 404)

    def test_response_try_to_purchase_nothing(self):
        # should be invalid
        to_buy = {'products': []}
        response = self.tester.post('/purchase', data=json.dumps(to_buy), content_type = 'application/json')
        self.assertEqual(response.status_code, 400)


if __name__ == '__main__':
    unittest.main()
