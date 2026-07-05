-- Second fully-authored lesson: RAG (Module 14), backing the RAG tab on the
-- Lesson screen. NOT YET APPLIED to the live project as of this commit —
-- the Supabase MCP connector was disconnected when this was written.

insert into public.lessons (module_id, title, description, content, learning_outcomes, estimated_minutes, order_index, difficulty, published_at) values
  ((select id from public.modules where module_number = 14),
   'RAG — teaching an LLM to cite its sources',
   'Retrieval-augmented generation: chunk, embed, retrieve, then answer from the retrieved text.',
   '{
      "concept": "RAG means Retrieval-Augmented Generation. Instead of trusting the model''s memory, you hand it the actual source text before it answers — split into small chunks, matched by meaning to the question, then pasted straight into the prompt. The model answers from what''s in front of it, and can point to exactly which chunk it used.",
      "concept_simpler": "Open-book exam, not closed-book. Find the right page first, then answer from that page — and say which page.",
      "quiz": {"prompt": "RAG retrieves the single most relevant chunk before answering. What''s the main reason?", "options": [{"key":"a","label":"It''s required by the LLM API","correct":false},{"key":"b","label":"So the answer is grounded in a real source it can cite","correct":true},{"key":"c","label":"To make the UI look more complex","correct":false}]},
      "key_takeaway": "Retrieval turns a guess into a citation. If the model can''t point to the chunk it used, don''t trust the answer."
    }'::jsonb,
   array['Explain why retrieval happens before generation', 'Reason about nearest-neighbour retrieval in meaning-space', 'Recognise when an answer is properly grounded vs. guessed'],
   25, 1, 'intermediate', now());
