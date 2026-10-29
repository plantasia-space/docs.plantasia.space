#!/usr/bin/env bash
# Deploy the dev docs (dev-userdocs.plantasia.space): pull `dev`, build it as the dev site, publish
# to the nginx-served dir. Runs on the dev box, by hand or from .github/workflows/deploy-dev.yml over
# SSH (a forced-command key runs this script whatever the client asks). See deploy/README.md.
# The public docs (docs.plantasia.space) still deploy from `main` to GitHub Pages (deploy.yml).
set -euo pipefail

REPO=/srv/dev-userdocs.plantasia.space
cd "$REPO"

# Node via nvm is not on PATH in the non-login shell a forced-command key gets. Newest v24 install,
# else the newest of any major (the same pick as be-deploy's deploy.sh).
NVM_NODES=/home/bruna/.nvm/versions/node
NODE_BIN="$(ls -d "$NVM_NODES"/v24.*/bin 2>/dev/null | sort -V | tail -1 || true)"
[[ -n "$NODE_BIN" ]] || NODE_BIN="$(ls -d "$NVM_NODES"/v*/bin 2>/dev/null | sort -V | tail -1 || true)"
[[ -n "$NODE_BIN" && -d "$NODE_BIN" ]] && export PATH="$NODE_BIN:$PATH"

# --- CI run context ---------------------------------------------------------------
# The workflow sends the GitHub run id + Actions run URL as the SSH command; SSH exposes it in
# $SSH_ORIGINAL_COMMAND. Whitelist-validated, never executed: the deploy events link to the run.
if [[ -n "${SSH_ORIGINAL_COMMAND:-}" ]]; then
  read -r -a _de_toks <<<"$SSH_ORIGINAL_COMMAND"
  for _tok in "${_de_toks[@]}"; do
    if [[ -z "${DEPLOY_RUN_ID:-}" && "$_tok" =~ ^[0-9]+$ ]]; then
      export DEPLOY_RUN_ID="$_tok"
    elif [[ -z "${DEPLOY_LOG_URL:-}" && "$_tok" =~ ^https://github\.com/[A-Za-z0-9._-]+/[A-Za-z0-9._-]+/actions/runs/[0-9]+(/attempts/[0-9]+)?$ ]]; then
      export DEPLOY_LOG_URL="$_tok"
    fi
  done
  unset _de_toks _tok
fi

# --- deploy events --------------------------------------------------------------------
# be-deploy's emitter, the channel every dev-box deploy reports through (deploy status dashboard;
# deploy.failed emails). Best-effort: without the lib the deploy still runs.
DE_EVENTS_LIB="${DE_EVENTS_LIB:-/srv/be-deploy/lib/events.sh}"
if [[ -f "$DE_EVENTS_LIB" ]]; then
  # shellcheck source=/dev/null
  source "$DE_EVENTS_LIB"
  [[ -f /srv/be-deploy/config/notify.env ]] && source /srv/be-deploy/config/notify.env
  de_init "userdocs" "dev"
else
  echo "!!  deploy events lib not found at $DE_EVENTS_LIB — skipping event emission" >&2
  de_init() { :; }; de_stage() { :; }; de_emit() { :; }; de_finish_ok() { :; }; de_disarm() { :; }
fi

de_stage "fetch"
echo "==> fetch + reset to origin/dev"
git fetch --quiet origin dev
git checkout --quiet -B dev origin/dev
git reset --hard --quiet origin/dev
REF=dev; SHA="$(git rev-parse HEAD)"; SHORT="$(git rev-parse --short HEAD)"
de_emit "deploy.started" "start"

# The box also runs mycelium/spore: keep the build low-priority.
de_stage "build"
echo "==> install + build the dev site (low priority, node $(node -v))"
rm -rf node_modules
nice -n 15 ionice -c3 bash -c '
  set -euo pipefail
  npm ci
  DOCS_SITE=dev npm run build
'

de_stage "publish"
echo "==> publish build/ -> deploy/site/"
rsync -a --delete build/ deploy/site/

de_stage "done"
echo "==> deployed $SHORT at $(date -u +%FT%TZ)"
de_finish_ok
