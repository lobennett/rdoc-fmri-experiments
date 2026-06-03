create table if not exists runs (
  id            bigint generated always as identity primary key,
  subject_id    text,
  session       text,
  run           text,
  task          text not null,
  is_practice   boolean not null default false,
  is_fmri       boolean not null default false,
  date_time     timestamptz,
  design_perm   integer,
  motor_perm    integer,
  n_records     integer not null default 0,
  hostname      text,
  exp_git_sha   text,
  raw_path      text,
  bids_path     text,
  source_filename text,
  flags         text[] not null default '{}',
  synced_at     timestamptz,
  trialdata     jsonb not null default '[]'::jsonb,
  unique (subject_id, session, run, task, date_time)
);
create index if not exists runs_subject_session_idx on runs (subject_id, session);
create index if not exists runs_task_idx on runs (task);
