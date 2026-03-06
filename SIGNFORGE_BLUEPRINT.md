# SignForge — Production-Ready Software Blueprint

> Derived from SignForge PRD v1.0 | March 2026 | 14 Phases

---

## Phase 1 — Product Overview

### Vision
A world where Indian Sign Language is a first-class digital citizen — every app speaks ISL, every story is signed, every deaf person has equal access to knowledge, culture, and opportunity.

### Core Problem
India's 63M deaf/HoH individuals face systemic digital exclusion:

| Failure | Reality | Impact |
|---------|---------|--------|
| Interpreter Shortage | 1 per 10,000 deaf persons | No classroom participation |
| Digital Tools Gap | Zero AI-powered ISL translation for Indian content | Ancient knowledge inaccessible |
| Developer Ecosystem | No SDK/API for ISL | Accessibility impossible to add |
| Technology Mismatch | Tools target ASL/BSL, not ISL (SOV grammar, 5,000+ signs) | Foreign tools fail Indian users |
| Hardware Barrier | Existing systems need special hardware | Cannot scale |

### Target Users & Personas

**Primary:**

| Persona | Age | Role | Pain Point | SignForge Use |
|---------|-----|------|-----------|---------------|
| Aarav | 14 | Deaf Student | Can't access Hindi/English content | Story library, classroom translation, vocab builder |
| Priya | 27 | Full-Stack Dev | No ISL API exists; 6+ months to build | Developer dashboard, REST API, NPM SDK, auditor |
| Dr. Meera | 45 | Special Ed Teacher | No digital ISL curriculum | Educator portal, Jataka library, progress dashboard |
| Rohit | 32 | Hearing Colleague | Language barrier at work | ISL learning, webcam-to-text, meeting overlay |

**Secondary:** ISL researchers, government/NGOs, healthcare providers, enterprise HR

### Key Value Propositions
- First platform combining ISL translation + developer tooling + cultural preservation
- Built on published academic research (NSUT IKS 2026) with proven BiLSTM architecture
- Addresses NEP 2020 mandate and Rights of Persons with Disabilities Act 2016
- Webcam-only (zero hardware requirement)
- 63M+ addressable users in India; expandable globally

### User Roles & Permissions

| Role | Permissions |
|------|------------|
| Super Admin | Full platform control, model management, user management, analytics, SiGML management |
| Institution Admin | Manage institution users, classes, content, reports |
| Educator | Create classes, assign content, track students, create lesson plans |
| Student | Access stories, quizzes, practice studio, vocabulary |
| Developer | API keys, SDK access, audit tools, usage dashboard, webhook management |
| API User | Programmatic access via REST/WebSocket only |
| General User | Communication hub, dictionary, learning, conversation mode |

### Business Logic Rules

1. **Translation Pipeline**: Text -> Language Detect -> [Hindi->English if needed] -> NLP Preprocessing -> BiLSTM+Attention -> ISL Glosses -> SiGML Lookup -> [Fingerspelling fallback if unmapped] -> Avatar Animation
2. **Recognition Pipeline**: Webcam -> MediaPipe (client-side, 75 keypoints @ 30fps) -> 30-frame sliding window -> BiLSTM Classifier -> Beam Search (width 5) -> 3-gram LM Rescoring -> Gloss Sequence -> NLP Post-processing -> English Text
3. **Confidence Routing**: Model confidence >= threshold -> serve result; below threshold -> Stanford CoreNLP rule-based fallback + warning badge
4. **API Rate Limiting**: Sliding window per API key; Free (1 req/sec, 1K/month), Starter (10/sec, 50K/month), Growth (50/sec, 500K/month), Enterprise (unlimited)
5. **Spaced Repetition**: SM-2 algorithm for vocabulary learning (ease factor, interval, repetitions)
6. **Adaptive Quizzes**: Difficulty increases on 3+ consecutive correct answers; decreases on 2+ consecutive wrong
7. **Model Retraining**: Auto-triggered when annotation batch exceeds 500 pairs; A/B test at 10% traffic; promote if BLEU improves >0.02
8. **Data Privacy**: Webcam processed client-side only; landmarks (not video) sent for recognition; feedback anonymized before training pipeline

### Functional Requirements (Top-Level)

- FR-01: Bidirectional ISL<->Text/Speech translation in real-time
- FR-02: 3D avatar rendering of ISL signs via CWASA/WebGL
- FR-03: Webcam gesture recognition via MediaPipe (client-side)
- FR-04: REST API + WebSocket API for developers
- FR-05: NPM and Python SDK packages
- FR-06: Jataka Tales library with ISL avatar storytelling
- FR-07: Educator portal with class/assignment/quiz management
- FR-08: ISL dictionary with 5,000+ signs and search
- FR-09: Accessibility auditor with GitHub integration and auto-fix
- FR-10: Admin dashboard with RBAC, analytics, model management
- FR-11: Split-screen deaf<->hearing conversation mode
- FR-12: Collaborative document editor with ISL narration
- FR-13: Spaced repetition vocabulary learning system
- FR-14: Compliance report generation (WCAG 2.2, RPwD Act, NEP 2020)

### Non-Functional Requirements

| Category | Requirement | Target |
|----------|------------|--------|
| Performance | Translation latency (p95) | < 500ms |
| Performance | Dictionary lookup (p95) | < 200ms |
| Performance | Avatar first load | < 2 seconds |
| Scalability | Concurrent users (v1) | 500 |
| Scalability | Concurrent users (v2) | 5,000 |
| Availability | Uptime SLA | 99.9% |
| Security | Encryption in transit | TLS 1.3 |
| Security | Encryption at rest | AES-256 |
| Security | Auth token expiry | 15 minutes (JWT) |
| Privacy | Webcam data | Client-side only |
| Compliance | Data protection | DPDP Act 2023 |
| Compliance | Accessibility | WCAG 2.2 Level AA |
| Responsiveness | Minimum viewport | 375px (iPhone SE) |
| i18n | Languages | English + Hindi UI |

---

## Phase 2 — User Journeys

### Journey 1: Deaf Student (Aarav) — Learning via Jataka Tales

```
ENTRY: Opens signforge.in on school tablet
  |
  [First Visit]
  |-> Sign Up (email or Google OAuth)
  |-> Onboarding wizard: "I am a student" -> select school -> enter class code
  |-> Dashboard shows: Assigned tales, vocabulary streak, quiz scores
  |
  [Daily Use]
  |-> Sees assigned Jataka Tale from Dr. Meera
  |-> Opens Story Player
  |     |-> Avatar signs story in full-screen
  |     |-> Hindi/English text highlights word-by-word in sync
  |     |-> Taps unknown word "courage" -> Vocabulary Spotlight
  |     |     |-> Avatar demonstrates sign for COURAGE
  |     |     |-> Shows gloss, HamNoSys, usage examples
  |     |     |-> "Add to my vocabulary list" button
  |     |-> Completes chapter -> progress bar updates
  |     |-> Bookmarks favorite moment -> shareable deep link
  |
  |-> Takes auto-generated quiz
  |     |-> Q1: Watch avatar sign -> pick correct English word (4 options)
  |     |-> Q2: Read sentence -> select correct ISL sign sequence
  |     |-> Q3: Order story events chronologically
  |     |-> Instant feedback: wrong answer shows correct sign demo
  |     |-> Score: 4/5 -> saved to progress
  |
  |-> Opens Practice Studio
  |     |-> Selects "COURAGE" from vocabulary list
  |     |-> Watches reference avatar demo
  |     |-> Records self signing via webcam
  |     |-> AI compares pose: "Handshape: 92%, Movement: 78%, Expression: 65%"
  |     |-> Specific feedback: "Try raising eyebrows more for emphasis"
  |     |-> Practice history shows improvement trend graph
  |
  [Edge Cases]
  - Camera permission denied -> step-by-step enable instructions + text-only fallback
  - Quiz answer disputed -> "Flag for teacher" button -> Dr. Meera notified
  - Story not fully loaded (slow network) -> skeleton screen + progressive chapter loading
  - Assigned tale due date passed -> "Late" badge, still submittable
  - Student in multiple classes -> class switcher in dashboard header

  [Failure States]
  - Translation service down -> cached version of story if previously viewed
  - WebGL not supported (old device) -> 2D fallback avatar + pre-rendered MP4
  - Session expired during quiz -> answers auto-saved, resume from last question
```

### Journey 2: Developer (Priya) — Integrating ISL into EdTech App

```
ENTRY: Finds SignForge via search / Product Hunt / developer conference
  |
  [Onboarding]
  |-> Clicks "Get Started" -> OAuth sign-up with GitHub
  |-> Role auto-detected as "Developer" (GitHub OAuth)
  |-> Interactive "Hello ISL" tutorial begins:
  |     |-> Step 1: See translation in playground (type text, watch avatar)
  |     |-> Step 2: Copy API key
  |     |-> Step 3: Run curl command in terminal
  |     |-> Step 4: Install SDK: npm install @signforge/sdk
  |     |-> Step 5: Paste <ISLAvatar text="Welcome" /> into React app
  |     |-> "Done in under 10 minutes!" celebration screen
  |
  [Daily Use]
  |-> Dashboard shows: API calls today, latency p95, error rate, quota usage
  |
  |-> API Key Management
  |     |-> Creates "Production" key with scopes: [translate, dictionary]
  |     |-> Creates "Staging" key with all scopes
  |     |-> Rotates compromised key -> old key revoked, new key issued
  |
  |-> API Playground
  |     |-> Selects POST /v1/translate
  |     |-> Types: "The doctor will see you now"
  |     |-> Sees response: glosses, sigml_urls, confidence: 0.89
  |     |-> Copies code snippet (JavaScript) -> pastes into app
  |
  |-> UI String Extractor
  |     |-> Pastes React component code
  |     |-> AI identifies 12 user-facing strings
  |     |-> One-click: translate all to ISL
  |     |-> Previews each as avatar animation
  |     |-> Exports as React ISL component bundle
  |
  |-> Accessibility Auditor
  |     |-> Connects GitHub repo via OAuth
  |     |-> Triggers scan on latest PR
  |     |-> Results: Score 62/100
  |     |-> 8 High issues: missing ISL for form labels
  |     |-> 4 Medium: missing ARIA roles
  |     |-> Clicks "Auto-Fix All (High confidence)"
  |     |-> PR #42 created with ISLAvatar wrappers inserted
  |     |-> Score improves to 81 -> compliance certificate downloadable
  |
  |-> Webhook setup
  |     |-> Registers https://api.priya.app/signforge-webhook
  |     |-> Events: translation.complete, model.updated
  |     |-> Tests delivery -> 200 OK confirmed
  |
  [Edge Cases]
  - API key exposed in GitHub commit -> email alert + auto-revoke suggestion
  - Rate limit hit during demo -> 429 with clear "Upgrade to Starter" CTA
  - SDK version mismatch -> deprecation warning in console + migration guide link
  - Webhook delivery fails -> 3 retries with exponential backoff, then dead-letter queue

  [Failure States]
  - Translation service timeout -> SDK returns cached result or error with retry guidance
  - GitHub OAuth token expired -> re-auth prompt in dashboard
  - Audit job stuck -> timeout after 5 min, email notification with retry button
```

### Journey 3: Educator (Dr. Meera) — Managing Deaf Classroom

```
ENTRY: Invited by institution admin via email link
  |
  [Setup]
  |-> Clicks invite link -> Sign Up -> Role: Educator
  |-> Creates Class: "Grade 6 ISL Studies"
  |-> Shares invite code "MEERA-6A" with 40 students
  |-> Students join using code during class
  |
  [Weekly Workflow]
  |-> Opens Educator Dashboard
  |     |-> Class overview: 38/40 students active this week
  |     |-> Assignment completion heat map
  |     |-> Flagged quiz answers requiring review
  |
  |-> Creates Assignment
  |     |-> Selects: "The Monkey King" (Jataka Tale #22)
  |     |-> Adds vocabulary set: 15 words from the tale
  |     |-> Attaches auto-generated quiz (adaptive difficulty ON)
  |     |-> Due date: Friday 5 PM
  |     |-> Publishes -> all 40 students see it on their dashboard
  |
  |-> Monitors Progress (mid-week)
  |     |-> 28 students completed story, 22 completed quiz
  |     |-> Avg quiz score: 76%
  |     |-> Drills into struggling student Aarav:
  |     |     |-> Story: 80% complete (stuck on chapter 3)
  |     |     |-> Quiz: not attempted
  |     |     |-> Vocabulary: 8/15 words practiced
  |     |     |-> Sends in-app nudge: "Aarav, try finishing chapter 3!"
  |
  |-> End of week: generates IEP progress report
  |     |-> PDF with: completion rates, quiz scores, vocabulary retention
  |     |-> Prints for parent-teacher meeting
  |
  |-> Creates Lesson Plan
  |     |-> Combines 3 tales + vocabulary + quizzes into structured plan
  |     |-> Aligns with CBSE special education syllabus template
  |     |-> Shares with educator community
  |     |-> Exports as SCORM package for school LMS
  |
  [Edge Cases]
  - Student joins after assignment due date -> auto-marked "late", still submittable
  - Class size exceeds 50 -> warning about quiz load times, suggest splitting
  - Parent requests access -> educator generates parent portal invite link
  - Two educators co-teaching -> both can be class admins

  [Failure States]
  - Report generation fails -> queued, notification when ready
  - Student data export timeout -> background job with email delivery
```

### Journey 4: Hearing Colleague (Rohit) — Workplace Communication

```
ENTRY: Downloads from app store link shared by deaf colleague
  |
  [First Use]
  |-> Sign Up -> "I am a hearing person learning ISL"
  |-> Onboarding: quick demo of conversation mode
  |
  [Meeting Scenario]
  |-> Opens Conversation Mode (split-screen)
  |-> LEFT PANEL (Rohit): types "Let's review the sprint backlog"
  |     |-> Translation pipeline processes
  |     |-> Avatar signs for deaf colleague on RIGHT PANEL
  |-> RIGHT PANEL (colleague): signs response via webcam
  |     |-> MediaPipe captures landmarks (client-side)
  |     |-> Recognition: "AGREE START NOW"
  |     |-> Post-processed: "I agree, let's start now"
  |     |-> Text + optional TTS for Rohit
  |-> Conversation log builds with timestamps
  |-> After meeting: exports as PDF transcript
  |
  [Learning ISL]
  |-> Browses ISL Dictionary
  |     |-> Searches "meeting" -> sees avatar demo + gloss + examples
  |     |-> Adds to vocabulary list "Work Terms"
  |-> Opens Flashcard Mode
  |     |-> Card shows: "meeting" -> attempts sign -> compares with avatar
  |     |-> SM-2 schedules next review in 3 days
  |-> Word of the Day notification: "DEADLINE"
  |
  [Edge Cases]
  - Low webcam quality -> "Low confidence" badge on recognized text
  - Background noise in TTS -> volume control + text-only mode
  - Colleague signs regional ISL variant -> lower confidence, suggest standard sign

  [Failure States]
  - Recognition model returns gibberish -> "Could not recognize. Please sign again slowly."
  - Session link shared externally -> requires auth to join
```

### Journey 5: Admin — Platform Management

```
ENTRY: Super Admin created during initial deployment
  |
  [Daily Operations]
  |-> Admin Dashboard
  |     |-> System health: all services green, API latency p95 = 340ms
  |     |-> DAU: 2,400 | MAU: 18,500
  |     |-> Translation queue depth: 12 (healthy)
  |     |-> GPU utilization: 45% (2/4 pods active)
  |
  |-> User Management
  |     |-> Searches user by email -> views profile, role, usage
  |     |-> Suspends abusive API user -> key revoked, email sent
  |     |-> Exports user data (DPDP compliance request)
  |
  |-> Content Moderation
  |     |-> Reviews queue: 8 user-submitted sign corrections
  |     |-> Approves 5 (ISL expert verified)
  |     |-> Rejects 2 (incorrect gloss) with feedback
  |     |-> Escalates 1 (ambiguous) to ISL expert team
  |
  |-> SiGML Management
  |     |-> Uploads 50 new SiGML files (batch upload)
  |     |-> Tags each with gloss, category, quality score
  |     |-> Retires 3 outdated files (replaced by better versions)
  |
  |-> ML Pipeline
  |     |-> Annotation batch #47: 520 pairs, Cohen's Kappa: 0.83
  |     |-> Triggers model retraining
  |     |-> New model BLEU: 0.77 (current: 0.75)
  |     |-> Deploys to 10% traffic for A/B test
  |     |-> After 24h: promotes to 100% (BLEU maintained)
  |
  [Failure States]
  - Model retraining fails -> auto-rollback to previous version, alert to admin
  - Storage approaching limit -> warning at 80%, auto-archive old model artifacts
  - Database connection pool exhausted -> HPA scales API pods, alert fired
```
## Phase 3 — Feature Decomposition

### Epic 1: ISL Communication Hub

