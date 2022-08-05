import {AccountsRepository} from "./accounts.repository";
import {OpenCreditDTO} from "../DTO/OpenCredit.DTO";
import {AccountType, TransactionType, User} from "@prisma/client";

class CreditsRepository extends AccountsRepository {
  async createCredit(data: OpenCreditDTO, user: User, interest: number) {
    const systemAccount = await this.getSystemAccount(data.currency)
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
        const credit = this.client.account.create({
            data: {
              periodOfPayment: data.periodOfPayment,
              expirationDate: new Date(data.expirationDate),
              balance: data.amount,
              currency: data.currency,
              type: AccountType.CreditAccount,
              ownerId: user.id,
              interest
            }
        })
        await this.moneyTransfer(systemAccount, targetAccount, data.amount, TransactionType.IssuanceOfLoan)
        return credit;
      }
    }
    return false;
  }
}

const repository = new CreditsRepository('account');

export default repository;