import Repository from "./repository";
import {OpenCreditDTO} from "../DTO/OpenCredit.DTO";
import {AccountType, Currency, PrismaClient, User, TransactionType} from "@prisma/client";

class AccountsRepository extends Repository {
  async getSystemAccount(currency: Currency) {
    return  await this.client.account.findFirst({
      where: {
        type: AccountType.BankAccount,
        currency
      }
    })
  }

  async createCredit(data: OpenCreditDTO, user: User) {
    const systemAccount = await this.getSystemAccount(data.currency)
    let interest = process.env.CREDIT_INTEREST_BASE ?? 5;
    if (typeof interest === 'string') {
      interest = Number.parseInt(interest)
    }
    if (systemAccount) {
      if (systemAccount.balance < data.amount) {
        return false;
      } else {
        const targetAccount = await this.findUnique({
          where: {
            id: data.account
          }
        })
        if (targetAccount.ownerId !== user.id || targetAccount.currency !== data.currency) {
          return false;
        }
        const result = await this.client.$transaction([
          this.client.account.create({
            data: {
              periodOfPayment: data.periodOfPayment,
              expirationDate: new Date(data.expirationDate),
              balance: data.amount,
              currency: data.currency,
              type: AccountType.CreditAccount,
              ownerId: user.id,
              interest
            }
          }),
          this.client.moneyTransaction.create({
            data: {
              fromId: systemAccount.id,
              toId: targetAccount.id,
              fromBalanceBefore: systemAccount.balance,
              fromBalanceAfter: systemAccount.balance - data.amount,
              toBalanceBefore: targetAccount.balance,
              toBalanceAfter: targetAccount.balance + data.amount,
              amount: data.amount,
              type: TransactionType.IssuanceOfLoan
            }
          }),
          this.client.account.update({
            where: {
              id: targetAccount.id
            },
            data: {
              balance: targetAccount.balance + data.amount
            }
          }),
          this.client.account.update({
            where: {
              id: systemAccount.id
            },
            data: {
              balance: systemAccount.balance - data.amount
            }
          })
        ])
        return result[0];
      }
    }
    return false;
  }
}

const repository = new AccountsRepository('account');

export default repository;