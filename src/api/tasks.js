const { STAND_ENDPOINTS } = require('../../config/stand.constants');

/**
 * HTTP client of the stand API. Methods only send requests and return the raw response:
 * status and body checks stay in the tests.
 */
class TasksApi {
  /**
   * @param {import('@playwright/test').APIRequestContext} context - Context that keeps the authToken cookie.
   */
  constructor(context) {
    this.context = context;
  }

  /**
   * Logs in. The authToken cookie is stored by the context.
   * @param {string} email - User email.
   * @param {string} password - User password.
   * @returns {Promise<import('@playwright/test').APIResponse>} Login response.
   */
  login(email, password) {
    return this.context.post(STAND_ENDPOINTS.login, { data: { email, password } });
  }

  /**
   * Gets all active tasks.
   * @returns {Promise<import('@playwright/test').APIResponse>} Response with the task list.
   */
  list() {
    return this.context.get(STAND_ENDPOINTS.tasks);
  }

  /**
   * Gets one task.
   * @param {number} id - Task id.
   * @returns {Promise<import('@playwright/test').APIResponse>} Response with the task.
   */
  getById(id) {
    return this.context.get(STAND_ENDPOINTS.taskById(id));
  }

  /**
   * Creates a task.
   * @param {object} task - Task body (see Swagger NewTask).
   * @returns {Promise<import('@playwright/test').APIResponse>} Create response.
   */
  create(task) {
    return this.context.post(STAND_ENDPOINTS.tasks, { data: task });
  }

  /**
   * Updates a task (PUT).
   * @param {number} id - Task id.
   * @param {object} task - New task body (see Swagger UpdateTask).
   * @returns {Promise<import('@playwright/test').APIResponse>} Update response.
   */
  update(id, task) {
    return this.context.put(STAND_ENDPOINTS.taskById(id), { data: task });
  }

  /**
   * Soft-deletes a task.
   * @param {number} id - Task id.
   * @returns {Promise<import('@playwright/test').APIResponse>} Delete response.
   */
  remove(id) {
    return this.context.delete(STAND_ENDPOINTS.taskById(id));
  }
}

module.exports = { TasksApi };
