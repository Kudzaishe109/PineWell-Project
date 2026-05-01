export default function PlaceholderTab({ title, description, icon }) {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>{icon}</div>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.desc}>{description}</p>
        <div style={styles.badge}>Coming soon</div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
  },
  card: {
    backgroundColor: 'var(--cream-dark)',
    borderRadius: 'var(--radius-xl)',
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    textAlign: 'center',
    maxWidth: 320,
    boxShadow: 'var(--shadow-card)',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 'var(--radius-xl)',
    backgroundColor: 'var(--cream)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    boxShadow: 'var(--shadow-soft)',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: 24,
    fontWeight: 400,
    color: 'var(--text-primary)',
  },
  desc: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  badge: {
    marginTop: 8,
    backgroundColor: 'var(--amber-subtle)',
    color: 'var(--amber)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '5px 14px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid rgba(112,92,48,0.2)',
  },
};
