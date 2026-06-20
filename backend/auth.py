from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt as _bcrypt
import os

SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-in-prod")
ALGORITHM = "HS256"
EXPIRE_HOURS = 24

def hash_password(password: str) -> str:
    return _bcrypt.hashpw(password.encode(), _bcrypt.gensalt()).decode()

def verify_password(plain: str, hashed: str) -> bool:
    return _bcrypt.checkpw(plain.encode(), hashed.encode())

def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=EXPIRE_HOURS)
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET, algorithms=[ALGORITHM])
    except JWTError:
        return {}
