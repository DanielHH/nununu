from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
import os

app = Flask(__name__)
if 'DOCKER' in os.environ:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db/testdb'
    app.config['SKIP_PAY'] = False
    app.config['SERVER_NAME'] = 'swish.mastega.nu'
    app.config['HTTP_SCHEME'] = 'https'
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SKIP_PAY'] = True
    app.config['HTTP_SCHEME'] = 'http'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.debug = True
app.config["SECRET_KEY"] = 'nununu ar en bra app for den hungrige'
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_PASS')
mail = Mail(app)

db = SQLAlchemy(app)
