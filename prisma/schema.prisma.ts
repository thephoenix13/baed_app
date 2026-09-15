// prisma/schema.prisma
//
// Bae'd — Prisma Schema (PostgreSQL + PostGIS)
//
// This file defines the complete data model.
// In production, run: npx prisma migrate dev
//
// NOTE: This is the schema file for reference.
// The actual Prisma client is not used in the browser build.
// It runs server-side in Next.js API routes.

/*
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ═══════════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════════

enum AccountStatus {
  ACTIVE
  SUSPENDED
  DEACTIVATED
  DELETED
}

enum Gender {
  MALE
  FEMALE
  NON_BINARY
  OTHER
}

enum Orientation {
  STRAIGHT
  GAY
  LESBIAN
  BISEXUAL
  ASEXUAL
  PANSEXUAL
  OTHER
}

enum VerificationStatus {
  NOT_STARTED
  IN_PROGRESS
  DOCUMENT_SUBMITTED
  SELFIE_REQUIRED
  PROCESSING
  VERIFIED
  FAILED
  MANUAL_REVIEW
  EXPIRED
  REVERIFICATION_REQUIRED
}

enum DocumentType {
  AADHAAR
  PAN_CARD
  PASSPORT
  DRIVERS_LICENSE
  VOTER_ID
}

// ═══════════════════════════════════════════════════════════════
// IDENTITY ZONE
// ═══════════════════════════════════════════════════════════════

model User {
  id            String        @id @default(cuid())
  phoneNumber   String        @unique @map("phone_number")
  countryCode   String        @map("country_code") @default("+91")
  firstName     String?       @map("first_name")
  lastName      String?       @map("last_name")
  dateOfBirth   DateTime?     @map("date_of_birth")
  gender        Gender?
  orientation   Orientation?
  status        AccountStatus @default(ACTIVE)
  isVerified    Boolean       @default(false) @map("is_verified")
  location      Unsupported("geography(Point, 4326)")?
  city          String?
  state         String?
  country       String?       @default("India")
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")
  deletedAt     DateTime?     @map("deleted_at")
  lastLoginAt   DateTime?     @map("last_login_at")

  profile       Profile?
  devices       UserDevice[]
  sessions      UserSession[]
  verification  VerificationRequest?

  @@index([phoneNumber])
  @@index([status])
  @@index([isVerified])
  @@index([city])
  @@index([createdAt])
  @@map("users")
}

model UserDevice {
  id            String    @id @default(cuid())
  userId        String    @map("user_id")
  deviceToken   String?   @map("device_token")
  deviceType    String    @map("device_type")
  deviceModel   String?   @map("device_model")
  osVersion     String?   @map("os_version")
  appVersion    String?   @map("app_version")
  pushEnabled   Boolean   @default(true) @map("push_enabled")
  lastActiveAt  DateTime? @map("last_active_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([deviceToken])
  @@map("user_devices")
}

model UserSession {
  id            String    @id @default(cuid())
  userId        String    @map("user_id")
  refreshToken  String    @unique @map("refresh_token")
  deviceId      String?   @map("device_id")
  ipAddress     String?   @map("ip_address")
  userAgent     String?   @map("user_agent")
  expiresAt     DateTime  @map("expires_at")
  revokedAt     DateTime? @map("revoked_at")
  createdAt     DateTime  @default(now()) @map("created_at")

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([refreshToken])
  @@index([expiresAt])
  @@map("user_sessions")
}

// ═══════════════════════════════════════════════════════════════
// VERIFICATION ZONE
// ═══════════════════════════════════════════════════════════════

model VerificationRequest {
  id                  String              @id @default(cuid())
  userId              String              @unique @map("user_id")
  status              VerificationStatus  @default(NOT_STARTED)
  documentType        DocumentType?       @map("document_type")
  documentReference   String?             @map("document_reference")
  documentHash        String?             @map("document_hash")
  selfieReference     String?             @map("selfie_reference")
  confidenceScore     Float?              @map("confidence_score")
  faceMatchScore      Float?              @map("face_match_score")
  livenessScore       Float?              @map("liveness_score")
  providerName        String?             @map("provider_name")
  providerResponse    Json?               @map("provider_response")
  startedAt           DateTime            @default(now()) @map("started_at")
  submittedAt         DateTime?           @map("submitted_at")
  processedAt         DateTime?           @map("processed_at")
  expiresAt           DateTime?           @map("expires_at")
  createdAt           DateTime            @default(now()) @map("created_at")
  updatedAt           DateTime            @updatedAt @map("updated_at")

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([status])
  @@map("verification_requests")
}

// ═══════════════════════════════════════════════════════════════
// ADMIN ZONE
// ═══════════════════════════════════════════════════════════════

enum AdminRole {
  SUPER_ADMIN
  TRUST_AND_SAFETY
  VERIFICATION_OPERATOR
  CUSTOMER_SUPPORT
  FINANCE
  ANALYST
}

model AdminUser {
  id              String      @id @default(cuid())
  email           String      @unique
  passwordHash    String      @map("password_hash")
  firstName       String      @map("first_name")
  lastName        String      @map("last_name")
  role            AdminRole   @default(CUSTOMER_SUPPORT)
  mfaEnabled      Boolean     @default(false) @map("mfa_enabled")
  mfaSecret       String?     @map("mfa_secret")
  isActive        Boolean     @default(true) @map("is_active")
  lastLoginAt     DateTime?   @map("last_login_at")
  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")

  @@index([email])
  @@index([role])
  @@map("admin_users")
}

// Additional models (Profile, Like, Match, Conversation, etc.)
// are defined in Phase 0 deliverable #2.
// This file shows the Identity + Admin subset for Phase 1.
*/

// ═══════════════════════════════════════════════════════════════
// EXPORT FOR BROWSER (TypeScript types only)
// ═══════════════════════════════════════════════════════════════

// This file is a reference. The actual Prisma schema is used
// server-side. Types are defined in src/modules/*/types/*.

export {};
