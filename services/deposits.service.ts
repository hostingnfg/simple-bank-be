import {User} from "@prisma/client";
import {OpenDepositDTO} from "../DTO/OpenDeposit.DTO";
import DepositsRepository from "../repositories/deposits.repository";

class DepositsService {
  getCurrentInterest() {
    return 4;
  }
  async orderDeposit(user: User, data: OpenDepositDTO) {
    return await DepositsRepository.createDeposit(data, user, this.getCurrentInterest())
  }
}

const service = new DepositsService();

export default service;