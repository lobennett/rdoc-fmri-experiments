-- Applied 2026-06-02. Renames the misleading n_trials column (it counts every
-- jsPsych record in trialdata -- instructions, ITIs, feedback, task trials --
-- not just experimental trials) to n_records.
alter table runs rename column n_trials to n_records;
