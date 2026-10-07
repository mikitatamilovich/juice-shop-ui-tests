/**
 * Escapes special regular expression characters in a string.
 * @param {string} text - Text to escape, for example "Apple Juice (1000ml)".
 * @returns {string} Text that can be safely used inside new RegExp().
 */
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds a case-sensitive matcher for a product name.
 * Case sensitivity keeps "Apple Juice" from matching "Pineapple Juice".
 * @param {string} productName - Product name as shown on the card.
 * @returns {RegExp} Case-sensitive matcher.
 */
function productNameMatcher(productName) {
  return new RegExp(escapeRegExp(productName));
}

module.exports = { escapeRegExp, productNameMatcher };
