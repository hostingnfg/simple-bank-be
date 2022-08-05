import {Currency} from "@prisma/client";

export interface OpenDebentureDTO {
  currency: Currency;
  expirationDate: number;
  periodOfPayment: number;
  amount: number;
  account: number;
}