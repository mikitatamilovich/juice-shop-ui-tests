/** Lowest allowed percentile. */
const PERCENT_MIN = 1;

/** Highest allowed percentile and the divisor that turns a percent into a fraction. */
const PERCENT_MAX = 100;

/**
 * Fails fast when the argument is not a non-empty array.
 * @param {number[]} values - List to check.
 * @returns {void}
 * @throws {Error} If the list is empty or is not an array.
 */
function assertNonEmpty(values) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('Expected a non-empty array of numbers');
  }
}

/**
 * Arithmetic mean.
 * @param {number[]} values - Non-empty list of numbers.
 * @returns {number} Mean value.
 * @throws {Error} If the list is empty.
 */
function mean(values) {
  assertNonEmpty(values);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Median: the middle value of the sorted list (mean of two middle values for an even count).
 * @param {number[]} values - Non-empty list of numbers.
 * @returns {number} Median value.
 * @throws {Error} If the list is empty.
 */
function median(values) {
  assertNonEmpty(values);
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

/**
 * Percentile by the nearest-rank method.
 * @param {number[]} values - Non-empty list of numbers.
 * @param {number} percent - Percentile from 1 to 100, for example 95.
 * @returns {number} Value at the given percentile.
 * @throws {Error} If the list is empty or the percent is out of range.
 */
function percentile(values, percent) {
  assertNonEmpty(values);
  if (!(percent >= PERCENT_MIN && percent <= PERCENT_MAX)) {
    throw new Error(`Percent must be between ${PERCENT_MIN} and ${PERCENT_MAX}, got ${percent}`);
  }
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil((percent / PERCENT_MAX) * sorted.length) - 1)];
}

module.exports = { mean, median, percentile };
