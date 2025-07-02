import hashlib
from datetime import datetime

def generate_hash(data):
    return hashlib.sha256(str(data).encode()).hexdigest()

def create_course_hash(name, description, previous_hash, timestamp=None):
    if not timestamp:
        timestamp = datetime.utcnow().isoformat()
    raw_data = f"{name}{description}{previous_hash}{timestamp}"
    return generate_hash(raw_data)

def create_registration_hash(user_id, course_id, previous_hash, timestamp=None):
    if not timestamp:
        timestamp = datetime.utcnow().isoformat()
    raw_data = f"{user_id}{course_id}{previous_hash}{timestamp}"
    return generate_hash(raw_data)