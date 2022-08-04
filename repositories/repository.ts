import { PrismaClient } from '@prisma/client'

class Repository {
  client: PrismaClient;
  model: string;
  constructor(model: string) {
    this.client = new PrismaClient();
    this.model = model;
  }
  create(data: any): Promise<any> {
    // @ts-ignore
    return this.client[this.model].create({ data })
  }
  findUnique(data: any): Promise<any> {
    // @ts-ignore
    return this.client[this.model].findUnique(data)
  }
}

export default Repository;