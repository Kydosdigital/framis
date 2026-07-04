# AI Engineer Academy Platform

_Started 2026-07-04 20:51 UTC_

---

## User

# Product Requirements Document
## AI Engineer Academy: Zero-to-Professional Developer Platform

**Version:** 1.0  
**Date:** July 2026  
**Status:** Ready for Development  
**Owner:** [Kydos Digital]

---

## 1. Executive Summary

**What:** An interactive, motion-guided web platform that teaches developers to go from zero to full-stack AI engineer in 12 months through project-based learning and human-centred curriculum design.

**Why:** Modern developers have access to powerful AI pair programmers (Claude, GitHub Copilot, etc.) but lack the judgment, verification, and architectural thinking to use them safely. Traditional coding bootcamps teach syntax; this teaches the thinking that matters when AI writes code.

**Who:** Self-taught developers, career changers, university graduates, and professionals wanting to pivot into AI engineering. Ages 18-45. ADHD-friendly design.

**Key differentiator:** Not another "learn to code" course. This is "learn to think like an engineer who builds with AI." Every concept is taught through interactive motion visualisations, real projects, and structured verification practices.

**Market opportunity:** £2-3bn global coding education market. Current gap: no platform teaches "how to use AI tools safely and build shipping systems around them." First-mover advantage in post-AI bootcamp market.

---

## 2. Problem Statement

### Current State

- **Too much theory, not enough practice.** Traditional courses (Udemy, Codecademy) teach syntax in isolation. They do not teach systems thinking, debugging, or how to verify code.
- **AI code assistance changes the game but no one teaches it.** Developers have Claude, Copilot, etc., but lack the judgment to evaluate generated code. They become prompt operators, not engineers.
- **Bootcamps are expensive and inflexible.** £10k-20k, 12-16 weeks, full-time. Not accessible to working adults.
- **Learning materials are text-heavy and boring.** Video + slides do not stick for kinetic/ADHD learners. No visual explanations of *why* systems work the way they do.
- **No portfolio-driven approach.** Most courses hand out certificates. This does not prove capability. Employers want GitHub repos and shipped projects.
- **Silent failure.** Learners build things that "look right" but have subtle bugs, security holes, or performance issues. They learn to pass quizzes, not to ship safely.

### Why It Matters

AI coding tools are here and accelerating. The bottleneck is not "can you write code faster" (tools handle that). The bottleneck is:

1. Knowing *what* to build
2. Evaluating whether AI-generated code is actually correct
3. Understanding systems deeply enough to design resilient architecture
4. Debugging production issues
5. Making trade-off decisions without a mentor

Developers who can do these things will be invaluable. Developers who just type prompts will be commoditised.

---

## 3. Goals and Success Metrics

### Primary Goals

1. **Ship a fully functional platform by Q4 2026** that covers 50% of the 12-month curriculum with motion graphics
2. **Acquire 100 active learners by end of 2026** with 60%+ weekly engagement
3. **Deliver measurable learning outcomes**: graduates can build, test, deploy full-stack AI applications
4. **Build a portfolio of 5-6 serious projects per learner** that are GitHub-public and hireable

### Success Metrics

**Engagement:**
- Weekly active learner rate: 60%+ (target 70%)
- Lesson completion rate: 75%+ within 2 weeks of assignment
- Project submission rate: 80%+ of assigned projects completed
- Time-to-value: 50% of users ship a deployed project within 4 weeks
- Session length: 45-90 minutes (sufficient for deep work)

**Learning Outcomes:**
- Post-curriculum self-assessment: 85%+ learners rate themselves "confident" in core skills
- Project quality: average code review score 7/10 or higher
- Bug density in capstone: <1 bug per 100 lines (industry standard is 1-5)
- Test coverage: 70%+ average across learner projects

**Retention & Graduation:**
- Monthly churn: <5% (excluding those who drop in week 1)
- 12-month graduation rate: 40%+ (realistic for self-paced, difficult curriculum)
- Job placement tracking: 50%+ of graduates employed/promoted within 6 months

**Network Effects:**
- Peer review participation: 80%+ of learners review 2+ peer projects
- Community posts: 20+ substantive discussions per week by month 3
- Referral rate: 30%+ of new learners come from graduate referrals

**Business Metrics:**
- CAC (customer acquisition cost): <£40
- LTV (lifetime value): £400+ over 12 months
- NRR (net revenue retention, if subscription): 100%+
- Freemium-to-paid conversion: 15%+

---

## 4. Target User

### Primary Persona: Alex

- **Age:** 24-35
- **Background:** Self-taught developer, bootcamp graduate, or university CS grad
- **Goal:** Move into AI engineering or become full-stack capable in 1 year
- **Pain points:**
  - Overwhelmed by "learn X, then Y, then Z" paralysis
  - Can build features but does not understand systems
  - Uses AI to code but does not trust the output
  - Lacks portfolio projects that are production-quality
  - Needs flexibility (part-time, 10-15 hrs/week)
- **Tech comfort:** Comfortable in terminal, can read code, knows one language somewhat
- **Learning style:** Prefers building over memorising; visual > text; ADHD-friendly pacing
- **Motivation:** Career growth, employability, shipping something real

### Secondary Persona: Jordan

