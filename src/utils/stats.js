/**
 * Arithmetic mean.
 * @param {number[]} values - Non-empty list of numbers.
 * @returns {number} Mean value.
 */
function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Median: the middle value of the sorted list (mean of two middle values for an even count).
 * @param {number[]} values - Non-empty list of numbers.
 * @returns {number} Median value.
 */
function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

/**
 * Percentile by the nearest-rank method.
 * @param {number[]} values - Non-empty list of numbers.
 * @param {number} percent - Percentile from 1 to 100, for example 95.
 * @returns {number} Value at the given percentile.
 */
function percentile(values, percent) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil((percent / 100) * sorted.length) - 1)];
}

module.exports = { mean, median, percentile };
