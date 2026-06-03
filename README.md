# rdoc-fmri-experiments

This repository holds the RDoC fMRI task batteries plus the launcher (`rdoc_launch`) and data-sync (`rdoc_sync`) tooling used to run and archive sessions.

## Components

### `expfactory_deploy_local`

The local jsPsych battery server. Install it in editable mode from the [`expfactory-deploy`](https://github.com/lobennett/expfactory-deploy) repo:

```bash
uv pip install -e /path/to/expfactory-deploy/expfactory_deploy_local
```

### `rdoc_launch/`

The session launcher; replaces the old `setup.py`/`run.sh` workflow. See [`rdoc_launch/README.md`](./rdoc_launch/README.md) for full flag reference.

### `rdoc_sync/`

Pushes completed run data to Supabase and Dropbox. See [`rdoc_sync/README.md`](./rdoc_sync/README.md) for configuration details. A nightly launchd agent keeps Supabase current; to run that Dropbox → Supabase sync manually at any time:

```bash
cd rdoc_sync && uv run rdoc-sync from-dropbox --env ../.env
```

## One-time setup

1. Install [uv](https://docs.astral.sh/uv/).

2. Install `expfactory_deploy_local` in editable mode (see [Components](#expfactory_deploy_local) above).

3. Install the launcher and sync packages:

   ```bash
   cd rdoc_launch && uv sync
   cd rdoc_sync && uv sync
   ```

4. Configure `rdoc_sync`: copy `.env.example` (repo root) to `.env` and fill in the Supabase credentials. Ensure rclone is configured for Dropbox — see [`rdoc_sync/README.md`](./rdoc_sync/README.md) for details.

5. Place `credentials.json` (Google service account) at the repo root for counterbalancing sheet access. This file is gitignored.

6. Set up the response button box: see [`karabiner/README.md`](./karabiner/README.md).

## Run a session

1. **If the counterbalancing sheet has changed**, pull the latest assignment and commit the result:

   ```bash
   cd rdoc_launch && uv run rdoc-launch update-counterbalancing
   git add counterbalancing.json && git commit -m "chore: update counterbalancing"
   ```

2. Set the Karabiner profile for the task type (span vs. non-span).

3. Launch the session:

   ```bash
   uv run rdoc-launch launch --subject sNN --session <menu value>
   ```

   Omit flags to be prompted interactively. One Chrome window opens; the battery auto-advances through tasks. Press **Enter** when the session is complete to trigger sync.

4. **Restart a single task** — refresh the browser (partial data is never saved). **Rerun a subset of tasks** — pass `--tasks task1,task2`.

5. On completion, the launcher runs `rdoc-sync` automatically (pushes to Supabase and Dropbox). Pass `--no-sync` to skip.

## Designs

[Jeanette](https://github.com/jmumford) created the task designs in her [`efficiency_model_mockups`](https://github.com/jmumford/efficiency_model_mockups) repository. She also produced a [slidedeck](https://docs.google.com/presentation/d/15qc8DHQ_8VCVIX6gASrjQIuLV7KIRNbVxNnqPzLIUC8/edit?usp=sharing) visualizing the different phases of each task.

## Legacy

`setup.py` and `run.sh` are retained as a fallback and will be retired once `rdoc-launch` is verified in a live session.