| Feature | Sub-Features | Priority | Complexity | Dependencies |
|---------|-------------|----------|-----------|-------------|
| **F1.1 Text Input Panel** | Rich text editor, language auto-detect, Whisper voice dictation, file upload (.txt/.docx), char/word count, signing duration estimate | P0 | Medium | Auth |
| **F1.2 Translation Pipeline** | Hindi->English bridge (mBERT), NLP preprocessing (spaCy), BiLSTM+Attention inference, ISL Mapper (gloss->SiGML), fingerspelling fallback, confidence scoring | P0 | High | NLP Service, ML Model, SiGML Library |
| **F1.3 3D Avatar Renderer** | CWASA WebGL avatar, gender selection (M/F/neutral), speed (0.5x-2.0x), loop/pause/rewind/step, synchronized text highlighting, fullscreen, PiP, dark mode | P0 | High | SiGML files, Three.js |
| **F1.4 Webcam Gesture Capture** | One-click webcam, MediaPipe Holistic (75 landmarks @ 30fps), skeleton overlay, confidence threshold, client-side processing | P0 | High | MediaPipe |
| **F1.5 Sign Recognition Output** | Gloss->NLP->English, TTS (Web Speech API), Hindi translation, conversation history, export PDF/share link | P0 | Medium | Recognition Model |
| **F1.6 Split-Screen Dialogue** | Hearing types->avatar (left), deaf signs->text (right), <500ms latency, timestamped transcript, shareable link, mobile responsive | P1 | Medium | F1.2, F1.4 |
| **F1.7 ISL Dictionary** | 5,000+ signs, search by English/Hindi/handshape, sign detail (video+gloss+HamNoSys+examples), Word of the Day, bookmarks, custom lists | P1 | Medium | Meilisearch, Signs DB |
| **F1.8 Vocabulary Learning** | Flashcards, SM-2 spaced repetition, progress tracking (words learned, accuracy, streak), category packs (greetings, numbers, emotions, etc.) | P2 | Medium | F1.7, Auth |

### Epic 2: Developer Dashboard & SDK

| Feature | Sub-Features | Priority | Complexity | Dependencies |
|---------|-------------|----------|-----------|-------------|
| **F2.1 Developer Onboarding** | OAuth 2.0 (Google/GitHub), API key CRUD (rotate/revoke/scope), sandbox (1K free calls/month), "Hello ISL" interactive tutorial (<10 min) | P0 | Medium | Auth |
| **F2.2 Translation REST API** | POST /v1/translate (text, source_lang, output_format, avatar_style, speed, webhook_url), batch endpoint (100 texts), rate limiting | P0 | Medium | F1.2 |
| **F2.3 Gesture WebSocket API** | ws:// landmark stream in -> gloss+confidence out every 100ms, batch video upload mode | P1 | High | F1.4, Recognition Model |
| **F2.4 NPM SDK** | @signforge/sdk: ISLAvatar component, useISLTranslation hook, ISLInput component, Storybook docs, TypeScript types | P0 | Medium | F2.2 |
| **F2.5 Python SDK** | pip install signforge: sync/async client, Flask/Django middleware, LangChain integration | P1 | Medium | F2.2 |
| **F2.6 UI String Extractor** | Paste React/Vue/Angular/HTML, AI extracts user-facing strings+ARIA, one-click ISL translate, avatar preview, export (SiGML/JSON/React bundle) | P1 | High | F2.2, LLM |
| **F2.7 Prompt-to-Prototype** | NL spec -> LLM generates React component with ISL, WCAG 2.2, one-click deploy | P2 | High | LLM, F2.4 |
| **F2.8 Performance Dashboard** | API latency (p50/p95/p99), BLEU trend, usage analytics, model comparison, webhook status | P1 | Medium | Analytics DB |

### Epic 3: Educational Platform

| Feature | Sub-Features | Priority | Complexity | Dependencies |
|---------|-------------|----------|-----------|-------------|
| **F3.1 Story Browser** | Searchable library (50 tales v1), filters (theme/difficulty/length), thumbnail cards (EN/HI/ISL gloss), pagination | P0 | Low | Stories DB, Meilisearch |
| **F3.2 Immersive Story Player** | Full-screen avatar, side-by-side text sync, chapter nav, vocabulary spotlight (tap word -> sign), bookmarks, completion tracking, social sharing | P0 | High | F1.3, F1.2 |
| **F3.3 Classroom Management** | Teacher dashboard, create/edit classes, student invitation (email/code), class roster, role validation | P1 | Medium | Auth, Institutions |
| **F3.4 Assignment Builder** | Select tales/vocab/quizzes, set due dates, adaptive difficulty toggle, publish to class | P1 | Medium | F3.3 |
| **F3.5 Quiz Engine** | Auto-generated quizzes from story content, 3 question types (sign->word, sentence->sign, sequence ordering), adaptive difficulty, instant feedback, leaderboard | P1 | High | F3.2, F1.3 |
| **F3.6 Progress Tracking** | Student: completion %, time spent, quiz scores, streak. Educator: class overview, individual drilldown, printable IEP report (PDF), parent portal | P1 | Medium | F3.3, F3.5 |
| **F3.7 Lesson Plan Creator** | Structured plans, CBSE/State Board templates, sharable with community, export PDF/SCORM | P2 | Medium | F3.4 |
| **F3.8 Practice Studio** | Webcam recording, AI pose comparison (handshape/movement/expression), feedback, improvement trends | P2 | High | MediaPipe, F1.4 |

### Epic 4: Live Collaboration Canvas

| Feature | Sub-Features | Priority | Complexity | Dependencies |
|---------|-------------|----------|-----------|-------------|
| **F4.1 Document Editor** | CRDT-based collab editor (Yjs), ISL narration of edits, "ISL Read Aloud", comment threads (text+ISL), version history | P2 | High | F1.2, WebSocket |
| **F4.2 Meeting Overlay** | Browser extension (Chrome/Firefox), Whisper ASR -> avatar overlay on video calls, deaf webcam -> captions, transcript export | P2 | Very High | F1.2, F1.4, Extension APIs |
| **F4.3 Visual Whiteboard** | Infinite canvas, voice/text annotations signed by avatar, gesture drawing, ISL instruction recording, accessible PDF export | P3 | Very High | F4.1, Canvas API |
| **F4.4 ISL Video Messaging** | Record ISL video, auto-transcript, text reply -> ISL avatar, inbox/outbox, Slack-like channels | P3 | High | F1.4, S3 |

### Epic 5: Accessibility Auditor

| Feature | Sub-Features | Priority | Complexity | Dependencies |
|---------|-------------|----------|-----------|-------------|
| **F5.1 Repo Scanner** | GitHub/GitLab OAuth, PR-triggered scan, detect missing ISL/ARIA/alt text/keyboard nav, prioritized issue list (Critical/High/Medium/Low) with line numbers | P1 | High | GitHub API |
| **F5.2 Accessibility Score** | 0-100 score, breakdown (ISL Coverage, WCAG 2.2, Cognitive Load, Visual Contrast), historical trend, benchmark vs network | P1 | Medium | F5.1 |
| **F5.3 AI Auto-Fix** | ISLAvatar insertion, ARIA/alt text suggestion, auto-generate PR with fixes, confidence indicator | P2 | High | F5.1, GitHub API, LLM |
| **F5.4 Compliance Report** | Legal PDF (WCAG 2.2, RPwD Act 2016, NEP 2020), compliance certificate for score 80+ | P2 | Medium | F5.2 |

### Epic 6: Admin & Analytics

| Feature | Sub-Features | Priority | Complexity | Dependencies |
|---------|-------------|----------|-----------|-------------|
| **F6.1 Platform Admin** | RBAC (7 roles), user CRUD (invite/suspend/reset/export), content moderation queue, SiGML file manager (upload/preview/tag/retire), system health dashboard | P0 | Medium | Auth |
| **F6.2 Research Dashboard** | Corpus management (view/filter/export EN-ISL pairs), annotation queue, Cohen's Kappa per batch, model retraining trigger, dataset version control | P1 | High | ML Pipeline |
| **F6.3 Analytics** | DAU/MAU, session duration, feature heatmap, BLEU trend, NPS survey (after 10 sessions), quiz/vocab metrics, API partner analytics | P1 | Medium | Events pipeline |

### Epic 7: Extended Features (New Additions)

| Feature | Sub-Features | Priority | Complexity | Dependencies |
|---------|-------------|----------|-----------|-------------|
| **F7.1 PWA Support** | Service worker, offline dictionary cache, installable, push notifications | P1 | Medium | Frontend |
| **F7.2 Gamification Engine** | Points, badges (First Sign, 7-Day Streak, Tale Master, etc.), levels, XP bar, leaderboards (class/global) | P2 | Medium | Auth, Education |
| **F7.3 ISL Community Forum** | Discussion threads, sign contribution portal, upvote/downvote, expert verification badge, rich text + ISL avatar embeds | P2 | High | Auth, F1.3 |
| **F7.4 Sign Contribution Portal** | Users submit new signs via webcam, expert review pipeline, approved signs enter SiGML library, contributor credits | P2 | High | F1.4, Admin |
| **F7.5 AI Conversation Bot** | Practice ISL conversations with AI, adaptive to learner level, topic selection (greetings, shopping, hospital), feedback on signing accuracy | P3 | Very High | F1.2, F1.4, LLM |
| **F7.6 Fingerspelling Game** | Interactive speed game, see word -> fingerspell it -> AI scores, time trials, multiplayer challenge mode | P3 | Medium | F1.4, Gamification |
| **F7.7 Multi-Tenant White-Label** | Custom domain, branding (logo, colors), isolated data, institutional SSO (SAML), custom onboarding flow | P3 | High | Infra, Auth |
| **F7.8 Notification System** | In-app, email, push (PWA). Events: assignment due, quiz graded, API quota warning, model update, feedback reviewed | P1 | Medium | Auth, Celery |
| **F7.9 Payment & Billing** | Stripe/Razorpay integration, plan selection, subscription management, invoice generation, usage-based overage billing | P1 | High | Auth, API Keys |
| **F7.10 ISL News Feed** | Curated ISL content (news articles signed by avatar), community stories, trending signs, daily ISL fact | P3 | Medium | F1.2, CMS |
| **F7.11 Parental Controls** | Content restrictions (age-appropriate), screen time limits, disable social features, parent dashboard | P2 | Medium | Auth, Education |
| **F7.12 Integration Marketplace** | Pre-built webhooks for Slack, Discord, Teams, Google Classroom, Moodle, Canvas LMS | P3 | High | Webhooks |

---

## Phase 4 — System Architecture

### High-Level Architecture Diagram

```
                          +---------------------------+
                          |    CloudFront CDN          |
                          |    SiGML, MP4, static      |
                          +-------------+-------------+
                                        |
                          +-------------v-------------+
                          |    React.js SPA            |
                          |    Vite + TS + Tailwind    |
                          |    CWASA/Three.js Avatar   |
                          |    MediaPipe (client)      |
                          |    Service Worker (PWA)    |
                          +-------------+-------------+
                                        |
                                   HTTPS / WSS
                                        |
                          +-------------v-------------+
                          |    Nginx Reverse Proxy     |
                          |    TLS 1.3 | CORS | LB    |
                          |    WAF (CloudFront)        |
                          +-------------+-------------+
                                        |
            +---------------------------+---------------------------+
            |                           |                           |
  +---------v---------+     +-----------v-----------+    +----------v----------+
  | Flask API Gateway |     | FastAPI Translation   |    | FastAPI Recognition  |
  | Auth, Routing,    |     | Service               |    | Service              |
  | Rate Limiting,    |     | NLP + BiLSTM + Mapper |    | LSTM + Beam Search   |
  | User/Content APIs |     | Confidence routing    |    | WebSocket handler    |
  +---------+---------+     +-----------+-----------+    +----------+----------+
            |                           |                           |
  +---------v---------------------------v---------------------------v----------+
  |                              Redis Cluster (v7)                            |
  |  Translation Cache (24h TTL) | Session Store | Rate Limiters | Pub/Sub   |
  +----+------------------+-------------------+-----------------+-------------+
       |                  |                   |                 |
  +----v------+   +-------v-------+   +-------v------+   +----v---------+
  | PostgreSQL|   | Celery Workers|   | AWS S3       |   | Meilisearch  |
  | 16 + RDS  |   | Video gen     |   | SiGML files  |   | Dictionary   |
  | Read      |   | Model retrain |   | MP4 avatars  |   | Stories      |
  | Replicas  |   | Audit jobs    |   | Corpus data  |   | search       |
  +-----------+   | Notifications |   | User uploads |   +--------------+
                  +-------+-------+   +--------------+
                          |
                  +-------v-------+
                  | GPU Node Pool |     +------------------+
                  | NVIDIA T4/A10 |     | MLflow Server    |
                  | PyTorch + CUDA|---->| Model Registry   |
                  | Whisper ASR   |     | Experiment Track |
                  +---------------+     +------------------+

  +-----------------------------------------------------------------------+
  | Observability: Prometheus + Grafana + AlertManager                    |
  | Logging: Structured JSON -> CloudWatch / ELK                         |
  | CI/CD: GitHub Actions -> Docker -> ECR -> K8s (EKS)                  |
  | Secrets: AWS Secrets Manager                                          |
  | IaC: Terraform (EKS, RDS, S3, ElastiCache, CloudFront)              |
  +-----------------------------------------------------------------------+
```

### Technology Decisions

#### Frontend: React 18+ / TypeScript / Vite / Tailwind CSS

**Why React (not Next.js)?**
The app is heavily client-side: WebGL avatar rendering (CWASA/Three.js), real-time MediaPipe webcam processing, WebSocket streams for gesture recognition. These are all browser-only operations. Next.js SSR adds complexity with zero benefit for these use cases. The Flask backend handles API routing, so Next.js API routes are redundant. Vite provides faster DX (sub-200ms HMR) and simpler config.

**Why Tailwind CSS?**
- Utility-first scales across 50+ screens without CSS file bloat
- Built-in dark mode (`dark:` prefix) — critical for deaf user preference
- Responsive breakpoints match our 375px/640px/1024px/1280px targets
- PurgeCSS produces tiny production bundles
- Design tokens map directly to Tailwind config

**State Management: Zustand**
- Lightweight (1.1KB) vs Redux (7KB+)
- No boilerplate, no providers
- Built-in devtools and persistence middleware
- Perfect for: auth state, user preferences, translation cache, conversation history

**Key Frontend Libraries:**
| Library | Purpose |
|---------|---------|
| React Router v6 | Client-side routing |
| Zustand | State management |
| Three.js | WebGL/CWASA avatar rendering |
| @mediapipe/holistic | Client-side pose estimation |
| TanStack Query | Server state, caching, background refetch |
| Tiptap | Rich text editor (communication hub, doc editor) |
| Recharts | Analytics charts |
| Radix UI | Accessible headless components |
| Framer Motion | Animations (respect prefers-reduced-motion) |
| i18next | Hindi/English internationalization |

#### Backend: Flask 3.0 (Gateway) + FastAPI (ML Services)

**Why Flask for Gateway?**
PRD specifies Flask. It's lightweight, battle-tested, excellent middleware ecosystem (Flask-Login, Flask-CORS, Flask-Limiter). Handles auth, routing, CRUD operations. Runs on Gunicorn with multiple workers.

**Why FastAPI for ML?**
- Native async/await for non-blocking ML inference
- Automatic OpenAPI schema generation (developer docs)
- Pydantic validation prevents malformed ML inputs
- WebSocket support for real-time gesture recognition
- Runs on Uvicorn (ASGI) with worker pool

**Key Backend Libraries:**
| Library | Purpose |
|---------|---------|
| SQLAlchemy 2.0 | ORM for PostgreSQL |
| Alembic | Database migrations |
| Flask-JWT-Extended | JWT auth with refresh tokens |
| Flask-Limiter | Rate limiting |
| Celery 5.3 | Async task queue |
| Pydantic | Data validation (FastAPI) |
| spaCy 3.7 | NLP tokenization/lemmatization |
| redis-py | Redis client |
| boto3 | AWS S3 client |
| meilisearch-python | Search client |

#### Database: PostgreSQL 16 (RDS)

**Why PostgreSQL?**
- PRD specifies it
- JSONB for flexible schema (gloss mappings, quiz answers, annotation data)
- Full-text search (tsvector) for dictionary backup search
- Robust constraints and foreign keys for relational data integrity
- RDS with read replicas for read-heavy workloads (dictionary, stories, analytics)
- Point-in-time recovery with 30-day retention

#### Cache: Redis 7 (ElastiCache)

**Caching Strategy:**
| Cache | TTL | Purpose |
|-------|-----|---------|
| Translation results | 24h | Avoid GPU re-inference for identical inputs |
| Dictionary lookups | 1h | Frequently accessed signs |
| Story metadata | 1h | Popular story cards |
| Session tokens | 15min | JWT session store |
| Rate limit counters | Sliding window | Per-key request counting |
| Meilisearch warm-up | 5min | Pre-warmed search results |

Expected cache hit rate: **80%+** for translations (many users translate common phrases).

#### Search: Meilisearch

**Why Meilisearch (not Elasticsearch)?**
- Sub-50ms search with typo tolerance (critical for Hindi transliteration)
- 10x simpler to operate than Elasticsearch
- Built-in filtering and faceting for story themes/difficulty
- RAM-efficient for our dataset size (5K signs + 547 stories)
- REST API with official Python client

