import { check } from 'express-validator/check';

export default [
  check('url').exists(),
  check('resolution').exists(),
];
