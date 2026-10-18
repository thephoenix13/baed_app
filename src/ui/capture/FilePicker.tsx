import { useRef } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../kit';
import { ACCEPTED_TYPES } from './files';

interface FilePickerProps {
  children: ReactNode;
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  /** "user" or "environment" asks a phone to open its camera app instead of the photo library. */
  capture?: 'user' | 'environment';
  variant?: 'primary' | 'pink' | 'ghost';
  disabled?: boolean;
}

/** A button that opens the device's file or photo chooser. */
export function FilePicker({ children, onFiles, multiple, capture, variant = 'ghost', disabled }: FilePickerProps) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={input}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple={multiple}
        capture={capture}
        hidden
        tabIndex={-1}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = ''; // so choosing the same photo again still fires
          if (files.length) onFiles(files);
        }}
      />
      <Button variant={variant} disabled={disabled} onClick={() => input.current?.click()}>
        {children}
      </Button>
    </>
  );
}
