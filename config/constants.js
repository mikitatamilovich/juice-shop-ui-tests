require('dotenv').config();
const { getRequiredEnv } = require('../src/utils/env');

/** Base URL of the application under test. */
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

/** Product used in the basket scenarios (name as shown on the card). */
const PRODUCT_NAME = 'Apple Juice (1000ml)';

/** Password for generated test users, taken from the .env file. */
const TEST_USER_PASSWORD = getRequiredEnv('TEST_USER_PASSWORD');

/** Wrong password for the negative login scenarios, taken from the .env file. */
const WRONG_PASSWORD = getRequiredEnv('WRONG_PASSWORD');

/** Parts of the generated test user email. */
const TEST_EMAIL = {
  prefix: 'qa.user',
  domain: 'example.com',
  suffixLength: 8,
};

/** Application routes. */
const ROUTES = {
  home: '/',
  basket: '/basket',
  search: '/search',
};

/** Timeouts in milliseconds. */
const TIMEOUTS = {
  test: 30000,
  expect: 5000,
};

/** API endpoints. */
const API_PATHS = {
  users: '/api/Users',
};

/** HTTP status codes used in checks. */
const HTTP_STATUS = {
  created: 201,
};

/** CSS selectors for elements without a stable accessible name. */
const SELECTORS = {
  accountMenu: '#navbarAccount',
  loginMenuItem: '#navbarLoginButton',
  passwordInput: '#password',
  passwordToggle: 'mat-form-field:has(#password) button',
  loginSubmit: '#loginButton',
  searchIcon: '#searchQuery',
  searchInput: 'app-mat-search-bar input',
  productCard: 'mat-card',
  snackBar: 'simple-snack-bar',
  basketRow: 'mat-row',
  totalPrice: '#price',
};

/** Accessible names of buttons, labels and visible texts. */
const UI_TEXT = {
  welcomeCloseButton: 'Close Welcome Banner',
  cookieButton: 'dismiss cookie message',
  homeButton: 'Back to homepage',
  profileMenuItem: 'Go to user profile',
  appHeading: 'OWASP Juice Shop',
  emailLabel: 'Email',
  addToBasketButton: 'Add to Basket',
  basketButton: 'Show the shopping cart',
  checkoutButton: 'Checkout',
};

/** Expected messages shown by the application. */
const MESSAGES = {
  invalidLogin: 'Invalid email or password.',
  emptyEmail: 'Please provide an email address.',
  noResults: 'No results found',
  productAdded: (productName) => `Placed ${productName} into basket`,
  productAddedAgain: (productName) => `Added another ${productName} to basket`,
};

/** Search scenario data. */
const SEARCH = {
  existingQuery: 'Apple',
  existingResultsCount: 3,
  missingQuery: 'qwertyxyz',
};

/** Expected values for the basket scenarios. */
const EXPECTED = {
  priceOne: '1.99',
  priceTwo: '3.98',
};

/** Values of the type attribute of the password input. */
const INPUT_TYPE = {
  hidden: 'password',
  visible: 'text',
};

/** HTML attributes used in checks. */
const ATTRIBUTES = {
  type: 'type',
};

/** Keyboard keys used by the tests. */
const KEYS = {
  enter: 'Enter',
};

/** Replaces empty strings for zero hardcode compliance. */
const EMPTY_VALUE = '';

module.exports = {
  BASE_URL,
  PRODUCT_NAME,
  TEST_USER_PASSWORD,
  WRONG_PASSWORD,
  TEST_EMAIL,
  ROUTES,
  TIMEOUTS,
  API_PATHS,
  HTTP_STATUS,
  SELECTORS,
  UI_TEXT,
  MESSAGES,
  SEARCH,
  EXPECTED,
  INPUT_TYPE,
  ATTRIBUTES,
  KEYS,
  EMPTY_VALUE,
};
