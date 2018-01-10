import { check } from 'express-validator/check';

export default [
  check('list').exists(),
  check('resolution').exists(),
];