- **Age:** 18-24
- **Background:** University student in non-CS discipline (maths, physics, economics)
- **Goal:** Transition into tech by building shipper projects
- **Pain points:**
  - University does not teach practical engineering
  - Bootcamps are expensive
  - Struggling to build something "real" without mentorship
- **Learning style:** Enjoys challenge; learns by doing; needs structure
- **Motivation:** Career pivot, learning AI + shipping, building public portfolio

### Secondary Persona: Casey

- **Age:** 35-50
- **Background:** Career changer (teacher, marketing, operations background)
- **Goal:** Become technical IC or founder of AI product
- **Pain points:**
  - Fundamentals are missing (no CS degree)
  - Intimidated by "everyone else knows this already"
  - Need to understand systems, not just syntax
  - Learning at own pace
- **Learning style:** Appreciates clear analogies; needs context ("why does this matter?")
- **Motivation:** Career transition, founder aspirations, respect from technical team

### User Constraints

- **Time:** 10-15 hours per week (cannot do full-time bootcamp)
- **Budget:** £30-60/month (subscription model) or £300-600 total (one-time)
- **Learning environment:** Prefers web-based, works on MacBook + monitor or iPad
- **Neurodiversity:** 20-30% will have ADHD or similar; design accordingly (short focused lessons, visual progress, celebration of wins)

---

## 5. Product Overview

### Core Offering

**"12-Month Zero-to-AI-Engineer Curriculum"** delivered through:

1. **Interactive lessons** (12 modules, 48 lessons total, 3-4 per module)
2. **Motion-guided concept explanations** (40+ visualisations showing how systems work)
3. **Project-based capstones** (5-6 real projects, all shipped and deployed)
4. **Code sandbox + deployment pipeline** (write, test, deploy within the platform)
5. **Peer code review + mentorship** (community + optional paid 1:1)
6. **Progress tracking + portfolio builder** (GitHub-ready portfolio page)

### What It Is NOT

- Not a video course (no passive watching)
- Not a quiz factory (quizzes are formative, not punitive)
- Not a certification program (portfolio > certificates)
- Not a "learn AI prompting" course (AI is a tool, not the curriculum)
- Not a replacement for mentorship (community + optional paid support)

---

## 6. Module Structure & Curriculum

### 12-Month Roadmap

**Phase 1: Computer & Programming Foundations (Weeks 1-8)**
- Module 1: Setup + Terminal Basics + Git
- Module 2: Python Syntax, Variables, Functions
- Module 3: Data Structures + Control Flow
- Module 4: File I/O + Errors + Debugging
- Capstone 1: Command-line expense tracker (deployed to GitHub)

**Phase 2: Web + Full-Stack Basics (Weeks 9-16)**
- Module 5: HTML, CSS, JavaScript Fundamentals
- Module 6: React Basics + Components
- Module 7: APIs + HTTP + JSON
- Module 8: Backend with Python + Postgres
- Capstone 2: Full-stack notes app with login (deployed to Vercel + Railway)

**Phase 3: Software Engineering Discipline (Weeks 17-24)**
- Module 9: Testing (unit, integration, end-to-end)
- Module 10: Debugging + Logging + Monitoring
- Module 11: Security Basics + Auth Patterns
- Module 12: CI/CD + Docker + Deployment
- Capstone 3: Full-stack app with tests, auth, and CI pipeline (GitHub Actions)

**Phase 4: AI Application Engineering (Weeks 25-32)**
- Module 13: LLM APIs + Tokens + Cost
- Module 14: Embeddings + RAG + Vector Search
- Module 15: Structured Outputs + Tool Calling
- Module 16: Evals + Safety + Guardrails
- Capstone 4: AI Q&A system with citations + evals (using Claude API)

**Phase 5: ML Fundamentals (Weeks 33-40)**
- Module 17: Probability + Statistics Intuition
- Module 18: Linear Algebra Basics
- Module 19: Transformers + Attention + Tokenisation
- Module 20: Fine-tuning Concepts + Dataset Quality
- Capstone 5: Train and deploy a small classifier (Hugging Face)

**Phase 6: Production AI Systems (Weeks 41-48)**
- Module 21: Agents + Workflows + Orchestration
- Module 22: Human-in-the-Loop + Guardrails
- Module 23: Observability + Cost Controls
- Module 24: AI Product Design + Edge Cases
- Capstone 6: Production-ready AI system (entire 12-week project)

---

## 7. Feature Specifications

### 7.1 Lesson Interface

**Lesson Layout (all lessons follow same template):**

```
[Header: "Variables - Storing Information"]
[Progress: Week 3 of 48 (6%) | Time estimate: 25 mins]

[Concept Explanation in Plain English]
"A variable is like a labelled box. When you write:
  name = "Alex"
You are writing "Alex" on a sticky note and putting it in a box
labelled "name"."

[Motion Visualisation]
[Interactive animation showing:
  - Text "Alex" appearing
  - Arrow pointing to box
  - Box labelled "name" filling with value
  - Later: name being retrieved, used in print statement]

[Real-World Example]
"In a restaurant app, you might store:
  user_name = "Sarah"
  order_total = 42.50"

[Code Example with Annotations]
```python
# Create a variable (put something in a box)
name = "Alex"
print(name)  # Use the variable (take it out of the box)
```

[Try It Yourself - Code Sandbox]
[Embedded editor where learner types code, runs it, sees output]

[Check Your Understanding - Mini Quiz]
"What does this do?
  x = 5
  y = x + 3
  a) x changes to 8
  b) y becomes 8
  c) both stay the same"

[Build Something Small]
"Write a program that asks for someone's name and age,
stores them in variables, then prints: 'Hi [name], you are [age]!'"

[Key Takeaway Card]
"Variables store values you'll use later. Give them clear names
so you remember what they do."

[Next Lesson Preview]
"Next up: Functions - how to write reusable recipes"
```

