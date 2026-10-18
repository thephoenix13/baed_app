import { CaptureStep } from './CaptureStep';

export function IdCaptureScreen() {
  return (
    <CaptureStep
      kind="id"
      step={3}
      backTo="/verify/consent"
      nextTo="/verify/selfie"
      nextLabel="Continue"
      kicker="Step 1 of 2"
      title="Take a photo of your ID."
      lead="Make sure all four corners are visible."
      cameraTitle="Photograph your ID"
      cameraHint="Fit the whole card inside the frame"
      tipsTitle="For a clear photo"
      tips={[
        { title: 'Face a window or lamp', sub: 'Daylight works best.' },
        { title: 'Avoid glare', sub: 'Tilt the card if you see a reflection.' },
        { title: 'Keep the ID flat', sub: 'Use the original card, not a photocopy.' },
      ]}
      emptyText="Your ID photo will appear here"
      allowLibrary
    />
  );
}
