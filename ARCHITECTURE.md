# Architecture Documentation

## System Design: 5-Agent Aesthetic Physique System

## Overview

The Body Trainer system uses a **multi-agent AI architecture** where specialized agents handle distinct domains and a Master Coordinator synthesizes their outputs into a unified, conflict-free 90-Day Blueprint.

## Agent Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER REQUEST                             │
│              (Profile + Goals + Physical Stats)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COORDINATOR AGENT                            │
│  Orchestrates all agents and synthesizes outputs               │
└──┬──────────┬──────────┬──────────┬──────────┬─────────────────┘
   │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼
┌──────┐  ┌───────┐  ┌────────┐ ┌────────┐ ┌─────────┐
│TRAIN-│  │SKIP-  │  │NUTRI-  │ │RECOV-  │ │MINDSET  │
│ ING  │  │PING   │  │TION    │ │ERY     │ │& TIME-  │
│AGENT │  │AGENT  │  │AGENT   │ │AGENT   │ │LINE     │
└──────┘  └───────┘  └────────┘ └────────┘ └─────────┘
   │          │          │          │          │
   └──────────┴──────────┴──────────┴──────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │    90-DAY BLUEPRINT      │
              │  (JSON Response to UI)   │
              └──────────────────────────┘
```

## Agent Responsibilities

### 1. Training Agent (`trainingAgent.ts`)
**Domain**: Gym programming and exercise science

**Inputs**: Age, gender, fitness level, goals, available days, equipment, injuries
**Outputs**:
- Weekly training schedule (split by muscle groups)
- V-taper priority exercises (shoulder width, lat development)
- Rep ranges optimized for aesthetics (8-15 hypertrophy, 15-20 definition)
- Form guidance for key compound movements
- Common mistakes to avoid
- Progressive overload strategy

**LLM Prompt Strategy**: Uses expertise framing as "elite aesthetic physique trainer" with specific instructions on V-taper development

### 2. Skipping Agent (`skippingAgent.ts`)
**Domain**: Jump rope cardio and fat burning

**Inputs**: User profile + gym schedule (from Training Agent)
**Outputs**:
- Weekly cardio schedule synced with gym days
- HIIT, steady-state, and interval protocols
- Fat burn calorie estimations
- Technique progression (basic → double unders)
- 12-week progression tracking

**Key Design**: Uses gym schedule as input to sync cardio intensity (lighter on heavy lift days)

### 3. Nutrition Agent (`nutritionAgent.ts`)
**Domain**: Sports nutrition and diet planning

**Inputs**: Physical stats (height, weight, age, gender), activity level, goals, diet type, allergies
**Outputs**:
- TDEE calculation (Mifflin-St Jeor formula)
- Caloric target (deficit/surplus/maintenance)
- Macronutrient breakdown (protein/carbs/fat)
- 7-day sample meal plan
- Meal timing strategy
- Evidence-based supplement stack
- Hydration plan
- Foods to eat/avoid (diet-type specific)

### 4. Recovery Agent (`recoveryAgent.ts`)
**Domain**: Recovery science and lifestyle optimization

**Inputs**: User profile
**Outputs**:
- Sleep optimization (8-phase sleep hygiene protocol)
- Hormone optimization (testosterone, cortisol, GH)
- Posture correction exercises
- Recovery supplement recommendations
- Active recovery protocols
- Stress management techniques

### 5. Mindset & Timeline Agent (`mindsetAgent.ts`)
**Domain**: Sports psychology and transformation timelines

**Inputs**: User profile
**Outputs**:
- Honest 90-day milestone assessment (weeks 4, 8, 12)
- Progress tracking system
- Plateau-busting strategies
- Mindset tools (visualization, identity habits)
- Weekly check-in protocol
- Motivation framework

### 6. Coordinator Agent (`coordinatorAgent.ts`)
**Domain**: Multi-agent orchestration and synthesis

**Process**:
1. Runs all 5 agents (sequentially due to inter-agent dependencies)
2. Synthesizes outputs, resolving conflicts
3. Creates unified daily routine
4. Generates 12-week integration timeline
5. Calculates success probability score

## Data Flow

```
Request → Validation (Zod) → Redis Cache Check
         ↓ (cache miss)
         LLM API Call (Anthropic/OpenAI)
         ↓
         JSON Parse & Validate
         ↓
         Redis Cache Set (TTL: 1 hour)
         ↓
         Response to Client
```

## Caching Strategy

- **Cache Key**: Hash of input parameters per agent
- **TTL**: 3600 seconds (1 hour) per agent, 7200s for full blueprints
- **Fallback**: Gracefully disables caching if Redis is unavailable
- **Purpose**: Prevents duplicate LLM calls for identical inputs

## Database Schema

```sql
users           -- User profiles and auth
blueprints      -- Generated 90-day plans (JSONB storage)
workouts        -- Individual workout sessions
progress        -- Body measurements and check-ins
agent_cache     -- DB-level response cache (backup to Redis)
```

## API Layer

```
POST /api/agents/blueprint    -- Full 6-agent orchestration
POST /api/agents/training     -- Individual agent endpoints
POST /api/agents/skipping
POST /api/agents/nutrition
POST /api/agents/recovery
POST /api/agents/mindset

POST /api/users/register      -- Auth
POST /api/users/login
GET  /api/users/profile/:id
PUT  /api/users/profile/:id

POST /api/progress            -- Progress logging
GET  /api/progress/:userId
GET  /api/progress/:userId/summary
```

## Frontend Architecture

```
src/
├── App.tsx              # Router configuration
├── pages/
│   ├── SetupWizard.tsx  # 3-step onboarding + agent trigger
│   ├── Dashboard.tsx    # Blueprint display hub
│   ├── Progress.tsx     # Charts + progress logging
│   └── Settings.tsx     # Configuration
├── components/
│   ├── Blueprint90Day.tsx  # Tabbed blueprint viewer
│   ├── TrainingPanel.tsx   # Training plan UI
│   ├── SkippingPanel.tsx   # Cardio plan UI
│   ├── NutritionPanel.tsx  # Nutrition plan UI
│   ├── RecoveryPanel.tsx   # Recovery plan UI
│   └── MindsetPanel.tsx    # Mindset plan UI
├── hooks/
│   └── useAgent.ts      # TanStack Query mutation wrappers
└── services/
    └── api.ts           # Axios API client
```

## LLM Integration

### Primary: Anthropic Claude 3.5 Sonnet
- Best for structured JSON generation
- Strong domain expertise in fitness/nutrition
- Consistent response format

### Fallback: OpenAI GPT-4o
- Used when Anthropic API unavailable
- Compatible JSON structure

### Prompt Engineering Strategy
Each agent uses:
1. **System Prompt**: Role definition + output format requirements
2. **User Message**: Specific user data + structured request
3. **JSON Extraction**: Regex-based extraction from markdown code blocks

## Security Considerations

- API keys stored server-side only (never in frontend)
- JWT tokens for user authentication (7-day expiry)
- Input validation with Zod before LLM calls
- Helmet.js security headers
- CORS restricted to frontend origin
- Rate limiting recommended for production

## Scaling Considerations

- Redis caching prevents redundant LLM API calls
- Agents can be parallelized where no dependencies exist
- Blueprint storage in JSONB enables flexible querying
- Docker Compose ready for Kubernetes migration
