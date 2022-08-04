import UsersRepository from "../repositories/users.repository";
import {RegistrationDTO} from "../DTO/Registration.DTO";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {AuthResponseDTO} from "../DTO/AuthResponseDTO";

class UsersService {
  encryptPassword(password: string) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, function(err, salt) {
        if (err) {
          reject(err)
        } else {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              reject(err)
            } else {
              resolve(hash)
            }
          });
        }
      });
    })
  }
  async create(data: RegistrationDTO):Promise<AuthResponseDTO|boolean> {
    const user = await UsersRepository.create({
      ...data,
      password: await this.encryptPassword(data.password)
    })
    if (user) {
      return {
        token: jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET ?? '',
          { expiresIn: 3600 }
        ),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user.id
      }
    }
    return false;
  }
}

const service = new UsersService();

export default service;