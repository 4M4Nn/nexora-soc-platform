from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
from database import init_db, get_db
from auth import hash_password, verify_password, create_token, decode_token
from agents import run_agent

load_dotenv()
app = FastAPI(title="Nexora SOC Platform", version="1.0.0")

FRONTEND_URL = os.environ.get("FRONTEND_URL", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.on_event("startup")
def startup():
    init_db()

def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    payload = decode_token(authorization.split(" ")[1])
    if not payload.get("sub"):
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload

# ── Auth ──
class LoginReq(BaseModel):
    email: str
    password: str

class RegisterReq(BaseModel):
    email: str
    password: str
    name: str
    org: str

@app.post("/auth/login")
def login(req: LoginReq):
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE email = %s", (req.email,))
            user = cur.fetchone()
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({
        "sub": str(user["id"]),
        "email": user["email"],
        "name": user["name"],
        "org": user["org"],
        "role": user["role"]
    })
    return {"token": token, "name": user["name"], "org": user["org"], "role": user["role"], "email": user["email"]}

@app.post("/auth/register")
def register(req: RegisterReq):
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM users WHERE email = %s", (req.email,))
            if cur.fetchone():
                raise HTTPException(status_code=400, detail="Email already registered")
            cur.execute(
                "INSERT INTO users (email, password_hash, name, org) VALUES (%s, %s, %s, %s) RETURNING id",
                (req.email, hash_password(req.password), req.name, req.org)
            )
            user_id = cur.fetchone()["id"]
    token = create_token({"sub": str(user_id), "email": req.email, "name": req.name, "org": req.org, "role": "analyst"})
    return {"token": token, "name": req.name, "org": req.org, "role": "analyst", "email": req.email}

@app.get("/auth/me")
def me(user=Depends(get_current_user)):
    return user

# ── Agent ──
class AnalyzeReq(BaseModel):
    session_id: str
    mode: str
    content: str

@app.post("/analyze")
def analyze(req: AnalyzeReq, user=Depends(get_current_user)):
    if req.mode not in ["soc", "ir", "risk", "audit"]:
        raise HTTPException(status_code=400, detail="Invalid mode")

    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO sessions (id, user_id, mode) VALUES (%s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET last_active = NOW()
            """, (req.session_id, int(user["sub"]), req.mode))

            cur.execute(
                "SELECT role, content FROM messages WHERE session_id = %s ORDER BY created_at ASC",
                (req.session_id,)
            )
            history = [{"role": r["role"], "content": r["content"]} for r in cur.fetchall()]

            mode_labels = {"soc": "SOC TRIAGE", "ir": "INCIDENT RESPONSE", "risk": "RISK SCORING", "audit": "AUDIT REPORT"}
            user_content = f"[MODE: {mode_labels[req.mode]}]\n\n{req.content}"
            cur.execute(
                "INSERT INTO messages (session_id, role, content) VALUES (%s, %s, %s)",
                (req.session_id, "user", user_content)
            )
            history.append({"role": "user", "content": user_content})

    try:
        reply = run_agent(req.mode, history)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")

    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO messages (session_id, role, content) VALUES (%s, %s, %s)",
                (req.session_id, "assistant", reply)
            )
            verdict = "UNKNOWN"
            if "ESCALATE" in reply:
                verdict = "ESCALATE"
            elif "MONITOR" in reply:
                verdict = "MONITOR"
            elif "FALSE POSITIVE" in reply or "CLOSE" in reply:
                verdict = "CLOSE"
            cur.execute(
                "INSERT INTO analysis_log (user_id, mode, preview, verdict) VALUES (%s, %s, %s, %s)",
                (int(user["sub"]), req.mode, req.content[:100], verdict)
            )

    return {"reply": reply, "session_id": req.session_id}

@app.post("/session/clear")
def clear_session(body: dict, user=Depends(get_current_user)):
    sid = body.get("session_id", "")
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM messages WHERE session_id = %s", (sid,))
            cur.execute("DELETE FROM sessions WHERE id = %s AND user_id = %s", (sid, int(user["sub"])))
    return {"ok": True}

@app.get("/history")
def history(user=Depends(get_current_user)):
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT al.id, al.mode, al.preview, al.verdict, al.created_at
                FROM analysis_log al WHERE al.user_id = %s
                ORDER BY al.created_at DESC LIMIT 20
            """, (int(user["sub"]),))
            rows = cur.fetchall()
    return {"history": [dict(r) for r in rows]}

class ContactReq(BaseModel):
    name: str
    email: str
    company: str
    team_size: str
    message: str

@app.post("/contact")
def contact(req: ContactReq):
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO contacts (name, email, company, team_size, message) VALUES (%s,%s,%s,%s,%s)",
                (req.name, req.email, req.company, req.team_size, req.message)
            )
    return {"ok": True}

@app.get("/health")
def health():
    return {"status": "online", "version": "1.0.0"}
