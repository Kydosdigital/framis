-- Insert "Phase 2.5: Data + Classical ML" (4 new modules) between the
-- existing Phase 2 (Web + full-stack basics) and what was Phase 3
-- (Engineering discipline). Every module from the old Phase 3 onward
-- (module_number 9-24, phase 3-6) shifts up by 4 module numbers and one
-- phase to make room.
--
-- Safe to run once: modules.module_id is the stable surrogate key that
-- public.projects/public.lessons foreign-key against (not module_number),
-- so shifting module_number/phase here does not disturb any existing
-- project or lesson relationship.

-- The phase column has a check constraint capped at 6 — widen it to 7
-- before any row can hold the new Phase 2.5 modules' phase value, or the
-- inserts/updates below will fail.
alter table public.modules drop constraint if exists modules_phase_check;
alter table public.modules add constraint modules_phase_check check (phase between 1 and 7);

-- Step 1: move the existing modules 9-24 into a temporary, non-colliding
-- range first. module_number is unique, and a straight "+4" update risks a
-- transient collision (e.g. module 9 -> 13 momentarily coexisting with the
-- not-yet-updated original module 13) depending on row processing order.
update public.modules
set module_number = module_number + 1000
where module_number between 9 and 24;

-- Step 2: move them down to their real final numbers (now collision-free,
-- since 9-24 is empty) and bump phase by 1 in the same statement.
update public.modules
set module_number = module_number - 996, phase = phase + 1
where module_number between 1009 and 1024;

-- Step 3: every phase from the (new) Engineering Discipline phase onward
-- shifts out by 16 weeks, since Phase 2.5 itself spans weeks 17-32.
update public.modules set weeks_label = 'Weeks 33-40' where phase = 4;
update public.modules set weeks_label = 'Weeks 41-48' where phase = 5;
update public.modules set weeks_label = 'Weeks 49-56' where phase = 6;
update public.modules set weeks_label = 'Weeks 57-64' where phase = 7;

-- Step 4: insert the 4 new Phase 2.5 modules.
insert into public.modules (phase, module_number, title, description, weeks_label) values
  (3, 9, 'Pandas + Data Wrangling', 'Loading, cleaning, and reshaping real (messy) tabular data.', 'Weeks 17-32'),
  (3, 10, 'Feature Engineering + Selection', 'Creating, encoding, scaling, and selecting the inputs a model actually sees.', 'Weeks 17-32'),
  (3, 11, 'Classical Machine Learning', 'Decision trees, ensembles, logistic regression, and clustering — how they work.', 'Weeks 17-32'),
  (3, 12, 'Model Evaluation + Cross-Validation', 'Evaluating a model rigorously instead of trusting a single accuracy number.', 'Weeks 17-32');