#### Queue: Celery 5.3 + Redis Broker

| Task | Queue | Priority |
|------|-------|----------|
| Video generation (MP4 avatar) | `video` | Medium |
| Model retraining | `ml` | Low |
| Audit job execution | `audit` | Medium |
| Webhook delivery | `webhooks` | High |
| Notification dispatch | `notifications` | High |
| Report generation (PDF) | `reports` | Low |
| Corpus export | `exports` | Low |

#### ML Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Translation | PyTorch 2.0+ BiLSTM + Multi-Head Attention | English -> ISL Gloss |
| Recognition | PyTorch LSTM (3-layer, 256 hidden) | Landmarks -> ISL Gloss |
| NLP | spaCy 3.7 + Stanford CoreNLP | Tokenization, lemmatization, SOV fallback |
| ASR | OpenAI Whisper v3 (large) | Speech -> text (Hindi + English) |
| Hindi->English | mBERT / HuggingFace MarianMT | Cross-lingual bridge |
| Code Gen | Llama 3.1 (8B) self-hosted | Prompt-to-Prototype, auto-fix |
| Tracking | MLflow 2.10 | Experiment logging, model registry |
| Tuning | Optuna | Bayesian hyperparameter optimization |
| Embeddings | mBERT (HuggingFace) | Cross-lingual transfer learning |

#### Deployment: Docker + Kubernetes (AWS EKS)

| Component | Config |
|-----------|--------|
| EKS Cluster | Multi-AZ, Mumbai primary, Singapore failover |
| API Pods | 2-8 replicas, HPA on CPU (70% threshold) |
| Translation Pods | 2-20 replicas, HPA on queue depth |
| GPU Nodes | NVIDIA T4 x4, auto-scale to zero when idle |
| Ingress | Nginx Ingress Controller, TLS termination |
| Secrets | AWS Secrets Manager, mounted as K8s secrets |
| Storage | EBS gp3 for node storage, S3 for media |
| CDN | CloudFront with S3 origin for SiGML/MP4 |
| DNS | Route 53 with health checks |
| IaC | Terraform with remote state (S3 + DynamoDB lock) |
## Phase 5 — Database Schema

### ER Diagram Description

```
USERS (1)──(N) USER_ROLES
USERS (1)──(N) OAUTH_ACCOUNTS
USERS (1)──(N) SESSIONS
USERS (1)──(N) API_KEYS (1)──(N) API_USAGE_LOGS
USERS (1)──(1) SUBSCRIPTIONS (N)──(1) PLANS
USERS (1)──(N) NOTIFICATIONS
USERS (1)──(N) BOOKMARKS
USERS (1)──(N) VOCABULARY_LISTS (1)──(N) VOCABULARY_LIST_ITEMS (N)──(1) SIGNS
USERS (1)──(N) USER_SIGN_PROGRESS (N)──(1) SIGNS
USERS (1)──(N) CONVERSATION_SESSIONS (1)──(N) CONVERSATION_MESSAGES
USERS (1)──(N) FEEDBACK_SUBMISSIONS

INSTITUTIONS (1)──(N) INSTITUTION_MEMBERS (N)──(1) USERS
INSTITUTIONS (1)──(N) CLASSES (1)──(N) CLASS_STUDENTS (N)──(1) USERS
CLASSES (1)──(N) ASSIGNMENTS (1)──(N) ASSIGNMENT_SUBMISSIONS (N)──(1) USERS

STORIES (1)──(N) STORY_CHAPTERS (1)──(N) STORY_GLOSS_ANNOTATIONS
STORIES (1)──(N) STORY_QUIZZES (1)──(N) QUIZ_QUESTIONS
USERS (1)──(N) USER_STORY_PROGRESS (N)──(1) STORIES
USERS (1)──(N) QUIZ_ATTEMPTS (N)──(1) STORY_QUIZZES

SIGNS (1)──(N) SIGN_CATEGORIES
SIGNS (1)──(N) SIGN_EXAMPLES
SIGNS (N)──(1) SIGML_FILES
GLOSS_MAPPINGS (N)──(1) SIGML_FILES

AUDIT_JOBS (1)──(N) AUDIT_ISSUES

ANNOTATION_BATCHES (1)──(N) ANNOTATIONS (N)──(1) USERS
MODEL_VERSIONS -- standalone with MLflow reference

DOCUMENTS (1)──(N) DOCUMENT_COLLABORATORS (N)──(1) USERS
ISL_MESSAGES -- sender/recipient/channel

GAMIFICATION_PROFILES (1)──(1) USERS
BADGES -- standalone lookup
USER_BADGES (N)──(1) USERS, (N)──(1) BADGES
```

### Complete Schema (SQL)

```sql
-- =============================================
-- CORE: USERS & AUTH
-- =============================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255),
    full_name       VARCHAR(255) NOT NULL,
    display_name    VARCHAR(100),
    avatar_url      VARCHAR(500),
    locale          VARCHAR(10) DEFAULT 'en',
    theme           VARCHAR(10) DEFAULT 'system',
    font_size       VARCHAR(10) DEFAULT 'medium',    -- 'small'|'medium'|'large'|'xlarge'
    high_contrast   BOOLEAN DEFAULT FALSE,
    reduce_motion   BOOLEAN DEFAULT FALSE,
    is_deaf         BOOLEAN DEFAULT FALSE,
    is_verified     BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    onboarding_done BOOLEAN DEFAULT FALSE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role        VARCHAR(30) NOT NULL CHECK (role IN (
        'super_admin','institution_admin','educator','student','developer','api_user','general'
    )),
    granted_by  UUID REFERENCES users(id),
    granted_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

CREATE TABLE oauth_accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider        VARCHAR(30) NOT NULL CHECK (provider IN ('google','github','gitlab')),
    provider_id     VARCHAR(255) NOT NULL,
    access_token    TEXT,
    refresh_token   TEXT,
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

CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(50) NOT NULL,
    title       VARCHAR(255) NOT NULL,
    body        TEXT,
    data        JSONB DEFAULT '{}',
    channel     VARCHAR(20) DEFAULT 'in_app',  -- 'in_app'|'email'|'push'
    is_read     BOOLEAN DEFAULT FALSE,
    read_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE is_read = FALSE;

-- =============================================
-- BILLING & SUBSCRIPTIONS
-- =============================================

CREATE TABLE plans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(50) UNIQUE NOT NULL,     -- 'free'|'starter'|'growth'|'enterprise'
    display_name    VARCHAR(100) NOT NULL,
    price_monthly   DECIMAL(10,2) NOT NULL DEFAULT 0,
    price_yearly    DECIMAL(10,2),
    api_calls_limit INTEGER NOT NULL,                -- monthly limit
    rate_limit_sec  INTEGER NOT NULL,                -- requests per second
    features        JSONB NOT NULL DEFAULT '{}',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id                 UUID NOT NULL REFERENCES plans(id),
    status                  VARCHAR(20) NOT NULL CHECK (status IN (
        'active','past_due','cancelled','trialing','paused'
    )),
    payment_provider        VARCHAR(20),             -- 'stripe'|'razorpay'
    external_subscription_id VARCHAR(255),
    current_period_start    TIMESTAMPTZ,
    current_period_end      TIMESTAMPTZ,
    cancel_at_period_end    BOOLEAN DEFAULT FALSE,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    amount          DECIMAL(10,2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'USD',
    status          VARCHAR(20) DEFAULT 'pending',   -- 'pending'|'paid'|'failed'|'refunded'
    external_id     VARCHAR(255),
    pdf_url         VARCHAR(500),
    paid_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DEVELOPER PLATFORM
-- =============================================

CREATE TABLE api_keys (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_hash        VARCHAR(255) NOT NULL,
    key_prefix      VARCHAR(12) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    scopes          JSONB DEFAULT '["translate"]',
    is_active       BOOLEAN DEFAULT TRUE,
    last_used_at    TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix) WHERE is_active = TRUE;

CREATE TABLE api_usage_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id      UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint        VARCHAR(100) NOT NULL,
    method          VARCHAR(10) NOT NULL,
    status_code     INTEGER NOT NULL,
    latency_ms      INTEGER,
    request_chars   INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_api_usage_key_date ON api_usage_logs(api_key_id, created_at);

CREATE TABLE webhooks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    url         VARCHAR(500) NOT NULL,
    secret      VARCHAR(255) NOT NULL,
    events      JSONB NOT NULL,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE webhook_deliveries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id      UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event           VARCHAR(50) NOT NULL,
    payload         JSONB NOT NULL,
    status_code     INTEGER,
    response_body   TEXT,
    attempts        INTEGER DEFAULT 0,
    delivered_at    TIMESTAMPTZ,
    next_retry_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ISL SIGNS & SIGML
-- =============================================

CREATE TABLE sigml_files (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename        VARCHAR(255) UNIQUE NOT NULL,
    s3_key          VARCHAR(500) NOT NULL,
    cdn_url         VARCHAR(500),
    gloss           VARCHAR(100) NOT NULL,
    hamnosys_code   VARCHAR(500),
    version         INTEGER DEFAULT 1,
    is_active       BOOLEAN DEFAULT TRUE,
    tags            JSONB DEFAULT '[]',
    uploaded_by     UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE signs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    english_word    VARCHAR(255) NOT NULL,
    hindi_word      VARCHAR(255),
    gloss           VARCHAR(100) NOT NULL UNIQUE,
    hamnosys_code   VARCHAR(500),
    sigml_file_id   UUID REFERENCES sigml_files(id),
    handshape_desc  TEXT,
    description     TEXT,
    video_url       VARCHAR(500),
    difficulty      VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty IN ('beginner','intermediate','advanced')),
    usage_count     INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sign_categories (
    sign_id     UUID NOT NULL REFERENCES signs(id) ON DELETE CASCADE,
    category    VARCHAR(100) NOT NULL,
    PRIMARY KEY (sign_id, category)
);

CREATE TABLE sign_examples (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sign_id     UUID NOT NULL REFERENCES signs(id) ON DELETE CASCADE,
    sentence_en TEXT NOT NULL,
    sentence_hi TEXT,
    isl_gloss   TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gloss_mappings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    english_word    VARCHAR(255) NOT NULL,
    gloss           VARCHAR(100) NOT NULL,
    sigml_file_id   UUID NOT NULL REFERENCES sigml_files(id),
    confidence      DECIMAL(3,2) DEFAULT 1.0,
    source          VARCHAR(20) DEFAULT 'manual' CHECK (source IN ('manual','model','feedback','community')),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(english_word, gloss)
);
CREATE INDEX idx_gloss_english ON gloss_mappings(english_word);

-- =============================================
-- JATAKA TALES
-- =============================================

CREATE TABLE stories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en        VARCHAR(500) NOT NULL,
    title_hi        VARCHAR(500),
    slug            VARCHAR(255) UNIQUE NOT NULL,
    summary_en      TEXT,
    summary_hi      TEXT,
    theme           VARCHAR(50) NOT NULL CHECK (theme IN ('animal','human','wisdom','sacrifice','karmic')),
    difficulty      VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner','intermediate','advanced')),
    duration_min    INTEGER,
    word_count      INTEGER,
    chapter_count   INTEGER DEFAULT 1,
    thumbnail_url   VARCHAR(500),
    is_published    BOOLEAN DEFAULT FALSE,
    published_at    TIMESTAMPTZ,
    view_count      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE story_chapters (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id        UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    chapter_num     INTEGER NOT NULL,
    title_en        VARCHAR(255),
    title_hi        VARCHAR(255),
    content_en      TEXT NOT NULL,
    content_hi      TEXT,
    isl_glosses     TEXT NOT NULL,
    sigml_sequence  JSONB NOT NULL,      -- [{gloss, sigml_file_id, word_index, start_time}]
    word_count      INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(story_id, chapter_num)
);

CREATE TABLE story_quizzes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id        UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    is_adaptive     BOOLEAN DEFAULT FALSE,
    question_count  INTEGER DEFAULT 5,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_questions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id         UUID NOT NULL REFERENCES story_quizzes(id) ON DELETE CASCADE,
    type            VARCHAR(30) NOT NULL CHECK (type IN ('sign_to_word','sentence_to_sign','sequence_order')),
    question_data   JSONB NOT NULL,
    options         JSONB NOT NULL,
    correct_answer  JSONB NOT NULL,
    difficulty      INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
    order_num       INTEGER NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_story_progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    story_id        UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    status          VARCHAR(20) DEFAULT 'not_started',
    current_chapter INTEGER DEFAULT 1,
    completion_pct  DECIMAL(5,2) DEFAULT 0,
    time_spent_sec  INTEGER DEFAULT 0,
    last_accessed   TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    UNIQUE(user_id, story_id)
);

CREATE TABLE quiz_attempts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id         UUID NOT NULL REFERENCES story_quizzes(id) ON DELETE CASCADE,
    score           DECIMAL(5,2) NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_count   INTEGER NOT NULL,
    answers         JSONB NOT NULL,
    time_spent_sec  INTEGER,
    completed_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EDUCATION: CLASSES & ASSIGNMENTS
-- =============================================

CREATE TABLE institutions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(50) CHECK (type IN ('school','university','ngo','enterprise')),
    city        VARCHAR(100),
    state       VARCHAR(100),
    country     VARCHAR(100) DEFAULT 'India',
    logo_url    VARCHAR(500),
    sso_config  JSONB,                   -- SAML/OIDC config for white-label
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE institution_members (
    institution_id  UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            VARCHAR(30) NOT NULL,
    joined_at       TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (institution_id, user_id)
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
    max_students    INTEGER DEFAULT 50,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE class_students (
    class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at   TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (class_id, student_id)
);

CREATE TABLE assignments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    type        VARCHAR(30) NOT NULL CHECK (type IN ('story','vocabulary','quiz','practice','lesson_plan')),
    content_ids JSONB NOT NULL,
    due_date    TIMESTAMPTZ,
    is_adaptive BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assignment_submissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id   UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','late')),
    score           DECIMAL(5,2),
    time_spent_sec  INTEGER,
    data            JSONB,
    submitted_at    TIMESTAMPTZ,
    UNIQUE(assignment_id, student_id)
);

-- =============================================
-- VOCABULARY & LEARNING
-- =============================================

CREATE TABLE vocabulary_lists (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    is_public   BOOLEAN DEFAULT FALSE,
    sign_count  INTEGER DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vocabulary_list_items (
    list_id     UUID NOT NULL REFERENCES vocabulary_lists(id) ON DELETE CASCADE,
    sign_id     UUID NOT NULL REFERENCES signs(id) ON DELETE CASCADE,
    added_at    TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (list_id, sign_id)
);

CREATE TABLE user_sign_progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sign_id         UUID NOT NULL REFERENCES signs(id) ON DELETE CASCADE,
    ease_factor     DECIMAL(4,2) DEFAULT 2.5,
    interval_days   INTEGER DEFAULT 1,
    repetitions     INTEGER DEFAULT 0,
    next_review_at  TIMESTAMPTZ,
    last_reviewed   TIMESTAMPTZ,
    correct_count   INTEGER DEFAULT 0,
    total_attempts  INTEGER DEFAULT 0,
    UNIQUE(user_id, sign_id)
);

CREATE TABLE bookmarks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(30) NOT NULL CHECK (target_type IN ('sign','story','chapter','conversation')),
    target_id   UUID NOT NULL,
    note        TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);

-- =============================================
-- CONVERSATIONS
-- =============================================

CREATE TABLE conversation_sessions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id  UUID NOT NULL REFERENCES users(id),
    share_code  VARCHAR(20) UNIQUE,
    title       VARCHAR(255),
    mode        VARCHAR(20) DEFAULT 'dialogue' CHECK (mode IN ('dialogue','monologue','meeting')),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    ended_at    TIMESTAMPTZ
);

CREATE TABLE conversation_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES conversation_sessions(id) ON DELETE CASCADE,
    sender_id       UUID REFERENCES users(id),
    input_type      VARCHAR(20) NOT NULL CHECK (input_type IN ('text','speech','sign','file')),
    input_content   TEXT NOT NULL,
    output_text     TEXT,
    isl_glosses     TEXT,
    confidence      DECIMAL(3,2),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_conv_msg_session ON conversation_messages(session_id, created_at);

-- =============================================
-- ACCESSIBILITY AUDITOR
-- =============================================

CREATE TABLE audit_jobs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    repo_url        VARCHAR(500),
    provider        VARCHAR(20),
    branch          VARCHAR(255),
    pr_number       INTEGER,
    input_code      TEXT,                    -- for direct code paste
    status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','running','completed','failed','timeout')),
    score           INTEGER CHECK (score BETWEEN 0 AND 100),
    breakdown       JSONB,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_issues (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id          UUID NOT NULL REFERENCES audit_jobs(id) ON DELETE CASCADE,
    severity        VARCHAR(10) NOT NULL CHECK (severity IN ('critical','high','medium','low')),
    category        VARCHAR(30) NOT NULL,
    file_path       VARCHAR(500),
    line_number     INTEGER,
    column_number   INTEGER,
    description     TEXT NOT NULL,
    suggestion      TEXT,
    fix_code        TEXT,
    auto_fixable    BOOLEAN DEFAULT FALSE,
    is_fixed        BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ML & ANNOTATION PIPELINE
-- =============================================

CREATE TABLE annotation_batches (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    status          VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','in_review','approved','training','completed')),
    total_pairs     INTEGER DEFAULT 0,
    approved_pairs  INTEGER DEFAULT 0,
    cohens_kappa    DECIMAL(4,3),
    created_by      UUID REFERENCES users(id),
    approved_by     UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    approved_at     TIMESTAMPTZ
);

CREATE TABLE annotations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id        UUID NOT NULL REFERENCES annotation_batches(id) ON DELETE CASCADE,
    english_text    TEXT NOT NULL,
    hindi_text      TEXT,
    isl_gloss       TEXT NOT NULL,
    annotator_id    UUID NOT NULL REFERENCES users(id),
    reviewer_id     UUID REFERENCES users(id),
    status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','corrected')),
    corrected_gloss TEXT,
    notes           TEXT,
    elan_file_url   VARCHAR(500),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at     TIMESTAMPTZ
);

CREATE TABLE feedback_submissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    type            VARCHAR(30) NOT NULL CHECK (type IN ('translation_correction','sign_suggestion','bug_report','content_issue')),
    original_text   TEXT,
    original_gloss  TEXT,
    corrected_gloss TEXT,
    notes           TEXT,
    status          VARCHAR(20) DEFAULT 'pending',
    reviewed_by     UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at     TIMESTAMPTZ
);

CREATE TABLE model_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version         VARCHAR(50) UNIQUE NOT NULL,
    model_type      VARCHAR(30) NOT NULL CHECK (model_type IN ('translation','recognition')),
    mlflow_run_id   VARCHAR(100),
    bleu_score      DECIMAL(4,3),
    accuracy        DECIMAL(4,3),
    is_active       BOOLEAN DEFAULT FALSE,
    is_candidate    BOOLEAN DEFAULT FALSE,      -- A/B test candidate
    traffic_pct     INTEGER DEFAULT 0,           -- % of traffic in A/B test
    training_config JSONB,
    training_data   JSONB,
    s3_artifact     VARCHAR(500),
    promoted_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- COLLABORATION
-- =============================================

CREATE TABLE documents (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id  UUID NOT NULL REFERENCES users(id),
    title       VARCHAR(500) NOT NULL,
    content     JSONB DEFAULT '{}',
    share_code  VARCHAR(20) UNIQUE,
    is_public   BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE document_collaborators (
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission  VARCHAR(10) NOT NULL CHECK (permission IN ('view','edit','admin')),
    PRIMARY KEY (document_id, user_id)
);

CREATE TABLE isl_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id       UUID NOT NULL REFERENCES users(id),
    channel_id      UUID,
    recipient_id    UUID REFERENCES users(id),
    video_s3_key    VARCHAR(500),
    transcript      TEXT,
    isl_glosses     TEXT,
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- GAMIFICATION
-- =============================================

CREATE TABLE gamification_profiles (
    user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    xp              INTEGER DEFAULT 0,
    level           INTEGER DEFAULT 1,
    streak_days     INTEGER DEFAULT 0,
    longest_streak  INTEGER DEFAULT 0,
    last_active_date DATE,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE badges (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(50) UNIQUE NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon_url    VARCHAR(500),
    category    VARCHAR(50),              -- 'learning'|'streak'|'social'|'achievement'
    xp_reward   INTEGER DEFAULT 0,
    criteria    JSONB NOT NULL            -- machine-readable unlock conditions
);

CREATE TABLE user_badges (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id    UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at   TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);

-- =============================================
-- EVENTS & ANALYTICS (append-only)
-- =============================================

CREATE TABLE analytics_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id),
    event_type  VARCHAR(100) NOT NULL,
    properties  JSONB DEFAULT '{}',
    session_id  VARCHAR(100),
    device_info JSONB,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_events_type_date ON analytics_events(event_type, created_at);
CREATE INDEX idx_events_user ON analytics_events(user_id, created_at);

-- =============================================
-- FULL-TEXT SEARCH INDEXES
-- =============================================

CREATE INDEX idx_signs_fts ON signs
    USING GIN (to_tsvector('english', english_word || ' ' || COALESCE(hindi_word,'') || ' ' || gloss || ' ' || COALESCE(description,'')));

CREATE INDEX idx_stories_fts ON stories
    USING GIN (to_tsvector('english', title_en || ' ' || COALESCE(title_hi,'') || ' ' || COALESCE(summary_en,'')));

-- =============================================
-- STANDARD INDEXES
-- =============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_signs_english ON signs(english_word);
CREATE INDEX idx_signs_gloss ON signs(gloss);
CREATE INDEX idx_stories_theme_diff ON stories(theme, difficulty) WHERE is_published = TRUE;
CREATE INDEX idx_story_chapters_story ON story_chapters(story_id, chapter_num);
CREATE INDEX idx_user_progress_user ON user_story_progress(user_id);
CREATE INDEX idx_class_students_class ON class_students(class_id);
CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_audit_jobs_user ON audit_jobs(user_id, created_at);
CREATE INDEX idx_feedback_status ON feedback_submissions(status) WHERE status = 'pending';
CREATE INDEX idx_sign_progress_review ON user_sign_progress(user_id, next_review_at);
```
## Phase 6 — API Specification

