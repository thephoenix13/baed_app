import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate('/welcome', { replace: true }), 1400);
    return () => {
      window.clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        background: 'linear-gradient(180deg, var(--bd-pink-pale) 0%, var(--bd-cream) 70%)',
      }}
    >
      <h1 className="bd-display" style={{ fontSize: 56 }}>
        Bae'd
      </h1>
      <p className="bd-lead" style={{ margin: 0 }}>
        Dating, without the doubt.
      </p>
    </div>
  );
}
