from flask import Blueprint, request, jsonify
import MySQLdb
from db_config import db_config
from blockchain import create_registration_hash
from auth_routes import token_required
from datetime import datetime

registration_bp = Blueprint('registration', __name__)

def get_db_connection():
    return MySQLdb.connect(
        host=db_config["MYSQL_HOST"],
        user=db_config["MYSQL_USER"],
        passwd=db_config["MYSQL_PASSWORD"],
        db=db_config["MYSQL_DB"],
        port=3306
    )

# Register for a course (user)
@registration_bp.route('/api/registrations', methods=['POST'])
@token_required
def register_course(current_user, is_admin):
    data = request.get_json()
    course_id = data.get('course_id')
    if not course_id:
        return jsonify({'message': 'Course ID required'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    # Prevent duplicate registration
    cur.execute("SELECT id FROM registrations WHERE user_id=%s AND course_id=%s", (current_user, course_id))
    if cur.fetchone():
        conn.close()
        return jsonify({'message': 'Already registered for this course'}), 409
    # Get last registration hash
    cur.execute("SELECT current_hash FROM registrations ORDER BY id DESC LIMIT 1")
    last = cur.fetchone()
    previous_hash = last[0] if last else '0'
    timestamp = datetime.utcnow().isoformat()
    current_hash = create_registration_hash(current_user, course_id, previous_hash, timestamp)
    cur.execute("INSERT INTO registrations (user_id, course_id, registered_at, previous_hash, current_hash) VALUES (%s, %s, %s, %s, %s)",
                (current_user, course_id, timestamp, previous_hash, current_hash))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Registered for course'}), 201

# Unregister from a course (user)
@registration_bp.route('/api/registrations/<int:course_id>', methods=['DELETE'])
@token_required
def unregister_course(current_user, is_admin, course_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM registrations WHERE user_id=%s AND course_id=%s", (current_user, course_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Unregistered from course'})

# List user's registrations
@registration_bp.route('/api/registrations', methods=['GET'])
@token_required
def list_registrations(current_user, is_admin):
    conn = get_db_connection()
    cur = conn.cursor()
    if is_admin and request.args.get('all') == '1':
        # Admin: list all registrations
        cur.execute("SELECT r.id, u.username, c.name, r.registered_at FROM registrations r JOIN users u ON r.user_id=u.id JOIN courses c ON r.course_id=c.id ORDER BY r.id DESC")
        regs = [
            {'id': row[0], 'username': row[1], 'course': row[2], 'registered_at': row[3]} for row in cur.fetchall()
        ]
    else:
        # User: list own registrations
        cur.execute("SELECT r.id, c.name, r.registered_at FROM registrations r JOIN courses c ON r.course_id=c.id WHERE r.user_id=%s ORDER BY r.id DESC", (current_user,))
        regs = [
            {'id': row[0], 'course': row[1], 'registered_at': row[2]} for row in cur.fetchall()
        ]
    conn.close()
    return jsonify(regs) 