### Authentication

All API requests require one of:
- `Authorization: Bearer <jwt>` — for user-facing requests
- `X-API-Key: sf_live_xxxxx` — for developer API calls
- No auth — for public endpoints (landing, story listing)

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "request_id": "uuid", "timestamp": "ISO-8601", "latency_ms": 142 }
}
```

**Error:**
```json
{
  "success": false,
  "data": null,
  "error": { "code": "VALIDATION_ERROR", "message": "Text exceeds 2000 chars", "details": {} },
  "meta": { "request_id": "uuid", "timestamp": "ISO-8601" }
}
```

**Error Codes:**

| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Missing or invalid token/key |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid request body |
| `RATE_LIMIT_EXCEEDED` | 429 | Quota exceeded, includes `Retry-After` header |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | ML service down, try later |
| `TRANSLATION_TIMEOUT` | 504 | Translation took too long |

---

### Auth Endpoints

#### `POST /auth/register`
Auth: None
```json
// Request
{ "email": "aarav@school.in", "password": "min8chars", "full_name": "Aarav Kumar", "is_deaf": true }
// Response 201
{ "user": { "id": "uuid", "email": "...", "full_name": "...", "roles": ["general"] }, "access_token": "jwt", "refresh_token": "jwt" }
// Errors: 409 email exists, 422 validation
```

#### `POST /auth/login`
Auth: None
```json
// Request
{ "email": "...", "password": "..." }
// Response 200: same as register
// Errors: 401 invalid credentials, 403 account suspended
```

#### `POST /auth/oauth/{provider}`
Auth: None | Provider: `google` | `github`
```json
// Request
{ "code": "oauth_auth_code", "redirect_uri": "https://signforge.in/auth/callback" }
// Response 200: same as register (creates account if new)
```

#### `POST /auth/refresh`
Auth: None (refresh token in body or httpOnly cookie)
```json
// Request
{ "refresh_token": "jwt_refresh" }
// Response 200
{ "access_token": "new_jwt", "refresh_token": "new_refresh" }
// Errors: 401 invalid/expired refresh token
```

#### `POST /auth/logout`
Auth: Bearer JWT
```json
// Response 200
{ "message": "Logged out" }
```

#### `POST /auth/forgot-password`
Auth: None
```json
// Request
{ "email": "user@example.com" }
// Response 200 (always, to prevent email enumeration)
{ "message": "If this email exists, a reset link has been sent" }
```

#### `POST /auth/reset-password`
Auth: None
```json
// Request
{ "token": "reset_token_from_email", "new_password": "newMin8chars" }
// Response 200
{ "message": "Password updated" }
```

---

### Translation Endpoints

#### `POST /v1/translate`
Auth: Bearer JWT or X-API-Key | Scopes: `translate`
```json
// Request
{
  "text": "The king gave the golden ball to the monkey",
  "source_lang": "en",          // "en"|"hi"|"auto"
  "output_format": "sigml",     // "sigml"|"gloss"|"json"|"mp4_url"
  "avatar_style": "female",     // "default"|"male"|"female"|"neutral"
  "speed": 1.0,                 // 0.5 - 2.0
  "webhook_url": null           // optional, for async mp4
}
// Response 200
{
  "translation_id": "uuid",
  "source_text": "The king gave the golden ball to the monkey",
  "detected_lang": "en",
  "glosses": ["KING", "GOLDEN", "BALL", "MONKEY", "GIVE"],
  "sigml_urls": [
    "https://cdn.signforge.in/sigml/KING.sigml",
    "https://cdn.signforge.in/sigml/GOLDEN.sigml",
    "https://cdn.signforge.in/sigml/BALL.sigml",
    "https://cdn.signforge.in/sigml/MONKEY.sigml",
    "https://cdn.signforge.in/sigml/GIVE.sigml"
  ],
  "word_to_gloss_map": [
    { "word": "king", "index": 0, "gloss": "KING", "mapped": true },
    { "word": "gave", "index": 4, "gloss": "GIVE", "mapped": true },
    { "word": "golden", "index": 1, "gloss": "GOLDEN", "mapped": true },
    { "word": "ball", "index": 2, "gloss": "BALL", "mapped": true },
    { "word": "monkey", "index": 3, "gloss": "MONKEY", "mapped": true }
  ],
  "confidence": 0.87,
  "fallback_used": false,
  "signing_duration_sec": 5.2,
  "cached": false
}
// Errors: 422 text too long (>2000), 429 rate limit, 503 ML service down
```

#### `POST /v1/translate/batch`
Auth: X-API-Key | Scopes: `translate`
```json
// Request
{ "texts": ["Hello", "How are you", ...], "source_lang": "en", "output_format": "gloss" }
// Max 100 texts per request
// Response 200
{ "results": [{ "index": 0, "glosses": ["HELLO"], "confidence": 0.95 }, ...], "total": 2 }
```

---

### Dictionary Endpoints

#### `GET /v1/signs/{word}`
Auth: Bearer JWT or X-API-Key | Scopes: `dictionary`
```json
// Response 200
{
  "sign": {
    "id": "uuid", "english_word": "king", "hindi_word": "राजा",
    "gloss": "KING", "hamnosys_code": "...",
    "sigml_url": "https://cdn.signforge.in/sigml/KING.sigml",
    "video_url": "https://cdn.signforge.in/videos/KING.mp4",
    "categories": ["nouns", "royalty"],
    "difficulty": "beginner",
    "examples": [{ "sentence_en": "The king was wise", "isl_gloss": "KING WISE" }],
    "handshape_desc": "Flat hand, palm facing right, moves upward"
  }
}
// Errors: 404 sign not found
```

#### `GET /v1/signs/search?q=king&category=nouns&difficulty=beginner&page=1&limit=20`
Auth: Optional
```json
// Response 200
{ "signs": [SignObject, ...], "total": 234, "page": 1, "limit": 20, "query": "king" }
```

#### `GET /v1/signs/word-of-the-day`
Auth: None (public)
```json
// Response 200
{ "sign": SignObject, "date": "2026-03-06", "fun_fact": "This sign uses both hands..." }
```

---

### Recognition Endpoints

#### `WebSocket /v1/recognize`
Auth: X-API-Key in query: `?api_key=sf_live_xxx`
```
Client -> Server (every 33ms at 30fps):
{ "frame_id": 1, "landmarks": { "pose": [[x,y,z],...33], "left_hand": [[x,y,z],...21], "right_hand": [[x,y,z],...21] }, "timestamp": 0.033 }

Server -> Client (every 100ms):
{ "frame_id": 1, "gloss": "KING", "confidence": 0.91, "is_final": false }

Server -> Client (on sentence boundary):
{ "glosses": ["KING", "BALL", "GIVE"], "text_en": "The king gave the ball", "text_hi": "राजा ने गेंद दी", "is_final": true, "confidence": 0.84 }
```

#### `POST /v1/recognize/video`
Auth: X-API-Key | Content-Type: multipart/form-data
```json
// Request: video file upload (mp4/webm, max 50MB)
// Response 202
{ "job_id": "uuid", "status": "processing", "estimated_sec": 30 }
```

#### `GET /v1/recognize/video/{job_id}`
Auth: X-API-Key
```json
// Response 200
{
  "status": "completed",
  "transcript": [
    { "start_sec": 0.0, "end_sec": 2.1, "glosses": ["HELLO"], "text_en": "Hello", "confidence": 0.93 },
    { "start_sec": 2.5, "end_sec": 5.8, "glosses": ["HOW", "YOU"], "text_en": "How are you?", "confidence": 0.81 }
  ],
  "full_text": "Hello. How are you?",
  "duration_sec": 5.8
}
// Errors: 404 job not found, 202 still processing
```

---

### Story Endpoints

#### `GET /v1/stories?theme=animal&difficulty=beginner&length=short&search=monkey&page=1&limit=12`
Auth: None (public listing)
```json
// Response 200
{
  "stories": [{
    "id": "uuid", "title_en": "The Monkey King", "title_hi": "वानर राजा",
    "slug": "the-monkey-king", "theme": "animal", "difficulty": "beginner",
    "duration_min": 5, "word_count": 450, "chapter_count": 3,
    "thumbnail_url": "...", "view_count": 1234
  }],
  "total": 50, "page": 1
}
```

#### `GET /v1/stories/{id}`
Auth: Optional (Bearer JWT for progress tracking)
```json
// Response 200
{
  "story": {
    "id": "uuid", "title_en": "...", "title_hi": "...",
    "chapters": [{
      "chapter_num": 1, "title_en": "The Forest",
      "content_en": "Long ago, in a great forest...",
      "content_hi": "बहुत पहले, एक बड़े जंगल में...",
      "isl_glosses": "LONG-AGO GREAT FOREST ...",
      "sigml_sequence": [
        { "gloss": "LONG-AGO", "sigml_url": "...", "word_index": 0 },
        { "gloss": "GREAT", "sigml_url": "...", "word_index": 3 }
      ]
    }],
    "quizzes": [{ "id": "uuid", "title": "Comprehension Quiz", "question_count": 5 }]
  },
  "progress": { "status": "in_progress", "current_chapter": 2, "completion_pct": 40.0 }
}
```

#### `PUT /v1/stories/{id}/progress`
Auth: Bearer JWT
```json
// Request
{ "current_chapter": 2, "completion_pct": 66.7, "time_spent_sec": 120 }
// Response 200
{ "progress": ProgressObject }
```

---

### Education Endpoints

#### `POST /v1/classes`
Auth: Bearer JWT (educator role)
```json
// Request
{ "name": "Grade 6 ISL Studies", "grade": "6", "subject": "ISL", "institution_id": "uuid" }
// Response 201
{ "class": { "id": "uuid", "invite_code": "MEERA-6A", ... } }
```

#### `POST /v1/classes/{id}/join`
Auth: Bearer JWT (student)
```json
// Request
{ "invite_code": "MEERA-6A" }
// Response 200
{ "class": ClassObject }
// Errors: 404 invalid code, 409 already joined, 403 class full
```

#### `POST /v1/classes/{id}/assignments`
Auth: Bearer JWT (educator, class owner)
```json
// Request
{
  "title": "The Monkey King - Week 3",
  "type": "story",
  "content_ids": ["story-uuid", "quiz-uuid"],
  "due_date": "2026-03-13T17:00:00Z",
  "is_adaptive": true
}
// Response 201
{ "assignment": AssignmentObject }
```

#### `GET /v1/classes/{id}/progress`
Auth: Bearer JWT (educator)
```json
// Response 200
{
  "class_stats": { "total_students": 40, "active_this_week": 38, "avg_score": 76.5 },
  "students": [{
    "id": "uuid", "name": "Aarav Kumar",
    "assignments_completed": 5, "assignments_total": 7,
    "avg_score": 82.5, "time_spent_min": 120,
    "streak_days": 5, "last_active": "2026-03-06T10:30:00Z"
  }]
}
```

#### `POST /v1/quizzes/{id}/submit`
Auth: Bearer JWT (student)
```json
// Request
{ "answers": { "q1-uuid": "option_b", "q2-uuid": ["opt_a","opt_c"] }, "time_spent_sec": 180 }
// Response 200
{
  "score": 80.0, "correct": 4, "total": 5,
  "feedback": [
    { "question_id": "q1-uuid", "correct": true },
    { "question_id": "q2-uuid", "correct": false, "correct_answer": "opt_b", "explanation": "...", "sign_url": "..." }
  ],
  "xp_earned": 50,
  "badges_earned": [{ "code": "quiz_master", "name": "Quiz Master" }]
}
```

---

### Audit Endpoints

#### `POST /v1/audit`
Auth: Bearer JWT or X-API-Key (developer)
```json
// Request
{ "source": "github", "repo_url": "https://github.com/user/repo", "branch": "main" }
// OR
{ "source": "code", "code": "<div><h1>Welcome</h1></div>", "framework": "react" }
// Response 202
{ "job_id": "uuid", "status": "pending", "estimated_sec": 60 }
```

#### `GET /v1/audit/{job_id}`
Auth: Bearer JWT or X-API-Key
```json
// Response 200
{
  "status": "completed",
  "score": 72,
  "breakdown": { "isl_coverage": 60, "wcag_22": 85, "cognitive_load": 70, "visual_contrast": 73 },
  "issues": [{
    "id": "uuid", "severity": "high", "category": "isl_missing",
    "file_path": "src/components/Header.tsx", "line_number": 42, "column_number": 12,
    "description": "User-facing text 'Welcome back' lacks ISL annotation",
    "suggestion": "Wrap with <ISLAvatar text=\"Welcome back\" />",
    "fix_code": "<ISLAvatar text=\"Welcome back\" style=\"inline\" />",
    "auto_fixable": true
  }],
  "total_issues": 15,
  "certificate_eligible": false
}
```

#### `POST /v1/audit/{job_id}/fix`
Auth: Bearer JWT (developer)
```json
// Request
{ "issue_ids": ["uuid1", "uuid2"], "create_pr": true, "pr_title": "Add ISL accessibility" }
// Response 200
{ "pr_url": "https://github.com/user/repo/pull/42", "fixes_applied": 12, "fixes_skipped": 0 }
```

---

### Developer Endpoints

#### `POST /v1/api-keys`
Auth: Bearer JWT (developer role)
```json
// Request
{ "name": "Production Key", "scopes": ["translate", "dictionary", "recognize"] }
// Response 201 (key shown ONCE)
{ "api_key": "sf_live_a1b2c3d4e5f6g7h8i9j0...", "key_id": "uuid", "prefix": "sf_live_a1b2" }
```

#### `GET /v1/api-keys`
Auth: Bearer JWT
```json
// Response 200
{ "keys": [{ "id": "uuid", "name": "Production", "prefix": "sf_live_a1b2", "scopes": [...], "last_used": "...", "created_at": "..." }] }
```

#### `DELETE /v1/api-keys/{id}`
Auth: Bearer JWT
```json
// Response 200
{ "message": "API key revoked" }
```

#### `GET /v1/usage?period=30d`
Auth: Bearer JWT or X-API-Key
```json
// Response 200
{
  "period": "30d",
  "total_requests": 12500,
  "by_endpoint": { "/v1/translate": 8000, "/v1/signs/search": 4500 },
  "by_day": [{ "date": "2026-03-01", "requests": 420 }, ...],
  "avg_latency_ms": 230,
  "error_rate": 0.02,
  "quota": { "plan": "starter", "limit": 50000, "used": 12500, "remaining": 37500, "resets_at": "2026-04-01" }
}
```

---

### Feedback & Admin Endpoints

#### `POST /v1/feedback`
Auth: Bearer JWT
```json
// Request
{ "type": "translation_correction", "original_text": "brave", "original_gloss": "BRAVE", "corrected_gloss": "COURAGE HAVE", "notes": "ISL uses COURAGE HAVE" }
// Response 201
{ "feedback_id": "uuid", "status": "pending" }
```

#### `GET /v1/admin/users?search=aarav&role=student&page=1`
Auth: Bearer JWT (super_admin | institution_admin)
```json
// Response 200
{ "users": [UserObject, ...], "total": 1234, "page": 1 }
```

#### `POST /v1/admin/model/retrain`
Auth: Bearer JWT (super_admin)
```json
// Request
{ "batch_ids": ["uuid1", "uuid2"], "model_type": "translation" }
// Response 202
{ "job_id": "uuid", "status": "queued", "estimated_min": 45 }
```

---

### Webhook Events

All webhooks signed with `X-SignForge-Signature: sha256=HMAC(payload, secret)`

| Event | Trigger | Payload |
|-------|---------|---------|
| `translation.complete` | Async MP4 ready | `{ translation_id, mp4_url, duration_sec }` |
| `recognition.complete` | Video transcript ready | `{ job_id, transcript, full_text }` |
| `audit.complete` | Audit finished | `{ job_id, score, issue_count }` |
| `model.updated` | New model promoted | `{ model_type, version, bleu_score }` |
| `quota.warning` | 80% quota used | `{ plan, used, limit, pct }` |
| `quota.exceeded` | 100% quota used | `{ plan, used, limit }` |
## Phase 7 — UI/UX Design System

### Visual Style: Modern Accessible Dashboard

The design language is **clean, high-contrast, ISL-first**. The avatar is always the focal point — never hidden behind a toggle. The aesthetic draws from modern SaaS dashboards (Linear, Vercel) but prioritized for deaf user needs: high contrast, large type, motion-conscious animations, and dark mode default.

### Color Palette

#### Brand Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--brand-primary` | `#2563EB` (Blue 600) | `#3B82F6` (Blue 500) | Primary CTAs, active nav, links |
| `--brand-primary-hover` | `#1D4ED8` (Blue 700) | `#60A5FA` (Blue 400) | Hover states |
| `--brand-primary-subtle` | `#DBEAFE` (Blue 100) | `#1E3A5F` | Badges, selected backgrounds |
| `--brand-secondary` | `#7C3AED` (Violet 600) | `#8B5CF6` (Violet 500) | ISL-specific features, avatar UI |
| `--brand-accent` | `#F59E0B` (Amber 500) | `#FBBF24` (Amber 400) | Badges, streaks, gamification |

