#!/usr/bin/env bash
# release-version.sh — decide whether the commit on the release branch is a new release.
#
# The one rule (see release-versioning.md): a release is a version in package.json, on the
# release branch, that has no tag yet. This script is that check. Every app and service repo
# carries a copy at .github/scripts/release-version.sh and calls it from its release workflow;
# the canonical copy lives beside the release-versioning standard.
#
#   release-version.sh            decide for HEAD, print the verdict, write GitHub outputs
#
# Environment:
#   REMOTE       git remote to read tags from          (default: origin)
#   TAG_PREFIX   prefix in front of the version        (default: v)
#   PACKAGE_JSON file holding the version              (default: package.json)
#
# Outputs (to $GITHUB_OUTPUT when set, always echoed):
#   version=X.Y.Z   tag=vX.Y.Z   release=true|false
#   previous=vA.B.C   the highest release tag below this version (empty for the first release)
#
# Exit codes: 0 = verdict reached (release=true: tag it; release=false: this commit is already
# tagged with this version, a re-run). 1 = not releasable, with the reason on stderr.
set -euo pipefail

export LC_ALL=C
REMOTE="${REMOTE:-origin}"
TAG_PREFIX="${TAG_PREFIX:-v}"
PACKAGE_JSON="${PACKAGE_JSON:-package.json}"

fail() { echo "::error::$*" >&2; exit 1; }

[ -f "$PACKAGE_JSON" ] || fail "no $PACKAGE_JSON here"
version=$(node -p "require('./$PACKAGE_JSON').version || ''")
[[ "$version" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]] \
  || fail "version '$version' in $PACKAGE_JSON is not a plain X.Y.Z release version"

tag="${TAG_PREFIX}${version}"
head=$(git rev-parse HEAD)

# Every tag on the remote with the commit it points at. An annotated tag lists twice; the
# peeled line (ending ^{}) is the commit, so it is sorted last and wins.
tags=$(git ls-remote --tags "$REMOTE" | sed 's#\trefs/tags/#\t#' | sort -k2,2) \
  || fail "could not read tags from $REMOTE"

tag_commit=$(awk -v t="$tag" -F'\t' '$2==t || $2==t"^{}" {c=$1} END {print c}' <<<"$tags")

release=true
if [ -n "$tag_commit" ]; then
  if [ "$tag_commit" = "$head" ]; then
    release=false
  else
    fail "$tag already exists on another commit (${tag_commit:0:7}); this commit (${head:0:7}) needs a new version in $PACKAGE_JSON"
  fi
fi

# Every release already tagged, lowest first. Only plain <prefix>X.Y.Z tags count: older date
# stamps (v2026.10.29-20) and other tags are ignored.
esc_prefix=$(printf '%s' "$TAG_PREFIX" | sed 's/[][\.*^$/]/\\&/g')
released=$(awk -F'\t' '{print $2}' <<<"$tags" | sed 's/\^{}$//' \
  | grep -E "^${esc_prefix}(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$" \
  | sed "s/^${esc_prefix}//" | sort -u -t. -k1,1n -k2,2n -k3,3n || true)

# A new version must be higher than every one of them.
highest=$(tail -1 <<<"$released")
if [ "$release" = true ] && [ -n "$highest" ]; then
  newer=$(node -p "const a='$version'.split('.').map(Number),b='$highest'.split('.').map(Number);(a[0]-b[0]||a[1]-b[1]||a[2]-b[2])>0")
  [ "$newer" = true ] || fail "$version is not higher than the latest release (${TAG_PREFIX}${highest})"
fi

# The release just before this one, for the range of the generated notes.
previous=$(grep -vx "$version" <<<"$released" | node -e '
  const v = process.argv[1].split(".").map(Number);
  const below = require("fs").readFileSync(0, "utf8").split("\n").filter(Boolean)
    .filter((t) => { const b = t.split(".").map(Number); return (v[0]-b[0] || v[1]-b[1] || v[2]-b[2]) > 0; });
  process.stdout.write(below.pop() || "");' "$version" || true)

{
  echo "version=$version"
  echo "tag=$tag"
  echo "release=$release"
  echo "previous=${previous:+${TAG_PREFIX}${previous}}"
} | tee -a "${GITHUB_OUTPUT:-/dev/null}"
