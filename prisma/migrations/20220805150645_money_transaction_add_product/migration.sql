-- AlterTable
ALTER TABLE `MoneyTransaction` ADD COLUMN `productId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `MoneyTransaction` ADD CONSTRAINT `MoneyTransaction_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Account`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
