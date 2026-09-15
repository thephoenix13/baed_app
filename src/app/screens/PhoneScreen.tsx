/**
 * Phone Screen
 *
 * Enter phone number to receive OTP.
 */

import { useState } from 'react';
import { fontDisplay } from '@/lib/fonts';
import { useSendOtp } from '@/hooks/use-auth';

interface PhoneScreenProps {
  onOtpSent: (phoneNumber: string, countryCode: string) => void;
  onBack: () => void;
}

export function PhoneScreen({ onOtpSent, onBack }: PhoneScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [error, setError] = useState('');

  const sendOtpMutation = useSendOtp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate phone number
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      await sendOtpMutation.mutateAsync({ phoneNumber, countryCode });
      onOtpSent(phoneNumber, countryCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    }
  };

  const formatPhone = (value: string) => {
    // Only allow digits
    const digits = value.replace(/\D/g, '');
    // Limit to 10 digits
    return digits.slice(0, 10);
  };

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
          What's your number?
        </h1>
        <p className="text-lead mb-8">
          We'll send you a verification code.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Country Code + Phone */}
          <div className="flex gap-2 mb-4">
            <div className="w-20">
              <label htmlFor="country-code" className="text-label text-muted mb-1 block">
                Code
              </label>
              <select
                id="country-code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="input"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+61">+61</option>
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="phone" className="text-label text-muted mb-1 block">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
                placeholder="98765 43210"
                className={`input ${error ? 'input-error' : ''}`}
                autoFocus
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-body text-error mb-4">{error}</p>
          )}

          {/* Info */}
          <div className="bg-pink-pale rounded-xl p-4 mb-8">
            <p className="text-body text-plum text-sm">
              🔒 Your number is kept private. We only use it to verify your identity.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={sendOtpMutation.isPending || phoneNumber.length !== 10}
            className={`btn btn-primary w-full ${
              sendOtpMutation.isPending || phoneNumber.length !== 10 ? 'btn-disabled' : ''
            }`}
          >
            {sendOtpMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="spinner !w-4 !h-4 !border-2"></span>
                Sending...
              </span>
            ) : (
              'Send Verification Code'
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <p className="text-body text-muted text-sm">
          By continuing, you agree to receive SMS for verification.
          Standard rates may apply.
        </p>
      </div>
    </div>
  );
}