**Lesson Features:**
- Est. reading time: 5-8 minutes (if read passively)
- Est. practice time: 15-20 minutes (typical hands-on lesson)
- One concept per lesson (avoid cognitive overload)
- "Explain Again Simpler" button (re-explain in different words)
- Keyboard shortcuts for power users (Alt+R = Run, Alt+N = Next)
- Dark mode + light mode + high contrast
- Readable on phone, tablet, desktop

### 7.2 Motion Graphics & Visualisations

**Key Interactive Animations (40+ total across curriculum):**

1. **Variables** - value being stored and retrieved from a box
2. **Functions** - inputs flowing through a process, outputs emerging
3. **Data Structures** - array/dict/set visualisations filling and being queried
4. **Loops** - counter incrementing, iterations happening, exit condition reached
5. **Conditionals** - branches in a flowchart, path being taken based on condition
6. **APIs** - HTTP request leaving app, server processing, response returning
7. **Databases** - data being written to tables, queries retrieving rows
8. **Authentication** - bouncer checking credentials, door unlocking
9. **React Components** - component tree rendering, state changes flowing down
10. **Embeddings** - words/documents plotted in space, similar items clustering
11. **RAG** - document being chunked, embedded, retrieved, fed into LLM
12. **Agents** - agent deciding which tool to use, executing, getting feedback loop
13. **Tokens** - text breaking into tokens, tokens filling a context window
14. **Fine-tuning** - model weights being updated based on examples

**Animation Technical Specs:**
- Tech stack: Framer Motion + React
- Duration: 2-5 seconds per animation (not distracting)
- Loopable: learner can rewatch by clicking
- No autoplay: animations start on user interaction (no seizure risk)
- Accessible: animations have text fallbacks + alt text
- Performance: 60 FPS on MacBook Air M2 + iPad (low-end devices supported with graceful degradation)

### 7.3 Code Sandbox

**Integrated IDE (not external):**

- **Left pane:** Code editor (syntax highlighting, Python/JS/TypeScript)
- **Right pane:** Output (console logs, errors, rendered results)
- **Top buttons:** Run | Save | Reset | Share | Copy
- **Linting:** Real-time error warnings (red squiggles)
- **Features:**
  - Pre-filled starter code for each lesson
  - Autocomplete (opt-in, not distracting)
  - Line numbers + bracket matching
  - Fullscreen mode for complex projects
  - Ability to save snippets to personal library
  - Integration with Replit or custom backend (Python execution)

### 7.4 Project Capstones

**Project Assignment Format:**

```
[Project: "Full-Stack Notes App with Login"]
[Difficulty: Intermediate | Duration: 2-3 weeks | Solo/Pair: Solo]

[Context]
"You are building an MVP for a notes app where users can:
- Sign up and log in
- Create, read, update, delete notes
- See only their own notes
All data is private."

[Requirements]
- Frontend: React, login form, notes list, new note form
- Backend: Python FastAPI + SQLite
- Features: auth, database, error handling
- Testing: 70%+ code coverage
- Deployment: Vercel (frontend) + Railway (backend)

[Acceptance Criteria]
- [x] User can create account with email + password
- [x] User can log in and see personal notes
- [x] User can create/edit/delete notes
- [x] Logging out clears auth token
- [x] Backend tests cover main flows
- [x] No hardcoded secrets in code
- [x] Deployed and working

[Hints (progressively revealed)]
[Hint 1] "Start with the database schema: users table, notes table"
[Hint 2] "Use bcrypt to hash passwords"
[Hint 3] "Add JWT token to each request"

[Starter Code]
[Boilerplate provided: folder structure, .env template, basic backend]

[Resources]
- Link to SQL lesson review
- Link to auth best practices doc
- Link to Vercel deployment guide
- Link to Railway deployment guide
- Example code snippets (not full solution)

[Submission]
- GitHub repo link (must be public)
- Deployed URL
- README with setup instructions
- Brief demo video (2-3 mins, optional but encouraged)

[Evaluation]
Peer review scorecard:
- [ ] Meets all acceptance criteria (40%)
- [ ] Code is readable and well-structured (20%)
- [ ] Has 70%+ test coverage (20%)
- [ ] Deployment works without errors (10%)
- [ ] README is clear for someone new (10%)

[Learning Outcomes]
After this project, you will:
- Understand how login actually works
- Know how to securely store passwords
- Be comfortable with full-stack deployment
- Have a portfolio piece you can show employers
```

### 7.5 Code Review & Peer Learning

**Peer Code Review System:**

- **Assigned reviews:** Every learner submits projects; system assigns 2 peer reviewers
- **Guided rubric:** Reviewers follow a checklist (prevents vague feedback)
- **Anonymised:** Reviewers do not see reviewer names (prevents popularity bias)
- **Async:** 3-day window to review (fits flexible schedules)
- **Incentive:** Learners who give thorough reviews earn badges/points
- **Quality gate:** If review score is <4/10, instructor spot-checks
- **Feedback template:**
  - [ ] What worked well (1-2 things)
  - [ ] One thing that could improve
  - [ ] One question I had
  - [ ] One thing I learned from reading this code

