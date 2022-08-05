import Repository from "./repository";
import {AccountType, Currency, TransactionType, Account} from "@prisma/client";

export class AccountsRepository extends Repository {
  async getSystemAccount(currency: Currency) {
    return  await this.client.account.findFirst({
      where: {
        type: AccountType.BankAccount,
        currency
      }
    })
  }
  async moneyTransfer(from: Account, to: Account, amount: number, type: TransactionType) {
    return await this.client.$transaction([
      this.client.moneyTransaction.create({
        data: {
          fromId: from.id,
          toId: to.id,
          fromBalanceBefore: from.balance,
          fromBalanceAfter: from.balance - amount,
          toBalanceBefore: to.balance,
          toBalanceAfter: to.balance + amount,
          amount,
          type
        }
      }),
      this.client.account.update({
        where: {
          id: to.id
        },
        data: {
          balance: to.balance + amount
        }
      }),
      this.client.account.update({
        where: {
          id: from.id
        },
        data: {
          balance: from.balance - amount
        }
      })
    ]);
  }
}

const repository = new AccountsRepository('account');

export default repository;