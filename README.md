# Nexora NOVA SOC Platform

AI-powered Security Operations Center platform with 4 specialized agents.

## Stack
- **Frontend**: React + Vite + Tailwind CSS → Vercel
- **Backend**: FastAPI + Python → Render
- **Database**: Neon PostgreSQL (free tier)
- **AI Engine**: Groq LLaMA 3.3 70B (free)

## Demo
- Email: `demo@nexora.ai`
- Password: `demo1234`

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Fill in .env with your keys
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
# Create .env.local with: VITE_API_URL=http://localhost:8000
npm run dev
```

## Deployment
- Backend → [Render.com](https://render.com) free web service
- Frontend → [Vercel.com](https://vercel.com) free tier
- Database → [Neon.tech](https://neon.tech) free tier
- AI → [Groq Console](https://console.groq.com) free API key