**Mentorship Option (Paid):**
- Optional 1:1 mentorship: £25-50/month for async code review + async advice
- Mentor is a senior engineer/AI engineer who reviews capstones within 48 hours
- Max 5-10 learners per mentor (quality over scale)

### 7.6 Progress Tracking & Portfolio

**Progress Dashboard:**

```
[Overall Progress: Week 18 of 48 (38%) | Estimated completion: Nov 2026]

[Current Module: "Testing - Unit Tests"]
[Modules Completed: 1-8 (Phase 2 complete)]
[Projects Submitted: 2/6 (Capstone 1, 2)]
[Projects Passed: 2/6]

[Streak: 12 days | Longest streak: 28 days]
[Badges Earned: "Git Master", "Debugger", "Peer Reviewer Star"]

[Schedule]
This week:
- [ ] Lesson: Testing Basics (25 mins, due tomorrow)
- [ ] Lesson: Mocking & Fixtures (30 mins, due tomorrow)
- [ ] Sandbox: Write unit tests for expense tracker (1 hour)
- [ ] Capstone: Start Project 3 (2-3 weeks)

[Time Spent This Week: 6.5 hrs of 10-15 target]

[Performance]
- Lesson completion rate: 94%
- Average quiz score: 82%
- Code review quality: 4.2/5 average
- Capstone pass rate: 100%
```

**Public Portfolio Page:**

Each learner gets a portfolio page at `academy.ai/portfolio/username` showing:
- Bio + learning journey
- 5-6 shipped projects (with links, tech stack, brief description)
- GitHub stats (if public)
- Testimonials from peer reviewers
- "Hire me" CTA
- Link to LinkedIn

Example:
```
[Alex's AI Engineering Portfolio]

[Bio]
"Full-stack developer + AI engineer. Spent 12 months learning to build
production systems with AI. Shipped 6 projects, all in production.
Comfortable with Python, React, databases, testing, and LLM integrations."

[Projects]
1. Expense Tracker (Python + Click) [Link to repo] [Deployed URL]
2. Notes App (React + FastAPI + Postgres) [Link to repo] [Live app]
3. AI Q&A System (Next.js + Claude API + RAG) [Link to repo] [Live app]
4. Job Application Tracker (Full-stack with tests) [Link to repo]
5. Sentiment Classifier (PyTorch + Hugging Face) [Link to repo] [Model card]
6. AI Research Assistant (Production system with guardrails) [Link to repo]

[Skills Verified]
- Full-stack development
- Testing & CI/CD
- AI application engineering
- System design
- Debugging & production ops

[Testimonials]
"Alex's code is clean, well-tested, and production-ready. Impressive
attention to detail around error handling." - Jordan (peer reviewer)

[Let's connect]
[GitHub] [LinkedIn] [Email]
```

---

## 8. User Flows

### 8.1 First-Time User Flow (Week 0)

1. **Landing page** - "Learn to build systems with AI" (CTA: Start Free)
2. **Sign-up** - Email + password + basic profile (name, current level)
3. **Assessment quiz** - 5 quick questions to gauge current knowledge
4. **Personalised onboarding** - Message: "You seem comfortable with basics. We'll start at Module 2." (or Module 1 if true beginner)
5. **Setup check** - "Install these tools: Python, VS Code, Git" (with links)
6. **First lesson** - Week 1 Lesson 1: "Setting Up Your Computer"
7. **Success moment** - "Run your first Python program!" (satisfying output)

### 8.2 Weekly Engagement Flow

1. **Monday morning:**
   - User gets email: "This week's curriculum is ready"
   - Dashboard shows: "3 lessons (1.5 hrs) + 1 project"

2. **Tuesday-Thursday:**
   - User completes 1-2 lessons per session
   - Tries code sandbox exercises
   - Earns points/badges

3. **Friday:**
   - User starts capstone project
   - Peers are assigned to review their previous project
   - User reviews 2 peer projects (gets feedback on their approach)

4. **Weekend:**
   - User works on capstone (optional)
   - Reviews peer feedback on project
   - Updates portfolio with completed project

5. **Monday:**
   - Submit capstone or progress update
   - Cycle repeats

### 8.3 Project Submission Flow

1. **User clicks "Submit Project"**
2. **Checks submission checklist:**
   - [ ] GitHub repo is public
   - [ ] README exists with setup instructions
   - [ ] Code has no hardcoded secrets
   - [ ] Tests run and pass
   - [ ] Project is deployed (or locally runnable)
3. **Provides GitHub URL, deployed URL, demo video (optional)**
4. **System auto-checks:**
   - Repo exists and is public
   - README is readable
   - Code runs without errors
5. **Sends to peer review queue**
6. **Learner is assigned 2 peer reviews**
7. **After 2 reviews, instructor spot-checks if needed**
8. **Result: Pass/Needs Revision**
9. **If passes: Added to portfolio, celebrated, move to next module**
10. **If needs revision: Specific feedback, learner has 1 week to resubmit**

### 8.4 Getting Help Flow

