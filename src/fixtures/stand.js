const base = require('@playwright/test');
const { STAND, STAND_STATUS } = require('../../config/stand.constants');
const { TasksApi } = require('../api/tasks');
const { buildTask } = require('../data/task');
const { createDbClient, deleteTaskById } = require('../db');

/** Delete statuses that count as a successful cleanup (404 means the test already deleted the task). */
const ACCEPTED_DELETE_STATUSES = [STAND_STATUS.noContent, STAND_STATUS.notFound];

/** Test with the stand fixtures: DB connection, logged in API client and test data cleanup. */
const test = base.test.extend({
  /**
   * Worker-scoped PostgreSQL connection. It is opened only by tests that ask for `db`
   * and closed after all tests of the worker.
   */
  db: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const client = createDbClient();
      await client.connect();
      await use(client);
      await client.end();
    },
    { scope: 'worker' },
  ],

  /**
   * Worker-scoped API client. The login runs once per worker, and the request context
   * keeps the authToken cookie for the next requests.
   */
  api: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      if (!STAND.userEmail || !STAND.userPassword) {
        throw new Error('STAND_USER_EMAIL and STAND_USER_PASSWORD must be set (see .env.example)');
      }
      const context = await base.request.newContext({ baseURL: STAND.apiUrl });
      const api = new TasksApi(context);
      const login = await api.login(STAND.userEmail, STAND.userPassword);
      if (!login.ok()) throw new Error(`Stand login failed with status ${login.status()}`);
      await use(api);
      await context.dispose();
    },
    { scope: 'worker' },
  ],

  /**
   * Ids of tasks created by the current test. After the test every task is soft-deleted
   * via API and then removed physically from the table. The cleanup also runs when the test
   * fails. Unexpected delete statuses are reported after all rows are processed.
   */
  createdIds: async ({ api, db }, use) => {
    const ids = [];
    await use(ids);
    const failures = [];
    for (const id of ids) {
      const response = await api.remove(id);
      if (!ACCEPTED_DELETE_STATUSES.includes(response.status())) {
        failures.push(`${id} (status ${response.status()})`);
      }
      await deleteTaskById(db, id);
    }
    if (failures.length > 0) {
      throw new Error(`Cleanup failed for tasks: ${failures.join(', ')}`);
    }
  },

  /**
   * Factory that creates tasks with unique titles through the API.
   * Every created task is registered in `createdIds` for cleanup.
   */
  createTask: async ({ api, createdIds }, use) => {
    /**
     * Creates one task.
     * @param {object} [overrides] - Task fields that replace the defaults.
     * @returns {Promise<object>} Task from the response body.
     * @throws {Error} If the stand does not answer with 201.
     */
    const createTask = async (overrides = {}) => {
      const response = await api.create(buildTask(overrides));
      if (response.status() !== STAND_STATUS.created) {
        throw new Error(`Task preparation failed: create returned ${response.status()}`);
      }
      const task = await response.json();
      createdIds.push(task.id);
      return task;
    };
    await use(createTask);
  },
});

module.exports = { test, expect: base.expect };