#### Semantic Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--success` | `#10B981` | `#34D399` | Correct answers, high confidence, healthy status |
| `--warning` | `#F59E0B` | `#FBBF24` | Low confidence, quota warning, due soon |
| `--error` | `#EF4444` | `#F87171` | Errors, critical audit issues, failed deliveries |
| `--info` | `#06B6D4` | `#22D3EE` | Tips, info badges, onboarding hints |

#### Neutral Scale

| Token | Light | Dark |
|-------|-------|------|
| `--bg-canvas` | `#FFFFFF` | `#0B1120` |
| `--bg-primary` | `#FFFFFF` | `#111827` |
| `--bg-secondary` | `#F8FAFC` | `#1E293B` |
| `--bg-tertiary` | `#F1F5F9` | `#334155` |
| `--bg-elevated` | `#FFFFFF` | `#1E293B` |
| `--text-primary` | `#0F172A` | `#F1F5F9` |
| `--text-secondary` | `#475569` | `#94A3B8` |
| `--text-muted` | `#94A3B8` | `#64748B` |
| `--text-inverse` | `#FFFFFF` | `#0F172A` |
| `--border-default` | `#E2E8F0` | `#334155` |
| `--border-strong` | `#CBD5E1` | `#475569` |
| `--border-focus` | `#2563EB` | `#3B82F6` |

### Typography

**Primary Font:** Inter (Variable, loaded via Google Fonts or self-hosted WOFF2)
**Hindi Font:** Noto Sans Devanagari (Variable)
**Monospace:** JetBrains Mono (developer dashboard, code blocks)

| Token | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| `--text-display` | 48px / 3rem | 800 | 1.1 | -0.02em |
| `--text-h1` | 36px / 2.25rem | 700 | 1.2 | -0.01em |
| `--text-h2` | 30px / 1.875rem | 600 | 1.25 | -0.005em |
| `--text-h3` | 24px / 1.5rem | 600 | 1.3 | 0 |
| `--text-h4` | 20px / 1.25rem | 600 | 1.4 | 0 |
| `--text-body-lg` | 18px / 1.125rem | 400 | 1.6 | 0 |
| `--text-body` | 16px / 1rem | 400 | 1.6 | 0 |
| `--text-body-sm` | 14px / 0.875rem | 400 | 1.5 | 0 |
| `--text-caption` | 12px / 0.75rem | 500 | 1.4 | 0.01em |
| `--text-code` | 14px / 0.875rem | 400 | 1.6 | 0 |

> Minimum body text: 16px. User-adjustable via accessibility panel (small=14px, medium=16px, large=18px, xlarge=20px).

### Spacing Scale (4px base, 8px primary)

| Token | Value | Common Use |
|-------|-------|-----------|
| `--space-0` | 0 | Reset |
| `--space-1` | 4px | Icon-text gap, tight padding |
| `--space-2` | 8px | Button internal, list item gap |
| `--space-3` | 12px | Card internal, form field gap |
| `--space-4` | 16px | Section padding, card gap |
| `--space-5` | 20px | Subsection spacing |
| `--space-6` | 24px | Card padding (large) |
| `--space-8` | 32px | Section separation |
| `--space-10` | 40px | Page section gap |
| `--space-12` | 48px | Major section gap |
| `--space-16` | 64px | Page top padding |
| `--space-20` | 80px | Hero section padding |

### Grid & Layout

| Property | Value |
|----------|-------|
| Max content width | 1280px |
| Grid columns | 12 (CSS Grid) |
| Column gap | 24px (desktop), 16px (mobile) |
| Page padding | 48px (desktop), 24px (tablet), 16px (mobile) |
| Sidebar width | 256px (expanded), 64px (collapsed) |
| Navbar height | 64px |
| Mobile bottom bar | 56px |

### Breakpoints

| Name | Width | Tailwind | Layout |
|------|-------|----------|--------|
| Mobile | 0-639px | default | 1 column, bottom tabs, stacked avatar |
| Tablet | 640-1023px | `sm:` | 2 columns, collapsible sidebar |
| Desktop | 1024-1279px | `lg:` | Full sidebar, multi-panel |
| Wide | 1280px+ | `xl:` | Max-width centered, 3-4 column grids |

### Component System

#### Buttons

| Variant | Background | Text | Border | Use Case |
|---------|-----------|------|--------|----------|
| Primary | `--brand-primary` | white | none | Main CTAs: Translate, Submit, Save |
| Secondary | transparent | `--brand-primary` | `--brand-primary` | Secondary actions: Cancel, Export |
| Ghost | transparent | `--text-secondary` | none | Tertiary: Close, Toggle |
| Danger | `--error` | white | none | Delete, Revoke |
| Success | `--success` | white | none | Approve, Deploy |

Sizes: `sm` (32px height), `md` (40px), `lg` (48px)
States: default, hover, active, disabled, loading (spinner)
Min touch target: 44x44px
Icon support: left, right, or icon-only

#### Form Inputs

| Variant | Description |
|---------|------------|
| Text Input | Border, label (floating or top), helper text, error state, char count |
| Textarea | Resizable, char/word count, auto-grow option |
| Select | Dropdown with search, multi-select variant |
| Search | Icon left, clear button right, instant results dropdown |
| File Upload | Drag-and-drop zone, progress bar, file type validation |
| Toggle | Accessible switch with label |
| Checkbox | Single + group |
| Radio | Single + group |
| Slider | Min/max labels, value display (for speed control) |

States: default, focus (blue ring), error (red ring + message), disabled (50% opacity)

#### Cards

| Type | Content | Used In |
|------|---------|---------|
| Story Card | Thumbnail, title (EN+HI), theme badge, difficulty chip, duration, play button | Story Browser |
| Sign Card | Gloss, English word, category badges, avatar thumbnail, bookmark button | Dictionary |
| Stat Card | Label, large number, trend arrow (up/down), sparkline chart | Dashboards |
| Issue Card | Severity badge, file path, description, auto-fix toggle | Audit Results |
| Assignment Card | Title, due date, status chip, progress bar | Student Dashboard |
| API Key Card | Name, prefix, scopes, last used, active toggle, actions (rotate/revoke) | Developer Dashboard |

#### Navigation

| Component | Details |
|-----------|---------|
| **Top Navbar** | Logo, search (global), theme toggle, locale switch, notification bell (badge count), user avatar dropdown |
| **Sidebar** | Collapsible (icon-only on collapse), sections with headers, active item highlight, role-based menu items |
| **Breadcrumbs** | Separator /, current page not linked, max 4 levels |
| **Mobile Bottom Tabs** | 5 tabs max: Home, Translate, Stories, Dictionary, Profile |
| **Tab Bar** | Horizontal pills or underlined, animated indicator |

#### Modals & Dialogs

| Type | Behavior |
|------|----------|
| Confirmation | "Are you sure?" + Confirm/Cancel, focus trap, ESC to close |
| Form Modal | Title, form fields, Submit/Cancel, validation on submit |
| Info Modal | Content + Close button |
| Full-Screen | Mobile: takes entire screen, Desktop: large centered |
| Sheet (mobile) | Bottom sheet, drag to dismiss |

#### Data Display

| Component | Features |
|-----------|---------|
| **Data Table** | Sortable columns, filterable, paginated (server-side), row selection, bulk actions, skeleton loading |
| **Stats Grid** | 2-4 column responsive grid of Stat Cards |
| **Charts** | Line (time series), Bar (comparison), Donut (distribution), using Recharts |
| **Progress Bar** | Linear (story/assignment), Circular (score), Stepped (onboarding) |
| **Empty State** | Illustration + title + description + CTA button |
| **Skeleton** | Matching layout of each content type, animated pulse |

#### Feedback & Notifications

| Component | Details |
|-----------|---------|
| **Toast** | Bottom-right stack, auto-dismiss 5s (errors persist), types: success/error/warning/info, action button optional |
| **Alert** | Inline banner, dismissable, icon + message + optional action link |
| **Badge** | Status (green/yellow/red/gray dot), count (number in circle), severity (colored chip) |
| **Tooltip** | Hover/focus triggered, max 280px wide, arrow pointing to trigger |
| **Popover** | Click triggered, rich content, close on outside click |

### Avatar Viewer Component

The most important component. Always prominently displayed.

| Mode | Layout | Controls |
|------|--------|----------|
| **Inline** | 400x300px embedded, below text input | Play, Pause, Speed |
| **Side-by-Side** | 50% screen width, next to text panel | Full controls |
| **Fullscreen** | 100vw x 100vh, text overlay at bottom | All controls + Chapter nav |
| **PiP** | 320x240px floating bottom-right, draggable | Play/Pause, Close |
| **Mini** | 120x90px, in dictionary sign card | Auto-play on hover, no controls |

Controls bar (always visible when playing):
`[Play/Pause] [Rewind] [Step Back] [Step Forward] [Speed: 0.5x 1x 1.5x 2x] [Loop] [Gender] [Fullscreen] [PiP]`

### Accessibility Requirements (WCAG 2.2 AA)

- Color contrast: 4.5:1 minimum for all text
- Focus indicators: 2px solid `--border-focus` ring on all interactive elements
- Skip-to-content link (first focusable element)
- ARIA landmarks: `banner`, `navigation`, `main`, `complementary`, `contentinfo`
- ARIA live regions for dynamic content (translation results, quiz feedback)
- Keyboard navigation: Tab order, Enter/Space to activate, Escape to close
- `prefers-reduced-motion`: disable all animations except essential (avatar signing)
- `prefers-color-scheme`: auto dark/light mode detection
- Font size adjustable (4 levels) via accessibility panel
- High contrast mode toggle (increases contrast to 7:1)

---

## Phase 8 — Figma Design Structure

### Page Organization (15 Pages)

