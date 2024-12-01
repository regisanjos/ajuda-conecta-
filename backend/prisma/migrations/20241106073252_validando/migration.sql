/*
  Warnings:

  - You are about to drop the column `discripition` on the `disaster` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `donation` table. All the data in the column will be lost.
  - The values [APROVED] on the enum `Donation_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `trackinNumber` on the `eta` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `user` table. All the data in the column will be lost.
  - The values [ADIMIN] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `updatedAt` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `disaster` DROP COLUMN `discripition`,
    ADD COLUMN `discription` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `donation` DROP COLUMN `updateAt`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `eta` DROP COLUMN `trackinNumber`,
    ADD COLUMN `trackingNumber` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `updateAt`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL;
