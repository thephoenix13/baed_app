/**
 * Identity Module — OTP Types
 */

export type OtpStatus = 'PENDING' | 'VERIFIED' | 'EXPIRED' | 'MAX_ATTEMPTS';

export interface OtpRecord {
  id: string;
  phoneNumber: string;
  countryCode: string;
  otp: string; // hashed in production
  status: OtpStatus;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
  verifiedAt: Date | null;
}

export interface OtpSendResult {
  success: boolean;
  expiresInSeconds: number;
  maskedPhone: string;
}

export interface OtpVerifyResult {
  success: boolean;
  userId?: string;
  isNewUser: boolean;
  error?: string;
}