User clicks "I'm stuck" (available on every lesson):

1. **Quick options:**
   - [ ] "Explain this simpler"
   - [ ] "Show me a hint"
   - [ ] "Show me an example"
   - [ ] "I want to see the solution"

2. **If hints don't work:**
   - [ ] "Ask the community" (post in forum)
   - [ ] "Get a mentor review" (paid option, £3 per question)

3. **Community path:**
   - Post appears in forum
   - Other learners can reply
   - Instructors monitor and jump in if stuck for 12+ hours
   - Answer is added to FAQ for future learners

4. **Mentor path:**
   - Learner pays £3 (or monthly subscription includes 10)
   - Mentor reviews code within 24 hours
   - Returns specific feedback + suggested next step

---

## 9. Technical Architecture

### 9.1 Tech Stack

**Frontend:**
- Framework: Next.js 14 (React 18)
- Styling: Tailwind CSS + shadcn/ui
- Animations: Framer Motion
- Code editor: Monaco (VS Code in browser)
- State: TanStack Query (React Query) + Zustand
- Deployment: Vercel

**Backend:**
- Runtime: Node.js (Hono or Express)
- Database: Postgres (Supabase)
- Auth: Clerk or NextAuth + Auth.js
- File storage: AWS S3 or Cloudinary (for screenshots, videos)
- API execution: Next.js serverless functions + external Python runners

**Code Execution:**
- Python: Piston API (managed code execution) or self-hosted
- JavaScript: Run in browser (Node WASM)
- Testing: Jest (JavaScript), pytest (Python)

**Integrations:**
- GitHub API (repo verification, commit counting)
- YouTube/Vimeo (video hosting for demos)
- SendGrid (email: reminders, digests)
- Stripe (if paid)
- Claude API (for optional AI tutor/feedback)

### 9.2 Data Model (Key Entities)

**Users**
- id, email, username, password_hash
- profile (name, bio, avatar, location)
- settings (theme, email_frequency, public_portfolio)
- created_at, updated_at

**Lessons**
- id, module_id, title, description
- content (html + motion specs in JSON)
- learning_outcomes, estimated_time
- order (1-48), difficulty
- created_at, published_at

**User Progress**
- id, user_id, lesson_id
- started_at, completed_at, time_spent
- quiz_score, completion_status (started/in_progress/completed)

**Projects (Capstones)**
- id, module_id, title, description
- requirements (acceptance criteria), rubric
- starter_code (github repo)
- created_at, due_date

**Project Submissions**
- id, user_id, project_id
- github_url, deployed_url, demo_video_url
- submitted_at, status (draft/submitted/under_review/passed/revision_needed)

**Code Reviews (Peer)**
- id, submission_id, reviewer_id
- score (1-5), feedback, submitted_at
- anonymous_mode (true/false)

**Portfolio**
- id, user_id
- public_url, public (true/false)
- featured_projects (array of project_ids)
- testimonials (from peer reviewers)

**Community Posts**
- id, user_id, lesson_id/project_id (optional)
- title, content (markdown)
- status (published/flagged)
- created_at, replies (FK to replies table)

---

## 10. Roadmap & Phasing

### Phase 1: MVP (Weeks 1-12, by end of Q3 2026)

**Ship:**
- Lesson infrastructure (create, edit, publish)
- Phase 1 + 2 curriculum (16 lessons + visualisations for 10 key concepts)
- Code sandbox (Python execution)
- 2 capstone projects (Capstone 1 + 2)
- User progress tracking
- Basic portfolio page

**Not included:**
- Peer review system
- Community forum
- Mentorship
- Mobile app

**Success metric:** 50 users sign up, 30 complete Capstone 1, 15 complete Capstone 2

### Phase 2: Core Curriculum (Weeks 13-26, Q4 2026)

**Add:**
- Phase 3 + 4 curriculum (20 more lessons + animations)
- JavaScript/TypeScript sandbox + React sandbox
- Capstones 3 + 4
- Peer review system (guided rubric, auto-assignment)
- Community forum with moderation
- "Explain Again" AI tutor (Claude API)

**Success metric:** 200 users, 100 with 4+ capstones, 50 in community discussions

### Phase 3: Advanced & Polish (Weeks 27-40, Q1 2027)

**Add:**
- Phase 5 + 6 curriculum (12 more lessons + visualisations)
- Capstones 5 + 6
- Mentorship option (paid, £25-50/month)
- Portfolio showcase page (searchable directory of graduates)
- Job board integration (show relevant jobs to graduates)
- Mobile-responsive polish

**Success metric:** 500 users, 150 graduates, 50+ portfolio projects live

### Phase 4: Monetisation & Scale (Weeks 41-52, Q2 2027+)

**Launch:**
- Freemium model:
  - Free: Lessons + sandboxes + peer review
  - Premium (£30/month or £300/year): Mentor support, certificate, advanced projects
- Affiliate links (AWS, Vercel, Cloud providers)
- Job placement partnership (referral fees)
- Corporate licenses (for companies training junior engineers)

**Success metric:** 1,000 users, 400+ graduates, £10k MRR, 50%+ job placement

---

## 11. Monetisation Strategy

### Option A: Freemium (Recommended)

**Free:**
- All lessons, sandboxes, projects
- Peer review system
- Portfolio builder
- Community forum

