import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton, Button, Footer, Kicker, Screen } from '@/ui/kit';

export function SignInScreen() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const valid = /^[6-9]\d{9}$/.test(phone);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (valid) navigate('/signin/otp', { state: { phone } });
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
        <Button type="submit" disabled={!valid}>
          Send code
        </Button>
      </Footer>
    </form>
  );
}
