import {Account, MoneyTransaction} from "@prisma/client";

export interface AccountRelTransactionsDTO extends Account {
  relatedTransactions: MoneyTransaction[]
}