**Premium (£30/month or £300/year):**
- Mentor code reviews (1 per week)
- Priority support (24-hour response)
- Certificate of completion
- Advanced projects (specialisation: ML, systems, security)
- Ad-free experience

**Rationale:** Removes barrier to entry. Users who finish curriculum are highly motivated to upgrade for mentorship.

**Projected margins:** 
- CAC: £30 (ads + referrals)
- LTV: £400 (avg mentor user: 8 months @ £40/mo)
- Target: 500 premium users by end of 2027 = £150k MRR

### Option B: Premium Only (Higher Barrier)

**£40/month or £400/year**

**Pros:** Simpler, higher intent users, easier to support
**Cons:** Limits reach, harder initial growth, less diversified user base

### Option C: Hybrid (B2B + B2C)

**B2C:** Freemium model as above
**B2B:** Corporate licenses
- £5k-10k/year per company (unlimited employees)
- Dedicated Slack support
- Custom curriculum (skip unneeded modules)
- Bulk reporting

**Rationale:** Companies training junior engineers = reliable revenue

---

## 12. Go-to-Market Strategy

### Pre-Launch (Month 1)

1. **Beta cohort:** 20-30 power users (Twitter, Reddit, Discord communities)
2. **Build in public:** Weekly updates on product (vibe coder narrative)
3. **Content:** Write 3-4 essays on "why AI changes coding education"
4. **Landing page:** Clear value prop, pricing, 7-day free trial CTA

### Launch (Month 2)

1. **Twitter thread storm:** "We shipped an AI engineer academy. Here's what we learned."
2. **Product Hunt:** Friday morning launch, live for Q&A
3. **Dev.to:** 5 in-depth blog posts on curriculum rationale
4. **Reddit:** Comments in r/learnprogramming, r/aiengineers (not spammy)
5. **Email:** Outreach to 500 coding educators, Substack writers
6. **Referral:** Early users get £20 credit per referral

### Growth (Months 3-12)

1. **Affiliate partnerships:**
   - Vercel: "Deploy your projects on Vercel" (referral links)
   - AWS/GCP: Cloud credits for learners (in exchange for referrals)
   - GitHub: Featured on GitHub Learning Path (if possible)

2. **Content marketing:**
   - Blog: 2 posts/week on AI engineering, learning, hiring
   - Podcast appearances: "How to hire junior AI engineers"
   - YouTube: Explainer videos (motion graphics from app)

3. **Community:**
   - Slack community for graduates (hiring + networking)
   - Monthly webinars (guest speakers from AI companies)
   - Sponsor AI/ml conferences (booth, talks)

4. **Partnership:**
   - Bootcamp partnerships (upsell to their graduates)
   - University partnerships (offer at cost to CS students)
   - LinkedIn Learning (syndicate content)

5. **Paid acquisition (Month 6+):**
   - Google Ads: "Learn AI engineering" (target coding keywords)
   - Twitter ads: Retarget learners
   - CAC target: <£40 to break even on free users; <£20 for premium

---

## 13. Competitive Analysis

### Existing Competitors & Gaps

| Competitor | Strength | Weakness | Our Advantage |
|---|---|---|---|
| Codecademy | Large user base | Text-heavy, no AI focus | Motion graphics, AI engineering-focused |
| Udemy/Coursera | Breadth | Passive video learning | Project-based, built with AI |
| Bootcamps | Employment focus | Expensive (£10k+), full-time | Affordable, flexible, AI-native |
| freeCodeCamp | Free, projects | Outdated, no AI curriculum | Modern stack, motion explanations |
| Anthropic's cookbook | Free, official | Reference only, not structured | Full curriculum, progression, community |
| GitHub Skills | Official, free | Basic topics, no AI | Deep specialisation in AI engineering |

**Our moat:**
- First-to-market: AI engineering curriculum designed post-Claude/Copilot
- Better learning UX: Motion graphics for kinetic learners
- Built on Claude + verified with real engineers
- Community + peer learning (not solo videos)
- Portfolio-driven (not certificates)

---

## 14. Risks & Mitigations

### Risk 1: Low Completion Rate
**Risk:** Self-paced learning has 5-10% completion rates for typical online courses.

**Mitigation:**
- Project-based (not video-based) increases engagement 3-5x
- Celebrate small wins (badges, streaks, public posts)
- Email reminders (1x per week, not spam)
- Cohort-based option for premium users (launches Q2 2027)
- Peer accountability (assigned reviews create social obligation)

### Risk 2: Quality Control of AI-Generated Code
**Risk:** Learners use Claude to generate entire projects; quality degrades.

**Mitigation:**
- Rubric explicitly penalises AI-generated-looking code without understanding
- Peer reviewers trained to spot this ("Can you explain line 5?")
- Mentor reviews catch it (paid option)
- Lesson messaging: "AI is a pair programmer, not a ghost writer"
- Capstone projects include live code walkthrough (video) to prove understanding

### Risk 3: Monetisation Uncertainty
**Risk:** Users expect coding education to be free (YouTube, freeCodeCamp, etc.).

**Mitigation:**
- Freemium model: remove barrier to entry
- Premium value is clear: mentor feedback, career support, community
- Alternative: corporate training (companies pay, individuals free)
- Network effects: as community grows, retention improves

### Risk 4: Curriculum Becomes Outdated
**Risk:** AI/ml landscape changes fast; curriculum becomes stale in 6 months.

