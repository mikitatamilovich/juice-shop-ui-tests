/** Error thrown when an HTTP request to the application fails. */
class NetworkError extends Error {
  /**
   * @param {string} message - Description of the failure.
   * @param {number} status - HTTP status code of the response.
   */
  constructor(message, status) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

module.exports = { NetworkError };
