import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDefaultFilters } from '@/modules/discovery/services/discovery.service';
import { useFilters } from '@/stores/filters-store';
import { BackButton, Button, Footer, Kicker, Pill, Screen } from '@/ui/kit';

const INTERESTS = ['Coffee', 'Travel', 'Music', 'Fitness', 'Reading', 'Cooking', 'Movies', 'Art', 'Hiking', 'Foodie', 'Dogs', 'Yoga'];

export function FiltersScreen() {
  const navigate = useNavigate();
  const saved = useFilters((s) => s.filters);
  const setFilters = useFilters((s) => s.setFilters);
  const [f, setF] = useState(saved);

  const toggleInterest = (i: string) =>
    setF((cur) => ({ ...cur, interests: cur.interests.includes(i) ? cur.interests.filter((x) => x !== i) : [...cur.interests, i] }));

  const slider = (id: string, label: string, value: number, min: number, max: number, suffix: string, onChange: (n: number) => void) => (
    <div className="bd-field">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label htmlFor={id}>{label}</label>
        <span className="bd-serif" style={{ fontSize: 22 }}>
          {value}
          {suffix}
        </span>
      </div>
      <input id={id} className="bd-range" type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );

  return (
    <>
      <Screen footer>
        <div className="bd-topbar">
          <BackButton to="/discover" />
        </div>
        <Kicker>Discovery</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 24px' }}>
          Who do you want to see?
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {slider('f-min', 'Youngest', f.minAge, 18, f.maxAge, '', (n) => setF({ ...f, minAge: n }))}
          {slider('f-max', 'Oldest', f.maxAge, f.minAge, 60, '', (n) => setF({ ...f, maxAge: n }))}
          {slider('f-dist', 'Distance', f.maxDistance, 1, 100, ' km', (n) => setF({ ...f, maxDistance: n }))}

          <div className="bd-field">
            <label>Show me</label>
            <div className="bd-chips">
              <Pill selected={f.interestedInWomen} onClick={() => setF({ ...f, interestedInWomen: !f.interestedInWomen })}>
                Women
              </Pill>
              <Pill selected={f.interestedInMen} onClick={() => setF({ ...f, interestedInMen: !f.interestedInMen })}>
                Men
              </Pill>
              <Pill selected={f.interestedInNonBinary} onClick={() => setF({ ...f, interestedInNonBinary: !f.interestedInNonBinary })}>
                Non-binary people
              </Pill>
            </div>
          </div>

          <div className="bd-field">
            <label>Shared interests</label>
            <div className="bd-chips">
              {INTERESTS.map((i) => (
                <Pill key={i} selected={f.interests.includes(i)} onClick={() => toggleInterest(i)}>
                  {i}
                </Pill>
              ))}
            </div>
          </div>
        </div>
      </Screen>
      <Footer>
        <Button
          onClick={() => {
            setFilters(f);
            navigate('/discover');
          }}
        >
          Show people
        </Button>
        <Button variant="ghost" onClick={() => setF(getDefaultFilters())}>
          Reset filters
        </Button>
      </Footer>
    </>
  );
}
