const base = require('@playwright/test');
const { STAND, STAND_STATUS } = require('../../config/stand.constants');
const { TasksApi } = require('../api/tasks');
const { buildTask } = require('../data/task');
const { createDbClient } = require('../db');

/** Test with the stand fixtures: DB connection, logged in API client and test data cleanup. */
const test = base.test.extend({
  // One DB connection per worker. It is opened only by tests that ask for `db`.
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

  // One login per worker. The context keeps the authToken cookie for the next requests.
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

  // Ids of tasks created by the current test. They are soft-deleted via API after the test,
  // also when the test fails. A 404 (already deleted by the test) is fine and ignored.
  createdIds: async ({ api }, use) => {
    const ids = [];
    await use(ids);
    for (const id of ids) {
      await api.remove(id);
    }
  },

  // Creates a task with a unique title and returns the task from the response body.
  createTask: async ({ api, createdIds }, use) => {
    await use(async (overrides = {}) => {
      const response = await api.create(buildTask(overrides));
      if (response.status() !== STAND_STATUS.created) {
        throw new Error(`Task preparation failed: create returned ${response.status()}`);
      }
      const task = await response.json();
      createdIds.push(task.id);
      return task;
    });
  },
});

module.exports = { test, expect: base.expect };
