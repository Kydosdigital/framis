-- Seed the 6-phase / 24-module roadmap, the 6 capstone projects, and the
-- one fully-authored lesson (Variables) that backs the demo Lesson screen.

insert into public.modules (phase, module_number, title, description, weeks_label) values
  (1, 1, 'Setup + Terminal Basics + Git', 'Getting comfortable in a terminal, installing tools, first commits.', 'Weeks 1-8'),
  (1, 2, 'Python Syntax, Variables, Functions', 'Core Python building blocks.', 'Weeks 1-8'),
  (1, 3, 'Data Structures + Control Flow', 'Lists, dicts, sets, loops, conditionals.', 'Weeks 1-8'),
  (1, 4, 'File I/O + Errors + Debugging', 'Reading/writing files, exceptions, first debugger session.', 'Weeks 1-8'),
  (2, 5, 'HTML, CSS, JavaScript Fundamentals', 'The building blocks of the web.', 'Weeks 9-16'),
  (2, 6, 'React Basics + Components', 'Component trees, props, state.', 'Weeks 9-16'),
  (2, 7, 'APIs + HTTP + JSON', 'Requests, responses, status codes, payloads.', 'Weeks 9-16'),
  (2, 8, 'Backend with Python + Postgres', 'FastAPI, SQL, schemas.', 'Weeks 9-16'),
  (3, 9, 'Testing (unit, integration, end-to-end)', 'Writing tests that actually catch bugs.', 'Weeks 17-24'),
  (3, 10, 'Debugging + Logging + Monitoring', 'Finding and fixing production issues.', 'Weeks 17-24'),
  (3, 11, 'Security Basics + Auth Patterns', 'Hashing, tokens, common vulnerabilities.', 'Weeks 17-24'),
  (3, 12, 'CI/CD + Docker + Deployment', 'Shipping safely and repeatably.', 'Weeks 17-24'),
  (4, 13, 'LLM APIs + Tokens + Cost', 'Working with model APIs directly.', 'Weeks 25-32'),
  (4, 14, 'Embeddings + RAG + Vector Search', 'Retrieval-augmented generation from scratch.', 'Weeks 25-32'),
  (4, 15, 'Structured Outputs + Tool Calling', 'Getting reliable, typed output from models.', 'Weeks 25-32'),
  (4, 16, 'Evals + Safety + Guardrails', 'Measuring and constraining model behaviour.', 'Weeks 25-32'),
  (5, 17, 'Probability + Statistics Intuition', 'The maths that underlies ML.', 'Weeks 33-40'),
  (5, 18, 'Linear Algebra Basics', 'Vectors, matrices, the operations that matter.', 'Weeks 33-40'),
  (5, 19, 'Transformers + Attention + Tokenisation', 'How modern LLMs actually work.', 'Weeks 33-40'),
  (5, 20, 'Fine-tuning Concepts + Dataset Quality', 'Adapting a model to a task.', 'Weeks 33-40'),
  (6, 21, 'Agents + Workflows + Orchestration', 'Multi-step, tool-using systems.', 'Weeks 41-48'),
  (6, 22, 'Human-in-the-Loop + Guardrails', 'Keeping people in the loop safely.', 'Weeks 41-48'),
  (6, 23, 'Observability + Cost Controls', 'Running AI systems in production.', 'Weeks 41-48'),
  (6, 24, 'AI Product Design + Edge Cases', 'Designing for the failure modes.', 'Weeks 41-48');

insert into public.projects (module_id, title, slug, description, difficulty, duration_label, solo_or_pair, requirements, rubric, hints, order_index) values
  ((select id from public.modules where module_number = 4), 'CLI expense tracker', 'cli-expense-tracker',
    'A command-line expense tracker, deployed to GitHub.', 'Beginner', '1-2 weeks', 'solo', '[]', '[]', '[]', 1),
  ((select id from public.modules where module_number = 8), 'Full-stack notes app with login', 'notes-app-with-login',
    'You''re building an MVP where users sign up, log in, and manage private notes. React frontend, FastAPI + SQLite backend, deployed on Vercel + Railway, 70%+ test coverage.',
    'Intermediate', '2-3 weeks', 'solo',
    '["User can create an account with email + password", "User can log in and see only their own notes", "User can create, edit and delete notes", "Logging out clears the auth token", "Backend tests cover the main flows (70%+)", "No hardcoded secrets anywhere in the repo", "Deployed and working at a public URL"]',
    '[{"key":"crit","label":"Meets all acceptance criteria","weight":"40%"},{"key":"read","label":"Code is readable and well-structured","weight":"20%"},{"key":"tests","label":"Has 70%+ test coverage","weight":"20%"},{"key":"deploy","label":"Deployment works without errors","weight":"10%"},{"key":"readme","label":"README is clear for someone new","weight":"10%"}]',
    '["Start with the database schema: a users table and a notes table with a user_id foreign key.", "Never store raw passwords — hash them with bcrypt before they touch the database.", "Attach a JWT to each request; the backend checks it before returning any notes."]',
    2),
  ((select id from public.modules where module_number = 12), 'Full-stack app with tests, auth & CI', 'tested-app-with-ci',
    'A tested application with a GitHub Actions CI pipeline.', 'Intermediate', '2-3 weeks', 'solo', '[]', '[]', '[]', 3),
  ((select id from public.modules where module_number = 16), 'AI Q&A system with citations', 'ai-qa-with-citations',
    'An AI question-answering system with citations and evals, built on the Claude API.', 'Advanced', '2-3 weeks', 'solo', '[]', '[]', '[]', 4),
  ((select id from public.modules where module_number = 20), 'Train + deploy a classifier', 'train-deploy-classifier',
    'Train and deploy a small classifier using Hugging Face.', 'Advanced', '2-3 weeks', 'solo', '[]', '[]', '[]', 5),
  ((select id from public.modules where module_number = 24), 'Production AI system', 'production-ai-system',
    'A production-ready AI system — the entire 12-week capstone project.', 'Advanced', '12 weeks', 'solo', '[]', '[]', '[]', 6);

insert into public.lessons (module_id, title, description, content, learning_outcomes, estimated_minutes, order_index, difficulty, published_at) values
  ((select id from public.modules where module_number = 2),
   'Variables — storing information',
   'A variable is like a labelled box: put a value in, use the label to get it back later.',
   '{
      "concept": "A variable is like a labelled box. When you write name = \"Alex\", you''re writing \"Alex\" on a sticky note and putting it into a box labelled \"name\". Later, any time your code says name, Python walks over to that box and takes the value out.",
      "concept_simpler": "A variable is a labelled box. Put a value in. Use the label to get it back later. That''s it — everything else in this lesson is just practising that one move.",
      "real_world_example": "user_name = \"Sarah\"\norder_total = 42.50",
      "starter_code": "name = \"Alex\"\nage = 24\nprint(\"Hi \" + name + \", you are \" + age + \"!\")",
      "challenge": "Store your own name and age in variables, then print “Hi [name], you are [age]!”",
      "quiz": {"prompt": "x = 5\ny = x + 3\nWhat does this do?", "options": [{"key":"a","label":"x changes to 8","correct":false},{"key":"b","label":"y becomes 8","correct":true},{"key":"c","label":"both stay the same","correct":false}]},
      "key_takeaway": "Variables store values you''ll use later. Give them clear names so future-you remembers what they hold."
    }'::jsonb,
   array['Understand how assignment stores a value', 'Read and reason about simple Python expressions', 'Use print() to inspect a variable''s value'],
   25, 1, 'beginner', now());
