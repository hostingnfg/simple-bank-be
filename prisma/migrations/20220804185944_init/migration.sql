-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ownerId` INTEGER NOT NULL,
    `balance` INTEGER NOT NULL,
    `type` ENUM('BankAccount', 'UserAccount', 'DepositAccount', 'CreditAccount') NOT NULL DEFAULT 'UserAccount',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `periodOfPayment` INTEGER NULL,
    `currency` ENUM('EUR', 'USD', 'GBP') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MoneyTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fromId` INTEGER NOT NULL,
    `toId` INTEGER NOT NULL,
    `fromBalanceBefore` INTEGER NOT NULL,
    `fromBalanceAfter` INTEGER NOT NULL,
    `toBalanceBefore` INTEGER NOT NULL,
    `toBalanceAfter` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('Remittance', 'CurrencyExchange', 'AccrualOfFine', 'LoanInterest', 'ClosingLoan', 'DepositInterest', 'ClosingDeposit', 'Commission') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MoneyTransaction` ADD CONSTRAINT `MoneyTransaction_fromId_fkey` FOREIGN KEY (`fromId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MoneyTransaction` ADD CONSTRAINT `MoneyTransaction_toId_fkey` FOREIGN KEY (`toId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
