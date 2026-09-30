require('dotenv').config();
const { getRequiredEnv } = require('../src/utils/env');

/** Base URL of the application under test. */
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

/** Product used in the basket scenario (name as shown on the card). */
const PRODUCT_NAME = 'Apple Juice (1000ml)';

/** Password for generated test users, taken from the .env file. */
const TEST_USER_PASSWORD = getRequiredEnv('TEST_USER_PASSWORD');

/** Wrong password for the negative login scenarios, taken from the .env file. */
const WRONG_PASSWORD = getRequiredEnv('WRONG_PASSWORD');

/** Parts of the generated test user email. */
const TEST_EMAIL = {
  prefix: 'qa.user',
  domain: 'example.com',
};

/** API endpoints. */
const API_PATHS = {
  users: '/api/Users',
};

/** HTTP status codes used in checks. */
const HTTP_STATUS = {
  created: 201,
};

/** CSS selectors for elements without a good accessible name. */
const SELECTORS = {
  accountMenu: '#navbarAccount',
  loginMenuItem: '#navbarLoginButton',
  productCard: 'mat-card',
};

/** Visible names of buttons, labels and headings. */
const UI_TEXT = {
  appHeading: 'OWASP Juice Shop',
  dismissButton: 'Dismiss',
  cookieButton: 'Me want it!',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  loginButton: 'Log in',
  addToBasketButton: 'Add to Basket',
  basketButton: 'Your Basket',
  checkoutButton: 'Checkout',
};

/** Expected messages shown by the application. */
const MESSAGES = {
  invalidLogin: 'Invalid email or password.',
  emptyEmail: 'Please provide an email address.',
  productAdded: (productName) => `Placed ${productName} into basket`,
};

module.exports = {
  BASE_URL,
  PRODUCT_NAME,
  TEST_USER_PASSWORD,
  WRONG_PASSWORD,
  TEST_EMAIL,
  API_PATHS,
  HTTP_STATUS,
  SELECTORS,
  UI_TEXT,
  MESSAGES,
};
