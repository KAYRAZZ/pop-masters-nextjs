/*
  Warnings:

  - The primary key for the `parceltracking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `parcel_tracking_id` on the `parceltracking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `parceltracking` DROP PRIMARY KEY,
    DROP COLUMN `parcel_tracking_id`,
    ADD PRIMARY KEY (`figurine_id`, `user_id`);
