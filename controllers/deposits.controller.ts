import express from 'express';
import {validationResult} from "express-validator";
import OpenDepositValidator from "../validators/open-deposit.validator";
import DepositsService from "../services/deposits.service";

const DepositsController = express.Router()

DepositsController.route('/order')
  .post(
    ...OpenDepositValidator,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        const deposit = await DepositsService.orderDeposit(req.user, req.body)
        if (deposit) {
          res.send(deposit);
        } else {
          res.status(500).json({ errors: [] })
        }
      }
    }
  )

export default DepositsController;