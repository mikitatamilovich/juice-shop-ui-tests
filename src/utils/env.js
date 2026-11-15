/**
 * Reads a required environment variable.
 * @param {string} name - Name of the environment variable.
 * @returns {string} Value of the variable.
 * @throws {Error} If the variable is not set or empty.
 */
function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set. Check your .env file.`);
  }
  return value;
}

module.exports = { getRequiredEnv };
