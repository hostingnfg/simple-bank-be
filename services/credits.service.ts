import {User} from "@prisma/client";
import {OpenCreditDTO} from "../DTO/OpenCredit.DTO";
import CreditsRepository from "../repositories/credits.repository";

class CreditsService {
  getCurrentInterest() {
    return 5;
  }
  async orderCredit(user: User, data: OpenCreditDTO) {
    return await CreditsRepository.createCredit(data, user, this.getCurrentInterest())
  }
}

const service = new CreditsService();

export default service;