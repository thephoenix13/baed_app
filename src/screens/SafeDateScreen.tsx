import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/stores/ui-store';
import { BackButton, Button, Footer, Item, Kicker, Pill, Screen, Section } from '@/ui/kit';

const CHECK_IN = ['1 hour in', '2 hours in', '3 hours in'];

export function SafeDateScreen() {
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [when, setWhen] = useState('');
  const [place, setPlace] = useState('');
  const [checkIn, setCheckIn] = useState(CHECK_IN[1]);
  const [consent, setConsent] = useState(false);

  const phoneOk = /^[6-9]\d{9}$/.test(contactPhone);
  const valid = contactName.trim().length >= 2 && phoneOk && !!when && place.trim().length >= 3 && consent;

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    addToast({
      type: 'success',
      title: 'Safe Date is set',
      message: `${contactName.trim()} will get your plan. We'll check in ${checkIn.toLowerCase()}.`,
    });
    navigate(-1);
  };

  return (
    <form onSubmit={save}>
      <Screen tint="var(--bd-peach)" footer>
        <div className="bd-topbar">
          <BackButton />
        </div>
        <Kicker>Safe Date</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 8px' }}>
          Let someone know where you'll be.
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 24px' }}>
          Share your plan with a person you trust, and we'll check in with you during the date.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="bd-field">
            <label htmlFor="sd-name">Trusted contact</label>
            <input id="sd-name" className="bd-input" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Their name" autoComplete="off" />
          </div>
          <div className="bd-field">
            <label htmlFor="sd-phone">Their mobile number</label>
            <input
              id="sd-phone"
              className="bd-input"
              inputMode="numeric"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="98765 43210"
              aria-invalid={contactPhone.length === 10 && !phoneOk}
            />
          </div>
          <div className="bd-field">
            <label htmlFor="sd-when">Date and time</label>
            <input id="sd-when" className="bd-input" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
          </div>
          <div className="bd-field">
            <label htmlFor="sd-place">Where</label>
            <input id="sd-place" className="bd-input" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Cafe name and area" autoComplete="off" />
          </div>
          <div className="bd-field">
            <label>Check in with me</label>
            <div className="bd-chips">
              {CHECK_IN.map((c) => (
                <Pill key={c} selected={checkIn === c} onClick={() => setCheckIn(c)}>
                  {c}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <Section title="What happens">
          <Item title="Your contact gets the time and place" sub="Only after you save. The link expires when the date ends." />
          <Item title="We ask if you're okay" sub="If you don't answer, we tell your contact. You can stop this any time." />
        </Section>

        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 22, cursor: 'pointer' }}>
          <input
            id="sd-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            style={{ width: 22, height: 22, marginTop: 1, accentColor: 'var(--bd-plum)', flex: 'none' }}
          />
          <span className="bd-small">I agree to share this plan and my check-in status with {contactName.trim() || 'my contact'}.</span>
        </label>
      </Screen>
      <Footer>
        <Button type="submit" disabled={!valid}>
          Save Safe Date
        </Button>
      </Footer>
    </form>
  );
}
