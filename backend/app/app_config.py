from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
if 'DOCKER' in os.environ:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db/testdb'
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SKIP_PAY'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.debug = True
app.config["SECRET_KEY"] = 'nununu ar en bra app for den hungrige'

db = SQLAlchemy(app)
