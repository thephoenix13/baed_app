/**
 * OTP Screen
 *
 * Enter 6-digit OTP received via SMS.
 */

import { useState, useRef, useEffect } from 'react';
import { fontDisplay } from '@/lib/fonts';
import { useVerifyOtp } from '@/hooks/use-auth';

interface OtpScreenProps {
  phoneNumber: string;
  countryCode: string;
  onSuccess: () => void;
  onBack: () => void;
  onResend: () => void;
}

export function OtpScreen({ phoneNumber, countryCode, onSuccess, onBack, onResend }: OtpScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyOtpMutation = useVerifyOtp();

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (newOtp.every((d) => d !== '') && newOtp.join('').length === 6) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      handleSubmit(pasted);
    }
  };

  const handleSubmit = async (otpValue: string) => {
    if (otpValue.length !== 6) return;

    setError('');
    try {
      await verifyOtpMutation.mutateAsync({
        phoneNumber,
        countryCode,
        otp: otpValue,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    onResend();
  };

  const maskedPhone = phoneNumber.slice(0, 3) + '***' + phoneNumber.slice(-4);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <button
          onClick={onBack}
          className="btn btn-ghost !px-3 !py-2"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        <h1
          className="text-h2 text-plum mb-2"
          style={fontDisplay.style}
        >
          Enter code
        </h1>
        <p className="text-lead mb-2">
          We sent a 6-digit code to
        </p>
        <p className="text-body text-ink font-semibold mb-8">
          {countryCode} {maskedPhone}
        </p>

        {/* OTP Inputs */}
        <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`input !w-12 !h-14 text-center text-h3 !p-0 ${
                error ? 'input-error' : ''
              }`}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-body text-error text-center mb-4">{error}</p>
        )}

        {/* Loading State */}
        {verifyOtpMutation.isPending && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="spinner !w-4 !h-4 !border-2"></span>
            <span className="text-body text-muted">Verifying...</span>
          </div>
        )}

        {/* Resend */}
        <div className="text-center mb-8">
          {resendCooldown > 0 ? (
            <p className="text-body text-muted">
              Resend code in <span className="font-semibold text-plum">{resendCooldown}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="btn btn-ghost !px-4 !py-2"
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Help */}
        <div className="bg-pink-pale rounded-xl p-4">
          <p className="text-body text-plum text-sm">
            💡 Didn't receive the code? Check your SMS inbox or spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}
