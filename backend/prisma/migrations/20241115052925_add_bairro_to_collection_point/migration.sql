/*
  Warnings:

  - You are about to drop the column `address` on the `collectionpoint` table. All the data in the column will be lost.
  - Added the required column `bairro` to the `CollectionPoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `CollectionPoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `collectionpoint` DROP COLUMN `address`,
    ADD COLUMN `bairro` VARCHAR(191) NOT NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `collectionPointId` INTEGER NULL;
