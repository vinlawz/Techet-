-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "checkoutRequestId" TEXT,
ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "mpesaReceipt" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_checkoutRequestId_key" ON "Payment"("checkoutRequestId");
