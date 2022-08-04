import {body} from "express-validator";

export default [
  body('email').isEmail(),
  // body('password').isLength({min: 8}),
  body('firstName').isLength({min: 1}),
  body('lastName').isLength({min: 1}),
]