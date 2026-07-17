#!/usr/bin/env bash
# Same checks as ci-local.sh, but run inside node:22-bookworm (Docker) instead
# of natively on your machine. Use this when you want true parity with
# ubuntu-latest — e.g. after touching package.json/package-lock.json, since
# npm can resolve optional/platform-specific deps differently on macOS vs
# Linux, and "npm ci" only catches that mismatch on the platform it runs on.
# Requires Docker Desktop running. Slower than ci-local.sh; not meant for
# every save, just before a push that touches dependencies.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! docker info >/dev/null 2>&1; then
  echo "Docker isn't running — start Docker Desktop and try again." >&2
  exit 1
fi

docker run --rm -v "$(pwd)":/repo -w /repo node:22-bookworm bash -c '
  set -e
  step() { printf "\n\033[1;34m==> %s\033[0m\n" "$1"; }

  step "npm ci (Linux — exactly what GitHub Actions runs)"
  rm -rf node_modules
  npm ci

  step "lint"
  npm run lint

  step "typecheck"
  npx tsc --noEmit

  step "test"
  npm test -- --ci

  printf "\n\033[1;32mAll CI checks passed inside Linux.\033[0m\n"
'
