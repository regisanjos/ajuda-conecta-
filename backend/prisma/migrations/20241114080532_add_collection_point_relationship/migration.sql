-- AlterTable
ALTER TABLE `donation` ADD COLUMN `collectionPointId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('USER', 'ADMIN', 'PONTO_DE_COLETA') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `CollectionPoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `adminId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CollectionPoint_adminId_key`(`adminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CollectionPoint` ADD CONSTRAINT `CollectionPoint_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_collectionPointId_fkey` FOREIGN KEY (`collectionPointId`) REFERENCES `CollectionPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
