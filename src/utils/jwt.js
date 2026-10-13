const JWT_PART_SEPARATOR = '.';
const JWT_PAYLOAD_INDEX = 1;
const JWT_ENCODING = 'base64url';
const TEXT_ENCODING = 'utf8';

/**
 * Decodes the payload of a JWT without verifying the signature.
 * @param {string} token - JWT in the form header.payload.signature.
 * @returns {Record<string, any>} Decoded payload object.
 */
function decodeJwtPayload(token) {
  const payload = token.split(JWT_PART_SEPARATOR)[JWT_PAYLOAD_INDEX];
  return JSON.parse(Buffer.from(payload, JWT_ENCODING).toString(TEXT_ENCODING));
}

module.exports = { decodeJwtPayload };
