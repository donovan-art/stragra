# MEMORY.md

## Stragravet Project Refactor

### GitHub PAT
- **Token:** `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`
- **Scope:** GitHub repository access
- **Stored:** 2025-01-28
- **Note:** For cloning/accessing vStragra repository (https://github.com/donovan-art/vStragra)

### Project Context
- **Project:** stragravet / vStragra
- **Objective:** Refactor from PostgreSQL + Prisma + TypeScript to **Baserow (Self-Hosted) + Dual Qwen Architecture**

### Dual Qwen Architecture
| Component | Model | Purpose |
|-----------|-------|---------|
| **Voice** | Qwen-Omni-Turbo-Realtime | Native audio processing, <500ms latency |
| **Search/Logic** | Qwen-3.5-Turbo | Text-based tool calling, Baserow queries |

### 7-Department Schema
1. **Reception:** Telephony/SIP, Scheduling, Check-ins
2. **Medical:** Exam Room Scribe, SOAP notes, Patient History
3. **Pharmacy:** Prescriptions, Inventory, Refills
4. **Lab:** Results, Diagnostic orders
5. **Grooming:** Bookings, Requirements
6. **Billing:** Invoices, Payment status
7. **Admin:** Staff permissions, Clinic settings

---

## ✅ COMPLETED

### Backend (FastAPI)
- ✅ `main.py` - FastAPI app with lifespan manager
- ✅ `requirements.txt` - Dependencies
- ✅ `.env.example` - Environment configuration
- ✅ `app/core/config.py` - Settings with dual Qwen models
- ✅ `app/services/baserow_client.py` - Baserow API client with multi-tenancy
- ✅ `app/services/qwen_client.py` - **NEW: Dual Qwen client (Omni + 3.5)** ✨
- ✅ `app/services/qwen_tools.py` - AI tool registry (20+ tools)
- ✅ `app/routers/voice_agent.py` - **UPDATED: Qwen-Omni voice + Qwen-3.5 tools** ✨
- ✅ `app/routers/search.py` - **UPDATED: AI-powered search with Qwen-3.5 summarization** ✨
- ✅ `app/routers/reception.py` - Appointments, check-ins
- ✅ `app/routers/medical.py` - Patients, SOAP notes
- ✅ `app/routers/pharmacy.py` - Prescriptions, inventory
- ✅ `app/routers/lab.py` - Test orders, results
- ✅ `app/routers/grooming.py` - Grooming bookings
- ✅ `app/routers/billing.py` - Invoices, payments
- ✅ `app/routers/admin.py` - Staff, clinic settings

### 🔍 Global Search Feature
**Backend:**
- `GET /api/search?q=Snoopy+Lee&summarize=true`
- Concurrent queries across all 7 departments
- **AI Summary via Qwen-3.5**: "Snoopy Lee has 3 upcoming appointments and 1 unpaid invoice"

**Frontend:**
- `components/GlobalSearchBar.tsx` - Google-like search bar
- Shows AI summary card with Sparkles icon
- Real-time search with 300ms debounce
- Cmd+K keyboard shortcut
- Results grouped by department with icons
- Highlighted matching text

### 🎙️ Voice Agent (Night Nurse)
**Dual Model Architecture:**
1. **Qwen-Omni-Turbo-Realtime**: Handles audio input/output, transcription, voice synthesis
2. **Qwen-3.5-Turbo**: Handles intent analysis, tool calling, Baserow queries

**Features:**
- WebSocket streaming for real-time voice (`/api/voice/ws/stream`)
- HTTP webhook for async processing (`/api/voice/webhook`)
- **CA AB 2905 Compliance**: AI disclosure played at call start
- Emergency keyword detection ("emergency", "urgent", "dying", "bleeding")
- Automatic escalation to human staff
- Tool calling to all 7 Baserow departments
- <500ms latency target

**Compliance Endpoints:**
- `GET /api/voice/disclosure` - Get AI disclosure text
- Automatic disclosure playback on call start

### Frontend (Next.js 16)
- ✅ `app/layout.tsx` - Root layout
- ✅ `app/page.tsx` - Dashboard with department grid
- ✅ `components/GlobalSearchBar.tsx` - Search bar with AI summary
- ✅ `hooks/useDebounce.ts` - Search debounce hook

### Infrastructure
- ✅ `docker-compose.yml` - Baserow + PostgreSQL + Redis
- ✅ Updated `.env.example` - Dual Qwen API keys

---

## TODO
- [ ] Set up Baserow tables in UI (define exact field structure)
- [ ] Configure Table IDs in .env
- [ ] Test voice WebSocket streaming
- [ ] Add LiveKit SIP integration
- [ ] Create department-specific pages
- [ ] Remove legacy TypeScript backend (Phase 5)

---

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/search?q=...&summarize=true` | GET | **Global search with AI summary** |
| `/api/search/{dept}?q=...` | GET | Search single department |
| `/api/reception/appointments` | GET/POST | Appointments CRUD |
| `/api/reception/check-in` | POST | Patient check-in |
| `/api/medical/patients` | GET/POST | Patient records |
| `/api/medical/soap-notes` | POST | Create SOAP note |
| `/api/pharmacy/prescriptions` | GET/POST | Prescriptions |
| `/api/pharmacy/inventory` | GET/POST | Inventory |
| `/api/lab/tests` | GET/POST | Lab tests |
| `/api/grooming/bookings` | GET/POST | Grooming bookings |
| `/api/billing/invoices` | GET/POST | Invoices |
| `/api/admin/staff` | GET/POST | Staff management |
| `/api/voice/webhook` | POST | LiveKit voice webhook |
| `/api/voice/ws/stream` | WS | **Real-time voice WebSocket** |
| `/api/voice/disclosure` | GET | **CA AB 2905 AI disclosure** |

---

## Multi-Tenancy
- All Baserow tables must include `tenant_id` field
- BaserowClient automatically injects tenant_id on all operations
- Default tenant: `settings.DEFAULT_TENANT_ID`

## Key Design Decisions
1. **Dual Qwen Architecture**: Omni for voice, 3.5 for logic
2. **NO SQL migrations**: Baserow tables managed via UI/API
3. **Grounded AI**: Qwen 3.5 only answers via tool calls to Baserow
4. **No guessing**: AI must retrieve data; never hallucinate patient info
5. **CA AB 2905 Compliance**: AI disclosure required at call start
6. **<500ms latency**: Target for both voice and search

## Voice Agent Flow
```
Caller Audio → Qwen-Omni (transcribe) → Qwen-3.5 (intent + tools) → Baserow (query)
                                              ↓
Caller ← Qwen-Omni (synthesize) ← Response text ← Tool results
```
