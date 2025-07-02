from flask import Blueprint, request, jsonify
import MySQLdb
from db_config import db_config
from blockchain import create_course_hash
from auth_routes import token_required
from datetime import datetime

course_bp = Blueprint('course', __name__)

def get_db_connection():
    return MySQLdb.connect(
        host=db_config["MYSQL_HOST"],
        user=db_config["MYSQL_USER"],
        passwd=db_config["MYSQL_PASSWORD"],
        db=db_config["MYSQL_DB"],
        port=3306
    )

# Get all courses (public)
@course_bp.route('/api/courses', methods=['GET'])
def get_courses():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, name, description, created_at FROM courses ORDER BY id DESC")
    courses = [
        {
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'created_at': row[3]
        } for row in cur.fetchall()
    ]
    conn.close()
    return jsonify(courses)

# Create a new course (admin only)
@course_bp.route('/api/courses', methods=['POST'])
@token_required
def create_course(current_user, is_admin):
    if not is_admin:
        return jsonify({'message': 'Admin privilege required'}), 403
    data = request.get_json()
    name = data.get('name')
    description = data.get('description', '')
    if not name:
        return jsonify({'message': 'Course name required'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    # Get last course hash
    cur.execute("SELECT current_hash FROM courses ORDER BY id DESC LIMIT 1")
    last = cur.fetchone()
    previous_hash = last[0] if last else '0'
    timestamp = datetime.utcnow().isoformat()
    current_hash = create_course_hash(name, description, previous_hash, timestamp)
    cur.execute("INSERT INTO courses (name, description, created_at, previous_hash, current_hash) VALUES (%s, %s, %s, %s, %s)",
                (name, description, timestamp, previous_hash, current_hash))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Course created'}), 201

# Update a course (admin only)
@course_bp.route('/api/courses/<int:course_id>', methods=['PUT'])
@token_required
def update_course(current_user, is_admin, course_id):
    if not is_admin:
        return jsonify({'message': 'Admin privilege required'}), 403
    data = request.get_json()
    name = data.get('name')
    description = data.get('description', '')
    if not name:
        return jsonify({'message': 'Course name required'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    # Get previous hash
    cur.execute("SELECT current_hash FROM courses WHERE id = %s", (course_id,))
    last = cur.fetchone()
    if not last:
        conn.close()
        return jsonify({'message': 'Course not found'}), 404
    previous_hash = last[0]
    timestamp = datetime.utcnow().isoformat()
    current_hash = create_course_hash(name, description, previous_hash, timestamp)
    cur.execute("UPDATE courses SET name=%s, description=%s, previous_hash=%s, current_hash=%s WHERE id=%s",
                (name, description, previous_hash, current_hash, course_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Course updated'})

# Delete a course (admin only)
@course_bp.route('/api/courses/<int:course_id>', methods=['DELETE'])
@token_required
def delete_course(current_user, is_admin, course_id):
    if not is_admin:
        return jsonify({'message': 'Admin privilege required'}), 403
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM courses WHERE id=%s", (course_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Course deleted'}) 