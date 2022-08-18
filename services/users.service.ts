import UsersRepository from "../repositories/users.repository";
import {RegistrationDTO} from "../DTO/Registration.DTO";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {AuthResponseDTO} from "../DTO/AuthResponse.DTO";
import {LoginDTO} from "../DTO/Login.DTO";

class UsersService {
  encryptPassword(password: string): Promise<string> {
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
  checkPassword(hashedPassword: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, function(err, isPasswordMatch) {
        resolve(!err && isPasswordMatch)
      });
    })
  }
  generateJWT(user: any):AuthResponseDTO {
    return {
      token: jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET ?? '',
        { expiresIn: 86400 }
      ),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user.id
    }
  }
  async create(data: RegistrationDTO):Promise<AuthResponseDTO|boolean> {
    const user = await UsersRepository.create({
      ...data,
      password: await this.encryptPassword(data.password)
    })
    if (user) {
      return this.generateJWT(user)
    }
    return false;
  }
  async login(data: LoginDTO):Promise<AuthResponseDTO|boolean> {
    const user = await UsersRepository.findUnique({
      where: {
        email: data.email
      }
    })
    if(user && await this.checkPassword(user.password, data.password)) {
      return this.generateJWT(user)
    } else {
      return false;
    }
  }
}

const service = new UsersService();

export default service;