**Mitigation:**
- Live lab modules (instructor-updated monthly)
- Learner feedback: weekly survey on "what's missing?"
- Advisory board of 5-10 working AI engineers (quarterly reviews)
- Modular design: swap out tools/frameworks without rewriting
- Beta program: new curriculum tested with 20 users before rollout

### Risk 5: Instructor Burnout
**Risk:** 1-2 instructors cannot handle 500+ learners, mentorship, community, etc.

**Mitigation:**
- Hire 2 additional instructors by month 6 (community manager + technical educator)
- Distributed mentorship: use vetted senior volunteers (incentivise with equity/revenue share)
- Automate: use Claude for code review suggestions (not final, but saves time)
- Scope: launch peer review system early (reduces instructor load 50%)

### Risk 6: Community Toxicity
**Risk:** Unmoderated forum becomes toxic; learners leave.

**Mitigation:**
- Code of Conduct (clear, enforced)
- Moderation team hired by month 3
- Automated flagging (slurs, harassment)
- Positive culture: celebrate question-asking, not shaming
- Example: Mods actively post thoughtful replies to questions

---

## 15. Success Criteria (Gate Metrics)

### Phase 1 Completion Gate (End Q3 2026)

- [ ] MVP shipped (all planned features)
- [ ] 50 active users with 40%+ weekly engagement
- [ ] 15 capstone project submissions with avg quality score 6/10+
- [ ] 0 security/data incidents
- [ ] NPS > 40 (from beta cohort)

### Phase 2 Completion Gate (End Q4 2026)

- [ ] 200 active users
- [ ] 100 users with 2+ capstone projects completed
- [ ] Peer review system functional (80% of projects reviewed within 7 days)
- [ ] Community 50+ discussions/month
- [ ] Churn <5% (excluding week-1 dropouts)

### Phase 3 Completion Gate (End Q1 2027)

- [ ] 500 active users
- [ ] 150 graduates (completed 50%+ of curriculum)
- [ ] 50 portfolio projects publicly visible (shared, hireable)
- [ ] Mentorship program (20+ mentors, £5k/month revenue)
- [ ] 30% of premium subscribers, £5k/month revenue

### Graduation Criteria (Per User)

User is "graduated" when:
- [ ] Completed all 6 capstones
- [ ] Average capstone score 7/10+
- [ ] 70%+ test coverage on final project
- [ ] Final project deployed and working
- [ ] Portfolio page public and polished
- [ ] Passed "Capstone Defense" (optional): live walkthrough of final project

---

## 16. Key Deliverables & Timeline

### By End Q3 2026
- [ ] Lesson builder interface (CMS)
- [ ] Phase 1 + 2 curriculum (16 lessons) with motion graphics
- [ ] Code sandbox (Python + JavaScript)
- [ ] 2 capstone projects (Capstone 1 + 2) with grading rubric
- [ ] User progress dashboard
- [ ] Portfolio page template
- [ ] Landing page + pricing page
- [ ] Email onboarding sequence
- [ ] Deployment pipeline (GitHub to Vercel)

### By End Q4 2026
- [ ] Phase 3 + 4 curriculum (20 lessons) with animations
- [ ] Peer review system (rubric, auto-assignment, anonymisation)
- [ ] Community forum + moderation
- [ ] "Explain Again" AI tutor (Claude API integration)
- [ ] 2 more capstones (Capstone 3 + 4)
- [ ] Email notification system (reminders, digests)

### By End Q1 2027
- [ ] Phase 5 + 6 curriculum (12 lessons)
- [ ] Mentorship platform (booking, async code reviews)
- [ ] Job board integration
- [ ] Portfolio showcase (searchable directory)
- [ ] Mobile responsive design
- [ ] 2 final capstones (Capstone 5 + 6)

---

## 17. Open Questions & Future Exploration

1. **Cohort-based hybrid?** Should we offer paid cohorts (live instructor, fixed timeline) alongside self-paced? (Test in Q1 2027)

2. **Specialisation tracks?** After Phase 4, do learners choose: "ML Engineer," "Systems Engineer," "AI Product Manager"? (Out of scope for MVP)

3. **Hiring partner?** Should we partner with a hiring platform (hired.com, toptal) for graduate placement? (Explore in Phase 3)

4. **International expansion?** Curriculum is English; what about localisation to other languages? (Post-launch, if demand exists)

5. **Offline option?** Could we distribute on USB for offline learning? (Unlikely need; web is more resilient)

6. **AI-generated feedback?** Can Claude provide meaningful code review feedback at scale? How to verify quality? (Test with Phase 2 launch)

7. **B2B licensing?** Companies paying £5k/year for employee training. How to make this work? (Test in Phase 3)

---

## 18. Appendix: Design System & Brand

### Colours
- **Primary (Action):** #1F2937 (Dark grey, trust)
- **Accent (Success):** #10B981 (Emerald green, growth)
- **Accent (Learning):** #F59E0B (Amber, energy)
- **Accent (Warning):** #EF4444 (Red, caution)
- **Background:** #FFFFFF (light) / #111827 (dark)
- **Text:** #1F2937 (light mode) / #F3F4F6 (dark mode)

### Typography
- **Headlines:** Inter Bold, 24-32px
- **Body:** Inter Regular, 14-16px
- **Code:** Fira Code, 12-14px

