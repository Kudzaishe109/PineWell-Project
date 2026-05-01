import { useEffect, useState } from 'react';

const STEPS = [
  'Reading nutrition label…',
  'Identifying nutrients…',
  'Classifying values…',
  'Generating insights…',
];

export default function AnalyzingScreen({ imageUrl }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
    }, 550);
    const dotsTimer = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => { clearInterval(stepTimer); clearInterval(dotsTimer); };
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {imageUrl && (
          <div style={styles.imageWrap}>
            <img src={imageUrl} alt="" style={styles.image} />
            <div style={styles.scanLine} />
            <div style={styles.imageOverlay} />
          </div>
        )}

        <div style={styles.content}>
          <div style={styles.spinnerWrap}>
            <Spinner />
          </div>
          <h2 style={styles.title}>Analyzing</h2>
          <p style={styles.step}>{STEPS[stepIndex]}{dots}</p>

          <div style={styles.progressTrack}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.progressDot,
                  backgroundColor: i <= stepIndex ? 'var(--green)' : 'var(--cream-deeper)',
                  transform: i === stepIndex ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>

          <p style={styles.hint}>This usually takes a few seconds</p>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg width={48} height={48} viewBox="0 0 48 48" style={{ animation: 'spin 1s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx={24} cy={24} r={20} fill="none" stroke="var(--cream-deeper)" strokeWidth={4} />
      <circle
        cx={24} cy={24} r={20}
        fill="none"
        stroke="var(--green)"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="60 72"
        transform="rotate(-90 24 24)"
      />
    </svg>
  );
}

const styles = {
  page: {
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'var(--cream-dark)',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-elevated)',
  },
  imageWrap: {
    position: 'relative',
    height: 180,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(0.75)',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, transparent 40%, var(--cream-dark))',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(74,124,89,0.7)',
    animation: 'scanMove 1.4s ease-in-out infinite',
    boxShadow: '0 0 12px rgba(74,124,89,0.6)',
    top: '40%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '28px 24px 32px',
    gap: 10,
  },
  spinnerWrap: { marginBottom: 4 },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: 24,
    fontWeight: 400,
    color: 'var(--text-primary)',
  },
  step: {
    fontSize: 14,
    color: 'var(--green)',
    fontWeight: 600,
    minHeight: 20,
  },
  progressTrack: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  hint: {
    fontSize: 12,
    color: 'var(--text-muted)',
    marginTop: 8,
  },
};
