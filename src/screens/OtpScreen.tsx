import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEnterApp } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { BackButton, Button, Footer, Kicker, Screen } from '@/ui/kit';

const RESEND_SECONDS = 30;
const MAX_ATTEMPTS = 5;

export function OtpScreen() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { phone?: string } | null };
  const enterApp = useEnterApp();
  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => {
      window.clearTimeout(t);
    };
  }, [seconds]);

  if (!state?.phone) return <Navigate to="/signin" replace />;

  const locked = attempts >= MAX_ATTEMPTS;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || locked || checking) return;
    setChecking(true);
    setFailed(false);
    try {
      const ok = await api.verifyOtp(state.phone!, code);
      if (!ok) {
        setAttempts((a) => a + 1);
        setWrong(true);
        setCode('');
        setChecking(false);
        return;
      }
      enterApp();
      navigate('/verify/why', { replace: true });
    } catch {
      setFailed(true);
      setChecking(false);
    }
  };

  const resend = () => {
    setSeconds(RESEND_SECONDS);
    setWrong(false);
    setCode('');
  };

  return (
    <form onSubmit={submit}>
      <Screen footer>
        <div className="bd-topbar">
          <BackButton to="/signin" />
        </div>
        <Kicker>Check your messages</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 10px' }}>
          Enter the 6-digit code.
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 28px' }}>
          Sent to +91 {state.phone.slice(0, 5)} {state.phone.slice(5)}.
        </p>

        <div className="bd-field">
          <label htmlFor="otp-code">Code</label>
          <input
            id="otp-code"
            className="bd-input"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            disabled={locked}
            value={code}
            maxLength={6}
            onChange={(e) => {
              setWrong(false);
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
            }}
            placeholder="······"
            aria-invalid={wrong}
            style={{ fontSize: 28, letterSpacing: 10, textAlign: 'center', fontFamily: 'var(--bd-font-display)' }}
          />
          {wrong && !locked && (
            <span className="bd-small" role="alert" style={{ color: 'var(--bd-error)' }}>
              That code isn't right. {MAX_ATTEMPTS - attempts} {MAX_ATTEMPTS - attempts === 1 ? 'try' : 'tries'} left.
            </span>
          )}
          {failed && (
            <span className="bd-small" role="alert" style={{ color: 'var(--bd-error)' }}>
              We couldn't check that code. Check your connection and try again.
            </span>
          )}
          {locked && (
            <span className="bd-small" role="alert" style={{ color: 'var(--bd-error)' }}>
              Too many wrong codes. Try again in 15 minutes.
            </span>
          )}
        </div>

        <div style={{ marginTop: 22 }}>
          {seconds > 0 ? (
            <span className="bd-small bd-muted">Resend code in {seconds}s</span>
          ) : (
            <button type="button" onClick={resend} disabled={locked} style={{ all: 'unset', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>
              Resend code
            </button>
          )}
        </div>
      </Screen>
      <Footer>
        <Button type="submit" disabled={code.length !== 6 || locked} loading={checking}>
          Verify and continue
        </Button>
      </Footer>
    </form>
  );
}
