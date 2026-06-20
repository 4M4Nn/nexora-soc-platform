import psycopg2
import psycopg2.extras
import os
from contextlib import contextmanager

DATABASE_URL = os.environ.get("DATABASE_URL", "")

def get_connection():
    return psycopg2.connect(DATABASE_URL, cursor_factory=psycopg2.extras.RealDictCursor)

@contextmanager
def get_db():
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    org VARCHAR(255) NOT NULL,
                    role VARCHAR(50) DEFAULT 'analyst',
                    created_at TIMESTAMP DEFAULT NOW()
                );
                CREATE TABLE IF NOT EXISTS sessions (
                    id VARCHAR(64) PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id),
                    mode VARCHAR(32) NOT NULL,
                    created_at TIMESTAMP DEFAULT NOW(),
                    last_active TIMESTAMP DEFAULT NOW()
                );
                CREATE TABLE IF NOT EXISTS messages (
                    id SERIAL PRIMARY KEY,
                    session_id VARCHAR(64) REFERENCES sessions(id),
                    role VARCHAR(16) NOT NULL,
                    content TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT NOW()
                );
                CREATE TABLE IF NOT EXISTS analysis_log (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id),
                    mode VARCHAR(32) NOT NULL,
                    preview TEXT,
                    verdict VARCHAR(64),
                    created_at TIMESTAMP DEFAULT NOW()
                );
                CREATE TABLE IF NOT EXISTS contacts (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255),
                    email VARCHAR(255),
                    company VARCHAR(255),
                    team_size VARCHAR(64),
                    message TEXT,
                    created_at TIMESTAMP DEFAULT NOW()
                );
            """)
            import bcrypt as _bcrypt
            hashed = _bcrypt.hashpw(b"demo1234", _bcrypt.gensalt()).decode()
            cur.execute("""
                INSERT INTO users (email, password_hash, name, org, role)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (email) DO NOTHING
            """, ("demo@nexora.ai", hashed, "Demo Analyst", "Nexora Demo", "analyst"))
    print("Database initialized.")
