/*
  Warnings:

  - The primary key for the `collection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `collection_id` on the `collection` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `parceltracking` DROP FOREIGN KEY `ParcelTracking_collectionCollection_id_fkey`;

-- AlterTable
ALTER TABLE `collection` DROP PRIMARY KEY,
    DROP COLUMN `collection_id`,
    ADD PRIMARY KEY (`figurine_id`, `user_id`);

-- AddForeignKey
ALTER TABLE `ParcelTracking` ADD CONSTRAINT `ParcelTracking_figurine_id_user_id_fkey` FOREIGN KEY (`figurine_id`, `user_id`) REFERENCES `Collection`(`figurine_id`, `user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
