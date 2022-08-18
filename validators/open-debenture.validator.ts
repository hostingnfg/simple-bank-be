import {body} from "express-validator";

export default [
  body('currency').isIn(['EUR', 'USD', 'GBP']),
  body('amount').isFloat({min: 0.01}),
  body('expirationDate').isFloat({min: +(new Date())}),
  body('periodOfPayment').isFloat({min: 1}),
  body('account').isFloat({min: 1})
]
