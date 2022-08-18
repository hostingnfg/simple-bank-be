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

  async getDebitAccount(currency: Currency, ownerId: number) {
    return await this.findFirst({
      where: {
        currency,
        ownerId,
        type: AccountType.UserAccount
      }
    })
  }

  async moneyTransfer(from: Account, to: Account, amount: number, type: TransactionType, productId?: number) {
    await this.client.moneyTransaction.create({
      data: {
        fromId: from.id,
        toId: to.id,
        fromBalanceBefore: from.balance,
        fromBalanceAfter: from.balance - amount,
        toBalanceBefore: to.balance,
        toBalanceAfter: to.balance + amount,
        amount,
        type,
        productId
      }
    });
    await this.client.account.update({
        where: {
          id: to.id
        },
        data: {
          balance: to.balance + amount
        }
    });
    await this.client.account.update({
        where: {
          id: from.id
        },
        data: {
          balance: from.balance - amount
        }
    });
  }

  async closeAccount(account: Account) {
    return await this.update({
      where: {
        id: account.id
      },
      data: {
        active: false
      }
    })
  }
}

const repository = new AccountsRepository('account');

export default repository;
