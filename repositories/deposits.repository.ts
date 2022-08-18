import {AccountsRepository} from "./accounts.repository";
import {AccountType, TransactionType, User} from "@prisma/client";
import {OpenDebentureDTO} from "../DTO/OpenDebenture.DTO";

class DepositsRepository extends AccountsRepository {
  async createDeposit(data: OpenDebentureDTO, user: User, interest: number) {
    const systemAccount = await this.getSystemAccount(data.currency)
    const expirationDate = new Date(data.expirationDate);
    const targetAccount = await this.findUnique({
      where: {
        id: data.account
      }
    })
    if (systemAccount && targetAccount) {
      if (targetAccount.balance < data.amount || expirationDate < new Date()) {
        return false;
      } else {
        if (targetAccount.currency !== data.currency || targetAccount.ownerId !== user.id ) {
          return false;
        }
        const deposit = this.client.account.create({
          data: {
            periodOfPayment: data.periodOfPayment,
            expirationDate,
            balance: data.amount,
            currency: data.currency,
            type: AccountType.DepositAccount,
            ownerId: user.id,
            interest
          }
        })
        await this.moneyTransfer(targetAccount, systemAccount, data.amount, TransactionType.OpeningDeposit)
        return deposit;
      }
    }
  }
}

const repository = new DepositsRepository('account');

export default repository;