### Tone of Voice
- **Encouraging, not patronising**
- **Clear, not verbose**
- **Practical, not theoretical**
- **Curious, not gatekeeping**
- Example: "Stuck? Let's break it down." (not "You may find this challenging.")

---

## 19. Approval & Sign-Off

| Role | Name | Date | Signature |
|---|---|---|---|
| Product | [Kydos] | July 2026 | |
| Engineering | [Lead Dev] | July 2026 | |
| GTM | [Marketing] | July 2026 | |

---

**Document Control**

- **Version:** 1.0
- **Status:** Ready for Development
- **Last Updated:** July 2026
- **Next Review:** End Q3 2026 (post-MVP launch)
- **Owner:** [Kydos Digital]

thats what i want to build

## Assistant

This is a rich PRD — before I design anything, let me nail down what you want me to produce first.

_[tool: questions_v2]_

## User

Questions answered:
- deliverable: Interactive prototype of the learner experience (lesson + sandbox + dashboard), Lesson interface only (with a motion visualisation), Landing page
- fidelity: Hi-fi polished screens
- flow_focus: First-time onboarding (sign-up → first lesson), Taking a lesson (concept → animation → sandbox → quiz), Project capstone submission, Progress dashboard / weekly planning, Peer code review
- demo_lesson: Variables (the box metaphor, per the PRD)
- variations: One strong direction
- variation_axis: Layout / information architecture, Novel UX ideas (streaks, ADHD-friendly pacing, celebrations), Interaction & animation styles, Copy / tone
- theme: Light
- device: Responsive demo
- realism: Fully working (runnable sandbox mock, state, navigation)
- audience: Investors
- anything_else: name of the app is Framis - "Fram" (Norse: forward/progress) + "is" (Latin: being). Means "building forward." framis.dev. Feels Scandinavian-influenced but not English.

for branding
Let me create this as an interactive HTML file instead:Done. Open the HTML file and you'll see:

**What's included:**

1. **Logo** - The forward-motion mark (3 nodes, 2 connecting lines, teal arrow) + wordmark
2. **Colour system** - All 6 colours with hex codes and usage
3. **Typography** - Headlines, body copy, monospace examples
4. **Landing preview** - Full-bleed dark hero with CTA
5. **Lesson card** - Example of how concepts are presented (gradient header, progress bar, code)
6. **Brand personality** - Core voice: clear, forward, calm, trustworthy

**Vibe:**
- Clean and minimal (Scandinavian influence)
- Technical but human
- Professional, not trying too hard
- Feels grounded, engineering-focused
- Works on light and dark modes

You can click through, see how colours work together, how typography feels. Want me to refine anything? Darker? Lighter? Different accent colour? Want to see the full landing page with nav, features, pricing, etc.?

i. have attached the branding and logo as an image

## Assistant

_[tool: list_files]_

_[tool: update_todos]_

The design system project is empty — your attached brand sheet is the design context. First, prepping the logo mark for use on any background:

_[tool: run_script]_

_[tool: list_files]_

_[tool: copy_files]_

_[tool: run_script]_

_[tool: set_project_title]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

The full Framis prototype is live in `Framis.dc.html` — one working flow in your brand (navy/blue/teal, Inter + IBM Plex Sans + Fira Code, real logo mark):

- **Landing** → Start free → **3-step onboarding** (account, placement quiz, setup checklist)
- **Dashboard** — week 18/48, streak, this-week tasks, capstone + review queue
- **Lesson: Variables** — playable box-metaphor motion viz, runnable Python sandbox (assignments, `print`, f-strings), quiz with feedback, "explain simpler" toggle
- **Capstone** — Notes App brief, criteria checklist, progressive hints, submission flow
- **Peer review** — anonymised code with a planted security bug, weighted scorecard, guided feedback

Tweaks panel lets you jump straight to dashboard/lesson, rename the learner, or hide gamification.

Next steps worth considering: a portfolio page, dark mode, or a second lesson (RAG) to show the AI-flavored end of the curriculum.

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Fixed — the sandbox now evaluates concatenation before string literals, so the starter code prints `Hi Alex, you are 24!` correctly.

## User

can the landing page be more interactive, put some motion graphics, this is 2026, i dont want bacis landing page, this needs to be next level, you have cluade design that can now do motion grahics, common give me something highlevel

## Assistant

Leveling up the landing: canvas particle network hero, auto-playing typed "lesson demo" panel, staggered word reveals, animated stat counters, concept ticker marquee, and scroll-triggered section reveals with hover motion throughout.

_[tool: snip]_

_[tool: snip]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Now the logic:

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

The landing is now motion-first:

- **Live particle network** in the hero — nodes drift, connect, and react to your cursor
- **Self-playing lesson demo** — code types itself, the value flies into the memory box, output prints, loops forever (the product demoing itself)
- **Staggered headline reveal** + stat counters that count up on load
- **Concept ticker** marquee (VARIABLES → RAG → AGENTS…)
- **Scroll-triggered reveals** with staggered cards, and hover lift + glow on cards/CTAs

Scroll down the page to see the reveals fire. Want more — e.g. a scroll-scrubbed "12-month journey" path, or magnetic buttons?

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Fixed — the particle canvas now self-heals its size each frame, so the network renders on first load instead of only after a resize.

