from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.debug = True
app.config["SECRET_KEY"] = 'nununu ar en bra app for den hungrige'

db = SQLAlchemy(app)