```
SignForge (Figma Project)
|
+-- 00. Cover & Table of Contents
+-- 01. Design Tokens & Foundations
|     +-- Colors (Light + Dark, all tokens)
|     +-- Typography (scale, Hindi, mono)
|     +-- Spacing & Grid (8px system, 12-col)
|     +-- Shadows & Elevation (4 levels)
|     +-- Icons (Lucide set + custom ISL icons)
|     +-- Border Radius (sm/md/lg/xl/full)
|     +-- Motion (duration, easing tokens)
|
+-- 02. Component Library
|     +-- Buttons (6 variants x 3 sizes x 5 states)
|     +-- Inputs (8 types x 4 states)
|     +-- Cards (6 types x 3 states: default/hover/skeleton)
|     +-- Navigation (Navbar/Sidebar/Breadcrumbs/BottomTabs/Tabs)
|     +-- Avatar Viewer (5 modes x 3 genders x 4 states)
|     +-- Modals (4 types x 2 themes)
|     +-- Toasts (4 types)
|     +-- Badges (status/count/severity/role)
|     +-- Tables (sortable, filterable, paginated)
|     +-- Charts (line/bar/donut)
|     +-- Skeleton Screens (matching each content type)
|     +-- Webcam View (4 states: inactive/requesting/active/error)
|     +-- Code Block (with syntax highlighting + copy)
|     +-- Progress (linear/circular/stepped)
|     +-- Empty States (5 variants)
|     +-- Error States (6 variants)
|
+-- 03. Landing Page
|     +-- Hero (avatar demo, headline, dual CTA)
|     +-- Features Grid (6 module cards)
|     +-- How It Works (3-step animated flow)
|     +-- Live Demo (embedded translation widget)
|     +-- Social Proof (logos, stats, testimonials)
|     +-- Pricing (4 tiers with feature comparison)
|     +-- FAQ Accordion
|     +-- Footer
|     +-- Mobile (375px) variant
|     +-- Tablet (768px) variant
|
+-- 04. Authentication
|     +-- Sign Up (email + OAuth + role selection)
|     +-- Log In (email + OAuth)
|     +-- Forgot Password
|     +-- Reset Password
|     +-- Email Verification
|     +-- Onboarding Wizard (4 steps: role, preferences, first translation, done)
|
+-- 05. Communication Hub
|     +-- Text-to-ISL (input panel + avatar + controls)
|     +-- ISL-to-Text (webcam + output panel)
|     +-- Split-Screen Conversation (desktop)
|     +-- Split-Screen Conversation (mobile: tabbed)
|     +-- Conversation History List
|     +-- Conversation Detail + Export
|
+-- 06. ISL Dictionary
|     +-- Dictionary Home (search + browse + Word of the Day)
|     +-- Search Results Grid
|     +-- Sign Detail Page
|     +-- My Vocabulary Lists
|     +-- Flashcard Learning Mode
|     +-- Category Browse
|
+-- 07. Developer Dashboard
|     +-- Overview (usage stats, quick actions, getting started)
|     +-- API Key Management
|     +-- API Playground (request builder + response viewer)
|     +-- Documentation Viewer (OpenAPI)
|     +-- SDK Guides (tabbed: NPM/Python/REST)
|     +-- UI String Extractor
|     +-- Prompt-to-Prototype
|     +-- Performance Monitoring (charts)
|     +-- Webhook Management
|
+-- 08. Jataka Tales Library
|     +-- Story Browser (grid + sidebar filters)
|     +-- Immersive Story Player (desktop)
|     +-- Story Player (mobile)
|     +-- Vocabulary Spotlight Overlay
|     +-- Story Completion Screen
|
+-- 09. Education Portal
|     +-- Student Dashboard (assignments, scores, streaks)
|     +-- Educator Dashboard (classes, progress, actions)
|     +-- Class Management (roster, settings)
|     +-- Assignment Builder
|     +-- Quiz Interface (3 question types)
|     +-- Quiz Results & Feedback
|     +-- Progress Report (printable)
|     +-- Lesson Plan Creator
|     +-- Practice Studio (webcam + AI feedback)
|     +-- Parent Portal
|
+-- 10. Collaboration
|     +-- Document Editor (with ISL narration)
|     +-- Meeting Overlay Preview
|     +-- Whiteboard Canvas
|     +-- ISL Message Inbox
|     +-- Message Thread
|
+-- 11. Accessibility Auditor
|     +-- Audit Dashboard (recent scans, trends)
|     +-- New Scan Flow (connect repo / paste code)
|     +-- Results Page (score + issues list)
|     +-- Issue Detail (code highlight + suggestion)
|     +-- Auto-Fix Review
|     +-- Compliance Report Preview (PDF)
|
+-- 12. Admin Panel
|     +-- System Health Dashboard
|     +-- User Management Table
|     +-- Content Moderation Queue
|     +-- SiGML File Manager
|     +-- Analytics Dashboard (usage + ML + education)
|     +-- Annotation Queue
|     +-- Model Training Console
|
+-- 13. Settings
|     +-- Profile Settings
|     +-- Accessibility Preferences
|     +-- Notification Preferences
|     +-- Billing & Subscription
|     +-- Data Export / Account Deletion
|
+-- 14. States & Patterns
|     +-- Loading: Skeleton screens for each page type
|     +-- Empty: No stories, no classes, no API keys, no results
|     +-- Error: 404, 500, offline, permission denied, camera error, rate limit
|     +-- Success: Translation complete, quiz passed, badge earned
```

### Component Variants (Figma Properties)

| Component | Properties |
|-----------|-----------|
| Button | `variant`: primary/secondary/ghost/danger/success | `size`: sm/md/lg | `state`: default/hover/active/disabled/loading | `icon`: none/left/right/only |
| Input | `type`: text/textarea/search/select/file/toggle/checkbox/radio/slider | `state`: default/focus/error/disabled | `size`: sm/md/lg | `label`: visible/floating/hidden |
| Card | `type`: story/sign/stat/issue/assignment/apikey | `state`: default/hover/skeleton | `theme`: light/dark |
| AvatarViewer | `mode`: inline/sidebyside/fullscreen/pip/mini | `gender`: male/female/neutral | `state`: loading/idle/playing/paused/error |
| Badge | `type`: status/count/severity/role | `color`: blue/green/red/amber/purple/gray | `size`: sm/md |
| Nav | `type`: navbar/sidebar/breadcrumb/bottomtab/tab | `state`: default/collapsed | `theme`: light/dark |
| Toast | `type`: success/error/warning/info | `action`: none/button | `dismiss`: auto/manual |
| Modal | `type`: confirm/form/info/fullscreen | `theme`: light/dark |

### Design Tokens (Figma Variables)

```
Collections:
  Colors/
    Light Mode (default)
    Dark Mode
  Typography/
    Scale (display -> caption)
    Weights (400, 500, 600, 700, 800)
  Spacing/
    Scale (0 -> 20)
  Radius/
    sm(4) md(8) lg(12) xl(16) full(9999)
  Shadows/
    sm md lg xl
  Breakpoints/
    mobile(375) tablet(640) desktop(1024) wide(1280)
```

### Auto-Layout Rules

- **Every frame** uses auto-layout (no absolute positioning except avatar WebGL canvas)
- **Direction**: Vertical for page sections, horizontal for inline groups
- **Spacing**: Always a design token (never arbitrary values)
- **Padding**: Consistent per component type (cards: 16px, modals: 24px, pages: variable by breakpoint)
- **Fill**: components use "Fill container" width where appropriate
- **Min/Max widths**: Cards min 280px, max 400px; content max 65ch for reading

### Figma API / Plugin Instructions for Auto-Generation

To programmatically generate the Figma structure:

**Method 1: Figma Plugin (Recommended)**

```
1. Install "Design Tokens" plugin from Figma Community
2. Import the design tokens JSON (exported from Tailwind config):
   - Convert tailwind.config.ts colors/spacing/radius to Figma Variables format
   - Map to Light/Dark modes in Figma Variables collections

3. Install "Iconify" plugin
   - Import Lucide icon set (matches our frontend icon library)

4. Use "Auto Component" plugin to generate component variants:
   - Create base Button component
   - Define properties: variant, size, state, icon
   - Plugin generates all permutations as variants

5. Use "Content Reel" plugin for placeholder content:
   - Import Jataka Tale titles and thumbnails
   - Import ISL sign names for dictionary cards
```

**Method 2: Figma REST API (Programmatic)**

```javascript
// Script to create Figma project structure via API
// Requires Figma Personal Access Token

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY;

// 1. Create pages
const pages = [
  "00. Cover", "01. Design Tokens", "02. Components",
  "03. Landing", "04. Auth", "05. Communication Hub",
  "06. Dictionary", "07. Developer Dashboard", "08. Stories",
  "09. Education", "10. Collaboration", "11. Auditor",
  "12. Admin", "13. Settings", "14. States"
];

// 2. For each page, create frames at breakpoints
const breakpoints = { mobile: 375, tablet: 768, desktop: 1440 };

// 3. Create component sets with variants
// Use POST https://api.figma.com/v1/files/{file_key}/components
// with componentProperties for variant definitions

// 4. Apply design tokens as Figma Variables
// Use POST https://api.figma.com/v1/files/{file_key}/variables
// Map each token to a variable with light/dark mode values

// 5. Create frames with auto-layout
// Use POST https://api.figma.com/v1/files/{file_key}/nodes
// Set layoutMode: "VERTICAL", itemSpacing, padding
```

**Method 3: Tokens Studio Plugin**

```
1. Install "Tokens Studio for Figma" plugin
2. Create tokens.json matching our design system:
   {
     "colors": { "brand-primary": { "light": "#2563EB", "dark": "#3B82F6" } },
     "typography": { "body": { "fontSize": "16", "lineHeight": "1.6" } },
     "spacing": { "4": "16px", "6": "24px" }
   }
3. Sync tokens to Figma Variables (plugin handles mode mapping)
4. Apply tokens to components -> all instances update automatically
5. Export tokens as CSS custom properties for development handoff
```
## Phase 9 — Repository Structure

```
signforge/
|
+-- .github/
|   +-- workflows/
|   |   +-- ci.yml                     # Lint + type-check + unit tests (every push)
|   |   +-- integration.yml            # Integration tests (PRs to main)
|   |   +-- build.yml                  # Docker build + push to ECR
|   |   +-- deploy-staging.yml         # Auto-deploy to staging on merge
|   |   +-- deploy-production.yml      # Manual approval -> production deploy
|   |   +-- security-scan.yml          # Dependabot + Snyk weekly scan
|   +-- PULL_REQUEST_TEMPLATE.md
|   +-- ISSUE_TEMPLATE/
|   |   +-- bug_report.yml
|   |   +-- feature_request.yml
|
+-- apps/                              # Deployable applications
|   |
|   +-- web/                           # React Frontend (SPA)
|   |   +-- public/
|   |   |   +-- favicon.ico
|   |   |   +-- manifest.json          # PWA manifest
|   |   |   +-- sw.js                  # Service worker (generated)
|   |   +-- src/
|   |   |   +-- app/                   # App shell, providers, router
|   |   |   |   +-- App.tsx
|   |   |   |   +-- Router.tsx
|   |   |   |   +-- Providers.tsx      # Auth, Theme, i18n, Query providers
|   |   |   +-- assets/               # Images, custom icons, fonts
|   |   |   +-- components/           # Shared UI (auto-imported from packages/ui)
|   |   |   +-- features/             # Feature modules (co-located components+hooks+api)
|   |   |   |   +-- auth/
|   |   |   |   |   +-- components/   # LoginForm, RegisterForm, OnboardingWizard
|   |   |   |   |   +-- hooks/        # useAuth, useOAuth
|   |   |   |   |   +-- api/          # auth API calls
|   |   |   |   |   +-- store.ts      # auth Zustand store
|   |   |   |   +-- communication/    # Text-to-ISL, Webcam, Conversation
|   |   |   |   |   +-- components/   # TextInputPanel, AvatarViewer, WebcamCapture, ConversationMode
|   |   |   |   |   +-- hooks/        # useTranslation, useRecognition, useConversation
|   |   |   |   |   +-- api/
|   |   |   |   +-- dictionary/       # Search, SignDetail, VocabLists, Flashcards
|   |   |   |   +-- stories/          # StoryBrowser, StoryPlayer, VocabSpotlight
|   |   |   |   +-- developer/        # APIKeys, Playground, Docs, StringExtractor
|   |   |   |   +-- education/        # ClassManagement, Assignments, Quizzes, Progress
|   |   |   |   +-- auditor/          # AuditDashboard, ScanResults, AutoFix
|   |   |   |   +-- collaboration/    # DocEditor, MeetingOverlay, Messaging
|   |   |   |   +-- admin/            # AdminDash, UserMgmt, ContentMod, Analytics, MLPipeline
|   |   |   |   +-- settings/         # Profile, Accessibility, Billing, DataExport
|   |   |   |   +-- gamification/     # Badges, Leaderboard, XPBar
|   |   |   +-- hooks/               # Global hooks (useTheme, useLocale, useBreakpoint)
|   |   |   +-- lib/                  # API client (Axios), helpers, constants
|   |   |   +-- stores/              # Zustand global stores (theme, user, notifications)
|   |   |   +-- i18n/                # i18next config, en.json, hi.json
|   |   |   +-- styles/              # global.css, tailwind imports
|   |   |   +-- types/               # Shared TypeScript types
|   |   |   +-- main.tsx             # Entry point
|   |   +-- index.html
|   |   +-- vite.config.ts
|   |   +-- tailwind.config.ts
|   |   +-- tsconfig.json
|   |   +-- Dockerfile
|   |   +-- .env.example
|   |
|   +-- api/                          # Flask API Gateway
|   |   +-- app/
|   |   |   +-- __init__.py           # Flask app factory
|   |   |   +-- config.py             # Config from env vars
|   |   |   +-- extensions.py         # SQLAlchemy, Redis, Mail, Celery init
|   |   |   +-- models/               # SQLAlchemy ORM models
|   |   |   |   +-- __init__.py
|   |   |   |   +-- user.py           # User, UserRole, OAuthAccount, Session
|   |   |   |   +-- sign.py           # Sign, SigmlFile, GlossMapping, SignCategory
|   |   |   |   +-- story.py          # Story, StoryChapter, StoryQuiz, QuizQuestion
|   |   |   |   +-- education.py      # Institution, Class, Assignment, Submission
|   |   |   |   +-- developer.py      # ApiKey, Webhook, Subscription, Plan
|   |   |   |   +-- audit.py          # AuditJob, AuditIssue
|   |   |   |   +-- annotation.py     # AnnotationBatch, Annotation, Feedback
|   |   |   |   +-- collaboration.py  # Document, ISLMessage
|   |   |   |   +-- gamification.py   # GamificationProfile, Badge, UserBadge
|   |   |   |   +-- analytics.py      # AnalyticsEvent
|   |   |   +-- routes/               # Flask Blueprints
|   |   |   |   +-- auth.py
|   |   |   |   +-- translate.py      # Proxies to translation service
|   |   |   |   +-- signs.py
|   |   |   |   +-- stories.py
|   |   |   |   +-- education.py
|   |   |   |   +-- developer.py
|   |   |   |   +-- audit.py
|   |   |   |   +-- admin.py
|   |   |   |   +-- feedback.py
|   |   |   |   +-- notifications.py
|   |   |   |   +-- billing.py
|   |   |   |   +-- gamification.py
|   |   |   +-- services/            # Business logic layer
|   |   |   |   +-- auth_service.py
|   |   |   |   +-- translation_service.py  # Calls FastAPI service
|   |   |   |   +-- quiz_service.py         # Auto-generation, adaptive difficulty
|   |   |   |   +-- audit_service.py        # Code analysis orchestration
|   |   |   |   +-- gamification_service.py # XP, badges, streak logic
|   |   |   |   +-- notification_service.py # Dispatch to channels
|   |   |   |   +-- billing_service.py      # Stripe/Razorpay integration
|   |   |   +-- middleware/           # Auth, rate limiting, CORS, request logging
|   |   |   +-- tasks/               # Celery task definitions
|   |   |   |   +-- video_generation.py
|   |   |   |   +-- model_training.py
|   |   |   |   +-- audit_runner.py
|   |   |   |   +-- webhook_delivery.py
|   |   |   |   +-- notification_dispatch.py
|   |   |   |   +-- report_generation.py
|   |   |   +-- utils/               # Helpers, validators, decorators
|   |   +-- migrations/              # Alembic
|   |   +-- tests/
|   |   |   +-- unit/
|   |   |   +-- integration/
|   |   +-- wsgi.py
|   |   +-- celery_worker.py
|   |   +-- Dockerfile
|   |   +-- requirements.txt
|   |   +-- .env.example
|
+-- services/                         # ML Microservices
|   |
|   +-- translation/                  # FastAPI Translation Service
|   |   +-- app/
|   |   |   +-- main.py              # FastAPI app + routes
|   |   |   +-- config.py
|   |   |   +-- models/              # PyTorch model definitions
|   |   |   |   +-- bilstm_encoder.py
|   |   |   |   +-- attention.py
|   |   |   |   +-- lstm_decoder.py
|   |   |   |   +-- seq2seq.py       # Full model composition
|   |   |   +-- pipeline/
|   |   |   |   +-- preprocessor.py  # Tokenize, lemmatize, normalize
|   |   |   |   +-- translator.py    # Model inference wrapper
|   |   |   |   +-- mapper.py        # Gloss -> SiGML file lookup
|   |   |   |   +-- fallback.py      # Stanford CoreNLP rule-based
|   |   |   |   +-- fingerspell.py   # Character-by-character ISL
|   |   |   |   +-- hindi_bridge.py  # Hindi -> English translation
|   |   |   |   +-- confidence.py    # Score calculation + routing
|   |   |   +-- cache.py             # Redis translation cache
|   |   +-- model_weights/           # .gitignored, downloaded at deploy
|   |   +-- tests/
|   |   +-- Dockerfile               # CUDA base image
|   |   +-- requirements.txt
|   |
|   +-- recognition/                  # FastAPI Gesture Recognition
|   |   +-- app/
|   |   |   +-- main.py
|   |   |   +-- websocket_handler.py # WebSocket endpoint
|   |   |   +-- models/
|   |   |   |   +-- lstm_classifier.py
|   |   |   |   +-- language_model.py  # 3-gram ISL LM
|   |   |   +-- pipeline/
|   |   |   |   +-- landmark_processor.py  # Normalize, sliding window
|   |   |   |   +-- recognizer.py          # Inference
|   |   |   |   +-- beam_search.py         # Width-5 beam search
|   |   |   |   +-- postprocessor.py       # Gloss -> English
|   |   +-- tests/
|   |   +-- Dockerfile
|   |   +-- requirements.txt
|   |
|   +-- nlp/                          # NLP Preprocessing Service
|   |   +-- app/
|   |   |   +-- main.py
|   |   |   +-- tokenizer.py
|   |   |   +-- lemmatizer.py
|   |   |   +-- lang_detect.py
|   |   |   +-- pos_tagger.py
|   |   +-- Dockerfile
|   |   +-- requirements.txt
|   |
|   +-- asr/                          # Speech-to-Text Service (Whisper)
|   |   +-- app/
|   |   |   +-- main.py
|   |   |   +-- transcriber.py
|   |   +-- Dockerfile
|   |   +-- requirements.txt
|
+-- packages/                         # Shared libraries
|   |
|   +-- sdk-js/                       # @signforge/sdk (NPM)
|   |   +-- src/
|   |   |   +-- client.ts            # API client
|   |   |   +-- components/
|   |   |   |   +-- ISLAvatar.tsx
|   |   |   |   +-- ISLInput.tsx
|   |   |   +-- hooks/
|   |   |   |   +-- useISLTranslation.ts
|   |   |   |   +-- useISLRecognition.ts
|   |   |   +-- provider.tsx          # <SignForgeProvider apiKey="..." />
|   |   |   +-- types.ts
|   |   |   +-- index.ts
|   |   +-- stories/                  # Storybook stories
|   |   +-- package.json
|   |   +-- tsup.config.ts           # Build config
|   |   +-- tsconfig.json
|   |
|   +-- sdk-python/                   # signforge (PyPI)
|   |   +-- signforge/
|   |   |   +-- __init__.py
|   |   |   +-- client.py
|   |   |   +-- async_client.py
|   |   |   +-- middleware/
|   |   |   |   +-- flask.py
|   |   |   |   +-- django.py
|   |   |   +-- types.py
|   |   +-- tests/
|   |   +-- pyproject.toml
|   |
|   +-- ui/                           # Shared React component library
|   |   +-- src/
|   |   |   +-- Button/
|   |   |   +-- Input/
|   |   |   +-- Card/
|   |   |   +-- Modal/
|   |   |   +-- Badge/
|   |   |   +-- Toast/
|   |   |   +-- DataTable/
|   |   |   +-- Chart/
|   |   |   +-- Skeleton/
|   |   |   +-- EmptyState/
|   |   |   +-- index.ts
|   |   +-- package.json
|   |
|   +-- config/                       # Shared configurations
|       +-- eslint/
|       +-- typescript/
|       +-- tailwind/
|
+-- ml/                               # ML Training & Research
|   +-- training/
|   |   +-- train_translation.py
|   |   +-- train_recognition.py
|   |   +-- evaluate.py              # BLEU, accuracy, Cohen's Kappa
|   |   +-- hyperparameter_search.py # Optuna
|   |   +-- export_model.py          # Export to ONNX/TorchScript
|   +-- data/
|   |   +-- preprocessing/
|   |   +-- augmentation/
|   |   +-- splits/
|   +-- notebooks/                   # Jupyter exploration
|   +-- configs/                     # YAML training configs
|   +-- requirements.txt
|
+-- extensions/                       # Browser Extensions
|   +-- meeting-overlay/
|       +-- manifest.json            # Chrome MV3 manifest
|       +-- src/
|       |   +-- content.ts           # Content script for video calls
|       |   +-- background.ts        # Service worker
|       |   +-- popup/               # Extension popup UI
|       +-- webpack.config.js
|
+-- infra/                            # Infrastructure as Code
|   +-- terraform/
|   |   +-- modules/
|   |   |   +-- networking/          # VPC, subnets, security groups
|   |   |   +-- eks/                 # EKS cluster + node groups
|   |   |   +-- rds/                 # PostgreSQL RDS
|   |   |   +-- elasticache/         # Redis cluster
|   |   |   +-- s3/                  # Buckets + policies
|   |   |   +-- cloudfront/          # CDN distribution
|   |   |   +-- ecr/                 # Container registry
|   |   |   +-- secrets/             # Secrets Manager
|   |   +-- environments/
|   |       +-- staging/
|   |       |   +-- main.tf
|   |       |   +-- variables.tf
|   |       |   +-- terraform.tfvars
|   |       +-- production/
|   +-- k8s/
|   |   +-- base/
|   |   |   +-- namespace.yml
|   |   |   +-- deployments/
|   |   |   |   +-- web.yml
|   |   |   |   +-- api.yml
|   |   |   |   +-- translation.yml
|   |   |   |   +-- recognition.yml
|   |   |   |   +-- nlp.yml
|   |   |   |   +-- asr.yml
|   |   |   |   +-- celery-worker.yml
|   |   |   |   +-- celery-beat.yml
|   |   |   +-- services/
|   |   |   +-- ingress.yml
|   |   |   +-- hpa.yml
|   |   |   +-- secrets.yml          # References AWS Secrets Manager
|   |   +-- overlays/
|   |       +-- staging/
|   |       +-- production/
|   +-- docker/
|       +-- nginx.conf
|       +-- docker-compose.yml       # Local development
|       +-- docker-compose.test.yml  # CI testing
|
+-- data/                             # Data assets (.gitignored, stored in S3)
|   +-- sigml/                       # 848+ SiGML animation files
|   +-- stories/                     # Jataka Tales JSON
|   +-- corpus/                      # English-ISL parallel pairs
|   +-- seeds/                       # Database seed scripts
|
+-- docs/                             # Project documentation
|   +-- architecture/                # ADRs (Architecture Decision Records)
|   +-- api/                         # API reference (generated from OpenAPI)
|   +-- deployment/                  # Runbooks
|   +-- onboarding/                  # Developer onboarding guide
|   +-- contributing.md
|
+-- scripts/                          # Utility scripts
|   +-- seed-database.py
|   +-- import-sigml.py
|   +-- import-stories.py
|   +-- generate-quiz.py
|   +-- export-corpus.py
|
+-- .env.example
+-- .gitignore
+-- docker-compose.yml               # -> infra/docker/docker-compose.yml
+-- package.json                     # Root workspace config (pnpm)
+-- pnpm-workspace.yaml
+-- turbo.json                       # Turborepo pipeline
+-- CLAUDE.md                        # Project conventions for AI assistants
+-- README.md
```

