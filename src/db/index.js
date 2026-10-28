const { Client } = require('pg');

/**
 * Task columns for SELECT. The table stores UTC values in "timestamp without time zone",
 * and pg would parse them in the local time zone, so the dates are converted to timestamptz.
 * The string has no interpolated values: all values go to queries as parameters.
 */
const TASK_COLUMNS = `id, title, description, status, priority,
  "dueDate" AT TIME ZONE 'UTC' AS "dueDate",
  "createdAt" AT TIME ZONE 'UTC' AS "createdAt",
  "deletedAt" AT TIME ZONE 'UTC' AS "deletedAt"`;

/**
 * Creates a PostgreSQL client from environment variables (not connected yet).
 * @returns {import('pg').Client} Client, call connect() before use.
 * @throws {Error} If a required variable is missing.
 */
function createDbClient() {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  for (const [name, value] of Object.entries({ DB_NAME, DB_USER, DB_PASSWORD })) {
    if (!value) throw new Error(`Environment variable ${name} is not set (see .env.example)`);
  }
  return new Client({
    host: DB_HOST || 'localhost',
    port: Number(DB_PORT || 5433),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  });
}

/**
 * Finds a task row by id, including soft-deleted ones.
 * @param {import('pg').Client} db - Connected client.
 * @param {number} id - Task id.
 * @returns {Promise<object|null>} Row or null if there is no such record.
 */
async function getTaskById(db, id) {
  const { rows } = await db.query(`SELECT ${TASK_COLUMNS} FROM "Task" WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

/**
 * Counts records with the exact title (soft-deleted included).
 * @param {import('pg').Client} db - Connected client.
 * @param {string} title - Task title.
 * @returns {Promise<number>} Number of records.
 */
async function countTasksByTitle(db, title) {
  const { rows } = await db.query('SELECT COUNT(*)::int AS count FROM "Task" WHERE title = $1', [
    title,
  ]);
  return rows[0].count;
}

/**
 * Physically removes a task row. Use only for data created by the current test.
 * @param {import('pg').Client} db - Connected client.
 * @param {number} id - Task id.
 * @returns {Promise<void>} Resolves after the DELETE.
 */
async function deleteTaskById(db, id) {
  await db.query('DELETE FROM "Task" WHERE id = $1', [id]);
}

module.exports = { createDbClient, getTaskById, countTasksByTitle, deleteTaskById };
