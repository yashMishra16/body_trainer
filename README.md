# Body Trainer — 5-Agent Aesthetic Physique System

A comprehensive AI-powered physique transformation platform that synthesizes personalized 90-day blueprints combining training, nutrition, recovery, and mindset optimization through 5 coordinated agents.

## 🏗️ Architecture Overview

```
User Profile → 5 AI Agents → Master Coordinator → 90-Day Blueprint
```

### 5 Core Agents

| Agent | Role | Key Output |
|-------|------|------------|
| 🏋️ **Training Agent** | Gym programming with rep ranges, V-taper focus, form guidance | Weekly training schedule |
| 🪢 **Skipping Agent** | Jump rope cardio synced with gym workouts | Fat burn protocols |
| 🥗 **Nutrition Agent** | TDEE calculation, macro targeting, meal planning | Custom meal plan + macros |
| 😴 **Recovery Agent** | Sleep optimization, hormone management, posture correction | Recovery protocol |
| 🧠 **Mindset Agent** | Honest milestone assessment, plateau strategies | 90-day timeline |
| 🎯 **Coordinator** | Synthesizes all agents into cohesive blueprint | 90-Day Blueprint |

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20 with TypeScript
- **Framework**: Express.js
- **AI/LLM**: LangChain + Anthropic Claude 3.5 Sonnet (primary) + OpenAI GPT-4 (fallback)
- **Database**: PostgreSQL with Knex.js migrations
- **Cache**: Redis (IORedis)
- **Auth**: JWT
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18 with TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **State**: TanStack Query (React Query v5)
- **Charts**: Chart.js + react-chartjs-2
- **Routing**: React Router v6

### Infrastructure
- **Containers**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Web Server**: Nginx (frontend)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Anthropic API key (or OpenAI API key)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yashMishra16/body_trainer.git
cd body_trainer

# Configure environment
cp .env.example .env
# Edit .env and add your API keys

# Start all services
docker-compose up -d

# Visit http://localhost:3000
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
npm install
cp ../.env.example .env
# Edit .env with your credentials

# Set up database (PostgreSQL must be running)
npm run migrate

# Start development server
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install

# Start development server
npm run dev
```

## ⚙️ Configuration

Copy `.env.example` to `.env` and configure:

```env
# Required: At least one LLM API key
ANTHROPIC_API_KEY=your_claude_api_key
OPENAI_API_KEY=your_openai_api_key  # Optional fallback

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/body_trainer

# Redis (Optional - disabling just turns off caching)
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your_secure_random_string
```

## 📁 Project Structure

```
body_trainer/
├── backend/
│   ├── src/
│   │   ├── agents/              # 6 AI agents
│   │   │   ├── trainingAgent.ts
│   │   │   ├── skippingAgent.ts
│   │   │   ├── nutritionAgent.ts
│   │   │   ├── recoveryAgent.ts
│   │   │   ├── mindsetAgent.ts
│   │   │   └── coordinatorAgent.ts
│   │   ├── config/              # LLM and database config
│   │   ├── database/            # Knex migrations
│   │   ├── services/            # Business logic
│   │   ├── routes/              # API routes
│   │   └── middleware/          # Auth, error handling
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # UI panels for each agent
│   │   ├── pages/               # Dashboard, Setup, Progress
│   │   ├── hooks/               # useAgent, useProgress
│   │   └── services/            # API client
│   └── package.json
├── docker-compose.yml
├── .env.example
└── .github/workflows/           # CI/CD pipelines
```

## 🔌 API Reference

### POST `/api/agents/blueprint`
Generate a full 90-day blueprint by running all 5 agents.

**Request Body:**
```json
{
  "userProfile": {
    "age": 25,
    "gender": "male",
    "fitnessLevel": "intermediate",
    "goals": ["fat loss", "aesthetics"],
    "availableDays": 4,
    "equipmentAccess": "full gym"
  },
  "nutritionProfile": {
    "age": 25,
    "gender": "male",
    "heightCm": 178,
    "weightKg": 80,
    "activityLevel": "moderately active",
    "goals": ["fat loss"],
    "dietType": "standard"
  }
}
```

### POST `/api/agents/training` | `/skipping` | `/nutrition` | `/recovery` | `/mindset`
Run individual agents independently.

### POST `/api/users/register` | `/api/users/login`
User authentication.

### GET `/api/progress/:userId`
Fetch progress history.

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 🔒 Security

- JWT authentication for protected routes
- Helmet.js for security headers
- CORS configured for frontend origin only
- Input validation with Zod
- Password hashing with bcrypt (12 rounds)
- Environment variables for all secrets

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| api | 3001 | Node.js/Express backend |
| frontend | 3000 | React + Nginx |
| postgres | 5432 | PostgreSQL 15 |
| redis | 6379 | Redis 7 |

## 📈 Roadmap

- [ ] Social progress sharing
- [ ] Workout video integration
- [ ] AI form analysis via camera
- [ ] Mobile app (React Native)
- [ ] Wearable device integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes with tests
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
