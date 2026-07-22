-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FARMER', 'SHIPPER', 'RETAILER', 'CONSUMER');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('FARMER', 'SHIPPER', 'RETAILER');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('PLANTED', 'HARVESTED', 'IN_TRANSIT', 'TESTING', 'RETAILING', 'SOLD', 'ABORTED');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('VEGETABLE', 'FRUIT', 'GRAIN', 'BEAN', 'HERB', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CONSUMER',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "companyName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "protectedKey" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "blockchainId" TEXT NOT NULL,
    "plantTxHash" TEXT,
    "retailTxHash" TEXT,
    "shipTxHash" TEXT,
    "productName" TEXT NOT NULL,
    "productVariety" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'VEGETABLE',
    "quantity" DOUBLE PRECISION,
    "unit" TEXT NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'PLANTED',
    "minTemperature" DOUBLE PRECISION NOT NULL,
    "maxTemperature" DOUBLE PRECISION NOT NULL,
    "minHumidity" DOUBLE PRECISION NOT NULL,
    "maxHumidity" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT '/logo.png',
    "farmerId" TEXT NOT NULL,
    "harvestDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "retailCompanyId" TEXT,
    "shipperCompanyId" TEXT,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StepTransit" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "shipperId" TEXT NOT NULL,
    "txHash" TEXT,
    "fromLocation" TEXT NOT NULL,
    "toLocation" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StepTransit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityTest" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "retailerId" TEXT NOT NULL,
    "txHash" TEXT,
    "isPassed" BOOLEAN NOT NULL,
    "note" TEXT NOT NULL,
    "testedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QualityTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Batch_blockchainId_key" ON "Batch"("blockchainId");

-- CreateIndex
CREATE UNIQUE INDEX "QualityTest_batchId_key" ON "QualityTest"("batchId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_retailCompanyId_fkey" FOREIGN KEY ("retailCompanyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_shipperCompanyId_fkey" FOREIGN KEY ("shipperCompanyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepTransit" ADD CONSTRAINT "StepTransit_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepTransit" ADD CONSTRAINT "StepTransit_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityTest" ADD CONSTRAINT "QualityTest_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityTest" ADD CONSTRAINT "QualityTest_retailerId_fkey" FOREIGN KEY ("retailerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
