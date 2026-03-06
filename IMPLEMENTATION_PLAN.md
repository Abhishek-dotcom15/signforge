# SignForge - Complete Implementation Plan

> Generated from SignForge PRD v1.0 | March 2026

---

## Table of Contents

1. [Product Understanding](#1-product-understanding)
2. [Feature Breakdown](#2-feature-breakdown)
3. [User Flows](#3-user-flows)
4. [System Architecture](#4-system-architecture)
5. [Database Design](#5-database-design)
6. [API Design](#6-api-design)
7. [UI/UX Theme](#7-uiux-theme)
8. [Figma Design Structure](#8-figma-design-structure)
9. [Development Roadmap](#9-development-roadmap)
10. [Task Breakdown](#10-task-breakdown)
11. [Repo Structure](#11-repo-structure)
12. [Implementation Strategy](#12-implementation-strategy)
13. [Production Plan](#13-production-plan)

---

## 1. Product Understanding

### Product Goal

SignForge is an AI-powered platform that bridges Indian Sign Language (ISL) with the digital world by providing real-time bidirectional translation, developer tooling (SDK/API), and a cultural education hub (547 Jataka Tales in animated ISL).

### Core Problem Being Solved

India has 63 million deaf/hard-of-hearing individuals facing:
- **Interpreter shortage**: 1 certified interpreter per 10,000 deaf persons
- **No digital ISL tools**: No AI-powered ISL translation for Indian cultural content
- **No developer ecosystem**: No SDK/API for developers to add ISL to apps
- **Technology mismatch**: Existing tools target ASL/BSL, not ISL (distinct SOV grammar, 5,000+ unique signs)
- **Hardware barriers**: Existing ISL systems require specialised hardware

### Target Users

| Persona | Role | Primary Need |
|---------|------|--------------|
| Aarav (14) | Deaf Student | Access educational content in ISL, communicate with hearing peers |
| Priya (27) | App Developer | Add ISL support to edtech apps via API/SDK in days, not months |
| Dr. Meera (45) | Special Ed Teacher | Digital ISL curriculum material, student progress tracking |
| Rohit (32) | Hearing Colleague | Learn ISL, use real-time translation in workplace meetings |

**Secondary Users**: ISL researchers, government/NGOs, healthcare providers, enterprise HR

### User Roles

| Role | Access Level |
|------|-------------|
| Super Admin | Full platform control, model management, analytics |
| Institution Admin | Manage institution users, content, reports |
| Educator | Create classes, assign content, track students |
| Student | Access stories, quizzes, practice studio |
| Developer | API keys, SDK access, audit tools, usage dashboard |
| API User | Programmatic access only via REST/WebSocket |
| General User (Deaf/Hearing) | Communication hub, dictionary, learning |

### Key Features (6 Modules)

1. **ISL Communication Hub** - Bidirectional ISL <-> text/speech translation
2. **Developer Dashboard & SDK** - API, NPM/Python SDK, code-to-ISL pipeline
3. **Educational Platform** - Jataka Tales library, educator portal, quizzes
4. **Live Collaboration Canvas** - Multi-user workspace with ISL avatar narration
5. **Accessibility Auditor** - WCAG/ISL gap scanner with auto-fix
6. **Admin & Analytics** - Usage analytics, model monitoring, corpus management

### User Journeys

**Journey 1: Deaf Student (Aarav)**
```
Sign Up -> Browse Jataka Tales -> Select Story -> Watch ISL Avatar ->
Take Quiz -> Track Progress -> Practice Signs in Studio -> Earn Badges
```

**Journey 2: Developer (Priya)**
```
OAuth Sign Up -> Generate API Key -> Read Docs -> Try Playground ->
Install NPM SDK -> Embed ISLAvatar Component -> Monitor Usage ->
Run Accessibility Audit -> Auto-Fix Issues
```

**Journey 3: Educator (Dr. Meera)**
```
Sign Up -> Create Class -> Add Students -> Assign Jataka Tale ->
Set Quiz Due Date -> Monitor Progress -> Generate Report -> Print IEP Docs
```

**Journey 4: Hearing Colleague (Rohit)**
```
Sign Up -> Open Conversation Mode -> Type Message -> See Avatar Sign ->
Colleague Signs via Webcam -> Read Text Output -> Browse Dictionary -> Learn Signs
```

### Constraints

- **v1 is web-only** (desktop + mobile responsive, no native apps)
- **Internet required** (no offline mode in v1)
- **No video calling** (planned for v2)
- **ISL only** (no ASL/BSL support until v3)
- **848 SiGML files** in v1 (expanding to 2,000+ in v2)
- **50 Jataka Tales** in v1 (full 547 in v2)
- **No hardware peripherals** (webcam only, no gloves/sensors)

---

## 2. Feature Breakdown

### Module 1: ISL Communication Hub

| Feature | Sub-Features | Priority |
|---------|-------------|----------|
| **F1.1 Text Input Panel** | Rich text editor, language auto-detect (Hindi/English), voice dictation (Whisper ASR), file upload (.txt/.docx), character/word count, estimated signing duration | P0 |
| **F1.2 Translation Pipeline** | Hindi->English bridge, NLP preprocessing, BiLSTM encoder with attention -> ISL glosses, SiGML lookup, fingerspelling fallback, confidence score | P0 |
| **F1.3 3D Avatar Renderer** | CWASA WebGL avatar, gender selection (M/F/neutral), speed control (0.5x-2.0x), loop/pause/rewind, step-by-step gloss nav, synchronized text highlighting, fullscreen, PiP, dark mode | P0 |
| **F1.4 Real-Time Gesture Capture** | One-click webcam activation, MediaPipe Holistic (33 body + 21 hand landmarks @ 30fps), skeleton overlay, confidence threshold, client-side processing | P0 |
| **F1.5 Sign Recognition & Output** | Gloss sequence -> NLP post-processing -> English, TTS (Web Speech API), Hindi translation, conversation history, export PDF/share link | P0 |
| **F1.6 Split-Screen Dialogue** | Left panel (hearing types -> avatar), right panel (deaf signs -> text), <500ms latency, transcript with timestamps, shareable session link, mobile responsive | P1 |
| **F1.7 ISL Dictionary** | 5,000+ signs, search by English/Hindi/handshape, sign video + gloss + HamNoSys + examples, Word of the Day, bookmarks, custom lists | P1 |
| **F1.8 Vocabulary Learning** | Flashcards, spaced repetition (SM-2), progress tracking, category-based learning packs | P2 |

### Module 2: Developer Dashboard & SDK

| Feature | Sub-Features | Priority |
|---------|-------------|----------|
| **F2.0 Developer Onboarding** | OAuth 2.0 (Google/GitHub), API key management (rotate/revoke/scope), sandbox (1,000 free calls/month), "Hello ISL" tutorial | P0 |
| **F2.1 UI String Extractor** | Paste React/Vue/Angular/HTML code, AI extracts user-facing strings + ARIA labels, one-click ISL translation, avatar preview, export (SiGML/JSON/React bundle) | P1 |
| **F2.2 Prompt-to-Prototype** | Natural language spec input, LLM generates React component with ISL support, WCAG 2.2 compliance, one-click deploy | P2 |
| **F2.3 Translation REST API** | POST /v1/translate (text, source_lang, output_format, avatar_style, speed, webhook_url) | P0 |
| **F2.4 Gesture Recognition WebSocket** | ws://api.signforge.in/v1/recognize, stream landmarks, batch video upload mode | P1 |
| **F2.5 JavaScript/TypeScript SDK** | npm @signforge/sdk, ISLAvatar component, useISLTranslation hook, ISLInput component, Storybook docs | P0 |
| **F2.6 Python SDK** | pip install signforge, sync/async functions, Flask/Django middleware, LangChain integration | P1 |
| **F2.7 Performance Dashboard** | API latency (p50/p95/p99), BLEU score trend, usage analytics, model comparison, webhook status | P1 |

### Module 3: Educational Platform

| Feature | Sub-Features | Priority |
|---------|-------------|----------|
| **F3.1 Story Browser** | Searchable library, filters (theme/difficulty/length), thumbnail cards (English/Hindi/ISL gloss) | P0 |
| **F3.2 Immersive Story Player** | Full-screen avatar, side-by-side text sync, chapter nav, vocabulary spotlight, bookmarks, completion tracking, social sharing | P0 |
| **F3.3 Classroom Management** | Teacher dashboard, create classes, add students, assignment builder, progress tracking, printable reports, parent portal | P1 |
| **F3.4 Interactive Quiz Engine** | Auto-generated quizzes, 3 question types, adaptive difficulty, instant feedback, leaderboard | P1 |
| **F3.5 Lesson Plan Creator** | Structured plans, CBSE/State Board templates, sharable, export PDF/SCORM | P2 |
| **F3.6 Student Practice Studio** | Webcam recording, AI pose comparison, handshape/movement/expression feedback, improvement trends | P2 |

### Module 4: Live Collaboration Canvas

| Feature | Sub-Features | Priority |
|---------|-------------|----------|
| **F4.1 Multi-User Document Editor** | Rich text collab editor, ISL narration of edits, "ISL Read Aloud", comment threads in text+ISL, version history | P2 |
| **F4.2 ISL Meeting Overlay** | Browser extension (Chrome/Firefox), Whisper ASR -> avatar, deaf webcam -> captions, transcript export | P2 |
| **F4.3 Visual Whiteboard** | Infinite canvas, voice/text annotations signed by avatar, gesture drawing, ISL instruction recording, accessible PDF export | P3 |
| **F4.4 ISL Video Message System** | Record ISL video, auto-transcript, text reply -> ISL avatar, ISL inbox/outbox, Slack-like channels | P3 |

### Module 5: Accessibility Auditor

| Feature | Sub-Features | Priority |
|---------|-------------|----------|
| **F5.1 Repository Scanner** | GitHub/GitLab OAuth, PR-triggered scan, detect missing ISL annotations/ARIA/alt text/keyboard nav, prioritized issue list | P1 |
| **F5.2 Accessibility Score** | 0-100 score, category breakdown, historical trend, benchmarking | P1 |
| **F5.3 AI-Powered Auto-Fix** | One-click ISLAvatar insertion, ARIA/alt text suggestions, auto-generated PR, confidence indicator | P2 |
| **F5.4 Compliance Report Generator** | Legal PDF report, aligned with WCAG 2.2/RPwD Act 2016/NEP 2020, compliance certificate (score 80+) | P2 |

### Module 6: Admin & Analytics

| Feature | Sub-Features | Priority |
|---------|-------------|----------|
| **F6.1 Platform Administration** | RBAC (6 roles), user management, content moderation queue, SiGML file management, system health dashboard | P0 |
| **F6.2 Research & Training Dashboard** | Corpus management, annotation queue, Cohen's Kappa metrics, model retraining trigger, dataset version control | P1 |
| **F6.3 Analytics & Reporting** | DAU/MAU, session duration, feature heatmap, BLEU score trend, NPS surveys, quiz/vocabulary metrics, API partner analytics | P1 |

### Non-Functional Requirements

| Category | Requirement |
|----------|------------|
| **Performance** | <500ms translation latency (p95), <200ms dictionary lookup, <2s avatar first load |
| **Scalability** | 500 concurrent users (v1), 5,000 (v2), horizontal pod autoscaling |
| **Availability** | 99.9% uptime SLA |
| **Security** | TLS 1.3, AES-256 at rest, OAuth 2.0 + PKCE, JWT (15-min expiry), OWASP Top 10 audit |
| **Privacy** | Client-side webcam processing, DPDP Act 2023 compliant, GDPR-compatible |
| **Accessibility** | WCAG 2.2 Level AA, keyboard navigation, screen reader support |
| **Responsiveness** | Mobile-first, 375px minimum (iPhone SE breakpoint) |
| **Internationalization** | Hindi + English UI; extensible to other languages |

### Missing Requirements & Ambiguities

1. **Payment/Billing System** - PRD mentions pricing tiers ($29/$99/Enterprise) but no payment flow. Need: Stripe/Razorpay integration, subscription management, invoicing.
2. **Notification System** - No spec for email/push/in-app notifications (assignment due, API quota warning, model updates).
3. **User Onboarding Flow** - "60 seconds to first translation" stated but exact wizard steps not defined.
4. **Search Infrastructure** - 5,000+ dictionary entries + 547 tales need full-text search.
5. **Localization of UI** - Hindi UI implied but no i18n strategy documented.
6. **Rate Limiting Strategy** - Tiers defined but no burst handling, grace periods, or overage billing.
7. **Backup & Disaster Recovery** - 30-day RDS backup mentioned but no full DR plan (RTO/RPO).
8. **Content Versioning** - No CMS or content versioning strategy for evolving tale content.
9. **Mobile PWA** - PRD says "web only" but PWA could significantly improve mobile experience.
10. **ISL Expert Review Workflow** - How do ISL experts access, review, and approve translations at scale?

### Recommended Additional Features

1. **PWA Support** - Installable app with service worker caching for dictionary entries and stories
2. **ISL Community Forum** - Space for deaf community, educators, and developers to share and contribute
3. **Gamification Engine** - Points, badges, streaks, levels for students and ISL learners
4. **ISL Sign Contribution Portal** - Crowdsourced sign submissions with expert review pipeline
5. **Webhook Marketplace** - Pre-built integrations for Slack, Discord, Teams, Google Classroom, Moodle
6. **Parental Controls** - Content restrictions, screen time limits for younger students
7. **Offline Dictionary Cache** - Service worker cached subset of dictionary for basic offline lookup
8. **Multi-Tenant White-Label** - Branded SignForge deployment for institutions
9. **AI Conversation Practice Bot** - ISL chatbot for practice conversations, adapting to learner level
10. **ISL Fingerspelling Game** - Interactive game to learn and practice ISL fingerspelling alphabet

---

## 3. User Flows

### Flow 1: Text-to-ISL Translation

```
User lands on Communication Hub
  |-> Enters/pastes text (or dictates via mic, or uploads file)
  |-> System auto-detects language (Hindi/English)
  |-> [If Hindi] LLM translates to English
  |-> NLP preprocessing (tokenize, lemmatize, normalize)
  |-> BiLSTM Encoder + Attention -> ISL Gloss Sequence
  |-> ISL Mapper looks up SiGML files for each gloss
  |     +--[Mapped] -> Load SiGML file
  |     +--[Unmapped] -> Fingerspelling fallback (char-by-char)
  |-> CWASA WebGL Avatar renders animation in browser
  |-> Source text highlights word-by-word in sync
  |-> User can: adjust speed | pause/rewind | fullscreen | PiP | loop
```

### Flow 2: ISL-to-Text (Webcam Recognition)

```
User clicks "Start Webcam"
  |-> Browser requests camera permission
  |     +--[Denied] -> Show error + instructions to enable
  |     +--[Granted] -> MediaPipe Holistic initializes
  |-> Captures 75 keypoints at 30fps (client-side)
  |-> Skeleton overlay on webcam feed
  |-> 30-frame sliding window -> BiLSTM classifier -> Gloss prediction
  |-> Beam search (width 5) + 3-gram LM rescoring
  |-> Gloss sequence -> NLP post-processing -> English sentence
  |-> [Optional] TTS output via Web Speech API
  |-> [Optional] Hindi translation
  |-> Conversation history updated with timestamp
```

### Flow 3: Split-Screen Conversation

```
Hearing User (Left Panel)           Deaf User (Right Panel)
  Types/speaks message                Signs via webcam
  |                                   |
  v                                   v
  Text -> Translation Pipeline        MediaPipe -> Recognition
  |                                   |
  v                                   v
  ISL Avatar signs for deaf user      Text appears for hearing user
  |                                   |
  +---------- Conversation Log -------+
  |
  v
  Export as PDF / Share via link
```

### Flow 4: Developer API Integration

```
Developer OAuth signup (Google/GitHub)
  |-> Lands on Developer Dashboard
  |-> Generates API Key (with scope selection)
  |-> Reads interactive docs + tries Playground
  |-> Installs SDK: npm install @signforge/sdk
  |-> Embeds <ISLAvatar text="..." /> in React app
  |-> SDK calls POST /v1/translate behind the scenes
  |-> Avatar renders ISL in developer's app
  |-> Monitors usage via Performance Dashboard
  |-> [Optional] Runs Accessibility Auditor on repo
  |-> [Optional] Auto-fixes ISL gaps via generated PR
```

### Flow 5: Student Learning (Jataka Tales)

```
Student logs in -> Views assigned tales
  |-> Opens Story Browser -> Filters by assigned/theme/difficulty
  |-> Selects tale -> Immersive Story Player opens
  |-> Avatar signs story | Text highlights in sync | Chapter nav
  |-> Taps unknown word -> Vocabulary Spotlight (sign + definition)
  |-> Completes story -> Auto-generated comprehension quiz
  |-> Answers questions -> Instant feedback with correct sign
  |-> Progress saved -> Educator sees completion + score
  |-> [Optional] Practice Studio: record signing, get AI feedback
```

### Flow 6: Educator Workflow

```
Educator signs up / logs in
  |-> Creates a Class (name, grade, subject)
  |-> Adds students (invite by email or code)
  |-> Opens Assignment Builder
  |-> Selects tales + vocabulary + quizzes | Sets due dates
  |-> Students receive assignments
  |-> Educator monitors: completion, time spent, quiz scores
  |-> Generates printable IEP progress report
  |-> [Optional] Shares lesson plan with community
```

### Flow 7: Accessibility Audit

```
Developer connects GitHub repo via OAuth
  |-> Auditor triggers on PR (or manual scan)
  |-> Scanner identifies:
  |     - Strings without ISL annotation
  |     - Missing ARIA / alt text
  |     - Keyboard nav gaps
  |     - No sign language alt for audio
  |-> Prioritized issue list (Critical/High/Medium/Low)
  |-> Accessibility Score (0-100)
  |-> Developer clicks "Auto-Fix"
  |-> AI inserts ISLAvatar components, suggests ARIA values
  |-> Auto-generated PR with fixes
  |-> [If score >= 80] Compliance certificate issued
```

### System Flow: Translation Pipeline

```
[Client] React SPA + CWASA Avatar + MediaPipe
    | HTTPS / WSS
[Gateway] Nginx -> Flask API Gateway (auth + rate limiting + routing)
    |
    +-> /v1/translate -> FastAPI Translation Service
    |     |-> NLP (spaCy + CoreNLP) -> BiLSTM -> Gloss -> SiGML Mapper
    |     |-> Redis cache check (return cached if hit)
    |     |-> Celery async for video generation
    |
    +-> /v1/recognize -> WebSocket -> PyTorch LSTM Inference
    |     |-> Sliding window classification -> Beam search
    |
    +-> /v1/stories -> Flask Content Service -> PostgreSQL + S3
    |
    +-> /v1/audit -> Flask Audit Service -> Celery async jobs
    |
[Data] PostgreSQL | Redis | S3 | MLflow
```

### Edge Cases

| Area | Edge Case | Handling |
|------|-----------|----------|
| **Translation** | Empty input | Disable translate button, show placeholder |
| | Input > 2,000 chars | Truncate with warning, suggest splitting |
| | Mixed Hindi+English | Handle code-switching, translate Hindi portions |
| | All words unmapped in SiGML | Full fingerspelling with accuracy warning |
| | Model confidence < threshold | Stanford CoreNLP fallback + warning badge |
| | Service timeout | Return cached result if available, else retry prompt |
| **Webcam** | Camera permission denied | Step-by-step enable instructions |
| | Low light | Warning overlay, suggest better lighting |
| | Multiple people in frame | Detect primary signer (closest), accuracy warning |
| | Rapid/unclear signing | Low confidence indicator, suggest slower signing |
| | Unsupported browser | Compatibility warning, suggest Chrome/Firefox |
| **Auth** | OAuth provider down | Fallback email/password login |
| | JWT expired mid-session | Silent refresh token; if fails, redirect to login |
| | API key compromised | One-click revoke, generate new, email alert |
| | Rate limit exceeded | 429 with Retry-After header, upgrade prompt |
| **Education** | Student joins after due date | Allow late submission with flag |
| | Quiz answer disputed | Flag for teacher review |
| | Network issue during story | Progressive loading, offline text cache |
| **Collaboration** | Same paragraph edited by two users | CRDT conflict resolution |
| | Avatar bandwidth too high | Degrade to text-only, avatar on-demand |

---

## 4. System Architecture

### High-Level Architecture

```
                         +------------------------+
                         |   CDN (CloudFront)     |
                         |   Static assets, SiGML |
                         +-----------+------------+
                                     |
                         +-----------v------------+
                         |   React.js Frontend    |
                         |   TypeScript + Tailwind|
                         |   CWASA/Three.js Avatar|
                         |   MediaPipe (client)   |
                         +-----------+------------+
                                     |
                                HTTPS / WSS
                                     |
                         +-----------v------------+
                         |   Nginx Reverse Proxy  |
                         |   TLS 1.3 | LB | CORS |
                         +-----------+------------+
                                     |
              +----------------------+----------------------+
              |                      |                      |
    +---------v--------+  +---------v--------+  +-----------v----------+
    | Flask API Gateway|  | FastAPI ML       |  | Flask Content Service|
    | Auth + Routing   |  | Translation Svc  |  | Stories + Dictionary |
    | Rate Limiting    |  | Gesture Recog    |  | User Management      |
    +--------+---------+  +--------+---------+  +-----------+----------+
              |                     |                        |
    +---------v---------------------v------------------------v---------+
    |                         Redis Cluster                            |
    |   Translation Cache | Sessions | Rate Limits | Pub/Sub          |
    +---+-------------------+---------------------+-------------------+
        |                   |                     |
  +-----v--------+  +------v---------+  +--------v---------+
  | PostgreSQL   |  | Celery Workers |  | AWS S3 / Blob    |
  | RDS + Read   |  | Video gen      |  | SiGML files      |
  | Replicas     |  | Model retrain  |  | MP4 avatars      |
  +----+---------+  | Audit jobs     |  | Corpus data      |
       |            +------+---------+  +------------------+
       |                   |
       |            +------v---------+
       |            | GPU Node Pool  |
       |            | NVIDIA T4/A10  |
       |            | PyTorch + CUDA |
       |            | Whisper ASR    |
       |            +------+---------+
       |                   |
       |            +------v---------+
       |            | MLflow Server  |
       |            | Model Registry |
       |            +----------------+
       |
  +----v---------------------------------------------+
  | Monitoring: Prometheus + Grafana + AlertManager  |
  | CI/CD: GitHub Actions -> Docker -> K8s (EKS)    |
  +--------------------------------------------------+
```

### Technology Choices & Justification

#### Frontend: React.js 18+ / TypeScript / Tailwind CSS / Vite

- **React.js**: PRD specifies; massive ecosystem; Three.js/WebGL integration; MediaPipe bindings
- **TypeScript**: Type safety for complex multi-module platform; better SDK consumer DX
- **Tailwind CSS**: Utility-first scales well; easy dark mode; responsive breakpoints; small purged bundle
- **Vite**: Faster dev/build vs CRA; native ESM; superior HMR

> **Why not Next.js?** The PRD specifies Flask backend. The app is heavily client-side (WebGL avatar, MediaPipe). A Vite SPA with React Router is simpler and aligns with architecture.

#### Backend: Flask (Gateway) + FastAPI (ML Services)

- **Flask**: PRD specifies; lightweight API gateway; good auth/middleware ecosystem
- **FastAPI**: Async for ML inference; auto OpenAPI docs; Pydantic validation; WebSocket support
- **Gunicorn + Uvicorn**: Production WSGI/ASGI servers

> **Why not Node.js?** ML pipeline is Python-native (PyTorch, spaCy, MediaPipe). Single language reduces boundary overhead.

#### Database: PostgreSQL 16

- **PostgreSQL**: PRD specifies; JSONB for flexible schema; full-text search for dictionary; relational for users/classes/assignments
- **Read Replicas**: Offload read-heavy dictionary lookups and story browsing
- **SQLite**: Local dev/testing fallback only

#### Auth: OAuth 2.0 + PKCE + JWT

- **OAuth 2.0 + PKCE**: PRD specifies Google/GitHub login; PKCE prevents code interception
- **JWT (15-min expiry)**: Stateless API auth; short-lived tokens
- **Refresh Tokens**: httpOnly cookies; silent renewal
- **bcrypt API Keys**: Hashed at rest; never stored plaintext

#### Storage: AWS S3 + CloudFront CDN

- **S3**: Cost-effective for media (SiGML, MP4, corpus); lifecycle policies
- **CloudFront**: Sub-100ms global SiGML load; edge caching for avatar videos

#### Cache: Redis 7

- **Translation Cache**: Avoid re-computing identical translations (GPU cost savings)
- **Session Store**: Fast authenticated user lookup
- **Rate Limits**: Atomic increment per API key, sliding window
- **Pub/Sub**: Real-time collaboration features

#### Queue: Celery 5.3 + Redis Broker

- **Async Video Generation**: MP4 rendering offloaded to background workers
- **Model Retraining**: Triggered on annotation batch > 500 pairs
- **Audit Jobs**: CPU-intensive scanning with webhook callback
- **Redis Broker**: Already in stack; simpler than RabbitMQ at this scale

#### ML / AI Stack

| Component | Technology | Reason |
|-----------|-----------|--------|
| Translation Model | PyTorch 2.0+ (BiLSTM + Transformer Attention) | PRD specifies; CUDA support |
| NLP | spaCy 3.7 + Stanford CoreNLP | Fast tokenization + deep parsing fallback |
| Gesture Recognition | MediaPipe Holistic + PyTorch LSTM | Client-side privacy; temporal classification |
| ASR | OpenAI Whisper v3 | SoTA Hindi + English recognition |
| LLM (Code Gen) | Llama 3.1 (8B) self-hosted | No API dependency; fine-tunable |
| Experiment Tracking | MLflow 2.10 | Model versioning, BLEU tracking, A/B tests |
| Hyperparameter Tuning | Optuna | PRD specifies Bayesian tuning |

#### Deployment: Docker + Kubernetes (AWS EKS)

- **Docker**: Consistent environments; microservice isolation
- **K8s (EKS)**: Horizontal pod autoscaling (2-20 replicas); GPU node pools; rolling deploys
- **Multi-Region**: Mumbai primary, Singapore failover
- **GitHub Actions**: CI/CD pipeline

#### Monitoring: Prometheus + Grafana

- **Prometheus**: Time-series metrics; K8s native discovery
- **Grafana**: Dashboards for latency, GPU util, error rates
- **AlertManager**: Slack/email alerts for SLA violations

#### Search (Additional): Meilisearch

- Sub-50ms typo-tolerant search for 5,000+ dictionary entries and 547 tales
- Lighter operational overhead than Elasticsearch
## 5. Database Design

### Entity Relationship Overview

```
Users ──< UserRoles
Users ──< ApiKeys
Users ──< Sessions
Users ──< Bookmarks
Users ──< VocabularyLists ──< VocabularyListItems
Users ──< ConversationSessions ──< ConversationMessages
Users ──< FeedbackSubmissions

Institutions ──< InstitutionMembers >── Users
Institutions ──< Classes ──< ClassStudents >── Users
Classes ──< Assignments ──< AssignmentSubmissions >── Users

Stories ──< StoryChapters ──< StoryGlossAnnotations
Stories ──< StoryQuizzes ──< QuizQuestions ──< QuizAnswers
Stories ──< UserStoryProgress >── Users

Signs ──< SignExamples
Signs ──< SignCategories >── Categories

SigmlFiles ──< GlossMappings

ApiKeys >── Users
ApiUsageLogs >── ApiKeys

AuditJobs >── Users
AuditJobs ──< AuditIssues

AnnotationBatches ──< Annotations >── Users (annotator)
ModelVersions ──< ModelExperiments

Subscriptions >── Users
Subscriptions >── Plans
```

### Database Schema

#### Core Tables

```sql
-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255),                    -- NULL for OAuth-only users
    full_name       VARCHAR(255) NOT NULL,
    display_name    VARCHAR(100),
    avatar_url      VARCHAR(500),
    locale          VARCHAR(10) DEFAULT 'en',        -- 'en' | 'hi'
    theme           VARCHAR(10) DEFAULT 'system',    -- 'light' | 'dark' | 'system'
    is_deaf         BOOLEAN DEFAULT FALSE,
    is_verified     BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role        VARCHAR(30) NOT NULL,  -- 'super_admin' | 'institution_admin' | 'educator' | 'student' | 'developer' | 'api_user' | 'general'
    granted_by  UUID REFERENCES users(id),
    granted_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

CREATE TABLE oauth_accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider        VARCHAR(30) NOT NULL,   -- 'google' | 'github' | 'gitlab'
    provider_id     VARCHAR(255) NOT NULL,
    access_token    TEXT,                    -- encrypted
    refresh_token   TEXT,                    -- encrypted
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider, provider_id)
);

CREATE TABLE sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token   VARCHAR(500) NOT NULL,
    ip_address      INET,
    user_agent      TEXT,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INSTITUTIONS & CLASSES (Education)
-- ============================================

CREATE TABLE institutions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(50) NOT NULL,   -- 'school' | 'university' | 'ngo' | 'enterprise'
    address     TEXT,
    city        VARCHAR(100),
    state       VARCHAR(100),
    country     VARCHAR(100) DEFAULT 'India',
    logo_url    VARCHAR(500),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE institution_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            VARCHAR(30) NOT NULL,  -- 'admin' | 'educator' | 'student' | 'parent'
    joined_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(institution_id, user_id)
);

CREATE TABLE classes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID REFERENCES institutions(id) ON DELETE SET NULL,
    educator_id     UUID NOT NULL REFERENCES users(id),
    name            VARCHAR(255) NOT NULL,
    grade           VARCHAR(50),
    subject         VARCHAR(100),
    invite_code     VARCHAR(20) UNIQUE NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE class_students (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

CREATE TABLE assignments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    type        VARCHAR(30) NOT NULL,  -- 'story' | 'vocabulary' | 'quiz' | 'practice'
    content_ids JSONB NOT NULL,        -- array of story/vocab/quiz IDs
    due_date    TIMESTAMPTZ,
    is_adaptive BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assignment_submissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id   UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          VARCHAR(20) DEFAULT 'pending',  -- 'pending' | 'in_progress' | 'completed' | 'late'
    score           DECIMAL(5,2),
    time_spent_sec  INTEGER,
    submitted_at    TIMESTAMPTZ,
    data            JSONB,             -- quiz answers, practice results, etc.
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

-- ============================================
-- ISL SIGNS & DICTIONARY
-- ============================================

CREATE TABLE signs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    english_word    VARCHAR(255) NOT NULL,
    hindi_word      VARCHAR(255),
    gloss           VARCHAR(100) NOT NULL UNIQUE,    -- ISL gloss notation (e.g., 'KING')
    hamnosys_code   VARCHAR(500),
    sigml_file_id   UUID REFERENCES sigml_files(id),
    handshape_desc  TEXT,
    description     TEXT,
    difficulty      VARCHAR(20) DEFAULT 'beginner',  -- 'beginner' | 'intermediate' | 'advanced'
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sign_categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sign_id     UUID NOT NULL REFERENCES signs(id) ON DELETE CASCADE,
    category    VARCHAR(100) NOT NULL,  -- 'greetings' | 'numbers' | 'colours' | 'emotions' | etc.
    UNIQUE(sign_id, category)
);

CREATE TABLE sign_examples (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sign_id     UUID NOT NULL REFERENCES signs(id) ON DELETE CASCADE,
    sentence    TEXT NOT NULL,
    isl_gloss   TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sigml_files (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename        VARCHAR(255) NOT NULL UNIQUE,
    s3_key          VARCHAR(500) NOT NULL,
    gloss           VARCHAR(100) NOT NULL,
    hamnosys_code   VARCHAR(500),
    version         INTEGER DEFAULT 1,
    is_active       BOOLEAN DEFAULT TRUE,
    tags            JSONB DEFAULT '[]',
    uploaded_by     UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gloss_mappings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    english_word    VARCHAR(255) NOT NULL,
    gloss           VARCHAR(100) NOT NULL,
    sigml_file_id   UUID NOT NULL REFERENCES sigml_files(id),
    confidence      DECIMAL(3,2) DEFAULT 1.0,
    source          VARCHAR(30) DEFAULT 'manual',  -- 'manual' | 'model' | 'feedback'
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(english_word, gloss)
);

-- ============================================
-- JATAKA TALES (Educational Content)
-- ============================================

CREATE TABLE stories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en        VARCHAR(500) NOT NULL,
    title_hi        VARCHAR(500),
    slug            VARCHAR(255) UNIQUE NOT NULL,
    summary_en      TEXT,
    summary_hi      TEXT,
    theme           VARCHAR(50) NOT NULL,     -- 'animal' | 'human' | 'wisdom' | 'sacrifice' | 'karmic'
    difficulty      VARCHAR(20) NOT NULL,     -- 'beginner' | 'intermediate' | 'advanced'
    duration_min    INTEGER,                  -- estimated ISL signing duration
    word_count      INTEGER,
    thumbnail_url   VARCHAR(500),
    is_published    BOOLEAN DEFAULT FALSE,
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE story_chapters (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id    UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    chapter_num INTEGER NOT NULL,
    title_en    VARCHAR(255),
    title_hi    VARCHAR(255),
    content_en  TEXT NOT NULL,
    content_hi  TEXT,
    isl_glosses TEXT NOT NULL,            -- space-separated ISL gloss sequence
    sigml_data  JSONB NOT NULL,           -- ordered array of {gloss, sigml_file_id, word_index}
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(story_id, chapter_num)
);

CREATE TABLE story_quizzes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id    UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    is_adaptive BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_questions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id     UUID NOT NULL REFERENCES story_quizzes(id) ON DELETE CASCADE,
    type        VARCHAR(30) NOT NULL,   -- 'sign_to_word' | 'sentence_to_sign' | 'sequence_order'
    question    JSONB NOT NULL,         -- type-specific question data
    options     JSONB NOT NULL,         -- array of answer options
    correct     JSONB NOT NULL,         -- correct answer(s)
    difficulty  INTEGER DEFAULT 1,      -- 1-5 scale
    order_num   INTEGER NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_story_progress (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    story_id            UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    status              VARCHAR(20) DEFAULT 'not_started',  -- 'not_started' | 'in_progress' | 'completed'
    current_chapter     INTEGER DEFAULT 1,
    completion_pct      DECIMAL(5,2) DEFAULT 0,
    time_spent_sec      INTEGER DEFAULT 0,
    last_accessed_at    TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    UNIQUE(user_id, story_id)
);

CREATE TABLE quiz_attempts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id         UUID NOT NULL REFERENCES story_quizzes(id) ON DELETE CASCADE,
    score           DECIMAL(5,2) NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    answers         JSONB NOT NULL,        -- {question_id: user_answer}
    time_spent_sec  INTEGER,
    completed_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VOCABULARY & LEARNING
-- ============================================

CREATE TABLE vocabulary_lists (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    is_public   BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vocabulary_list_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id         UUID NOT NULL REFERENCES vocabulary_lists(id) ON DELETE CASCADE,
    sign_id         UUID NOT NULL REFERENCES signs(id) ON DELETE CASCADE,
    added_at        TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(list_id, sign_id)
);

CREATE TABLE user_sign_progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sign_id         UUID NOT NULL REFERENCES signs(id) ON DELETE CASCADE,
    ease_factor     DECIMAL(4,2) DEFAULT 2.5,    -- SM-2 algorithm
    interval_days   INTEGER DEFAULT 1,
    repetitions     INTEGER DEFAULT 0,
    next_review_at  TIMESTAMPTZ,
    last_reviewed_at TIMESTAMPTZ,
    accuracy_pct    DECIMAL(5,2) DEFAULT 0,
    UNIQUE(user_id, sign_id)
);

CREATE TABLE bookmarks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type     VARCHAR(30) NOT NULL,   -- 'sign' | 'story' | 'chapter'
    target_id       UUID NOT NULL,
    note            TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);

-- ============================================
-- CONVERSATIONS & COMMUNICATION
-- ============================================

CREATE TABLE conversation_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id      UUID NOT NULL REFERENCES users(id),
    share_code      VARCHAR(20) UNIQUE,
    title           VARCHAR(255),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    ended_at        TIMESTAMPTZ
);

CREATE TABLE conversation_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES conversation_sessions(id) ON DELETE CASCADE,
    sender_id       UUID REFERENCES users(id),
    input_type      VARCHAR(20) NOT NULL,   -- 'text' | 'speech' | 'sign'
    input_content   TEXT NOT NULL,           -- original input
    output_text     TEXT,                    -- translated output text
    isl_glosses     TEXT,                    -- ISL gloss sequence
    confidence      DECIMAL(3,2),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DEVELOPER PLATFORM
-- ============================================

CREATE TABLE api_keys (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_hash        VARCHAR(255) NOT NULL,      -- bcrypt hash
    key_prefix      VARCHAR(10) NOT NULL,       -- first 8 chars for identification
    name            VARCHAR(100) NOT NULL,
    scopes          JSONB DEFAULT '["translate"]',  -- ['translate', 'recognize', 'dictionary', 'stories', 'audit']
    is_active       BOOLEAN DEFAULT TRUE,
    last_used_at    TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE api_usage_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id  UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint    VARCHAR(100) NOT NULL,
    method      VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    latency_ms  INTEGER,
    request_size INTEGER,
    response_size INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_api_usage_created ON api_usage_logs(api_key_id, created_at);

CREATE TABLE subscriptions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan        VARCHAR(30) NOT NULL,   -- 'free' | 'starter' | 'growth' | 'enterprise'
    status      VARCHAR(20) NOT NULL,   -- 'active' | 'past_due' | 'cancelled' | 'trialing'
    stripe_sub_id VARCHAR(255),
    current_period_start TIMESTAMPTZ,
    current_period_end   TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE webhooks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    url         VARCHAR(500) NOT NULL,
    secret      VARCHAR(255) NOT NULL,     -- HMAC-SHA256 signing secret
    events      JSONB NOT NULL,            -- ['translation.complete', 'recognition.complete', etc.]
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE webhook_deliveries (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id  UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event       VARCHAR(50) NOT NULL,
    payload     JSONB NOT NULL,
    status_code INTEGER,
    attempts    INTEGER DEFAULT 0,
    delivered_at TIMESTAMPTZ,
    next_retry  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACCESSIBILITY AUDITOR
-- ============================================

CREATE TABLE audit_jobs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    repo_url        VARCHAR(500),
    repo_provider   VARCHAR(20),          -- 'github' | 'gitlab'
    branch          VARCHAR(255),
    pr_number       INTEGER,
    status          VARCHAR(20) DEFAULT 'pending',  -- 'pending' | 'running' | 'completed' | 'failed'
    score           INTEGER,              -- 0-100
    score_breakdown JSONB,                -- {isl_coverage, wcag, cognitive_load, visual_contrast}
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_issues (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id      UUID NOT NULL REFERENCES audit_jobs(id) ON DELETE CASCADE,
    severity    VARCHAR(10) NOT NULL,     -- 'critical' | 'high' | 'medium' | 'low'
    category    VARCHAR(30) NOT NULL,     -- 'isl_missing' | 'aria' | 'alt_text' | 'keyboard' | 'contrast'
    file_path   VARCHAR(500),
    line_number INTEGER,
    description TEXT NOT NULL,
    suggestion  TEXT,
    auto_fixable BOOLEAN DEFAULT FALSE,
    is_fixed    BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ML & ANNOTATION PIPELINE
-- ============================================

CREATE TABLE annotation_batches (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    status          VARCHAR(20) DEFAULT 'open',  -- 'open' | 'in_review' | 'approved' | 'training'
    total_pairs     INTEGER DEFAULT 0,
    cohens_kappa    DECIMAL(4,3),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    approved_at     TIMESTAMPTZ
);

CREATE TABLE annotations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id        UUID NOT NULL REFERENCES annotation_batches(id) ON DELETE CASCADE,
    english_text    TEXT NOT NULL,
    isl_gloss       TEXT NOT NULL,
    annotator_id    UUID NOT NULL REFERENCES users(id),
    reviewer_id     UUID REFERENCES users(id),
    status          VARCHAR(20) DEFAULT 'pending',  -- 'pending' | 'approved' | 'rejected' | 'corrected'
    confidence      DECIMAL(3,2),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at     TIMESTAMPTZ
);

CREATE TABLE feedback_submissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    type            VARCHAR(30) NOT NULL,   -- 'translation_correction' | 'sign_suggestion' | 'bug_report'
    original_text   TEXT,
    original_gloss  TEXT,
    corrected_gloss TEXT,
    notes           TEXT,
    status          VARCHAR(20) DEFAULT 'pending',  -- 'pending' | 'reviewed' | 'accepted' | 'rejected'
    reviewed_by     UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE model_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version         VARCHAR(50) NOT NULL UNIQUE,
    model_type      VARCHAR(30) NOT NULL,   -- 'translation' | 'recognition'
    mlflow_run_id   VARCHAR(100),
    bleu_score      DECIMAL(4,3),
    accuracy        DECIMAL(4,3),
    is_active       BOOLEAN DEFAULT FALSE,  -- currently serving traffic
    training_data   JSONB,                  -- {batch_ids, pair_count, etc.}
    config          JSONB,                  -- hyperparameters
    s3_artifact     VARCHAR(500),
    deployed_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COLLABORATION (Module 4)
-- ============================================

CREATE TABLE documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id      UUID NOT NULL REFERENCES users(id),
    title           VARCHAR(500) NOT NULL,
    content         JSONB NOT NULL DEFAULT '{}',   -- CRDT document state
    share_code      VARCHAR(20) UNIQUE,
    is_public       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE document_collaborators (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission  VARCHAR(10) NOT NULL,   -- 'view' | 'edit' | 'admin'
    UNIQUE(document_id, user_id)
);

CREATE TABLE isl_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id       UUID NOT NULL REFERENCES users(id),
    channel_id      UUID,                -- NULL for direct messages
    recipient_id    UUID REFERENCES users(id),
    video_s3_key    VARCHAR(500),        -- recorded ISL video
    transcript      TEXT,                -- auto-generated text
    isl_glosses     TEXT,
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_signs_english ON signs(english_word);
CREATE INDEX idx_signs_hindi ON signs(hindi_word);
CREATE INDEX idx_signs_gloss ON signs(gloss);
CREATE INDEX idx_gloss_mappings_word ON gloss_mappings(english_word);
CREATE INDEX idx_stories_theme ON stories(theme);
CREATE INDEX idx_stories_difficulty ON stories(difficulty);
CREATE INDEX idx_story_chapters_story ON story_chapters(story_id, chapter_num);
CREATE INDEX idx_user_story_progress ON user_story_progress(user_id, story_id);
CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX idx_audit_jobs_user ON audit_jobs(user_id);
CREATE INDEX idx_annotations_batch ON annotations(batch_id);
CREATE INDEX idx_feedback_status ON feedback_submissions(status);
CREATE INDEX idx_conversation_messages_session ON conversation_messages(session_id, created_at);

-- Full-text search indexes
CREATE INDEX idx_signs_search ON signs USING GIN (to_tsvector('english', english_word || ' ' || COALESCE(hindi_word, '') || ' ' || gloss));
CREATE INDEX idx_stories_search ON stories USING GIN (to_tsvector('english', title_en || ' ' || COALESCE(summary_en, '')));
```

### Key Relationships Summary

| Relationship | Type | Description |
|-------------|------|-------------|
| User -> Roles | 1:N | A user can have multiple roles (e.g., educator + developer) |
| User -> API Keys | 1:N | Developers manage multiple scoped API keys |
| Institution -> Classes | 1:N | School/org contains multiple classes |
| Class -> Students | M:N | Via class_students junction table |
| Class -> Assignments | 1:N | Educator assigns content to class |
| Story -> Chapters | 1:N | Ordered chapters within a tale |
| Story -> Quizzes | 1:N | Auto-generated comprehension quizzes |
| Sign -> SiGML File | N:1 | Multiple signs can reference same SiGML |
| English Word -> Gloss -> SiGML | N:N:1 | Via gloss_mappings table |
| Audit Job -> Issues | 1:N | Scan produces multiple findings |
| Annotation Batch -> Annotations | 1:N | Grouped for quality control |

---

## 6. API Design

### Base Configuration

- **Base URL**: `https://api.signforge.in/v1`
- **Auth**: Bearer JWT (user routes) or `X-API-Key` header (developer routes)
- **Content-Type**: `application/json`
- **Rate Limits**: Per tier (Free: 1 req/sec, Starter: 10/sec, Growth: 50/sec, Enterprise: unlimited)

### Standard Response Envelope

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "request_id": "uuid",
    "timestamp": "ISO-8601",
    "latency_ms": 142
  },
  "error": null
}
```

```json
{
  "success": false,
  "data": null,
  "meta": { "request_id": "uuid", "timestamp": "ISO-8601" },
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have exceeded your rate limit. Upgrade plan or wait.",
    "details": { "retry_after": 60 }
  }
}
```

### Authentication Endpoints

#### POST /auth/register
```
Body: { "email": "string", "password": "string", "full_name": "string", "is_deaf": boolean }
Response: { "user": UserObject, "access_token": "jwt", "refresh_token": "jwt" }
Auth: None
```

#### POST /auth/login
```
Body: { "email": "string", "password": "string" }
Response: { "user": UserObject, "access_token": "jwt", "refresh_token": "jwt" }
Auth: None
```

#### POST /auth/oauth/{provider}
```
Params: provider = "google" | "github"
Body: { "code": "string", "redirect_uri": "string" }
Response: { "user": UserObject, "access_token": "jwt", "refresh_token": "jwt" }
Auth: None
```

#### POST /auth/refresh
```
Body: { "refresh_token": "string" }
Response: { "access_token": "jwt", "refresh_token": "jwt" }
Auth: None
```

#### POST /auth/logout
```
Auth: Bearer JWT
Response: { "message": "Logged out successfully" }
```

### Translation Endpoints

#### POST /v1/translate
```
Auth: Bearer JWT or X-API-Key
Body:
{
  "text": "string (max 2000 chars)",
  "source_lang": "en" | "hi" | "auto",
  "output_format": "sigml" | "gloss" | "json" | "mp4_url",
  "avatar_style": "default" | "male" | "female" | "neutral",
  "speed": 1.0,           // 0.5 to 2.0
  "webhook_url": "string"  // optional, for async mp4 generation
}
Response:
{
  "translation_id": "uuid",
  "source_text": "The king gave the ball",
  "detected_lang": "en",
  "glosses": ["KING", "BALL", "GIVE"],
  "sigml_urls": [
    "https://cdn.signforge.in/sigml/KING.sigml",
    "https://cdn.signforge.in/sigml/BALL.sigml",
    "https://cdn.signforge.in/sigml/GIVE.sigml"
  ],
  "confidence": 0.87,
  "fallback_used": false,
  "signing_duration_sec": 4.2
}
```

#### POST /v1/translate/batch
```
Auth: X-API-Key
Body:
{
  "texts": ["string", ...],    // max 100 items
  "source_lang": "en" | "hi" | "auto",
  "output_format": "gloss" | "json"
}
Response:
{
  "results": [
    { "index": 0, "glosses": [...], "confidence": 0.92 },
    { "index": 1, "glosses": [...], "confidence": 0.78 }
  ],
  "total": 2
}
```

### Sign Dictionary Endpoints

#### GET /v1/signs/{word}
```
Auth: Bearer JWT or X-API-Key
Params: word (URL-encoded English or Hindi word)
Response:
{
  "sign": {
    "id": "uuid",
    "english_word": "king",
    "hindi_word": "राजा",
    "gloss": "KING",
    "hamnosys_code": "...",
    "sigml_url": "https://cdn.signforge.in/sigml/KING.sigml",
    "categories": ["nouns", "royalty"],
    "examples": [
      { "sentence": "The king was wise", "isl_gloss": "KING WISE" }
    ],
    "difficulty": "beginner"
  }
}
```

#### GET /v1/signs/search
```
Auth: Bearer JWT or X-API-Key
Query: q=string, category=string, difficulty=string, page=int, limit=int
Response:
{
  "signs": [SignObject, ...],
  "total": 1234,
  "page": 1,
  "limit": 20
}
```

#### GET /v1/signs/word-of-the-day
```
Auth: Optional
Response: { "sign": SignObject, "date": "2026-03-06" }
```

### Gesture Recognition Endpoints

#### WebSocket /v1/recognize
```
Auth: X-API-Key (in query param or first message)
Client sends: { "landmarks": [[x,y,z], ...], "timestamp": float }  // 75 keypoints
Server responds: { "gloss": "KING", "confidence": 0.91, "is_final": false }
On sentence boundary: { "glosses": ["KING", "BALL", "GIVE"], "text": "The king gave the ball", "is_final": true }
```

#### POST /v1/recognize/video
```
Auth: X-API-Key
Body: multipart/form-data with video file
Response:
{
  "job_id": "uuid",
  "status": "processing"    // async, poll GET /v1/recognize/video/{job_id}
}
```

#### GET /v1/recognize/video/{job_id}
```
Auth: X-API-Key
Response:
{
  "status": "completed",
  "transcript": [
    { "start_sec": 0.0, "end_sec": 2.1, "glosses": ["HELLO"], "text": "Hello" },
    ...
  ]
}
```

### Stories Endpoints

#### GET /v1/stories
```
Auth: Optional (public listing)
Query: theme=string, difficulty=string, length=string, search=string, page=int, limit=int
Response:
{
  "stories": [
    {
      "id": "uuid", "title_en": "...", "title_hi": "...", "slug": "...",
      "theme": "animal", "difficulty": "beginner", "duration_min": 5,
      "thumbnail_url": "...", "word_count": 450
    }
  ],
  "total": 50, "page": 1
}
```

#### GET /v1/stories/{id}
```
Auth: Optional (public), Bearer JWT for progress tracking
Response:
{
  "story": {
    "id": "uuid", "title_en": "...", "title_hi": "...",
    "chapters": [
      {
        "chapter_num": 1, "title_en": "...",
        "content_en": "...", "content_hi": "...",
        "isl_glosses": "KING GARDEN WALK ...",
        "sigml_data": [
          { "gloss": "KING", "sigml_url": "...", "word_index": 0 }
        ]
      }
    ],
    "quizzes": [{ "id": "uuid", "title": "..." }]
  },
  "progress": { "status": "in_progress", "current_chapter": 2, "completion_pct": 40 }
}
```

### Education Endpoints

#### POST /v1/classes
```
Auth: Bearer JWT (educator role)
Body: { "name": "string", "grade": "string", "subject": "string", "institution_id": "uuid?" }
Response: { "class": ClassObject }
```

#### POST /v1/classes/{id}/assignments
```
Auth: Bearer JWT (educator, owner of class)
Body: { "title": "string", "type": "story", "content_ids": ["uuid"], "due_date": "ISO-8601" }
Response: { "assignment": AssignmentObject }
```

#### GET /v1/classes/{id}/progress
```
Auth: Bearer JWT (educator)
Response:
{
  "students": [
    {
      "student_id": "uuid", "name": "...",
      "assignments_completed": 5, "avg_score": 82.5,
      "time_spent_min": 120, "last_active": "ISO-8601"
    }
  ]
}
```

#### POST /v1/quizzes/{id}/submit
```
Auth: Bearer JWT (student)
Body: { "answers": { "question_id": "answer_value", ... }, "time_spent_sec": 300 }
Response:
{
  "score": 80.0, "correct": 4, "total": 5,
  "feedback": [
    { "question_id": "uuid", "correct": true },
    { "question_id": "uuid", "correct": false, "correct_answer": "...", "sign_url": "..." }
  ]
}
```

### Audit Endpoints

#### POST /v1/audit
```
Auth: Bearer JWT or X-API-Key (developer)
Body:
{
  "source": "github",           // 'github' | 'gitlab' | 'code'
  "repo_url": "https://github.com/user/repo",
  "branch": "main",
  "code": "string"              // alternative: paste code directly
}
Response: { "job_id": "uuid", "status": "pending" }
```

#### GET /v1/audit/{job_id}
```
Auth: Bearer JWT or X-API-Key
Response:
{
  "status": "completed",
  "score": 72,
  "breakdown": { "isl_coverage": 60, "wcag": 85, "cognitive_load": 70, "contrast": 73 },
  "issues": [
    {
      "severity": "high", "category": "isl_missing",
      "file": "src/components/Header.tsx", "line": 42,
      "description": "User-facing text lacks ISL annotation",
      "suggestion": "Wrap with <ISLAvatar text=\"Welcome\" />",
      "auto_fixable": true
    }
  ],
  "total_issues": 15
}
```

#### POST /v1/audit/{job_id}/fix
```
Auth: Bearer JWT (developer)
Body: { "issue_ids": ["uuid", ...], "create_pr": true }
Response: { "pr_url": "https://github.com/user/repo/pull/42", "fixes_applied": 12 }
```

### Feedback & Annotation Endpoints

#### POST /v1/feedback
```
Auth: Bearer JWT
Body:
{
  "type": "translation_correction",
  "original_text": "The king was brave",
  "original_gloss": "KING BRAVE",
  "corrected_gloss": "KING COURAGE HAVE",
  "notes": "ISL uses COURAGE HAVE, not BRAVE directly"
}
Response: { "feedback_id": "uuid", "status": "pending" }
```

### Developer Dashboard Endpoints

#### POST /v1/api-keys
```
Auth: Bearer JWT (developer role)
Body: { "name": "Production Key", "scopes": ["translate", "dictionary"] }
Response: { "api_key": "sf_live_abc123...", "key_id": "uuid" }  // key shown ONCE
```

#### GET /v1/usage
```
Auth: Bearer JWT or X-API-Key
Query: period=7d|30d|90d
Response:
{
  "period": "30d",
  "total_requests": 12500,
  "requests_by_endpoint": { "/v1/translate": 8000, "/v1/signs": 4500 },
  "avg_latency_ms": 230,
  "error_rate": 0.02,
  "quota": { "limit": 50000, "used": 12500, "remaining": 37500 }
}
```

### Webhook Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `translation.complete` | Async MP4 video ready | `{ translation_id, mp4_url, duration_sec }` |
| `recognition.complete` | Video transcript ready | `{ job_id, transcript }` |
| `audit.complete` | Audit job finished | `{ job_id, score, issue_count }` |
| `model.updated` | New model deployed | `{ model_type, version, bleu_score }` |

---

## 7. UI/UX Theme

### Design Philosophy

SignForge is an **ISL-first** platform. The avatar is the primary UI element, not an afterthought. Design prioritizes:
- Visual clarity for deaf users
- High contrast and large touch targets
- Dark mode as default (preferred by many deaf users for reduced eye strain)
- Motion-conscious animations (respect prefers-reduced-motion)
- Keyboard-navigable (WCAG 2.2 AA compliant)

### Color Palette

#### Primary Colors

| Name | Light Mode | Dark Mode | Usage |
|------|-----------|-----------|-------|
| **Primary** | `#2563EB` (Blue 600) | `#3B82F6` (Blue 500) | CTAs, links, active states |
| **Primary Hover** | `#1D4ED8` (Blue 700) | `#60A5FA` (Blue 400) | Interactive hover states |
| **Primary Light** | `#DBEAFE` (Blue 100) | `#1E3A5F` | Backgrounds, badges |

#### Secondary Colors

| Name | Light Mode | Dark Mode | Usage |
|------|-----------|-----------|-------|
| **Secondary** | `#7C3AED` (Violet 600) | `#8B5CF6` (Violet 500) | ISL-specific features, avatar controls |
| **Accent** | `#F59E0B` (Amber 500) | `#FBBF24` (Amber 400) | Notifications, badges, gamification |
| **Success** | `#10B981` (Emerald 500) | `#34D399` (Emerald 400) | Correct answers, confidence high |
| **Warning** | `#F59E0B` (Amber 500) | `#FBBF24` (Amber 400) | Low confidence, quota near limit |
| **Error** | `#EF4444` (Red 500) | `#F87171` (Red 400) | Errors, critical issues |

#### Neutral Colors

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--bg-primary` | `#FFFFFF` | `#0F172A` (Slate 900) |
| `--bg-secondary` | `#F8FAFC` (Slate 50) | `#1E293B` (Slate 800) |
| `--bg-tertiary` | `#F1F5F9` (Slate 100) | `#334155` (Slate 700) |
| `--text-primary` | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) |
| `--text-secondary` | `#475569` (Slate 600) | `#94A3B8` (Slate 400) |
| `--text-muted` | `#94A3B8` (Slate 400) | `#64748B` (Slate 500) |
| `--border` | `#E2E8F0` (Slate 200) | `#334155` (Slate 700) |
| `--border-focus` | `#2563EB` | `#3B82F6` |

### Typography

| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| **H1** | Inter | 700 (Bold) | 36px / 2.25rem | 1.2 |
| **H2** | Inter | 600 (SemiBold) | 30px / 1.875rem | 1.25 |
| **H3** | Inter | 600 | 24px / 1.5rem | 1.3 |
| **H4** | Inter | 600 | 20px / 1.25rem | 1.4 |
| **Body Large** | Inter | 400 (Regular) | 18px / 1.125rem | 1.6 |
| **Body** | Inter | 400 | 16px / 1rem | 1.6 |
| **Body Small** | Inter | 400 | 14px / 0.875rem | 1.5 |
| **Caption** | Inter | 500 (Medium) | 12px / 0.75rem | 1.4 |
| **Code** | JetBrains Mono | 400 | 14px / 0.875rem | 1.6 |
| **Hindi Text** | Noto Sans Devanagari | 400 | 16px / 1rem | 1.7 |

> **Why Inter?** Excellent readability at all sizes, extensive weight range, good i18n support, widely available as a variable font (reduces load).

### Spacing System (8px Grid)

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-20` | 80px |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Badges, small chips |
| `--radius-md` | 8px | Cards, inputs, buttons |
| `--radius-lg` | 12px | Modals, large cards |
| `--radius-xl` | 16px | Feature panels |
| `--radius-full` | 9999px | Avatars, circular buttons |

### Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Inputs, small cards |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Dropdown menus, cards |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, popovers |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Page overlays |

### UI Components

| Component | Variants | Notes |
|-----------|----------|-------|
| **Button** | Primary, Secondary, Ghost, Danger, Icon-only | Min height 44px (touch target) |
| **Input** | Text, Textarea, Select, File Upload, Search | 16px min font (no zoom on iOS) |
| **Card** | Story Card, Sign Card, Stat Card, Issue Card | Consistent padding (16px/24px) |
| **Avatar Viewer** | Inline, Fullscreen, PiP, Side-by-side | Always includes playback controls |
| **Badge** | Status (active/inactive), Severity (critical/high/medium/low), Role | |
| **Modal** | Confirmation, Form, Info, Full-screen | Keyboard trap, ESC to close |
| **Toast** | Success, Error, Warning, Info | Auto-dismiss 5s, persistent for errors |
| **Tabs** | Horizontal, Vertical, Pill-style | ARIA tabs pattern |
| **Progress Bar** | Linear, Circular, Step indicator | For story progress, quiz, upload |
| **Skeleton** | Text line, Card, Avatar, Table row | All async states use skeletons |
| **Webcam View** | Active (with skeleton overlay), Inactive, Error | Permission state handling |
| **Code Block** | Syntax highlighted, with copy button | For developer dashboard |
| **Data Table** | Sortable, filterable, paginated | For admin/analytics views |
| **Chart** | Line, Bar, Donut | For analytics dashboard |
| **Navigation** | Top navbar, Sidebar, Breadcrumbs, Mobile bottom tabs | |

### Responsive Layout Rules

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| **Mobile** | 375px - 639px | Single column, bottom nav, stacked avatar |
| **Tablet** | 640px - 1023px | Two-column where needed, sidebar collapsible |
| **Desktop** | 1024px - 1279px | Full sidebar, multi-panel layouts |
| **Wide** | 1280px+ | Max content width 1280px, centered |

**Key Layout Rules:**
- Avatar viewer always visible (fixed/sticky) when translation is active
- Split-screen conversation collapses to tabbed view on mobile
- Sidebar navigation collapses to hamburger on tablet and below
- Story player: side-by-side on desktop, stacked on mobile (avatar on top)
- Dashboard cards use CSS Grid: 1 col mobile, 2 col tablet, 3-4 col desktop
- Min touch target: 44x44px for all interactive elements
- Content max-width: 65ch for reading content (optimal line length)

---

## 8. Figma Design Structure

### Page Organization

```
Figma Project: SignForge
|
+-- 0. Cover & TOC
|     Cover page with project branding
|     Table of contents linking to all pages
|
+-- 1. Design System
|     +-- 1.1 Colors (Light + Dark tokens)
|     +-- 1.2 Typography (Scale + Hindi support)
|     +-- 1.3 Spacing & Grid (8px grid system)
|     +-- 1.4 Icons (Lucide icon set + custom ISL icons)
|     +-- 1.5 Shadows & Elevation
|     +-- 1.6 Motion & Animation tokens
|
+-- 2. Components Library
|     +-- 2.1 Buttons (Primary/Secondary/Ghost/Danger/Icon, all states)
|     +-- 2.2 Inputs (Text/Textarea/Select/Search/File, all states)
|     +-- 2.3 Cards (Story/Sign/Stat/Issue, with hover + skeleton)
|     +-- 2.4 Navigation (Navbar/Sidebar/Breadcrumbs/BottomTabs)
|     +-- 2.5 Avatar Viewer (Inline/Fullscreen/PiP/Controls)
|     +-- 2.6 Modals & Dialogs (Confirm/Form/Info/Fullscreen)
|     +-- 2.7 Toasts & Notifications
|     +-- 2.8 Badges & Tags
|     +-- 2.9 Tables & Data Display
|     +-- 2.10 Charts (Line/Bar/Donut)
|     +-- 2.11 Webcam View (Active/Inactive/Error states)
|     +-- 2.12 Code Blocks & API Playground
|     +-- 2.13 Progress Indicators (Bar/Circle/Steps)
|     +-- 2.14 Skeletons & Loading States
|
+-- 3. Landing Page
|     +-- 3.1 Hero Section (avatar demo, headline, CTA)
|     +-- 3.2 Features Grid (6 modules)
|     +-- 3.3 How It Works (3-step flow)
|     +-- 3.4 Live Demo Embed (try translation)
|     +-- 3.5 Testimonials / Use Cases
|     +-- 3.6 Pricing Cards (Free/Starter/Growth/Enterprise)
|     +-- 3.7 Footer (links, newsletter, social)
|     +-- Mobile variant
|
+-- 4. Authentication
|     +-- 4.1 Sign Up (Email + OAuth buttons)
|     +-- 4.2 Log In
|     +-- 4.3 Forgot Password
|     +-- 4.4 Reset Password
|     +-- 4.5 Email Verification
|     +-- 4.6 Onboarding Wizard (role selection, first translation)
|
+-- 5. Communication Hub
|     +-- 5.1 Text-to-ISL (input panel + avatar + controls)
|     +-- 5.2 ISL-to-Text / Webcam Mode
|     +-- 5.3 Split-Screen Conversation
|     +-- 5.4 Conversation History
|     +-- Mobile variants for all
|
+-- 6. ISL Dictionary
|     +-- 6.1 Dictionary Browse & Search
|     +-- 6.2 Sign Detail Page
|     +-- 6.3 Word of the Day
|     +-- 6.4 Vocabulary Lists
|     +-- 6.5 Flashcard Learning Mode
|
+-- 7. Developer Dashboard
|     +-- 7.1 Dashboard Overview (usage stats, quick actions)
|     +-- 7.2 API Key Management
|     +-- 7.3 API Playground (interactive tester)
|     +-- 7.4 Documentation Viewer
|     +-- 7.5 SDK Installation Guide
|     +-- 7.6 UI String Extractor
|     +-- 7.7 Prompt-to-Prototype
|     +-- 7.8 Performance Monitoring
|     +-- 7.9 Webhook Management
|
+-- 8. Educational Platform
|     +-- 8.1 Story Browser (grid + filters)
|     +-- 8.2 Immersive Story Player
|     +-- 8.3 Vocabulary Spotlight Overlay
|     +-- 8.4 Quiz Interface (3 question types)
|     +-- 8.5 Quiz Results & Feedback
|     +-- 8.6 Student Dashboard
|
+-- 9. Educator Portal
|     +-- 9.1 Educator Dashboard
|     +-- 9.2 Class Management
|     +-- 9.3 Assignment Builder
|     +-- 9.4 Student Progress View
|     +-- 9.5 Report Generator
|     +-- 9.6 Lesson Plan Creator
|     +-- 9.7 Parent Portal View
|
+-- 10. Collaboration Canvas
|     +-- 10.1 Document Editor with ISL Narration
|     +-- 10.2 Meeting Overlay Extension Preview
|     +-- 10.3 Whiteboard Canvas
|     +-- 10.4 ISL Message Inbox
|
+-- 11. Accessibility Auditor
|     +-- 11.1 Audit Dashboard
|     +-- 11.2 Repo Connection Flow
|     +-- 11.3 Scan Results (issue list + score)
|     +-- 11.4 Auto-Fix Review
|     +-- 11.5 Compliance Report PDF Preview
|
+-- 12. Admin Panel
|     +-- 12.1 Admin Dashboard (system health)
|     +-- 12.2 User Management
|     +-- 12.3 Content Moderation Queue
|     +-- 12.4 SiGML File Manager
|     +-- 12.5 Analytics Dashboard
|     +-- 12.6 Annotation & Corpus Management
|     +-- 12.7 Model Training Dashboard
|
+-- 13. Settings
|     +-- 13.1 Profile Settings
|     +-- 13.2 Accessibility Preferences (font size, contrast, motion)
|     +-- 13.3 Notification Preferences
|     +-- 13.4 Billing & Subscription
|     +-- 13.5 Data Export / Account Deletion (DPDP compliance)
|
+-- 14. Error & Empty States
|     +-- 14.1 404 Not Found
|     +-- 14.2 500 Server Error
|     +-- 14.3 Network Offline
|     +-- 14.4 Empty States (no stories, no classes, no API keys)
|     +-- 14.5 Permission Denied
|     +-- 14.6 Camera Permission Error
|     +-- 14.7 Rate Limit Exceeded
|
+-- 15. Loading States
|     +-- Skeleton screens for: Dashboard, Story List, Dictionary,
|         API Playground, Analytics, Quiz, Conversation
```

### Component Variants (Figma)

| Component | Variants | Properties |
|-----------|----------|------------|
| Button | Size: sm/md/lg, Style: primary/secondary/ghost/danger, State: default/hover/active/disabled/loading, Icon: none/left/right/only | |
| Input | Type: text/textarea/search/select/file, State: default/focus/error/disabled, Size: sm/md/lg | |
| Card | Type: story/sign/stat/issue, State: default/hover/skeleton, Theme: light/dark | |
| Avatar Viewer | Mode: inline/fullscreen/pip, State: loading/playing/paused/error, Gender: male/female/neutral | |
| Badge | Type: status/severity/role, Color: blue/green/red/amber/purple/gray | |
| Navigation | Type: navbar/sidebar/breadcrumb/bottomtab, State: collapsed/expanded, Theme: light/dark | |
| Webcam | State: inactive/requesting/active/error, Overlay: on/off | |
| Toast | Type: success/error/warning/info, Dismissable: yes/no | |

### Design Tokens (Figma Variables)

```
Collections:
  - Colors (Light / Dark modes)
  - Typography (sizes, weights, line-heights)
  - Spacing (4px - 80px scale)
  - Border Radius (sm/md/lg/xl/full)
  - Shadows (sm/md/lg/xl)
  - Breakpoints (mobile/tablet/desktop/wide)

Usage:
  - All components reference tokens, never hard-coded values
  - Mode switching instantly themes entire design
  - Exported as CSS custom properties for development handoff
```

### Auto-Layout Rules

- All frames use auto-layout (vertical or horizontal)
- 8px grid spacing as base unit
- Cards: 16px internal padding, 12px gap between elements
- Page sections: 64px vertical spacing
- Content containers: max-width 1280px, auto horizontal padding (16px mobile, 32px tablet, 48px desktop)
- Button groups: 8px gap
- Form fields: 16px vertical gap
- Navigation items: 4px gap (compact), 8px gap (spacious)
## 9. Development Roadmap

### Phase 1: Foundation (Weeks 1-8)

| Week | Focus | Deliverables |
|------|-------|-------------|
| 1-2 | **Project Setup & Infrastructure** | Monorepo scaffold, Docker Compose, CI/CD pipeline, PostgreSQL + Redis setup, AWS S3 bucket, Nginx config |
| 3-4 | **Auth & User System** | OAuth 2.0 (Google/GitHub), JWT auth, user registration, role management, session handling |
| 5-6 | **Core Translation Pipeline (Backend)** | Flask API gateway, FastAPI translation service, NLP preprocessing (spaCy), ISL Mapper with SiGML lookup, Redis caching |
| 7-8 | **3D Avatar Renderer (Frontend)** | CWASA WebGL integration, SiGML file loading, avatar playback controls (speed/pause/rewind), dark mode, responsive layout |

**Phase 1 Exit Criteria:**
- User can sign up, log in (OAuth), and see a dashboard
- Text input -> ISL gloss -> SiGML -> avatar animation works end-to-end
- Translation results cached in Redis
- CI/CD deploys to staging on merge to main

### Phase 2: Core Features (Weeks 9-18)

| Week | Focus | Deliverables |
|------|-------|-------------|
| 9-10 | **BiLSTM Translation Model** | PyTorch model training, BLEU evaluation, model serving via FastAPI, Stanford CoreNLP fallback |
| 11-12 | **Webcam Gesture Recognition** | MediaPipe Holistic integration (client-side), skeleton overlay, BiLSTM classifier, beam search, real-time gloss output |
| 13-14 | **ISL Dictionary & Search** | Dictionary database seeding (5,000+ signs), Meilisearch integration, sign detail pages, search API, Word of the Day |
| 15-16 | **Jataka Tales Library** | Story browser with filters, immersive story player, synchronized text highlighting, chapter navigation, vocabulary spotlight |
| 17-18 | **Developer Dashboard v1** | API key management, interactive playground, usage analytics, REST API documentation, rate limiting |

**Phase 2 Exit Criteria:**
- Bidirectional translation works (text->ISL and ISL->text via webcam)
- Dictionary searchable with 5,000+ entries
- 50 Jataka Tales browsable and playable with ISL avatar
- Developers can generate API keys and make translate API calls
- BiLSTM model achieves BLEU >= 0.60 on test set

### Phase 3: Advanced Features (Weeks 19-28)

| Week | Focus | Deliverables |
|------|-------|-------------|
| 19-20 | **Split-Screen Conversation Mode** | Deaf<->Hearing dialogue interface, conversation history, transcript export, shareable session links |
| 21-22 | **NPM & Python SDK** | @signforge/sdk package (ISLAvatar component, useISLTranslation hook), Python SDK (pip install signforge), Storybook docs |
| 23-24 | **Educational Platform** | Classroom management, assignment builder, quiz engine (3 types), adaptive difficulty, progress tracking |
| 25-26 | **Accessibility Auditor** | GitHub OAuth, repo scanner, accessibility scoring, issue prioritization, auto-fix suggestions |
| 27-28 | **Vocabulary Learning & Practice** | Flashcard system (SM-2 spaced repetition), learning packs, practice studio (webcam + AI pose comparison) |

**Phase 3 Exit Criteria:**
- Full conversation mode functional with <500ms latency
- NPM SDK published and usable in external React apps
- Educators can create classes, assign stories, and track student progress
- Accessibility auditor can scan a GitHub repo and produce scored report
- Spaced repetition learning mode functional

### Phase 4: Optimization (Weeks 29-34)

| Week | Focus | Deliverables |
|------|-------|-------------|
| 29-30 | **Performance Optimization** | Translation latency < 500ms (p95), avatar load < 2s, Redis cache hit ratio > 80%, database query optimization, CDN for SiGML files |
| 31-32 | **ML Model Enhancement** | Transformer attention added to BiLSTM, Optuna hyperparameter tuning, continuous learning pipeline, A/B testing framework, target BLEU >= 0.75 |
| 33-34 | **Collaboration Features** | Multi-user document editor (CRDT), ISL Read Aloud, ISL Meeting Overlay browser extension (Chrome), ISL video messaging |

**Phase 4 Exit Criteria:**
- All performance NFRs met (latency, load time, concurrent users)
- BiLSTM+Attention model achieves BLEU >= 0.75
- Collaboration document editor works with 5+ concurrent users
- Browser extension installable and functional with Google Meet

### Phase 5: Production Readiness (Weeks 35-40)

| Week | Focus | Deliverables |
|------|-------|-------------|
| 35-36 | **Admin & Analytics** | Admin dashboard, RBAC enforcement, user management, SiGML file manager, annotation queue, model retraining UI |
| 37-38 | **Security & Compliance** | OWASP Top 10 audit, penetration testing prep, DPDP Act compliance review, WCAG 2.2 AA audit, compliance report generator |
| 39-40 | **Launch Preparation** | Load testing (500 concurrent), monitoring dashboards (Grafana), alerting rules, documentation finalization, landing page, onboarding flow |

**Phase 5 Exit Criteria:**
- 99.9% uptime on staging for 2 weeks
- All security audit findings resolved
- WCAG 2.2 AA compliance verified
- Landing page live, onboarding < 60 seconds to first translation
- Runbooks for all operational scenarios

---

## 10. Task Breakdown

### Epic 1: Project Foundation

**Feature 1.1: Repository & Infrastructure Setup**
- Task: Initialize monorepo with Turborepo/pnpm workspaces
  - Subtask: Create apps/web (Vite + React + TypeScript)
  - Subtask: Create apps/api (Flask API gateway)
  - Subtask: Create services/translation (FastAPI + PyTorch)
  - Subtask: Create services/recognition (FastAPI + MediaPipe)
  - Subtask: Create packages/ui (shared React component library)
  - Subtask: Create packages/config (shared ESLint, TypeScript, Tailwind configs)
- Task: Set up Docker Compose for local development
  - Subtask: Dockerfile for each service (web, api, translation, recognition)
  - Subtask: docker-compose.yml with PostgreSQL, Redis, Meilisearch, Nginx
  - Subtask: Hot-reload configuration for all services
- Task: Configure CI/CD with GitHub Actions
  - Subtask: Lint + type-check workflow
  - Subtask: Unit test workflow (pytest + vitest)
  - Subtask: Docker build + push workflow
  - Subtask: Deploy to staging on merge to main
- Task: Set up cloud infrastructure (AWS)
  - Subtask: Terraform/Pulumi for EKS cluster, RDS PostgreSQL, S3, CloudFront, ElastiCache Redis
  - Subtask: Kubernetes manifests (Deployments, Services, Ingress, HPA)
  - Subtask: Secrets management (AWS Secrets Manager)

**Feature 1.2: Database & Data Layer**
- Task: Design and create database migrations
  - Subtask: Install Alembic (Flask) migration tool
  - Subtask: Create initial migration with all core tables
  - Subtask: Seed data script for signs, categories, sample stories
- Task: Set up Redis caching layer
  - Subtask: Translation cache (TTL: 24 hours)
  - Subtask: Session store
  - Subtask: Rate limit counters (sliding window)
- Task: Set up Meilisearch
  - Subtask: Signs index with searchable attributes
  - Subtask: Stories index with filterable attributes
  - Subtask: Sync pipeline from PostgreSQL to Meilisearch

### Epic 2: Authentication & User Management

**Feature 2.1: Authentication System**
- Task: Implement OAuth 2.0 with PKCE
  - Subtask: Google OAuth provider integration
  - Subtask: GitHub OAuth provider integration
  - Subtask: OAuth callback handling and user creation
- Task: Implement JWT authentication
  - Subtask: Access token generation (15-min expiry)
  - Subtask: Refresh token flow (httpOnly cookie)
  - Subtask: Token verification middleware (Flask)
- Task: Email/password registration
  - Subtask: Registration endpoint with validation
  - Subtask: Password hashing (bcrypt)
  - Subtask: Email verification flow
- Task: Role-based access control
  - Subtask: Role assignment on registration
  - Subtask: Permission decorators for Flask routes
  - Subtask: Role-based UI rendering (frontend)

**Feature 2.2: User Profile & Settings**
- Task: Profile management endpoints
  - Subtask: GET/PUT /users/me
  - Subtask: Avatar upload to S3
  - Subtask: Locale and theme preferences
  - Subtask: Accessibility settings (font size, contrast, motion)
- Task: Account management
  - Subtask: Password change
  - Subtask: Data export (DPDP Act compliance)
  - Subtask: Account deletion with cascading cleanup

### Epic 3: ISL Translation Engine

**Feature 3.1: NLP Preprocessing Service**
- Task: Set up spaCy NLP pipeline
  - Subtask: English tokenization, lemmatization, POS tagging
  - Subtask: Stopword removal and normalization
  - Subtask: Hindi text detection (language identification)
- Task: Hindi-to-English translation bridge
  - Subtask: Integrate pre-trained Hindi->English model (HuggingFace)
  - Subtask: Fallback to Google Translate API
  - Subtask: Cache translations in Redis
- Task: Stanford CoreNLP fallback parser
  - Subtask: SOV grammar rule-based mapping
  - Subtask: Confidence-based fallback trigger

**Feature 3.2: BiLSTM Translation Model**
- Task: Model architecture implementation
  - Subtask: 2-layer BiLSTM encoder (512 hidden units, 256-dim embeddings)
  - Subtask: Attention mechanism (8-head multi-head attention)
  - Subtask: LSTM decoder with teacher forcing
  - Subtask: Beam search inference (width 5)
- Task: Training pipeline
  - Subtask: Dataset loader for English-ISL parallel pairs
  - Subtask: Training loop with cross-entropy loss + label smoothing
  - Subtask: ReduceLROnPlateau scheduler + early stopping
  - Subtask: MLflow experiment logging
  - Subtask: Checkpoint saving every 5 epochs
- Task: Model serving
  - Subtask: FastAPI endpoint for inference
  - Subtask: Model loading and warm-up on startup
  - Subtask: Batch inference support
  - Subtask: A/B testing infrastructure (traffic splitting)

**Feature 3.3: ISL Mapper & SiGML Pipeline**
- Task: Build gloss-to-SiGML mapping system
  - Subtask: Load 848 SiGML files into S3 with metadata in PostgreSQL
  - Subtask: JSON lookup table (gloss -> SiGML file path)
  - Subtask: Redis cache for frequently accessed mappings
- Task: Fingerspelling fallback
  - Subtask: Character-by-character ISL fingerspelling SiGML generation
  - Subtask: Trigger when gloss has no SiGML mapping
- Task: Translation confidence scoring
  - Subtask: Model output confidence calculation
  - Subtask: Threshold-based fallback routing

### Epic 4: 3D Avatar & Frontend

**Feature 4.1: CWASA WebGL Avatar**
- Task: Integrate CWASA avatar engine
  - Subtask: Three.js + CWASA setup in React
  - Subtask: SiGML file parser and animation player
  - Subtask: Avatar model loading (male/female/neutral)
- Task: Playback controls
  - Subtask: Play/pause/stop buttons
  - Subtask: Speed control slider (0.5x - 2.0x)
  - Subtask: Rewind and step-by-step gloss navigation
  - Subtask: Loop toggle
  - Subtask: Fullscreen mode
  - Subtask: Picture-in-Picture support
- Task: Synchronized text highlighting
  - Subtask: Map avatar animation timeline to source text word positions
  - Subtask: Highlight current word during playback
  - Subtask: Click-to-seek (click word to jump avatar to that sign)

**Feature 4.2: Communication Hub UI**
- Task: Text input panel
  - Subtask: Rich text editor with language detection indicator
  - Subtask: Character/word count + estimated signing duration
  - Subtask: Voice dictation button (Whisper ASR integration)
  - Subtask: File upload (.txt, .docx)
- Task: ISL-to-Text webcam mode
  - Subtask: Camera permission flow with error handling
  - Subtask: MediaPipe Holistic initialization
  - Subtask: Skeleton overlay rendering on canvas
  - Subtask: Real-time gloss display
  - Subtask: TTS output toggle
- Task: Conversation mode (split-screen)
  - Subtask: Left panel (hearing: text/speech -> avatar)
  - Subtask: Right panel (deaf: webcam -> text)
  - Subtask: Conversation transcript with timestamps
  - Subtask: Mobile tabbed layout
  - Subtask: Share session link, export PDF

**Feature 4.3: Application Shell**
- Task: Navigation and layout
  - Subtask: Top navbar with user menu, theme toggle, locale selector
  - Subtask: Sidebar navigation (collapsible)
  - Subtask: Mobile bottom tab bar
  - Subtask: Breadcrumb component
- Task: Theme system
  - Subtask: Dark/light/system mode detection and toggle
  - Subtask: CSS custom properties for all design tokens
  - Subtask: Tailwind dark mode configuration
- Task: Accessibility foundation
  - Subtask: Skip-to-content link
  - Subtask: Focus management and visible focus rings
  - Subtask: ARIA landmarks on all page sections
  - Subtask: Screen reader announcements for dynamic content
  - Subtask: Reduced motion support

### Epic 5: Developer Platform

**Feature 5.1: API Key Management**
- Task: API key CRUD
  - Subtask: Generate key with bcrypt hash storage
  - Subtask: List keys (show prefix only)
  - Subtask: Rotate key (generate new, revoke old)
  - Subtask: Revoke key
  - Subtask: Scope selection (translate/recognize/dictionary/stories/audit)
- Task: Rate limiting
  - Subtask: Redis-based sliding window per API key
  - Subtask: Tier-based limits (Free/Starter/Growth/Enterprise)
  - Subtask: 429 response with Retry-After header
  - Subtask: Usage quota tracking

**Feature 5.2: API Playground & Docs**
- Task: Interactive API playground
  - Subtask: Request builder UI (endpoint, params, headers)
  - Subtask: Live response viewer with syntax highlighting
  - Subtask: Code snippet generator (cURL, JavaScript, Python)
- Task: API documentation
  - Subtask: Auto-generated OpenAPI spec from FastAPI
  - Subtask: Embedded docs viewer (Swagger UI or custom)
  - Subtask: SDK installation guides (NPM, Python)
  - Subtask: "Hello ISL" tutorial (10-minute quick start)

**Feature 5.3: NPM SDK (@signforge/sdk)**
- Task: SDK package development
  - Subtask: ISLAvatar React component
  - Subtask: useISLTranslation custom hook
  - Subtask: ISLInput component (text field + avatar preview)
  - Subtask: Configuration provider (API key, base URL)
- Task: SDK publishing
  - Subtask: Build pipeline (tsup/rollup)
  - Subtask: NPM publish workflow
  - Subtask: Storybook documentation
  - Subtask: TypeScript type definitions

**Feature 5.4: Python SDK**
- Task: SDK development
  - Subtask: SignForgeClient class (sync + async)
  - Subtask: translate(), recognize(), search_signs() methods
  - Subtask: Flask middleware for auto ISL headers
  - Subtask: Django middleware
- Task: SDK publishing
  - Subtask: PyPI publish workflow
  - Subtask: Documentation (Sphinx/mkdocs)

### Epic 6: Educational Platform

**Feature 6.1: Jataka Tales Library**
- Task: Story content pipeline
  - Subtask: JSON schema for tales (title, chapters, glosses, SiGML refs)
  - Subtask: Ingest 50 tales with chapter-level ISL annotations
  - Subtask: Thumbnail generation
- Task: Story browser UI
  - Subtask: Grid layout with filter sidebar (theme/difficulty/length)
  - Subtask: Search integration (Meilisearch)
  - Subtask: Story card component with thumbnail, title, metadata
- Task: Immersive story player
  - Subtask: Full-screen layout with avatar + synchronized text
  - Subtask: Chapter navigation sidebar
  - Subtask: Vocabulary spotlight (tap word -> sign + definition)
  - Subtask: Bookmark and note-taking
  - Subtask: Completion tracking + reading history

**Feature 6.2: Educator Portal**
- Task: Class management
  - Subtask: Create/edit/delete classes
  - Subtask: Student invitation (email or invite code)
  - Subtask: Class roster view
- Task: Assignment system
  - Subtask: Assignment builder (select content, set due date)
  - Subtask: Student assignment view
  - Subtask: Submission tracking
- Task: Progress dashboards
  - Subtask: Class-level progress overview
  - Subtask: Individual student drilldown
  - Subtask: Printable IEP progress report (PDF)
  - Subtask: Parent portal (simplified view)

**Feature 6.3: Quiz Engine**
- Task: Quiz generation
  - Subtask: Auto-generate from story content (3 question types)
  - Subtask: Sign-to-word: show avatar sign, pick correct word
  - Subtask: Sentence-to-sign: read sentence, identify correct sign sequence
  - Subtask: Sequence ordering: arrange story events in order
- Task: Quiz experience
  - Subtask: Quiz UI with timer
  - Subtask: Instant feedback with correct sign demonstration
  - Subtask: Adaptive difficulty (harder on consistent correct answers)
  - Subtask: Score calculation and storage
  - Subtask: Leaderboard (optional, teacher-configurable)

### Epic 7: Accessibility Auditor

**Feature 7.1: Repository Scanner**
- Task: GitHub/GitLab integration
  - Subtask: OAuth connection flow
  - Subtask: Repository listing and selection
  - Subtask: PR webhook registration
- Task: Code analysis engine
  - Subtask: AST parser for React/Vue/Angular/HTML
  - Subtask: Detect user-facing strings without ISL annotation
  - Subtask: ARIA label completeness checker
  - Subtask: Alt text presence checker
  - Subtask: Keyboard navigation analysis
  - Subtask: Visual contrast ratio checker
- Task: Scoring system
  - Subtask: Calculate 0-100 score with category breakdown
  - Subtask: Historical score tracking
  - Subtask: Severity classification (Critical/High/Medium/Low)

**Feature 7.2: Auto-Fix**
- Task: Fix generation
  - Subtask: ISLAvatar component insertion around flagged text
  - Subtask: ARIA label value suggestion (AI-generated)
  - Subtask: Alt text generation for images
- Task: PR creation
  - Subtask: Apply fixes to code
  - Subtask: Create branch and PR via GitHub API
  - Subtask: Confidence indicator per fix

### Epic 8: Collaboration & Communication

**Feature 8.1: Document Editor**
- Task: Real-time collaborative editor
  - Subtask: CRDT-based document model (Yjs)
  - Subtask: Rich text editing (Tiptap/ProseMirror)
  - Subtask: WebSocket sync for multi-user editing
  - Subtask: ISL "Read Aloud" button (avatar reads doc)
  - Subtask: Comment threads (text + ISL avatar)
  - Subtask: Version history

**Feature 8.2: ISL Meeting Overlay**
- Task: Browser extension (Chrome/Firefox)
  - Subtask: Content script for video call pages (Meet/Zoom/Teams)
  - Subtask: Audio capture -> Whisper ASR -> Translation -> Avatar overlay
  - Subtask: Deaf user webcam -> text caption overlay
  - Subtask: Meeting transcript export

**Feature 8.3: ISL Video Messaging**
- Task: Video message system
  - Subtask: Record ISL video via webcam
  - Subtask: Auto-generate text transcript
  - Subtask: Text reply auto-translated to ISL avatar
  - Subtask: Inbox/outbox UI
  - Subtask: Channels (Slack-like threading)

### Epic 9: Admin & Analytics

**Feature 9.1: Admin Dashboard**
- Task: System health monitoring
  - Subtask: API latency, error rate, uptime display
  - Subtask: Model inference metrics
  - Subtask: Queue depth monitoring
- Task: User management
  - Subtask: User list with search/filter
  - Subtask: Invite, suspend, reactivate users
  - Subtask: Role management
  - Subtask: Data export for DPDP compliance
- Task: Content management
  - Subtask: SiGML file upload/preview/tag/retire
  - Subtask: Content moderation queue (user-submitted corrections)

**Feature 9.2: Analytics**
- Task: Usage analytics
  - Subtask: DAU/MAU charts
  - Subtask: Session duration distribution
  - Subtask: Feature usage heatmap
  - Subtask: API partner analytics
- Task: ML model analytics
  - Subtask: BLEU score trend chart
  - Subtask: Error type distribution
  - Subtask: Model comparison (current vs. candidate)
- Task: Educational analytics
  - Subtask: Quiz completion rates
  - Subtask: Vocabulary retention metrics
  - Subtask: Institutional deployment stats

**Feature 9.3: ML Pipeline Admin**
- Task: Annotation management
  - Subtask: Annotation queue viewer
  - Subtask: Cohen's Kappa calculation per batch
  - Subtask: Approve/reject annotations
  - Subtask: Export corpus (JSON/ELAN format)
- Task: Model training
  - Subtask: Trigger retraining from UI
  - Subtask: MLflow experiment viewer
  - Subtask: A/B test management (traffic split)
  - Subtask: Model rollback capability

### Epic 10: Production Readiness

**Feature 10.1: Security Hardening**
- Task: Security audit preparation
  - Subtask: OWASP Top 10 self-audit
  - Subtask: Parameterized queries audit
  - Subtask: CSP headers configuration
  - Subtask: CSRF token implementation
  - Subtask: Input sanitization review
  - Subtask: Dependency vulnerability scan (Snyk/Dependabot)

**Feature 10.2: Monitoring & Observability**
- Task: Set up Prometheus + Grafana
  - Subtask: Application metrics endpoints
  - Subtask: Grafana dashboards (API, ML, infrastructure)
  - Subtask: AlertManager rules (latency, error rate, uptime)
- Task: Structured logging
  - Subtask: JSON structured logs across all services
  - Subtask: Request ID propagation
  - Subtask: Log aggregation (CloudWatch/ELK)

**Feature 10.3: Load Testing & Optimization**
- Task: Load testing
  - Subtask: k6 or Locust scripts for key endpoints
  - Subtask: 500 concurrent user simulation
  - Subtask: Identify and fix bottlenecks
- Task: Frontend optimization
  - Subtask: Bundle size analysis and code splitting
  - Subtask: Lazy loading for routes and heavy components
  - Subtask: Image/asset optimization
  - Subtask: Service worker for static asset caching

---

## 11. Repo Structure

```
signforge/
|
+-- .github/
|   +-- workflows/
|   |   +-- ci.yml                  # Lint + type-check + test
|   |   +-- build.yml               # Docker build + push
|   |   +-- deploy-staging.yml      # Deploy to staging K8s
|   |   +-- deploy-production.yml   # Deploy to production (manual trigger)
|   +-- PULL_REQUEST_TEMPLATE.md
|   +-- ISSUE_TEMPLATE/
|
+-- apps/
|   +-- web/                        # React.js Frontend (Vite + TypeScript)
|   |   +-- public/
|   |   +-- src/
|   |   |   +-- assets/             # Static images, fonts, icons
|   |   |   +-- components/         # Shared UI components
|   |   |   |   +-- avatar/         # ISL Avatar viewer + controls
|   |   |   |   +-- common/         # Button, Input, Card, Modal, etc.
|   |   |   |   +-- layout/         # Navbar, Sidebar, Footer, Shell
|   |   |   |   +-- webcam/         # MediaPipe webcam components
|   |   |   +-- features/           # Feature-specific modules
|   |   |   |   +-- auth/           # Login, Register, OAuth
|   |   |   |   +-- communication/  # Text-to-ISL, Webcam, Conversation
|   |   |   |   +-- dictionary/     # Sign browser, search, learning
|   |   |   |   +-- stories/        # Jataka Tales browser + player
|   |   |   |   +-- developer/      # API keys, playground, docs
|   |   |   |   +-- education/      # Classes, assignments, quizzes
|   |   |   |   +-- auditor/        # Accessibility audit UI
|   |   |   |   +-- collaboration/  # Document editor, messaging
|   |   |   |   +-- admin/          # Admin dashboard, user mgmt
|   |   |   |   +-- settings/       # Profile, preferences, billing
|   |   |   +-- hooks/              # Custom React hooks
|   |   |   +-- lib/                # Utility functions, API client
|   |   |   +-- stores/             # Zustand state management
|   |   |   +-- routes/             # React Router route definitions
|   |   |   +-- styles/             # Global CSS, Tailwind config
|   |   |   +-- types/              # TypeScript type definitions
|   |   |   +-- App.tsx
|   |   |   +-- main.tsx
|   |   +-- index.html
|   |   +-- vite.config.ts
|   |   +-- tailwind.config.ts
|   |   +-- tsconfig.json
|   |   +-- Dockerfile
|   |
|   +-- api/                        # Flask API Gateway
|   |   +-- app/
|   |   |   +-- __init__.py         # Flask app factory
|   |   |   +-- config.py           # Environment-based config
|   |   |   +-- extensions.py       # DB, Redis, mail init
|   |   |   +-- models/             # SQLAlchemy ORM models
|   |   |   |   +-- user.py
|   |   |   |   +-- sign.py
|   |   |   |   +-- story.py
|   |   |   |   +-- api_key.py
|   |   |   |   +-- audit.py
|   |   |   |   +-- annotation.py
|   |   |   |   +-- education.py
|   |   |   |   +-- collaboration.py
|   |   |   +-- routes/             # Blueprint route handlers
|   |   |   |   +-- auth.py
|   |   |   |   +-- translate.py
|   |   |   |   +-- signs.py
|   |   |   |   +-- stories.py
|   |   |   |   +-- education.py
|   |   |   |   +-- developer.py
|   |   |   |   +-- audit.py
|   |   |   |   +-- admin.py
|   |   |   |   +-- feedback.py
|   |   |   |   +-- webhooks.py
|   |   |   +-- middleware/         # Auth, rate limiting, CORS
|   |   |   +-- services/          # Business logic layer
|   |   |   +-- utils/             # Helpers, validators
|   |   |   +-- tasks/             # Celery task definitions
|   |   +-- migrations/            # Alembic migrations
|   |   +-- tests/
|   |   +-- wsgi.py
|   |   +-- Dockerfile
|   |   +-- requirements.txt
|
+-- services/
|   +-- translation/               # FastAPI ML Translation Service
|   |   +-- app/
|   |   |   +-- main.py            # FastAPI app
|   |   |   +-- models/            # PyTorch model definitions
|   |   |   |   +-- bilstm.py      # BiLSTM encoder-decoder
|   |   |   |   +-- attention.py   # Multi-head attention
|   |   |   +-- pipeline/          # Translation pipeline
|   |   |   |   +-- preprocessor.py  # NLP preprocessing
|   |   |   |   +-- translator.py    # Model inference
|   |   |   |   +-- mapper.py        # Gloss -> SiGML mapping
|   |   |   |   +-- fallback.py      # CoreNLP fallback
|   |   |   |   +-- fingerspell.py   # Fingerspelling generator
|   |   |   +-- config.py
|   |   +-- model_weights/         # .gitignore'd; downloaded at deploy
|   |   +-- tests/
|   |   +-- Dockerfile
|   |   +-- requirements.txt
|   |
|   +-- recognition/               # FastAPI Gesture Recognition Service
|   |   +-- app/
|   |   |   +-- main.py
|   |   |   +-- models/
|   |   |   |   +-- lstm_classifier.py
|   |   |   |   +-- language_model.py
|   |   |   +-- pipeline/
|   |   |   |   +-- landmark_processor.py
|   |   |   |   +-- recognizer.py
|   |   |   |   +-- beam_search.py
|   |   |   +-- websocket_handler.py
|   |   +-- tests/
|   |   +-- Dockerfile
|   |   +-- requirements.txt
|   |
|   +-- nlp/                       # NLP Service (spaCy + CoreNLP)
|   |   +-- app/
|   |   |   +-- main.py
|   |   |   +-- tokenizer.py
|   |   |   +-- lemmatizer.py
|   |   |   +-- lang_detect.py
|   |   |   +-- hindi_translator.py
|   |   +-- Dockerfile
|   |   +-- requirements.txt
|   |
|   +-- asr/                       # ASR Service (Whisper)
|   |   +-- app/
|   |   |   +-- main.py
|   |   |   +-- transcriber.py
|   |   +-- Dockerfile
|   |   +-- requirements.txt
|
+-- packages/
|   +-- sdk-js/                    # @signforge/sdk NPM package
|   |   +-- src/
|   |   |   +-- client.ts          # SignForge API client
|   |   |   +-- components/
|   |   |   |   +-- ISLAvatar.tsx
|   |   |   |   +-- ISLInput.tsx
|   |   |   +-- hooks/
|   |   |   |   +-- useISLTranslation.ts
|   |   |   +-- types.ts
|   |   |   +-- index.ts
|   |   +-- stories/               # Storybook stories
|   |   +-- package.json
|   |   +-- tsconfig.json
|   |   +-- tsup.config.ts
|   |
|   +-- sdk-python/                # signforge PyPI package
|   |   +-- signforge/
|   |   |   +-- __init__.py
|   |   |   +-- client.py
|   |   |   +-- async_client.py
|   |   |   +-- middleware/
|   |   |   |   +-- flask.py
|   |   |   |   +-- django.py
|   |   |   +-- types.py
|   |   +-- tests/
|   |   +-- setup.py
|   |   +-- pyproject.toml
|   |
|   +-- ui/                        # Shared React component library
|   |   +-- src/
|   |   |   +-- Button.tsx
|   |   |   +-- Input.tsx
|   |   |   +-- Card.tsx
|   |   |   +-- Modal.tsx
|   |   |   +-- Badge.tsx
|   |   |   +-- Toast.tsx
|   |   |   +-- Skeleton.tsx
|   |   |   +-- DataTable.tsx
|   |   |   +-- Chart.tsx
|   |   |   +-- index.ts
|   |   +-- package.json
|   |
|   +-- config/                    # Shared configurations
|       +-- eslint/
|       +-- typescript/
|       +-- tailwind/
|
+-- ml/                            # ML Training & Experiments
|   +-- training/
|   |   +-- train_translation.py   # BiLSTM training script
|   |   +-- train_recognition.py   # Gesture LSTM training
|   |   +-- evaluate.py            # BLEU, accuracy evaluation
|   |   +-- hyperparameter_search.py  # Optuna tuning
|   +-- data/
|   |   +-- preprocessing/         # Data cleaning scripts
|   |   +-- augmentation/          # Data augmentation
|   |   +-- splits/                # Train/val/test split configs
|   +-- notebooks/                 # Jupyter notebooks for exploration
|   +-- configs/                   # Training configuration YAML files
|   +-- requirements.txt
|
+-- infra/                         # Infrastructure as Code
|   +-- terraform/                 # or pulumi/
|   |   +-- modules/
|   |   |   +-- eks/
|   |   |   +-- rds/
|   |   |   +-- s3/
|   |   |   +-- redis/
|   |   |   +-- cdn/
|   |   +-- environments/
|   |       +-- staging/
|   |       +-- production/
|   +-- k8s/                       # Kubernetes manifests
|   |   +-- base/
|   |   |   +-- namespace.yml
|   |   |   +-- deployments/
|   |   |   +-- services/
|   |   |   +-- ingress.yml
|   |   |   +-- hpa.yml
|   |   +-- overlays/
|   |       +-- staging/
|   |       +-- production/
|   +-- docker/
|       +-- nginx.conf
|       +-- docker-compose.yml     # Local development
|       +-- docker-compose.prod.yml
|
+-- data/                          # Data assets (gitignored, stored in S3)
|   +-- sigml/                     # 848+ SiGML files
|   +-- stories/                   # Jataka Tales JSON files
|   +-- corpus/                    # English-ISL parallel pairs
|   +-- seeds/                     # Database seed data
|
+-- docs/                          # Documentation
|   +-- api/                       # API documentation
|   +-- architecture/              # Architecture decision records
|   +-- deployment/                # Deployment runbooks
|   +-- onboarding/                # Developer onboarding guide
|
+-- extensions/                    # Browser Extensions
|   +-- meeting-overlay/           # ISL Meeting Overlay (Chrome/Firefox)
|       +-- manifest.json
|       +-- content.js
|       +-- popup/
|       +-- background.js
|
+-- .env.example
+-- .gitignore
+-- docker-compose.yml             # Symlink to infra/docker/docker-compose.yml
+-- package.json                   # Root workspace config
+-- pnpm-workspace.yaml
+-- turbo.json                     # Turborepo pipeline config
+-- README.md
+-- CLAUDE.md                      # Project conventions for AI assistants
```

---

## 12. Implementation Strategy

### Development Order & Dependencies

```
Phase 1 (Foundation) — all parallel-ready
  |
  +-- [PARALLEL] Infra setup + DB migrations + Auth system + Frontend shell
  |
  v
Phase 2 (Core) — dependencies shown
  |
  +-- Translation Pipeline (depends on: DB, Auth, NLP service)
  |     |
  |     v
  +-- Avatar Renderer (depends on: Translation Pipeline for SiGML data)
  |     |
  |     v
  +-- Webcam Recognition (depends on: Frontend shell, can parallel with Avatar)
  |
  +-- [PARALLEL with above] Dictionary + Story Browser (depends on: DB, Search)
  |
  +-- Developer Dashboard (depends on: Auth, Translation API)
  |
  v
Phase 3 (Advanced) — all depend on Phase 2
  |
  +-- [PARALLEL] Conversation Mode | SDK packages | Educator Portal | Auditor | Learning
  |
  v
Phase 4 (Optimization)
  |
  +-- [PARALLEL] Performance tuning | Model enhancement | Collaboration
  |
  v
Phase 5 (Production)
  |
  +-- [SEQUENTIAL] Security audit -> Monitoring -> Load testing -> Launch prep
```

### Critical Path

```
Infra Setup -> Auth -> Translation Service -> Avatar Renderer -> Communication Hub MVP
                                            -> Developer Dashboard -> SDK -> Launch
```

### Key Dependencies

| Dependency | Impact | Mitigation |
|-----------|--------|------------|
| BiLSTM model training data (10K+ pairs) | Model quality directly depends on corpus size | Start with INCLUDE dataset + rule-based fallback; expand corpus over time |
| SiGML files (848 in v1) | Avatar can only sign mapped vocabulary | Fingerspelling fallback for unmapped words; prioritize most common words |
| CWASA WebGL engine | Avatar rendering is core UX | Prototype early; have 2D fallback plan if WebGL issues arise |
| ISLRTC partnership | Expert annotators for quality | Begin with freelance ISL experts; ISLRTC enhances but isn't hard dependency |
| GPU infrastructure | ML inference and ASR | Start with Kaggle/Colab for training; defer production GPU to Phase 4 |

### Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| BiLSTM BLEU < 0.75 target | Medium | High | Stanford CoreNLP fallback; expand training data; Optuna hyperparameter search; consider fine-tuning mBERT |
| CWASA/WebGL performance on low-end devices | Medium | Medium | 2D SVG fallback avatar; pre-rendered MP4 option; progressive enhancement |
| SiGML coverage gap | High | Medium | Automatic fingerspelling; priority-based expansion of SiGML library; community contribution portal |
| Slow developer adoption | Medium | High | Generous free tier (1,000 calls/month); interactive playground; "Hello ISL in 10 min" tutorial; open-source core |
| Privacy concerns (webcam) | Low | High | Client-side MediaPipe processing; no video to server; explicit opt-in; privacy audit; clear in-app messaging |
| GPU cost overruns | Medium | Medium | Redis caching for repeated translations; GPU auto-scaling to zero; batch inference; model quantization |
| Scaling bottleneck at translation service | Medium | High | Horizontal pod autoscaling; translation cache (80%+ hit rate target); async video generation via queue |

### Scaling Considerations

1. **Translation Caching**: Redis cache with 24h TTL; identical translations served from cache (~80% hit rate expected). Reduces GPU inference calls significantly.
2. **Horizontal Scaling**: K8s HPA scales translation pods 2-20 based on queue depth. GPU nodes scale to zero when idle.
3. **CDN for SiGML**: All 848+ SiGML files served via CloudFront. Avatar renderer fetches from CDN, not origin.
4. **Database Read Replicas**: Read-heavy workloads (dictionary, stories, analytics) routed to replicas.
5. **Async Processing**: Video generation, model retraining, and audit jobs run on Celery workers, never blocking API threads.
6. **Connection Pooling**: PgBouncer for PostgreSQL connection pooling at high concurrency.

### Security Practices

1. **Authentication**: OAuth 2.0 + PKCE; JWT with 15-min expiry; refresh tokens in httpOnly cookies; bcrypt for passwords and API keys
2. **Authorization**: RBAC with permission decorators; row-level security for multi-tenant data
3. **Data Protection**: TLS 1.3 in transit; AES-256 at rest; client-side webcam processing (no video to server)
4. **Input Validation**: Pydantic models for all API inputs; parameterized SQL queries; HTML sanitization
5. **Headers**: CSP, X-Content-Type-Options, X-Frame-Options, HSTS, CSRF tokens
6. **Dependencies**: Dependabot for vulnerability scanning; pin all versions; automated security updates
7. **Secrets**: AWS Secrets Manager; never in code or environment files; rotated quarterly
8. **Auditing**: All admin actions logged; API key usage logged; data access audit trail for DPDP compliance
9. **Rate Limiting**: Per IP + per API key; sliding window algorithm; DDoS protection via CloudFront WAF

---

## 13. Production Plan

### Testing Strategy

#### Test Pyramid

```
         /  E2E Tests  \        (10%) Playwright
        / Integration    \      (30%) API tests, DB tests
       /  Unit Tests      \     (60%) Functions, components, models
      /_____________________\
```

#### Unit Tests
- **Frontend**: Vitest + React Testing Library
  - Component rendering and interaction tests
  - Custom hook tests
  - Utility function tests
  - State management tests
- **Backend**: pytest
  - Route handler tests (Flask)
  - Service layer tests
  - Model inference tests (with mocked weights)
  - Utility and validator tests
- **ML**: pytest
  - Data preprocessing pipeline tests
  - Model forward pass shape validation
  - BLEU score calculation tests
  - ISL mapper lookup tests

#### Integration Tests
- **API Integration**: pytest + httpx
  - Full request-response cycle for all endpoints
  - Auth flow (register -> login -> token refresh -> access protected route)
  - Translation pipeline (text -> NLP -> model -> mapper -> response)
  - Rate limiting behavior
  - Webhook delivery
- **Database Integration**: pytest + testcontainers
  - Migration up/down validation
  - Complex query correctness
  - Cascade delete behavior

#### End-to-End Tests
- **Playwright** for critical user flows:
  - Sign up -> first translation in < 60 seconds
  - Developer: generate API key -> make API call -> see response
  - Student: browse stories -> play story -> take quiz
  - Educator: create class -> add student -> assign content -> view progress
  - Accessibility auditor: connect repo -> scan -> view results

#### ML-Specific Testing
- BLEU score regression tests (new model must meet minimum threshold)
- Inference latency benchmarks (< 500ms p95)
- Model artifact integrity checks
- A/B test statistical significance validation

### CI/CD Pipeline

```
[Push to feature branch]
  |-> GitHub Actions: ci.yml
  |   +-- Lint (ESLint + Ruff)
  |   +-- Type Check (TypeScript + mypy)
  |   +-- Unit Tests (Vitest + pytest)
  |   +-- Security Scan (Snyk/Dependabot)
  |
[Pull Request to main]
  |-> All above + Integration Tests
  |-> Docker build (validate all Dockerfiles)
  |-> Preview deployment (Vercel preview for frontend)
  |
[Merge to main]
  |-> GitHub Actions: deploy-staging.yml
  |   +-- Docker build + push to ECR
  |   +-- Run database migrations on staging
  |   +-- Kubectl apply to staging K8s cluster
  |   +-- Smoke tests against staging
  |   +-- Slack notification
  |
[Manual approval for production]
  |-> GitHub Actions: deploy-production.yml
  |   +-- Rolling deployment to production K8s
  |   +-- Health check validation
  |   +-- Canary: 10% traffic for 15 minutes
  |   +-- Full rollout if no errors
  |   +-- Rollback trigger on error rate > 1%
  |   +-- Slack notification
```

### Monitoring & Alerting

#### Metrics (Prometheus)
- **API Metrics**: Request rate, latency (p50/p95/p99), error rate, status code distribution
- **ML Metrics**: Inference latency, model confidence distribution, fallback usage rate
- **Infrastructure**: CPU/memory/disk usage per pod, GPU utilization, Redis hit ratio, DB connections
- **Business Metrics**: DAU/MAU, translations per hour, API calls per developer, story completions

#### Dashboards (Grafana)
1. **API Overview**: Request volume, latency, error rate, top endpoints
2. **ML Performance**: Inference latency, BLEU score trend, fallback rate, cache hit ratio
3. **Infrastructure**: K8s pod health, node resource usage, Redis stats, DB performance
4. **Business**: User activity, feature adoption, API partner usage

#### Alerting (AlertManager -> Slack/Email)

| Alert | Condition | Severity |
|-------|-----------|----------|
| API Error Rate High | > 5% 5xx for 5 minutes | Critical |
| Translation Latency | p95 > 1000ms for 10 minutes | Warning |
| Translation Latency | p95 > 2000ms for 5 minutes | Critical |
| GPU Utilization | > 90% for 15 minutes | Warning |
| Database Connection Pool | > 80% utilized | Warning |
| Redis Memory | > 80% of max | Warning |
| Disk Usage | > 85% on any node | Warning |
| Pod Restart Loop | > 3 restarts in 10 minutes | Critical |
| SSL Certificate Expiry | < 14 days remaining | Warning |
| Model BLEU Degradation | Drop > 0.05 from baseline | Critical |
| API Uptime | < 99.9% in rolling 24h | Critical |

### Logging

- **Format**: JSON structured logs with consistent fields
  ```json
  {
    "timestamp": "ISO-8601",
    "level": "info|warn|error",
    "service": "api|translation|recognition|nlp|asr",
    "request_id": "uuid",
    "user_id": "uuid",
    "message": "...",
    "metadata": {}
  }
  ```
- **Aggregation**: CloudWatch Logs (AWS) or ELK Stack
- **Retention**: 30 days hot, 90 days warm, 1 year cold (S3)
- **Sensitive Data**: Never log passwords, API keys, tokens, or PII. Log API key prefix only.

### Error Handling Strategy

#### Frontend
- Global error boundary (React ErrorBoundary) catches render errors -> friendly ISL avatar error page
- API errors handled by centralized error interceptor in Axios/fetch wrapper
- Network offline detection -> offline banner with retry
- All errors display in plain language + ISL avatar explanation (per PRD)

#### Backend
- Centralized exception handler in Flask/FastAPI
- Structured error responses with error codes, messages, and request IDs
- Unhandled exceptions -> 500 response + Sentry alert
- Graceful degradation: if ML service is down, queue request and return 202

#### ML Services
- Model loading failure -> health check fails -> K8s restarts pod -> alert
- Inference timeout (> 5s) -> return fallback translation (CoreNLP) with warning
- GPU OOM -> reduce batch size dynamically; alert for capacity planning

### Performance Optimization

#### Frontend
- **Code Splitting**: Route-based lazy loading (React.lazy + Suspense)
- **Bundle Size**: Tree shaking + Tailwind purging; target < 200KB initial JS
- **Assets**: WebP images, WOFF2 fonts, SVG icons; preload critical resources
- **Caching**: Service worker for static assets; stale-while-revalidate for API data
- **Avatar**: SiGML files prefetched for current translation; progressive loading
- **Rendering**: Virtual scrolling for long lists (dictionary, conversation history)

#### Backend
- **Caching**: Redis cache for translations (24h TTL), dictionary lookups (1h), story metadata (1h)
- **Database**: Connection pooling (PgBouncer); optimized indexes; read replicas for reads
- **Async**: Celery for video generation, audits, model training; never block API threads
- **Compression**: gzip/brotli for API responses; CDN compression for static assets

#### ML
- **Model Quantization**: INT8 quantization for inference (TensorRT) -> 2-3x speedup
- **Batch Inference**: Batch multiple translation requests when possible
- **Model Warm-up**: Pre-load model weights on pod start; health check validates readiness
- **Cache**: Translation cache reduces repeat inference by ~80%

---

## Appendix: Quick Reference

### Key URLs (Production)
- **Web App**: https://signforge.in
- **API**: https://api.signforge.in/v1
- **WebSocket**: wss://api.signforge.in/v1/recognize
- **CDN**: https://cdn.signforge.in (SiGML files, media)
- **Docs**: https://docs.signforge.in
- **Status**: https://status.signforge.in

### Key Commands (Development)
```bash
# Start all services locally
docker compose up -d

# Run frontend dev server
cd apps/web && pnpm dev

# Run API server
cd apps/api && flask run --debug

# Run translation service
cd services/translation && uvicorn app.main:app --reload

# Run tests
pnpm test                    # Frontend tests
cd apps/api && pytest        # Backend tests

# Database migrations
cd apps/api && flask db upgrade
cd apps/api && flask db migrate -m "description"

# Train translation model
cd ml && python training/train_translation.py --config configs/bilstm_v1.yml

# Build Docker images
docker compose build
```

### Team Size Recommendation
- **2 Frontend Engineers** (React, Three.js/WebGL, MediaPipe)
- **2 Backend Engineers** (Flask, FastAPI, PostgreSQL, Redis)
- **1 ML Engineer** (PyTorch, model training, inference optimization)
- **1 DevOps/SRE** (K8s, AWS, CI/CD, monitoring)
- **1 UI/UX Designer** (Figma, accessibility specialist)
- **1 Product Manager** (prioritization, stakeholder management)
- **ISL Expert Consultants** (annotation, quality review) — part-time/contract

**Total**: 8 full-time + ISL expert consultants

---

*End of SignForge Implementation Plan*
