#!/usr/bin/env bash
# Compares Playwright worker counts on one project: every count is run several times.
# Usage (from the project root): bash tools/run-workers-comparison.sh <project> "<worker counts>" [runs]
# Example: bash tools/run-workers-comparison.sh ui "1 2 4 6" 3
PROJECT="${1:-ui}"
WORKER_COUNTS="${2:-1 2 4 6}"
RUNS="${3:-3}"
OUT="isolation-results/workers-${PROJECT}"

mkdir -p "${OUT}"
echo "| Workers | Run | Time | Passed | Failed |" | tee "${OUT}/table.md"
echo "|---|---|---|---|---|" | tee -a "${OUT}/table.md"

for workers in ${WORKER_COUNTS}; do
  for run in $(seq 1 "${RUNS}"); do
    log="${OUT}/w${workers}-run${run}.log"
    npx playwright test --project="${PROJECT}" --retries=0 --reporter=line --workers="${workers}" > "${log}" 2>&1
    time=$(grep -oE '\([0-9.]+[ms]\)' "${log}" | tail -1 | tr -d '()')
    passed=$(grep -oE '[0-9]+ passed' "${log}" | tail -1 | grep -oE '[0-9]+')
    failed=$(grep -oE '[0-9]+ failed' "${log}" | tail -1 | grep -oE '[0-9]+')
    echo "| ${workers} | ${run} | ${time:-n/a} | ${passed:-0} | ${failed:-0} |" | tee -a "${OUT}/table.md"
  done
done
echo "Done. Details in ${OUT}"