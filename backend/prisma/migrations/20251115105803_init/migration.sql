-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DOKTER', 'PERAWAT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('L', 'P');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('CONSULTATION', 'SCALING', 'FILLING', 'EXTRACTION', 'WHITENING', 'ORTHODONTIC', 'OTHER');

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('SHIFT', 'MEETING', 'ACTIVITY');

-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('SICK', 'ANNUAL', 'EMERGENCY', 'UNPAID');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'TRANSFER', 'CARD', 'QRIS');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIAL', 'REFUNDED');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "specialization" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" UUID NOT NULL,
    "patient_number" VARCHAR(50) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "gender" "Gender" NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "address" TEXT,
    "blood_type" VARCHAR(5),
    "allergies" TEXT,
    "medical_history" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL,
    "service_code" VARCHAR(50) NOT NULL,
    "service_name" VARCHAR(255) NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "description" TEXT,
    "base_price" DECIMAL(12,2) NOT NULL,
    "commission_rate" DECIMAL(5,2) NOT NULL,
    "duration_minutes" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visits" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "nurse_id" UUID NOT NULL,
    "visit_number" VARCHAR(50) NOT NULL,
    "visit_date" TIMESTAMP(6) NOT NULL,
    "queue_number" INTEGER NOT NULL,
    "status" "VisitStatus" NOT NULL DEFAULT 'WAITING',
    "chief_complaint" TEXT,
    "blood_pressure" VARCHAR(20),
    "notes" TEXT,
    "total_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treatments" (
    "id" UUID NOT NULL,
    "visit_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "performed_by" UUID NOT NULL,
    "tooth_number" VARCHAR(10),
    "diagnosis" TEXT,
    "treatment_notes" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "images" TEXT[],
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "treatments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "visit_id" UUID NOT NULL,
    "payment_number" VARCHAR(50) NOT NULL,
    "payment_date" TIMESTAMP(6) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "paid_amount" DECIMAL(12,2) NOT NULL,
    "change_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reference_number" VARCHAR(100),
    "notes" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "schedule_type" "ScheduleType" NOT NULL,
    "start_datetime" TIMESTAMP(6) NOT NULL,
    "end_datetime" TIMESTAMP(6) NOT NULL,
    "location" VARCHAR(255),
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence_pattern" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_requests" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "approved_by" UUID,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "leave_type" "LeaveType" NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "rejection_reason" TEXT,
    "approved_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commissions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "treatment_id" UUID NOT NULL,
    "base_amount" DECIMAL(12,2) NOT NULL,
    "commission_rate" DECIMAL(5,2) NOT NULL,
    "commission_amount" DECIMAL(12,2) NOT NULL,
    "period_month" INTEGER NOT NULL,
    "period_year" INTEGER NOT NULL,
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(6),
    "notes" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "users"("is_active");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patients_patient_number_key" ON "patients"("patient_number");

-- CreateIndex
CREATE INDEX "patients_patient_number_idx" ON "patients"("patient_number");

-- CreateIndex
CREATE INDEX "patients_full_name_idx" ON "patients"("full_name");

-- CreateIndex
CREATE INDEX "patients_phone_idx" ON "patients"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "services_service_code_key" ON "services"("service_code");

-- CreateIndex
CREATE INDEX "services_category_idx" ON "services"("category");

-- CreateIndex
CREATE INDEX "services_is_active_idx" ON "services"("is_active");

-- CreateIndex
CREATE INDEX "services_service_code_idx" ON "services"("service_code");

-- CreateIndex
CREATE UNIQUE INDEX "visits_visit_number_key" ON "visits"("visit_number");

-- CreateIndex
CREATE INDEX "visits_patient_id_idx" ON "visits"("patient_id");

-- CreateIndex
CREATE INDEX "visits_nurse_id_idx" ON "visits"("nurse_id");

-- CreateIndex
CREATE INDEX "visits_visit_date_idx" ON "visits"("visit_date");

-- CreateIndex
CREATE INDEX "visits_status_idx" ON "visits"("status");

-- CreateIndex
CREATE INDEX "visits_queue_number_idx" ON "visits"("queue_number");

-- CreateIndex
CREATE INDEX "treatments_visit_id_idx" ON "treatments"("visit_id");

-- CreateIndex
CREATE INDEX "treatments_patient_id_idx" ON "treatments"("patient_id");

-- CreateIndex
CREATE INDEX "treatments_service_id_idx" ON "treatments"("service_id");

-- CreateIndex
CREATE INDEX "treatments_performed_by_idx" ON "treatments"("performed_by");

-- CreateIndex
CREATE INDEX "treatments_created_at_idx" ON "treatments"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "payments_payment_number_key" ON "payments"("payment_number");

-- CreateIndex
CREATE INDEX "payments_visit_id_idx" ON "payments"("visit_id");

-- CreateIndex
CREATE INDEX "payments_payment_date_idx" ON "payments"("payment_date");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_payment_number_idx" ON "payments"("payment_number");

-- CreateIndex
CREATE INDEX "schedules_user_id_idx" ON "schedules"("user_id");

-- CreateIndex
CREATE INDEX "schedules_start_datetime_idx" ON "schedules"("start_datetime");

-- CreateIndex
CREATE INDEX "schedules_schedule_type_idx" ON "schedules"("schedule_type");

-- CreateIndex
CREATE INDEX "leave_requests_user_id_idx" ON "leave_requests"("user_id");

-- CreateIndex
CREATE INDEX "leave_requests_approved_by_idx" ON "leave_requests"("approved_by");

-- CreateIndex
CREATE INDEX "leave_requests_status_idx" ON "leave_requests"("status");

-- CreateIndex
CREATE INDEX "leave_requests_start_date_idx" ON "leave_requests"("start_date");

-- CreateIndex
CREATE INDEX "commissions_user_id_idx" ON "commissions"("user_id");

-- CreateIndex
CREATE INDEX "commissions_treatment_id_idx" ON "commissions"("treatment_id");

-- CreateIndex
CREATE INDEX "commissions_period_month_period_year_idx" ON "commissions"("period_month", "period_year");

-- CreateIndex
CREATE INDEX "commissions_status_idx" ON "commissions"("status");

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_nurse_id_fkey" FOREIGN KEY ("nurse_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_treatment_id_fkey" FOREIGN KEY ("treatment_id") REFERENCES "treatments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
