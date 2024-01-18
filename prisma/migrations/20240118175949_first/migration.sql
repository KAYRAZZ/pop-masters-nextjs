-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "figurine_id" INTEGER NOT NULL,
    "collection_name" TEXT NOT NULL,
    "figurine_owned" BOOLEAN NOT NULL DEFAULT false,
    "figurine_wished" BOOLEAN NOT NULL DEFAULT false,
    "date_figurine_added" TIMESTAMP(3) NOT NULL,
    "purchase_price" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("figurine_id","user_id")
);

-- CreateTable
CREATE TABLE "ParcelTracking" (
    "figurine_id" INTEGER NOT NULL,
    "tracking_number" TEXT NOT NULL,
    "donnees" VARCHAR(2500),
    "date_parcel_added" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "ParcelTracking_pkey" PRIMARY KEY ("figurine_id","user_id")
);

-- CreateTable
CREATE TABLE "CollectionsDatas" (
    "collections_datas_id" SERIAL NOT NULL,
    "collection_name" TEXT NOT NULL,
    "figurine_id" INTEGER NOT NULL,
    "figurine_name" TEXT NOT NULL,
    "figurine_image" VARCHAR(250),
    "figurine_box" VARCHAR(250) NOT NULL,
    "figurine_reference" TEXT,
    "figurine_numero" TEXT NOT NULL,
    "figurine_special_feature" TEXT NOT NULL,

    CONSTRAINT "CollectionsDatas_pkey" PRIMARY KEY ("collections_datas_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParcelTracking" ADD CONSTRAINT "ParcelTracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
