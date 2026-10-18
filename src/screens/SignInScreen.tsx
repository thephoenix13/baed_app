import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { BackButton, Button, Footer, Kicker, Screen } from '@/ui/kit';

export function SignInScreen() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const valid = /^[6-9]\d{9}$/.test(phone);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!valid || sending) return;
    setSending(true);
    setFailed(false);
    try {
      await api.sendOtp(phone);
      navigate('/signin/otp', { state: { phone } });
    } catch {
      setFailed(true);
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <Screen footer>
        <div className="bd-topbar">
          <BackButton to="/welcome" />
        </div>
        <Kicker>Sign in or join</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 10px' }}>
          What's your number?
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 28px' }}>
          We'll text you a 6-digit code. No passwords.
        </p>

        <div className="bd-field">
          <label htmlFor="si-phone">Mobile number</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="bd-input" style={{ width: 'auto', display: 'flex', alignItems: 'center', fontWeight: 600 }} aria-hidden="true">
              +91
            </div>
            <input
              id="si-phone"
              className="bd-input"
              inputMode="numeric"
              autoComplete="tel-national"
              autoFocus
              value={phone}
              maxLength={10}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="98765 43210"
              aria-invalid={phone.length === 10 && !valid}
            />
          </div>
          {phone.length === 10 && !valid && (
            <span className="bd-small" style={{ color: 'var(--bd-error)' }}>
              Enter a valid 10-digit Indian mobile number.
            </span>
          )}
        </div>

        <p className="bd-small bd-muted" style={{ marginTop: 22 }}>
          By continuing you agree to our Terms and Privacy Policy. You must be 18 or older.
        </p>
      </Screen>
      <Footer>
        {failed && (
          <p className="bd-small" role="alert" style={{ margin: 0, color: 'var(--bd-error)', textAlign: 'center' }}>
            We couldn't send the code. Check your connection and try again.
          </p>
        )}
        <Button type="submit" disabled={!valid} loading={sending}>
          {failed ? 'Try again' : 'Send code'}
        </Button>
      </Footer>
    </form>
  );
}
