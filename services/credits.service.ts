import {User} from "@prisma/client";
import {OpenCreditDTO} from "../DTO/OpenCredit.DTO";
import AccountsRepository from "../repositories/accounts.repository";

class CreditsService {
  getCurrentInterest() {
    return 5;
  }
  async orderCredit(user: User, data: OpenCreditDTO) {
    return await AccountsRepository.createCredit(data, user)
  }
}

const service = new CreditsService();

export default service;