import {PrismaClient} from "@prisma/client";
import {rndStr} from "../../utills/helpers";

const client = new PrismaClient();

(async () => {
  const systemUser = await client.user.create({
    data: {
      firstName: 'system',
      lastName: 'system',
      email: 'system@system',
      password: rndStr(128)
    }
  })
  await client.account.createMany({
    data: ['EUR', 'USD', 'GBP'].map(currency => ({
      ownerId: systemUser.id,
      balance: 1000000,
      currency,
      type: 'BankAccount'
    })) as any
  })
})()