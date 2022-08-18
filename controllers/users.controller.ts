import express from 'express';
import { validationResult } from 'express-validator';
import RegistrationValidator from "../validators/registration.validator";
import UsersService from "../services/users.service";
import AuthValidator from "../validators/auth.validator";
import {PrismaErrorDTO} from "../DTO/PrismaError.DTO";

const UsersController = express.Router()

UsersController.route('/')
  .post(
    ...RegistrationValidator,
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
        } else {
          const user = await UsersService.create(req.body);
          if (user) {
            res.send(user)
          } else {
            res.status(500).json({ errors: [] })
          }
        }
      } catch (e) {
        if ((e as PrismaErrorDTO).meta?.target === 'User_email_key') {
          res.status(400).json({
            errors: [
              {
                value: req.body.email,
                msg: "User already exist!",
                param: "email",
              }
            ]
          })
        } else {
          res.status(500).json({ errors: [] })
        }
      }
    }
  )

UsersController.route('/login')
  .post(
    ...AuthValidator,
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({errors: errors.array()});
        } else {
          const loginDTO = await UsersService.login(req.body);
          if (loginDTO) {
            res.send(loginDTO)
          } else {
            res.status(401).json({ errors: {auth: false}})
          }
        }
      } catch (e) {
        res.status(500).json({ errors: [] })
      }
    }
  )

export default UsersController;
