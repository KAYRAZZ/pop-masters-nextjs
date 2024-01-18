-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Collection` (
    `figurine_id` VARCHAR(191) NOT NULL,
    `collection_name` VARCHAR(191) NOT NULL,
    `figurine_owned` BOOLEAN NOT NULL DEFAULT false,
    `figurine_wished` BOOLEAN NOT NULL DEFAULT false,
    `date_figurine_added` DATETIME(3) NOT NULL,
    `purchase_price` VARCHAR(191) NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`figurine_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParcelTracking` (
    `figurine_id` VARCHAR(191) NOT NULL,
    `tracking_number` VARCHAR(191) NOT NULL,
    `donnees` VARCHAR(2500) NULL,
    `date_parcel_added` DATETIME(3) NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`figurine_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CollectionsDatas` (
    `collections_datas_id` INTEGER NOT NULL AUTO_INCREMENT,
    `collection_name` VARCHAR(191) NOT NULL,
    `figurine_id` VARCHAR(191) NOT NULL,
    `figurine_name` VARCHAR(191) NOT NULL,
    `figurine_image` VARCHAR(250) NULL,
    `figurine_box` VARCHAR(250) NOT NULL,
    `figurine_reference` VARCHAR(191) NULL,
    `figurine_numero` VARCHAR(191) NOT NULL,
    `figurine_special_feature` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`collections_datas_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParcelTracking` ADD CONSTRAINT `ParcelTracking_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
