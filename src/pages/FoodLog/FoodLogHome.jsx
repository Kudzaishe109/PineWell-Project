import { ScanLine, Clock, Leaf, ChevronRight } from 'lucide-react';

export default function FoodLogHome({ onStartScan, recentScans }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeaf}>
          <Leaf size={14} style={{ color: 'var(--green)' }} />
        </div>
        <p style={styles.headerDate}>{today}</p>
        <h1 style={styles.headline}>
          What do you<br />wanna eat?
        </h1>
        <p style={styles.subtext}>
          Scan a nutrition label to instantly understand what's in your food.
        </p>
      </div>

      {/* Main CTA Card */}
      <button style={styles.ctaCard} onClick={onStartScan}>
        <div style={styles.ctaIcon}>
          <ScanLine size={32} style={{ color: 'var(--green)' }} strokeWidth={1.5} />
        </div>
        <div style={styles.ctaText}>
          <span style={styles.ctaTitle}>Scan Food Label</span>
          <span style={styles.ctaDesc}>Use camera or upload an image</span>
        </div>
        <ChevronRight size={20} style={{ color: 'var(--green-light)', flexShrink: 0 }} />
      </button>

      {/* Tip Card */}
      <div style={styles.tipCard}>
        <div style={styles.tipDot} />
        <p style={styles.tipText}>
          <strong>Tip:</strong> Scan the Nutrition Facts panel on the back of any packaged food for the best results.
        </p>
      </div>

      {/* Recent Scans */}
      <section style={styles.recentSection}>
        <div style={styles.sectionHeader}>
          <Clock size={15} style={{ color: 'var(--amber)' }} />
          <h2 style={styles.sectionTitle}>Recent Scans</h2>
        </div>

        {recentScans.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIllustration}>
              <Leaf size={28} style={{ color: 'var(--cream-deeper)' }} strokeWidth={1.5} />
            </div>
            <p style={styles.emptyTitle}>No scans yet</p>
            <p style={styles.emptyDesc}>Your recent food label scans will appear here.</p>
          </div>
        ) : (
          <div style={styles.scanList}>
            {recentScans.map((scan, i) => (
              <RecentScanItem key={i} scan={scan} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function RecentScanItem({ scan }) {
  const verdictColor = scan.summary.verdict === 'Balanced' ? 'var(--green)' : scan.summary.verdict === 'Mixed' ? 'var(--amber)' : '#c0392b';

  return (
    <div style={styles.scanItem}>
      {scan.imageUrl && (
        <img src={scan.imageUrl} alt="Scanned label" style={styles.scanThumb} />
      )}
      <div style={styles.scanInfo}>
        <span style={styles.scanServing}>{scan.servingSize}</span>
        <span style={{ ...styles.scanVerdict, color: verdictColor }}>{scan.summary.verdict}</span>
      </div>
      <span style={styles.scanScore}>{scan.summary.score}</span>
    </div>
  );
}

const styles = {
  page: {
    padding: '28px 20px 32px',
    maxWidth: 600,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  header: {
    paddingBottom: 4,
  },
  headerLeaf: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'var(--green-subtle)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    marginBottom: 14,
  },
  headerDate: {
    fontSize: 12,
    color: 'var(--green)',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: 0,
  },
  headline: {
    fontFamily: 'var(--font-serif)',
    fontSize: 36,
    fontWeight: 400,
    lineHeight: 1.2,
    color: 'var(--text-primary)',
    marginTop: 10,
    marginBottom: 12,
    letterSpacing: '-0.01em',
  },
  subtext: {
    fontSize: 15,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    maxWidth: 320,
  },
  ctaCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'var(--green-subtle)',
    border: '1.5px solid rgba(74,124,89,0.2)',
    borderRadius: 'var(--radius-xl)',
    padding: '20px 22px',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    boxShadow: 'var(--shadow-soft)',
    width: '100%',
    textAlign: 'left',
  },
  ctaIcon: {
    width: 56,
    height: 56,
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(74,124,89,0.15)',
  },
  ctaText: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  ctaTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: 18,
    fontWeight: 500,
    color: 'var(--green-dark)',
  },
  ctaDesc: {
    fontSize: 13,
    color: 'var(--green-light)',
    fontWeight: 500,
  },
  tipCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'var(--amber-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '14px 16px',
    border: '1px solid rgba(112,92,48,0.12)',
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'var(--amber)',
    flexShrink: 0,
    marginTop: 6,
  },
  tipText: {
    fontSize: 13,
    color: 'var(--amber)',
    lineHeight: 1.55,
  },
  recentSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--amber)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '36px 20px',
    backgroundColor: 'var(--cream-dark)',
    borderRadius: 'var(--radius-xl)',
    border: '1px dashed var(--cream-deeper)',
  },
  emptyIllustration: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    backgroundColor: 'var(--cream)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  emptyDesc: {
    fontSize: 13,
    color: 'var(--text-muted)',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  scanList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  scanItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'var(--cream-dark)',
    borderRadius: 'var(--radius-lg)',
    padding: '14px 16px',
  },
  scanThumb: {
    width: 44,
    height: 44,
    borderRadius: 'var(--radius-md)',
    objectFit: 'cover',
    flexShrink: 0,
  },
  scanInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  scanServing: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  scanVerdict: {
    fontSize: 12,
    fontWeight: 600,
  },
  scanScore: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--green)',
    fontFamily: 'var(--font-serif)',
  },
};
