-- AlterTable
ALTER TABLE `MoneyTransaction` MODIFY `type` ENUM('Remittance', 'CurrencyExchange', 'AccrualOfFine', 'IssuanceOfLoan', 'OpeningDeposit', 'LoanInterest', 'ClosingLoan', 'DepositInterest', 'ClosingDeposit', 'Commission') NOT NULL;
