import {body} from "express-validator";

export default [
  body('currency').isIn(['EUR', 'USD', 'GBP']),
]