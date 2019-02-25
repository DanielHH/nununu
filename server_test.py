import json, unittest
import server

user1 = {'email': 'kalle@anka.se', 'password': '1234'}

class ServerTestCases(unittest.TestCase):

    ########################
    ### Helper functions ###
    ########################
    def sign_up_user(self, user):
        """
        Populates the tester db with a user
        """
        self.tester.post('/user/sign-up', data=json.dumps(user), content_type = 'application/json')

    def sign_in_user(self, user):
        """
        Sign in a user and returns a valid token
        """
        token_response = self.tester.post('/user/sign-in', data=json.dumps(user), content_type = 'application/json')
        token = json.loads(token_response.data.decode(encoding='UTF-8'))['token']
        return token

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
        with self.assertRaises(ValueError):
            self.tester.post('/user/change-password', data=json_data, headers={'Authorization': token}, content_type = 'application/json')


if __name__ == '__main__':
    unittest.main()
