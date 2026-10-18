import { Navigate } from 'react-router-dom';
import { demoTools } from '@/lib/api';
import { useVerificationStore } from '@/stores/verification-store';
import { CaptureStep } from './CaptureStep';

export function SelfieScreen() {
  const hasId = useVerificationStore((s) => !!s.id);
  // The selfie is matched against the ID, so the ID comes first
  if (!hasId && !demoTools) return <Navigate to="/verify/id" replace />;

  return (
    <CaptureStep
      kind="selfie"
      step={4}
      backTo="/verify/id"
      nextTo="/verify/processing"
      nextLabel="Submit for verification"
      kicker="Step 2 of 2"
      title="Now, take a selfie."
      lead="We use it to check that the ID belongs to you."
      cameraTitle="Take a selfie"
      cameraHint="Centre your face in the oval"
      tipsTitle="For a good match"
      tips={[
        { title: 'Remove glasses and hats' },
        { title: 'Keep your face in the oval', sub: 'Good, even light on your face.' },
      ]}
      emptyText="Your selfie will appear here"
      allowLibrary={false}
    />
  );
}
