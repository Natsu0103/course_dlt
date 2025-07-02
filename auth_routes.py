from flask import Blueprint, request, jsonify
import pymysql
pymysql.install_as_MySQLdb()
import MySQLdb
from db_config import db_config
import hashlib
import jwt
import datetime
from functools import wraps
import os
from dotenv import load_dotenv

# load the .env file
load_dotenv()

# get the secret key from the .env file
SECRET_KEY = os.getenv('SECRET_KEY')

auth_bp = Blueprint('auth', __name__)

def get_db_connection():
    return MySQLdb.connect(
        host=db_config["MYSQL_HOST"],
        user=db_config["MYSQL_USER"],
        passwd=db_config["MYSQL_PASSWORD"],
        db=db_config["MYSQL_DB"],
        port=3306
    )

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data['user_id']
            is_admin = data.get('is_admin', False)
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, is_admin, *args, **kwargs)
    return decorated

@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    is_admin = data.get('is_admin', False)
    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400
    password_hash = hash_password(password)
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO users (username, password_hash, is_admin) VALUES (%s, %s, %s)", (username, password_hash, is_admin))
        conn.commit()
        return jsonify({'message': 'Registration successful'}), 201
    except MySQLdb.IntegrityError:
        return jsonify({'message': 'Username already exists'}), 409
    finally:
        conn.close()

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400
    password_hash = hash_password(password)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, is_admin FROM users WHERE username=%s AND password_hash=%s", (username, password_hash))
    user = cur.fetchone()
    conn.close()
    if user:
        user_id, is_admin = user
        token = jwt.encode({
            'user_id': user_id,
            'is_admin': bool(is_admin),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        return jsonify({'token': token}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

@auth_bp.route('/api/auth/me', methods=['GET'])
@token_required
def get_me(current_user, is_admin):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, username, is_admin FROM users WHERE id=%s", (current_user,))
    user = cur.fetchone()
    conn.close()
    if user:
        return jsonify({
            'user_id': user[0],
            'username': user[1],
            'is_admin': bool(user[2])
        })
    else:
        return jsonify({'message': 'User not found'}), 404