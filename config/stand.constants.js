/** Settings of the React API Data Sample stand. Values come from .env (loaded in playwright config). */
const STAND = {
  apiUrl: process.env.STAND_API_URL || 'http://localhost:4000',
  userEmail: process.env.STAND_USER_EMAIL,
  userPassword: process.env.STAND_USER_PASSWORD,
};

/** Every test task title starts with this prefix, so test data is easy to recognise. */
const TASK_TITLE_PREFIX = 'qa-';

/** Paths of the stand API. */
const STAND_ENDPOINTS = {
  login: '/api/auth/login',
  tasks: '/api/tasks',
  /**
   * Builds the path of one task.
   * @param {number} id - Task id.
   * @returns {string} Path of the task.
   */
  taskById: (id) => `/api/tasks/${id}`,
};

/** HTTP statuses returned by the stand API. */
const STAND_STATUS = {
  ok: 200,
  created: 201,
  noContent: 204,
  unauthorized: 401,
  notFound: 404,
  validationError: 422,
};

/** Values of the TaskStatus enum (see schema.prisma). */
const TASK_STATUS = {
  toDo: 'TO_DO',
  inProgress: 'IN_PROGRESS',
  pending: 'PENDING',
  completed: 'COMPLETED',
};

/** Values of the TaskPriority enum (see schema.prisma). */
const TASK_PRIORITY = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
};

/** Default values of a generated task; a test overrides the ones that matter for its scenario. */
const TASK_DEFAULTS = {
  description: 'Created by an automated test',
  status: TASK_STATUS.toDo,
  priority: TASK_PRIORITY.low,
  dueDate: '2026-12-31T00:00:00.000Z',
};

/** Fields of the Task schema from Swagger. */
const TASK_FIELDS = ['id', 'title', 'description', 'status', 'priority', 'dueDate', 'deletedAt'];

/** Messages returned by the stand API. */
const STAND_MESSAGES = {
  authRequired: 'Authentication required. Please log in.',
};
/** Fallback connection settings of the stand database when .env does not set them. */
const DB_DEFAULTS = {
  host: 'localhost',
  port: 5433,
};
module.exports = {
  STAND,
  TASK_TITLE_PREFIX,
  STAND_ENDPOINTS,
  STAND_STATUS,
  TASK_STATUS,
  TASK_PRIORITY,
  TASK_DEFAULTS,
  TASK_FIELDS,
  STAND_MESSAGES,
  DB_DEFAULTS,
};
