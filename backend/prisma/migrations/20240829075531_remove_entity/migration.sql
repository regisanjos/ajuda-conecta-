/*
  Warnings:

  - You are about to drop the `donationexit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `donationexit` DROP FOREIGN KEY `DonationExit_donationId_fkey`;

-- DropTable
DROP TABLE `donationexit`;
