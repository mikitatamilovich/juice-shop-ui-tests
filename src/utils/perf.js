const { mean, median, percentile } = require('./stats');

/**
 * Sends one request and measures only its duration.
 * A network error is recorded as an error result instead of being thrown.
 * @param {() => Promise<import('@playwright/test').APIResponse>} send - Function that sends the request.
 * @returns {Promise<{ms: number, status: number|null, error?: string}>} Duration and HTTP status.
 */
async function timeRequest(send) {
  const start = performance.now();
  try {
    const response = await send();
    return { ms: performance.now() - start, status: response.status() };
  } catch (error) {
    return { ms: performance.now() - start, status: null, error: error.message };
  }
}

/**
 * Checks whether a result counts as an error (network error or status outside 2xx).
 * @param {{status: number|null}} result - Measured request result.
 * @returns {boolean} True for an error.
 */
function isError(result) {
  return result.status === null || result.status < 200 || result.status >= 300;
}

/**
 * Sends requests one after another and measures the whole series.
 * @param {() => Promise<import('@playwright/test').APIResponse>} send - Request sender.
 * @param {number} count - Number of requests.
 * @returns {Promise<{totalMs: number, results: object[]}>} Series total time and per-request results.
 */
async function runSequential(send, count) {
  const start = performance.now();
  const results = [];
  for (let i = 0; i < count; i += 1) {
    results.push(await timeRequest(send));
  }
  return { totalMs: performance.now() - start, results };
}

/**
 * Sends requests in batches: requests of one batch run at the same time, batches go one by one.
 * @param {() => Promise<import('@playwright/test').APIResponse>} send - Request sender.
 * @param {number} count - Total number of requests.
 * @param {number} batchSize - Number of simultaneous requests.
 * @returns {Promise<{totalMs: number, results: object[]}>} Series total time and per-request results.
 */
async function runInBatches(send, count, batchSize) {
  const start = performance.now();
  const results = [];
  for (let sent = 0; sent < count; sent += batchSize) {
    const size = Math.min(batchSize, count - sent);
    const batch = await Promise.all(Array.from({ length: size }, () => timeRequest(send)));
    results.push(...batch);
  }
  return { totalMs: performance.now() - start, results };
}

/**
 * Calculates metrics of several series of the same scenario.
 * @param {string} scenario - Scenario name for the table.
 * @param {{totalMs: number, results: object[]}[]} series - Measured series.
 * @returns {object} Row with request count, mean total time, mean, median, p95 and error count.
 */
function summarize(scenario, series) {
  const times = series.flatMap((item) => item.results.map((result) => result.ms));
  return {
    scenario,
    requests: times.length,
    totalMs: mean(series.map((item) => item.totalMs)),
    meanMs: mean(times),
    medianMs: median(times),
    p95Ms: percentile(times, 95),
    errors: series.reduce((sum, item) => sum + item.results.filter(isError).length, 0),
  };
}

/**
 * Renders rows as a Markdown table.
 * @param {object[]} rows - Rows made by summarize().
 * @returns {string} Markdown table.
 */
function toMarkdownTable(rows) {
  const fmt = (value) => value.toFixed(1);
  const lines = [
    '| Сценарий | Запросов | Общее время, мс | Среднее, мс | Медиана, мс | p95, мс | Ошибки (не 2xx) |',
    '|---|---|---|---|---|---|---|',
  ];
  for (const row of rows) {
    lines.push(
      `| ${row.scenario} | ${row.requests} | ${fmt(row.totalMs)} | ${fmt(row.meanMs)} | ` +
        `${fmt(row.medianMs)} | ${fmt(row.p95Ms)} | ${row.errors} |`,
    );
  }
  return lines.join('\n');
}

module.exports = { timeRequest, runSequential, runInBatches, summarize, toMarkdownTable };
