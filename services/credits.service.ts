import {User} from "@prisma/client";
import CreditsRepository from "../repositories/credits.repository";
import {OpenDebentureDTO} from "../DTO/OpenDebenture.DTO";

class CreditsService {
  getCurrentInterest() {
    return 500;
  }
  async orderCredit(user: User, data: OpenDebentureDTO) {
    return await CreditsRepository.createCredit(data, user, this.getCurrentInterest())
  }
}

const service = new CreditsService();

export default service;
