#!/usr/bin/env bash
# Mirrors .github/workflows/ci.yml step-for-step so you can catch failures
# (lockfile drift, lint, type, test) before pushing instead of after.
set -euo pipefail
cd "$(dirname "$0")/.."

step() { printf '\n\033[1;34m==> %s\033[0m\n' "$1"; }

step "npm ci (exact same install CI does — catches lockfile drift)"
npm ci

step "lint"
npm run lint

step "typecheck"
npx tsc --noEmit

step "test"
npm test -- --ci

printf '\n\033[1;32mAll CI checks passed locally.\033[0m\n'
