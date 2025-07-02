from flask import Flask
from auth_routes import auth_bp
from course_routes import course_bp
import pymysql
pymysql.install_as_MySQLdb()
import MySQLdb
from db_config import db_config
from dotenv import load_dotenv
import os
from flask_cors import CORS
from registration_routes import registration_bp

app = Flask(__name__)
CORS(app)
# load the .env file
load_dotenv()

# get the secret key from the .env file
SECRET_KEY = os.getenv('SECRET_KEY')


# Load database config
app.config.update(db_config)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(course_bp)
app.register_blueprint(registration_bp)

# Database connection function
def get_db_connection():
    return MySQLdb.connect(
        host=db_config["MYSQL_HOST"],
        user=db_config["MYSQL_USER"],
        passwd=db_config["MYSQL_PASSWORD"],
        db=db_config["MYSQL_DB"],
        port=3306
    )

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')