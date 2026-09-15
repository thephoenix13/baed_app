/**
 * Why Verify Screen
 *
 * Explains why identity verification is required.
 */

import { fontDisplay } from '@/lib/fonts';

interface WhyVerifyScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

export function WhyVerifyScreen({ onContinue, onBack }: WhyVerifyScreenProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <button onClick={onBack} className="btn btn-ghost !px-3 !py-2" aria-label="Go back">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 flex flex-col">
        <div className="mb-8">
          <div className="w-16 h-16 bg-verified-green/10 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-verified-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>

          <h1 className="text-h2 text-plum mb-3" style={fontDisplay.style}>
            Why verify?
          </h1>
          <p className="text-lead">
            We verify every person on Bae'd so you can date with confidence.
            No catfishing. No fake profiles. Just real people.
          </p>
        </div>

        {/* Benefits */}
        <div className="flex-1 space-y-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-pink-pale rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h3 className="text-body font-semibold text-ink mb-1">You're safe</h3>
              <p className="text-body text-muted text-sm">
                Every person is who they say they are. Verified by government ID + selfie match.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-pink-pale rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h3 className="text-body font-semibold text-ink mb-1">Better matches</h3>
              <p className="text-body text-muted text-sm">
                When everyone is real, you spend less time filtering and more time connecting.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-pink-pale rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h3 className="text-body font-semibold text-ink mb-1">Your data is safe</h3>
              <p className="text-body text-muted text-sm">
                We never store your ID document. Only a verification reference is kept.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pb-8">
          <button onClick={onContinue} className="btn btn-primary w-full">
            Start Verification
          </button>
          <p className="text-body text-muted text-center text-sm mt-3">
            Takes about 2 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
