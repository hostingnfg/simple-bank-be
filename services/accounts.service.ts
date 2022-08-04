import { User } from "@prisma/client";
import AccountsRepository from "../repositories/accounts.repository";


class AccountsService {
  openAccount(user: User, currency: string) {
    return AccountsRepository.create({
      ownerId: user.id,
      balance: 0,
      type: 'UserAccount',
      currency
    })
  }
}

const service = new AccountsService();

export default service;