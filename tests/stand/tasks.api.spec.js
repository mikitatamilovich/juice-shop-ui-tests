const { test, expect } = require('../../src/fixtures/stand');
const { buildTask } = require('../../src/data/task');
const {
  STAND_ENDPOINTS,
  STAND_MESSAGES,
  STAND_STATUS,
  TASK_FIELDS,
  TASK_PRIORITY,
  TASK_STATUS,
} = require('../../config/stand.constants');

test.describe('Tasks API', () => {
  test('should return a list of tasks with the documented fields', async ({ api, createTask }) => {
    const task = await createTask();

    const response = await api.list();

    expect(response.status()).toBe(STAND_STATUS.ok);
    const tasks = await response.json();
    expect(Array.isArray(tasks)).toBe(true);
    for (const item of tasks) {
      expect(Object.keys(item)).toEqual(expect.arrayContaining(TASK_FIELDS));
    }
    // Only our own record is checked: the table also has seed data and other tests' records.
    expect(tasks.find((item) => item.id === task.id)).toMatchObject({
      title: task.title,
      deletedAt: null,
    });
  });

  test('should return a task by id', async ({ api, createTask }) => {
    const task = await createTask({ priority: TASK_PRIORITY.high });

    const response = await api.getById(task.id);

    expect(response.status()).toBe(STAND_STATUS.ok);
    expect(await response.json()).toMatchObject({
      id: task.id,
      title: task.title,
      description: task.description,
      status: TASK_STATUS.toDo,
      priority: TASK_PRIORITY.high,
      dueDate: task.dueDate,
      deletedAt: null,
    });
  });

  test('should create a task', async ({ api, createdIds }) => {
    const data = buildTask({ status: TASK_STATUS.inProgress, priority: TASK_PRIORITY.high });

    const response = await api.create(data);
    const body = await response.json();
    if (body.id) createdIds.push(body.id);

    expect(response.status()).toBe(STAND_STATUS.created);
    expect(Number.isInteger(body.id)).toBe(true);
    expect(body).toMatchObject({ ...data, deletedAt: null });
  });

  test('should reject a task without a title', async ({ api }) => {
    const withoutTitle = buildTask();
    delete withoutTitle.title;

    const response = await api.create(withoutTitle);

    expect(response.status()).toBe(STAND_STATUS.validationError);
  });

  test('should not return tasks without authorization', async ({ request }) => {
    // The built-in `request` fixture has no authToken cookie.
    const response = await request.get(STAND_ENDPOINTS.tasks);

    expect(response.status()).toBe(STAND_STATUS.unauthorized);
    expect(await response.json()).toMatchObject({ message: STAND_MESSAGES.authRequired });
  });
});
