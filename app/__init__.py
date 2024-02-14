from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .routes.main import main
from .routes.auth import auth


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///YOURDATABASE.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

app.register_blueprint(main)
app.register_blueprint(auth, url_prefix='/auth')