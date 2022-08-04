import express from 'express';
import OpenAccountValidator from "../validators/open-account.validator";
import {validationResult} from "express-validator";
import AccountsService from "../services/accounts.service";

const AccountsController = express.Router()

AccountsController.route('/open')
  .post(
    ...OpenAccountValidator,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        const account = await AccountsService.openAccount(req.user, req.body.currency)
        if (account) {
          res.send(account);
        } else {
          res.status(500).json({ errors: [] })
        }
      }
    }
  )

export default AccountsController;