### Folder Purpose Summary

| Folder | Purpose |
|--------|---------|
| `apps/web` | React SPA frontend — the user-facing web application |
| `apps/api` | Flask API gateway — handles auth, routing, rate limiting, CRUD |
| `services/translation` | FastAPI ML service — BiLSTM inference, NLP, SiGML mapping |
| `services/recognition` | FastAPI ML service — gesture recognition via WebSocket |
| `services/nlp` | NLP preprocessing microservice (spaCy + CoreNLP) |
| `services/asr` | Whisper speech-to-text microservice |
| `packages/sdk-js` | NPM SDK published as @signforge/sdk |
| `packages/sdk-python` | Python SDK published on PyPI |
| `packages/ui` | Shared React component library (consumed by web + sdk-js) |
| `packages/config` | Shared ESLint, TypeScript, Tailwind configurations |
| `ml/` | Training scripts, notebooks, data pipelines (not deployed) |
| `extensions/` | Browser extension for ISL meeting overlay |
| `infra/` | Terraform modules, K8s manifests, Docker configs |
| `data/` | Data assets (gitignored, synced to S3) |
| `docs/` | Architecture docs, API reference, runbooks |
| `scripts/` | One-off utility scripts for data import, seeding |

---

## Phase 10 — Development Roadmap

### Phase 1: Project Setup (Weeks 1-2)

| Task | Output |
|------|--------|
| Initialize monorepo (pnpm + Turborepo) | Working build pipeline |
| Scaffold apps/web (Vite + React + TS + Tailwind) | Hello World frontend |
| Scaffold apps/api (Flask + SQLAlchemy + Alembic) | Hello World API |
| Docker Compose for local dev (PostgreSQL, Redis, Meilisearch, Nginx) | `docker compose up` works |
| CI pipeline (lint + type-check + test on push) | Green CI on first PR |
| Terraform base infrastructure (VPC, EKS, RDS, S3) | Staging cluster provisioned |
| Design system tokens in Tailwind config | Colors, typography, spacing configured |
| CLAUDE.md with project conventions | AI-ready project context |

### Phase 2: Core Infrastructure (Weeks 3-4)

| Task | Output |
|------|--------|
| Database migrations (all core tables) | Schema deployed to staging |
| Redis caching layer + rate limiter | Translation cache, session store, rate limiting |
| Meilisearch setup + sync pipeline | Dictionary and stories searchable |
| S3 bucket + CloudFront CDN | SiGML files served via CDN |
| Nginx reverse proxy config | TLS, CORS, load balancing |
| Structured logging (JSON format) | Consistent logs across services |
| Health check endpoints | `/health` on all services |

### Phase 3: Authentication (Weeks 5-6)

| Task | Output |
|------|--------|
| OAuth 2.0 + PKCE (Google, GitHub) | Social login working |
| Email/password registration + login | Full auth flow |
| JWT tokens (15-min access, 7-day refresh) | Token management |
| Role-based access control (7 roles) | Permission decorators |
| Frontend auth flow (login, register, onboarding wizard) | Auth pages |
| Protected routes + API middleware | Auth enforcement |

### Phase 4: Core Features (Weeks 7-16)

| Week | Feature | Output |
|------|---------|--------|
| 7-8 | **Translation Pipeline backend** | Flask->FastAPI->NLP->BiLSTM->Mapper->SiGML |
| 9-10 | **3D Avatar Renderer** | CWASA WebGL avatar plays SiGML in browser |
| 11-12 | **Communication Hub UI** | Text input + avatar + controls + dark mode |
| 13-14 | **Webcam Recognition** | MediaPipe client-side + LSTM inference + text output |
| 15-16 | **ISL Dictionary + Search** | 5K signs seeded, Meilisearch, sign detail pages |

### Phase 5: Advanced Features (Weeks 17-28)

| Week | Feature | Output |
|------|---------|--------|
| 17-18 | **Jataka Tales Library** | 50 stories, browser, immersive player |
| 19-20 | **Developer Dashboard** | API keys, playground, docs, rate limiting |
| 21-22 | **NPM + Python SDK** | Published packages with Storybook/docs |
| 23-24 | **Education Portal** | Classes, assignments, quiz engine |
| 25-26 | **Accessibility Auditor** | GitHub scan, scoring, auto-fix |
| 27-28 | **Conversation Mode + Vocab Learning** | Split-screen, flashcards, SM-2 |

### Phase 6: Testing & QA (Weeks 29-32)

| Task | Output |
|------|--------|
| Unit test coverage to 80%+ | pytest + vitest suites |
| Integration tests for all API flows | httpx test suite |
| E2E tests (Playwright) for 10 critical flows | Automated E2E |
| WCAG 2.2 AA audit (axe-core + manual) | Accessibility compliance |
| Security audit (OWASP Top 10) | Vulnerability fixes |
| Performance testing (k6, 500 concurrent) | Latency optimizations |
| ML model evaluation (BLEU >= 0.75) | Model performance report |

### Phase 7: Production Deployment (Weeks 33-36)

| Task | Output |
|------|--------|
| Production K8s cluster (multi-AZ) | Production infrastructure |
| GPU nodes provisioned (T4 x4) | ML inference in production |
| Monitoring dashboards (Grafana) | 4 dashboards live |
| Alerting rules (AlertManager) | 10+ alert rules |
| Landing page + onboarding flow | Public marketing page |
| Billing integration (Stripe/Razorpay) | Payment flow working |
| Load testing in production | 500 concurrent validated |
| Runbooks for operational scenarios | Documentation complete |
| Public launch | SignForge live |

---

## Phase 11 — Task Breakdown

(Full task breakdown was provided in the previous IMPLEMENTATION_PLAN.md — Epics 1-10 with Features, Tasks, and Subtasks. See that document for the complete 150+ task breakdown. The structure follows:)

```
Epic -> Feature -> Task -> Subtask

Example:
Epic 3: ISL Translation Engine
  Feature 3.2: BiLSTM Translation Model
    Task: Model architecture implementation
      Subtask: 2-layer BiLSTM encoder (512 hidden units, 256-dim embeddings)
      Subtask: Multi-head attention mechanism (8 heads)
      Subtask: LSTM decoder with teacher forcing
      Subtask: Beam search inference (width 5)
    Task: Training pipeline
      Subtask: Dataset loader for English-ISL parallel pairs
      Subtask: Training loop (cross-entropy + label smoothing)
      Subtask: MLflow experiment logging
      ...
```

Refer to `IMPLEMENTATION_PLAN.md` Section 10 for the complete task breakdown.
## Phase 12 — Development Strategy

### Development Order (Critical Path)

```
Week 1-2: Project Setup (monorepo, Docker, CI, Terraform)
    |
    v
Week 3-4: Core Infra (DB, Redis, Search, S3, CDN) ----+
    |                                                   |
    v                                                   v
Week 5-6: Auth System              Week 5-6: NLP Service + SiGML import [parallel]
    |                                   |
    v                                   v
Week 7-8: Translation Pipeline (Flask->FastAPI->BiLSTM->Mapper)
    |
    v
Week 9-10: CWASA Avatar Renderer (WebGL + playback controls)
    |
    +-------> Week 11-12: Communication Hub UI (text input + avatar + controls)
    |
    +-------> Week 13-14: Webcam Recognition (MediaPipe + LSTM) [parallel with Hub UI]
    |
    v
Week 15-16: Dictionary + Search (seed 5K signs, Meilisearch)
    |
    v
Week 17-28: Advanced features [parallelizable across team]
    |
    v
Week 29-32: Testing & QA
    |
    v
Week 33-36: Production launch
```

### Dependency Graph

```
[Infrastructure] -> [Auth] -> [All API routes]
[Infrastructure] -> [NLP Service] -> [Translation Service]
[Translation Service] -> [Avatar Renderer] -> [Communication Hub]
[Translation Service] -> [Developer Dashboard] -> [SDK packages]
[Translation Service] -> [Story Player] -> [Education Portal]
[MediaPipe] -> [Recognition Service] -> [Webcam Mode] -> [Conversation Mode]
[Auth + RBAC] -> [Admin Dashboard]
[Translation Service + GitHub API] -> [Accessibility Auditor]
[Celery + Redis] -> [Async jobs: video gen, model training, audits, webhooks]
[All features] -> [Testing] -> [Production]
```

### Risk Areas & Mitigations

| Risk | Prob | Impact | Mitigation |
|------|------|--------|------------|
| **BiLSTM BLEU < 0.75** | Medium | High | Stanford CoreNLP fallback; expand corpus with INCLUDE dataset; Optuna hyperparameter search; try fine-tuning mBERT as alternative; set intermediate milestone at 0.60 |
| **CWASA/WebGL fails on low-end devices** | Medium | Medium | Detect WebGL support at load; 2D SVG fallback avatar; pre-rendered MP4 via S3; progressive enhancement |
| **SiGML coverage gap (848 signs vs 5,000+ needed)** | High | Medium | Automatic fingerspelling for all unmapped vocabulary; prioritize top 2,000 most common English words; community contribution portal for sign additions |
| **GPU cost overruns** | Medium | Medium | Redis translation cache (80%+ hit rate goal); GPU auto-scale to zero when idle; INT8 model quantization (2-3x cheaper); batch inference where possible |
| **MediaPipe accuracy in real conditions** | Medium | High | Display confidence scores prominently; "sign again slowly" prompt on low confidence; limit initial recognition to isolated signs (easier); expand to continuous sentences in v2 |
| **Developer SDK adoption** | Medium | High | Generous free tier (1K calls); "Hello ISL in 10 min" tutorial; interactive playground; open-source core pipeline; conference demos |
| **Privacy backlash (webcam)** | Low | Very High | Client-side processing (MediaPipe runs in browser); NO video to server; landmarks only; explicit opt-in dialog; privacy audit before launch; clear in-app messaging |
| **Scope creep (6 modules is ambitious)** | High | High | Strict P0/P1/P2/P3 prioritization; ship Communication Hub + Developer Dashboard first; defer P2/P3 features to post-launch; weekly scope review |
| **Team bandwidth** | Medium | High | Parallelize where possible; use AI-assisted development (Claude Code, Cursor); outsource SiGML animation creation to ISL expert contractors |
| **Regulatory compliance** | Low | High | Engage DPDP Act consultant early; build privacy-by-design from day one; no PII in logs; data export/deletion flows in Phase 3 |

### Scaling Considerations

| Component | v1 Target | Scaling Strategy | v2 Target |
|-----------|----------|-----------------|----------|
| API Gateway | 500 concurrent | K8s HPA (2-8 pods), Nginx LB | 5,000 concurrent |
| Translation | 100 req/sec | HPA (2-20 pods), Redis cache (80% hit), GPU auto-scale | 1,000 req/sec |
| Database | 1,000 connections | PgBouncer pooling, read replicas, partition analytics_events | 5,000 connections |
| Search | 500 req/sec | Meilisearch scales vertically; RAM-based | 2,000 req/sec |
| CDN | Sub-100ms global | CloudFront with S3 origin, cache-control headers | Same |
| WebSocket | 200 concurrent | Recognition pods scale independently | 1,000 concurrent |
| Storage | 1TB | S3 lifecycle policies (archive old models), tiered storage | 10TB |

### Security Practices

