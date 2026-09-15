import { fontDisplay } from '@/lib/fonts';

interface ConsentScreenProps {
  onAccept: () => void;
  onBack: () => void;
}

export function ConsentScreen({ onAccept, onBack }: ConsentScreenProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="px-6 pt-12 pb-4">
        <button onClick={onBack} className="btn btn-ghost !px-3 !py-2" aria-label="Go back">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 px-6 flex flex-col">
        <h1 className="text-h2 text-plum mb-3" style={fontDisplay.style}>
          Before we begin
        </h1>
        <p className="text-lead mb-8">
          We need your consent to verify your identity. Here's what happens:
        </p>

        <div className="flex-1 space-y-4 mb-8">
          <div className="card">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-plum text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <div>
                <h3 className="text-body font-semibold text-ink">Photo your ID</h3>
                <p className="text-body text-muted text-sm">Aadhaar, PAN, Passport, or Driver's License</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-plum text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <div>
                <h3 className="text-body font-semibold text-ink">Take a selfie</h3>
                <p className="text-body text-muted text-sm">We'll match your face to your ID photo</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-plum text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <div>
                <h3 className="text-body font-semibold text-ink">We verify</h3>
                <p className="text-body text-muted text-sm">Your ID is checked by our verification partner. We never store your document.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-pink-pale rounded-xl p-4 mb-6">
          <p className="text-body text-plum text-sm">
            🔒 Your ID document is processed securely and never stored on our servers. Only a verification reference is kept.
          </p>
        </div>

        <div className="pb-8 space-y-3">
          <button onClick={onAccept} className="btn btn-primary w-full">
            I Agree — Start Verification
          </button>
          <button onClick={onBack} className="btn btn-ghost w-full">
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
