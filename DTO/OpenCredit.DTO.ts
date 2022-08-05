import {Currency} from "@prisma/client";

export interface OpenCreditDTO {
  currency: Currency;
  expirationDate: number;
  periodOfPayment: number;
  amount: number;
  account: number;
}