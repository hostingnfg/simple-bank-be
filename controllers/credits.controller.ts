import express from 'express';
import {validationResult} from "express-validator";
import OpenCreditValidator from "../validators/open-credit.validator";
import CreditsService from "../services/credits.service";

const CreditsController = express.Router()

CreditsController.route('/order')
  .post(
    ...OpenCreditValidator,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        const credit = await CreditsService.orderCredit(req.user, req.body)
        if (credit) {
          res.send(credit);
        } else {
          res.status(500).json({ errors: [] })
        }
      }
    }
  )

export default CreditsController;
