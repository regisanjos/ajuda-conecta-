/*
  Warnings:

  - You are about to drop the column `amount` on the `donation` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `donation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `donation` DROP COLUMN `amount`,
    DROP COLUMN `currency`;
