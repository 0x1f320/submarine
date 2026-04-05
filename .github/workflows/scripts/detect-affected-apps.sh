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
  dir_name=$(basename "$dir")
  pkg_json="$dir/package.json"

  if [ ! -f "$pkg_json" ]; then
    continue
  fi

  pkg_name=$(jq -r '.name' "$pkg_json")
  found=$(echo "$AFFECTED_JSON" | jq -r \
    --arg name "$pkg_name" \
    'if [.tasks[] | select(.package == $name)] | length > 0
     then "true" else "false" end')
  echo "$dir_name=$found" >> "$GITHUB_OUTPUT"
done

# Check if Rust/Tauri source files actually changed (not just downstream TS deps)
CHANGED_FILES=$(git diff --name-only "$BASE" -- 2>/dev/null || true)
if echo "$CHANGED_FILES" | grep -q '^apps/desktop/src-tauri/'; then
  echo "desktop-tauri=true" >> "$GITHUB_OUTPUT"
else
  echo "desktop-tauri=false" >> "$GITHUB_OUTPUT"
fi
