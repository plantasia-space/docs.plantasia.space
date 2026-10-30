#!/usr/bin/env bash
# Deploy the dev docs (xplorer-docs.plantasia.space): pull `dev`, build it as the dev site, publish
# to the nginx-served dir. Runs on the dev box, by hand or from .github/workflows/deploy-dev.yml
# through be-deploy's CI wrapper (ci-deploy-command.sh, which also passes the Actions run id/URL as
# DEPLOY_RUN_ID / DEPLOY_LOG_URL). See deploy/README.md.
# The public docs (docs.plantasia.space) still deploy from `main` to GitHub Pages (deploy.yml).
set -euo pipefail

# One block, read whole before it runs: the reset below rewrites this very file.
{

REPO=/srv/xplorer-docs.plantasia.space
cd "$REPO"

# Node via nvm is not on PATH in the non-login shell a forced-command key gets. Newest v24 install,
# else the newest of any major (the same pick as be-deploy's deploy.sh).
NVM_NODES=/home/bruna/.nvm/versions/node
NODE_BIN="$(ls -d "$NVM_NODES"/v24.*/bin 2>/dev/null | sort -V | tail -1 || true)"
[[ -n "$NODE_BIN" ]] || NODE_BIN="$(ls -d "$NVM_NODES"/v*/bin 2>/dev/null | sort -V | tail -1 || true)"
[[ -n "$NODE_BIN" && -d "$NODE_BIN" ]] && export PATH="$NODE_BIN:$PATH"

# --- deploy events --------------------------------------------------------------------
# be-deploy's emitter, the channel every dev-box deploy reports through (deploy status dashboard;
# deploy.failed emails). Best-effort: without the lib the deploy still runs.
DE_EVENTS_LIB="${DE_EVENTS_LIB:-/srv/be-deploy/lib/events.sh}"
if [[ -f "$DE_EVENTS_LIB" ]]; then
  # shellcheck source=/dev/null
  source "$DE_EVENTS_LIB"
  [[ -f /srv/be-deploy/config/notify.env ]] && source /srv/be-deploy/config/notify.env
  de_init "xplorer-docs" "dev"
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
exit 0
}
