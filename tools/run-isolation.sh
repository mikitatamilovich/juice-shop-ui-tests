#!/usr/bin/env bash
# Isolation and parallel-execution experiment (part 4) for one Playwright project.
# Usage (from the project root): bash tools/run-isolation.sh <project> [parallel workers]
# Example: bash tools/run-isolation.sh ui 4
PROJECT="${1:-ui}"
WORKERS="${2:-4}"
OUT="isolation-results/${PROJECT}"
SUMMARY="${OUT}/summary.txt"
COMMON=(--project="${PROJECT}" --retries=0 --reporter=line)

mkdir -p "${OUT}"
: > "${SUMMARY}"

echo "== Each test alone" | tee -a "${SUMMARY}"
npx playwright test --project="${PROJECT}" --list \
  | grep -oE 'tests/[^ ]+\.spec\.js:[0-9]+' | sort -u > "${OUT}/tests.txt"
while read -r target; do
  if npx playwright test "${target}" "${COMMON[@]}" > /dev/null 2>&1; then
    echo "PASS ${target}" | tee -a "${SUMMARY}"
  else
    echo "FAIL ${target}" | tee -a "${SUMMARY}"
  fi
done < "${OUT}/tests.txt"

for mode in seq par; do
  workers=1
  if [ "${mode}" = "par" ]; then workers="${WORKERS}"; fi
  for run in 1 2 3; do
    log="${OUT}/${mode}${run}.log"
    npx playwright test "${COMMON[@]}" --workers="${workers}" > "${log}" 2>&1
    result=$(grep -E '[0-9]+ (passed|failed|flaky|skipped)' "${log}" | tr -s ' ' | tr '\n' ';')
    echo "${mode} run ${run} (workers=${workers}): ${result}" | tee -a "${SUMMARY}"
  done
done
echo "Done. Details in ${OUT}"
