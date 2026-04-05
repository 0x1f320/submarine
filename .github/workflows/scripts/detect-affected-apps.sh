#!/usr/bin/env bash
set -euo pipefail

# Usage: detect-affected-apps.sh <base_ref>
#
# Analyzes changes against the given base ref using turborepo's dependency
# graph to determine which packages are affected.
#
# Scans both apps/ and packages/ directories. If a shared package
# (e.g. typescript-config) is changed, turborepo correctly flags all
# downstream dependents as affected.

BASE="$1"

AFFECTED_JSON=$(npx turbo run build --filter="...[$BASE]" --dry-run=json 2>/dev/null)

for dir in apps/*/ packages/*/; do
  name=$(basename "$dir")
  found=$(echo "$AFFECTED_JSON" | jq -r \
    --arg name "$name" \
    'if [.tasks[] | select(.package == $name)] | length > 0
     then "true" else "false" end')
  echo "$name=$found" >> "$GITHUB_OUTPUT"
done