| Layer | Practice |
|-------|---------|
| **Network** | VPC with private subnets for DB/Redis; public subnets for ingress only; security groups per service; WAF on CloudFront |
| **Authentication** | OAuth 2.0 + PKCE; JWT (15-min, RS256); refresh tokens (httpOnly, Secure, SameSite=Strict); bcrypt (cost factor 12) |
| **Authorization** | RBAC with permission decorators; row-level security (users see only their data); API key scopes |
| **Data** | TLS 1.3 in transit; AES-256 at rest (RDS, S3); client-side webcam processing; anonymized feedback before training |
| **Input** | Pydantic validation on all API inputs; parameterized SQL (SQLAlchemy); HTML sanitization (bleach); max input lengths |
| **Headers** | CSP (strict), X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy (camera self-only) |
| **Secrets** | AWS Secrets Manager; never in code/env files; rotated quarterly; API keys shown once, stored as bcrypt |
| **Dependencies** | Dependabot weekly scans; Snyk in CI; pin all versions; automated PR for security patches |
| **Monitoring** | Failed auth attempts logged; API key abuse detection (anomalous patterns); admin action audit trail |
| **Compliance** | DPDP Act 2023 (data minimization, consent, erasure); GDPR-compatible; WCAG 2.2 AA; annual pen test |

---

## Phase 13 — Production Plan

### Testing Strategy

#### Test Pyramid

```
            /   E2E   \         10% — Playwright (10 critical flows)
           / Integration\       30% — pytest + httpx (API flows, DB queries)
          /   Unit Tests  \     60% — vitest + pytest (functions, components, models)
         /___________________\
```

#### Coverage Targets

| Area | Tool | Target |
|------|------|--------|
| Frontend components | Vitest + React Testing Library | 80% |
| Frontend hooks | Vitest | 90% |
| API routes | pytest + httpx | 85% |
| Service layer | pytest | 90% |
| ML inference | pytest (mocked weights) | 70% |
| Database queries | pytest + testcontainers | 80% |
| SDK packages | vitest / pytest | 90% |

#### E2E Critical Flows (Playwright)

1. New user sign-up -> onboarding -> first translation (< 60s)
2. Developer: OAuth -> generate API key -> playground request -> response
3. Student: browse stories -> play story -> vocabulary spotlight -> quiz -> score
4. Educator: create class -> invite student -> assign story -> view progress
5. Conversation mode: type message -> avatar signs -> webcam sign -> text output
6. Dictionary: search sign -> view detail -> add to vocabulary -> flashcard
7. Auditor: connect repo -> scan -> view results -> auto-fix -> PR created
8. Admin: user management -> suspend user -> content moderation -> approve
9. Billing: select plan -> payment -> API limits updated
10. Settings: change theme -> accessibility preferences -> data export

#### ML-Specific Tests

- BLEU regression: new model must beat minimum threshold (0.60 v1, 0.75 target)
- Inference latency: < 500ms p95 on standard GPU
- Model loading: < 30s cold start
- Fallback trigger: verify CoreNLP activates on low confidence
- Fingerspelling: verify all unmapped words produce valid SiGML

### CI/CD Pipeline

```
[Every Push]
  GitHub Actions: ci.yml
  +-- pnpm install (cached)
  +-- Lint: ESLint (frontend) + Ruff (Python)
  +-- Type check: tsc --noEmit + mypy
  +-- Unit tests: vitest + pytest (parallel)
  +-- Duration: ~3 minutes

[Pull Request to main]
  GitHub Actions: integration.yml
  +-- All above
  +-- Docker build (validate Dockerfiles)
  +-- Integration tests (testcontainers: PostgreSQL + Redis)
  +-- Security scan (Snyk)
  +-- Preview deploy (Vercel for frontend)
  +-- Duration: ~8 minutes

[Merge to main]
  GitHub Actions: deploy-staging.yml
  +-- Docker build + tag + push to ECR
  +-- Run Alembic migrations on staging DB
  +-- kubectl apply to staging EKS cluster
  +-- Smoke tests (health checks + 5 critical API calls)
  +-- Slack notification
  +-- Duration: ~5 minutes

[Production Deploy (manual trigger)]
  GitHub Actions: deploy-production.yml
  +-- Require: 1 approval from team lead
  +-- Docker images already in ECR (from staging)
  +-- Run migrations on production DB
  +-- Canary deployment: 10% traffic for 15 minutes
  +-- Monitor: error rate < 1%, latency p95 < 500ms
  +-- If healthy: promote to 100%
  +-- If unhealthy: auto-rollback + Slack alert
  +-- Duration: ~20 minutes (including canary)
```

### Monitoring & Observability

#### Metrics (Prometheus)

| Category | Metrics |
|----------|---------|
| **API** | request_total, request_duration_seconds, request_size_bytes, response_size_bytes (by endpoint, method, status) |
| **ML** | inference_duration_seconds, model_confidence, fallback_rate, cache_hit_rate, batch_size |
| **Infrastructure** | cpu_usage, memory_usage, disk_usage, gpu_utilization, gpu_memory (per pod) |
| **Business** | active_users, translations_total, api_calls_total, stories_completed, quiz_score_avg |
| **Queue** | celery_queue_depth, celery_task_duration, celery_task_failures |

#### Grafana Dashboards (4)

1. **API Health**: Request volume, latency percentiles, error rate, top endpoints, status code distribution
2. **ML Performance**: Inference latency, BLEU score trend, confidence distribution, fallback rate, cache hit ratio
3. **Infrastructure**: K8s pod health, node resources, Redis stats, DB connections, queue depth
4. **Business**: DAU/MAU, translations/hour, stories completed, developer API usage, revenue

#### Alert Rules (AlertManager -> Slack + Email)

| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| High Error Rate | 5xx > 5% for 5min | Critical | Page on-call |
| Translation Latency | p95 > 1s for 10min | Warning | Investigate |
| Translation Latency | p95 > 2s for 5min | Critical | Scale pods |
| GPU OOM | GPU memory > 95% | Critical | Restart pod + increase memory |
| DB Connection Exhaustion | Pool > 80% | Warning | Scale PgBouncer |
| Redis Memory | > 80% max | Warning | Eviction policy review |
| Pod Restart Loop | > 3 restarts / 10min | Critical | Investigate crash |
| SSL Cert Expiry | < 14 days | Warning | Renew cert |
| BLEU Score Drop | > 0.05 from baseline | Critical | Rollback model |
| Disk Usage | > 85% | Warning | Expand volume |
| API Uptime | < 99.9% / 24h | Critical | Incident review |

### Logging Strategy

**Format**: Structured JSON, consistent across all services
```json
{
  "timestamp": "2026-03-06T10:30:00.123Z",
  "level": "info",
  "service": "translation",
  "request_id": "abc-123",
  "user_id": "user-uuid",
  "message": "Translation completed",
  "duration_ms": 342,
  "source_lang": "en",
  "gloss_count": 5,
  "confidence": 0.87,
  "cached": false
}
```

**Rules:**
- NEVER log: passwords, API keys (only prefix), tokens, PII, webcam data
- ALWAYS log: request_id (propagated across services), user_id, duration, error details
- **Retention**: 30 days hot (CloudWatch), 90 days warm, 1 year cold (S3 Glacier)
- **Aggregation**: CloudWatch Logs with Insights queries; optional ELK for advanced search

### Error Handling

| Layer | Strategy |
|-------|---------|
| **Frontend** | React ErrorBoundary (global) -> friendly error page with ISL avatar explaining error; API error interceptor in Axios; network offline banner; retry button |
| **API Gateway** | Centralized Flask error handler; structured error responses; request_id in every error; 5xx -> Sentry alert |
| **ML Service** | Inference timeout (5s) -> return CoreNLP fallback with warning; GPU OOM -> reduce batch dynamically; model load failure -> pod restart |
| **Celery Tasks** | Retry with exponential backoff (max 3 attempts); dead-letter queue for failed jobs; admin notification on persistent failure |
| **WebSocket** | Auto-reconnect with backoff (1s, 2s, 4s, max 30s); last-known state preserved; reconnect indicator in UI |
| **Database** | Connection retry (3 attempts); read replica fallback; circuit breaker on connection pool exhaustion |

### Performance Optimization

| Area | Technique | Target |
|------|-----------|--------|
| **Frontend bundle** | Code splitting (React.lazy), tree shaking, Tailwind purge, dynamic imports | < 200KB initial JS |
| **Fonts** | Self-hosted WOFF2, font-display: swap, subset for Hindi | < 100KB total |
| **Images** | WebP format, responsive srcset, lazy loading, CDN | < 50KB per image |
| **Avatar** | Prefetch SiGML for current translation; cache in IndexedDB; progressive loading | < 2s first sign |
| **API responses** | gzip/brotli compression; pagination; field selection (?fields=id,title) | < 100ms for cached |
| **Translation** | Redis cache (24h TTL, ~80% hit rate); batch inference; model quantization (INT8) | < 500ms p95 |
| **Database** | PgBouncer; optimized indexes; EXPLAIN ANALYZE on slow queries; materialized views for analytics | < 50ms p95 |
| **Search** | Meilisearch (RAM-based); pre-warmed results for popular queries | < 50ms |
| **CDN** | Cache-Control: max-age=31536000 for SiGML; stale-while-revalidate for API responses | Sub-100ms globally |

---

## Phase 14 — AI-Assisted Development Plan

### Recommended AI Tools

| Tool | Best For | Usage Pattern |
|------|----------|---------------|
| **Claude Code (CLI)** | Architecture decisions, complex refactoring, full-file generation, code review, debugging | Primary development assistant; use for multi-file changes, understanding codebase, writing tests |
| **Cursor** | Real-time code completion, inline editing, file-level changes | IDE for daily coding; Tab completion, Cmd+K for inline edits, chat for context-aware help |
| **GitHub Copilot** | Boilerplate code, repetitive patterns, test generation | Always-on in IDE; good for generating similar patterns across files |

### Module Build Order (Optimized for AI-Assisted Development)

The order below maximizes what AI tools can generate effectively, building foundational code that later modules reference:

#### Sprint 1-2: Scaffolding (Claude Code)

**Use Claude Code for:**
- Generate entire monorepo structure from CLAUDE.md spec
- Create all Docker Compose configs
- Write all CI/CD GitHub Actions workflows
- Generate Terraform modules for AWS infrastructure
- Create CLAUDE.md with project conventions

**Prompt strategy:**
```
"Create the complete monorepo scaffold for SignForge following the repository
structure in IMPLEMENTATION_PLAN.md. Include all package.json, tsconfig.json,
Dockerfile, requirements.txt files with correct dependencies."
```

#### Sprint 3-4: Database + Auth (Claude Code + Cursor)

**Claude Code for:**
- Generate complete SQLAlchemy models from the SQL schema
- Write Alembic migration files
- Generate Flask auth routes (OAuth, JWT, RBAC)
- Write seed scripts for signs, stories, categories

**Cursor for:**
- Daily coding of auth middleware
- JWT token utilities
- Redis session management

**Prompt strategy:**
```
"Generate SQLAlchemy models for all tables in the database schema.
Include relationships, indexes, and constraints. Use the models/ folder
structure with separate files per domain."
```

#### Sprint 5-8: Translation Pipeline (Claude Code)

**Claude Code for:**
- Generate FastAPI translation service scaffold
- Write NLP preprocessing pipeline (spaCy integration)
- Create ISL Mapper with gloss->SiGML lookup
- Generate fingerspelling fallback logic
- Write unit tests for the entire pipeline

**Cursor for:**
- PyTorch model architecture (BiLSTM + Attention) — code alongside ML docs
- Training loop implementation
- MLflow integration

**Manual work (not AI-suited):**
- Model hyperparameter tuning (Optuna, requires GPU experimentation)
- Training data preparation and annotation
- BLEU evaluation interpretation

#### Sprint 9-12: Frontend Core (Cursor + Claude Code)

**Cursor for:**
- React component development (avatar viewer, text input, webcam)
- Tailwind styling (Cursor excels at inline CSS-in-class patterns)
- Custom hooks (useTranslation, useRecognition, useAuth)
- State management (Zustand stores)

**Claude Code for:**
- Generate complete page layouts from Figma descriptions
- Create routing configuration
- Write component tests (React Testing Library)
- Generate i18n translation files (en.json, hi.json)

**Prompt strategy:**
```
"Create the ISLAvatarViewer React component with these props: sigmlUrls (string[]),
speed (number), gender ('male'|'female'|'neutral'), onComplete (callback).
Include playback controls, fullscreen, PiP. Use Three.js for WebGL rendering.
Follow the design system tokens from tailwind.config.ts."
```

#### Sprint 13-16: Developer Platform (Claude Code)

**Claude Code for:**
- Generate NPM SDK package (@signforge/sdk) with ISLAvatar, ISLInput, hooks
- Generate Python SDK (signforge) with sync/async clients, Flask/Django middleware
- Create Storybook stories for all SDK components
- Write API playground UI component
- Generate OpenAPI spec from FastAPI routes

**This is where AI shines most** — SDKs are well-structured, pattern-heavy code that AI generates excellently.

#### Sprint 17-20: Education + Auditor (Cursor + Claude Code)

**Cursor for:**
- Quiz UI components (3 question types)
- Educator dashboard components
- Progress charts (Recharts)

**Claude Code for:**
- Quiz auto-generation algorithm from story content
- Adaptive difficulty logic
- Accessibility auditor code analysis engine (AST parsing)
- GitHub API integration for repo scanning
- Auto-fix code generation

#### Sprint 21-24: Collaboration + Admin (Claude Code)

**Claude Code for:**
- Yjs CRDT document editor integration
- WebSocket real-time sync
- Admin dashboard with charts and tables
- Gamification engine (XP, badges, streaks)
- Browser extension scaffold (Chrome MV3)

### AI Coding Best Practices for This Project

1. **Always provide CLAUDE.md context**: Keep project conventions, folder structure, and design system tokens in CLAUDE.md so AI tools have consistent context.

2. **Generate in layers**:
   - First: types/interfaces (TypeScript types, Pydantic models)
   - Second: data layer (DB models, API clients)
   - Third: business logic (services, hooks)
   - Fourth: UI (components, pages)
   - Fifth: tests

3. **Use AI for boilerplate, review for logic**: AI excels at generating CRUD routes, form components, test scaffolds. Manually review business-critical logic (auth, billing, ML inference).

4. **Parallel generation**: Use Claude Code to generate multiple independent files simultaneously (e.g., all SQLAlchemy models, all Flask routes, all React feature modules).

5. **Test-driven with AI**: Write test descriptions first, then ask AI to implement both tests and code. Higher quality than code-first.

6. **Code review via AI**: Before merging any PR, ask Claude Code to review for security issues, performance problems, and adherence to project conventions.

### Estimated AI Acceleration

| Task Category | Without AI | With AI | Speedup |
|--------------|-----------|---------|---------|
| Scaffolding & config | 2 weeks | 2 days | 5x |
| Database models & migrations | 1 week | 1 day | 5x |
| API routes (CRUD) | 3 weeks | 4 days | 4x |
| React components | 4 weeks | 1.5 weeks | 2.5x |
| SDK packages | 2 weeks | 3 days | 4x |
| Tests | 3 weeks | 1 week | 3x |
| Documentation | 2 weeks | 2 days | 5x |
| ML model code | 2 weeks | 1.5 weeks | 1.3x |
| **Total estimate** | **36 weeks** | **16 weeks** | **2.25x** |

> ML model training, data annotation, and hyperparameter tuning are NOT significantly accelerated by AI coding tools. These remain human-intensive.

---

## Appendix: Quick Reference

### Key URLs (Production)

| URL | Purpose |
|-----|---------|
| `https://signforge.in` | Web application |
| `https://api.signforge.in/v1` | REST API |
| `wss://api.signforge.in/v1/recognize` | WebSocket recognition |
| `https://cdn.signforge.in` | CDN (SiGML, media) |
| `https://docs.signforge.in` | API documentation |
| `https://status.signforge.in` | Status page |
| `https://storybook.signforge.in` | SDK component demos |

### Dev Commands

```bash
# Local development
docker compose up -d                     # Start all services
cd apps/web && pnpm dev                  # Frontend dev server (Vite)
cd apps/api && flask run --debug         # API gateway
cd services/translation && uvicorn app.main:app --reload  # Translation service

# Testing
pnpm test                               # All frontend tests
cd apps/api && pytest                    # All backend tests
cd apps/web && pnpm playwright test      # E2E tests

# Database
cd apps/api && flask db upgrade          # Run migrations
cd apps/api && flask db migrate -m "..."  # Create migration

# ML
cd ml && python training/train_translation.py --config configs/bilstm_v1.yml
cd ml && python training/evaluate.py --model latest --dataset test

# Docker
docker compose build                     # Build all images
docker compose logs -f translation       # Watch translation service logs

# Deploy
git push origin main                     # Triggers staging deploy
gh workflow run deploy-production.yml     # Manual production deploy
```

### Team Size Recommendation

| Role | Count | Responsibility |
|------|-------|---------------|
| Frontend Engineer | 2 | React, Three.js/WebGL, MediaPipe, Tailwind |
| Backend Engineer | 2 | Flask, FastAPI, PostgreSQL, Redis, Celery |
| ML Engineer | 1 | PyTorch, model training, inference optimization |
| DevOps / SRE | 1 | K8s, AWS, Terraform, CI/CD, monitoring |
| UI/UX Designer | 1 | Figma, accessibility, design system |
| Product Manager | 1 | Prioritization, user research, stakeholders |
| **Total FTE** | **8** | |
| ISL Expert Consultants | 2-5 | Annotation, sign verification, cultural review (contract) |

---

*End of SignForge Production-Ready Software Blueprint*
*Version 2.0 | 14 Phases | March 2026*
