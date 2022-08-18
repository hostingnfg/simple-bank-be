import {Account, AccountType, Currency, User, MoneyTransaction, TransactionType} from "@prisma/client";
import {OpenDepositDTO} from "../DTO/OpenDeposit.DTO";
import DepositsRepository from "../repositories/deposits.repository";
import {AccountRelTransactionsDTO} from "../DTO/AccountRelTransactions.DTO";

class DepositsService {
  getCurrentInterest() {
    return 400;
  }
  async orderDeposit(user: User, data: OpenDepositDTO) {
    return await DepositsRepository.createDeposit(data, user, this.getCurrentInterest())
  }

  async checkDeposit(deposit: AccountRelTransactionsDTO) {
    if (deposit.expirationDate && deposit.createdAt && deposit.periodOfPayment && deposit.interest) {
      const sysAcc = await DepositsRepository.getSystemAccount(deposit.currency)
      const userAcc = await DepositsRepository.getDebitAccount(deposit.currency, deposit.ownerId)
      const now = new Date();
      const totalDuration = Math.floor((+deposit.expirationDate - +deposit.createdAt)/60000)
      const currentDuration = Math.floor(
        (+(deposit.expirationDate < now ? deposit.expirationDate : now) - +deposit.createdAt)/60000
      )
      const successPayment = deposit.relatedTransactions.reduce((acc:number, current:MoneyTransaction) => {
        return current.amount + acc;
      }, 0)
      const minPeriodPayment = deposit.balance * deposit.interest/14400000
      const pastPayments = Math.floor(currentDuration / deposit.periodOfPayment)
      const neededAmount = pastPayments * minPeriodPayment * deposit.periodOfPayment
      const transactionAmount = Math.floor(neededAmount - successPayment)

      if (transactionAmount > 0 && sysAcc && userAcc) {
        await DepositsRepository.moneyTransfer(
          sysAcc,
          userAcc,
          transactionAmount,
          TransactionType.DepositInterest,
          deposit.id
        )
      }
      if (currentDuration === totalDuration && deposit.balance > 0 && sysAcc && userAcc) {
        await DepositsRepository.moneyTransfer(
          sysAcc,
          userAcc,
          deposit.balance,
          TransactionType.ClosingDeposit,
          deposit.id
        )
        await DepositsRepository.closeAccount(deposit)
      }
    }
  }

  checkingPaymentsOnDeposits(cursor?: number) {
    DepositsRepository.findMany({
      ...cursor ? {
        skip: 1,
        cursor: {
          id: cursor,
        },
      } : { },
      take: 5,
      where: {
        NOT: {
          balance: 0,
          active: false,
        },
        type: 'DepositAccount'
      },
      include: {
        relatedTransactions: true
      }
    }).then(async res => {
      for (let i = 0; i<res.length; i++) {
        await this.checkDeposit(res[i])
      }
      if (res.length > 0) {
        this.checkingPaymentsOnDeposits(res[res.length - 1].id);
      }
    })
  }
}

const service = new DepositsService();

export default service;
