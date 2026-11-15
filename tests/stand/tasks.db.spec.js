const { test, expect } = require('../../src/fixtures/stand');
const { buildTask } = require('../../src/data/task');
const { countTasksByTitle, getTaskById } = require('../../src/db');
const { STAND_STATUS, TASK_PRIORITY, TASK_STATUS } = require('../../config/stand.constants');

// API does the action, SQL confirms the result.
test.describe('Tasks API and database', () => {
  test('created task is saved in the database', async ({ api, db, createdIds }) => {
    const data = buildTask({ status: TASK_STATUS.pending, priority: TASK_PRIORITY.medium });

    const response = await api.create(data);
    const body = await response.json();
    if (body.id) createdIds.push(body.id);
    expect(response.status()).toBe(STAND_STATUS.created);

    await expect.poll(() => getTaskById(db, body.id)).not.toBeNull();
    const row = await getTaskById(db, body.id);
    expect(row.title).toBe(data.title);
    expect(row.description).toBe(data.description);
    expect(row.status).toBe(TASK_STATUS.pending);
    expect(row.priority).toBe(TASK_PRIORITY.medium);
    expect(row.dueDate.toISOString()).toBe(data.dueDate);
    expect(row.deletedAt).toBeNull();
    expect(await countTasksByTitle(db, data.title)).toBe(1);
  });

  test('updated field is saved and other fields stay the same', async ({ api, db, createTask }) => {
    const task = await createTask({ status: TASK_STATUS.toDo });
    const before = await getTaskById(db, task.id);

    const response = await api.update(task.id, {
      title: task.title,
      description: task.description,
      status: TASK_STATUS.inProgress,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    expect(response.status()).toBe(STAND_STATUS.ok);

    await expect
      .poll(async () => (await getTaskById(db, task.id)).status)
      .toBe(TASK_STATUS.inProgress);
    const after = await getTaskById(db, task.id);
    expect({ ...after, status: before.status }).toEqual(before);
  });

  test('deleted task is hidden by the API and marked as deleted in the database', async ({
    api,
    db,
    createTask,
  }) => {
    const task = await createTask();

    const deleteResponse = await api.remove(task.id);
    expect(deleteResponse.status()).toBe(STAND_STATUS.noContent);

    expect((await api.getById(task.id)).status()).toBe(STAND_STATUS.notFound);
    const list = await (await api.list()).json();
    expect(list.some((item) => item.id === task.id)).toBe(false);

    await expect
      .poll(async () => (await getTaskById(db, task.id))?.deletedAt ?? null)
      .not.toBeNull();
    const row = await getTaskById(db, task.id);
    expect(row.id).toBe(task.id);
    expect(row.title).toBe(task.title);
  });
});
