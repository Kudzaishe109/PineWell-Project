import { ArrowLeft, ScanLine, Save, CheckCircle, AlertTriangle, AlertCircle, TrendingDown, Sparkles, Leaf, Droplets, ArrowRight } from 'lucide-react';

const STATUS_CONFIG = {
  'good':      { color: '#4a7c59', bg: '#e8f0eb', border: 'rgba(74,124,89,0.2)',  Icon: CheckCircle,    label: 'Good'     },
  'low':       { color: '#705c30', bg: '#f5eedc', border: 'rgba(112,92,48,0.2)', Icon: TrendingDown,   label: 'Low'      },
  'too-much':  { color: '#c0392b', bg: '#fdecea', border: 'rgba(192,57,43,0.2)', Icon: AlertTriangle,  label: 'Too much' },
  'attention': { color: '#d97706', bg: '#fef3c7', border: 'rgba(217,119,6,0.2)', Icon: AlertCircle,    label: 'Attention'},
};

export default function Results({ result, imageUrl, onScanAnother, onSave }) {
  if (!result) return null;

  const { nutrients, summary, servingSize, servingsPerContainer, healthierAlternative } = result;
  const verdictColor = summary.score >= 75 ? 'var(--green)' : summary.score >= 55 ? '#d97706' : '#c0392b';

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={onScanAnother}>
          <ArrowLeft size={20} style={{ color: 'var(--text-primary)' }} />
        </button>
        <h1 style={styles.topTitle}>Results</h1>
        <div style={{ width: 40 }} />
      </div>

      {/* Image strip */}
      {imageUrl && (
        <div style={styles.imageStrip}>
          <img src={imageUrl} alt="Scanned label" style={styles.stripImage} />
          <div style={styles.stripOverlay} />
          <div style={styles.stripBadge}>
            <ScanLine size={12} style={{ color: 'var(--green)' }} />
            <span>Analyzed</span>
          </div>
        </div>
      )}

      {/* Summary card */}
      <div style={styles.summaryCard}>
        <div style={styles.scoreRing}>
          <ScoreRing score={summary.score} color={verdictColor} />
        </div>
        <div style={styles.summaryText}>
          <p style={styles.servingLabel}>Per serving · {servingSize}</p>
          <p style={{ ...styles.verdictText, color: verdictColor }}>{summary.verdict}</p>
          {summary.highlights.length > 0 && (
            <div style={styles.highlights}>
              {summary.highlights.map((h, i) => (
                <span key={i} style={styles.highlight}>{h}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section label */}
      <div style={styles.sectionRow}>
        <Sparkles size={14} style={{ color: 'var(--amber)' }} />
        <p style={styles.sectionLabel}>Nutrient Breakdown</p>
      </div>

      {/* Nutrient cards */}
      <div style={styles.nutrientGrid}>
        {nutrients.map((n) => (
          <NutrientCard key={n.id} nutrient={n} />
        ))}
      </div>

      {/* Healthier Alternative */}
      {healthierAlternative && (
        <div style={styles.altCard}>
          <div style={styles.altHeader}>
            <div style={styles.altIconWrap}>
              {healthierAlternative.category === 'drink'
                ? <Droplets size={18} style={{ color: 'var(--green)' }} strokeWidth={1.8} />
                : <Leaf size={18} style={{ color: 'var(--green)' }} strokeWidth={1.8} />
              }
            </div>
            <div style={styles.altTitleGroup}>
              <p style={styles.altEyebrow}>Healthier Alternative</p>
              <p style={styles.altName}>{healthierAlternative.name}</p>
            </div>
            <ArrowRight size={16} style={{ color: 'var(--green-light)', flexShrink: 0 }} />
          </div>
          <p style={styles.altReason}>{healthierAlternative.reason}</p>
          <div style={styles.altSwaps}>
            {healthierAlternative.swaps.map((swap, i) => (
              <span key={i} style={styles.altSwapPill}>{swap}</span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.saveBtn} onClick={onSave}>
          <Save size={18} />
          Save to Food Log
        </button>
        <button style={styles.scanAgainBtn} onClick={onScanAnother}>
          <ScanLine size={18} />
          Scan Another
        </button>
      </div>
    </div>
  );
}

function NutrientCard({ nutrient }) {
  const { status, label, name, value, unit, explanation } = nutrient;
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['good'];
  const { Icon } = cfg;

  return (
    <div style={{ ...styles.nutrientCard, borderColor: cfg.border }}>
      <div style={styles.nutrientHeader}>
        <div style={styles.nutrientMeta}>
          <span style={styles.nutrientName}>{name}</span>
          <span style={styles.nutrientValue}>{value}<span style={styles.nutrientUnit}>{unit}</span></span>
        </div>
        <span style={{ ...styles.statusBadge, color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.border }}>
          <Icon size={11} strokeWidth={2.5} />
          {label}
        </span>
      </div>
      <p style={styles.nutrientExplanation}>{explanation}</p>
      <div style={{ ...styles.statusBar, backgroundColor: cfg.bg }}>
        <div style={{ ...styles.statusBarFill, backgroundColor: cfg.color, width: getBarWidth(nutrient) }} />
      </div>
    </div>
  );
}

function getBarWidth({ id, value }) {
  const maxes = {
    calories: 600, protein: 80, carbohydrates: 100, fat: 40,
    saturatedFat: 20, fiber: 28, sugar: 50, addedSugar: 25,
    sodium: 2300, cholesterol: 300,
  };
  const pct = Math.min((value / (maxes[id] || value + 1)) * 100, 100);
  return `${Math.round(pct)}%`;
}

function ScoreRing({ score, color }) {
  const r = 30;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={styles.scoreWrap}>
      <svg width={80} height={80} viewBox="0 0 80 80">
        <circle cx={40} cy={40} r={r} fill="none" stroke="var(--cream-deeper)" strokeWidth={6} />
        <circle
          cx={40} cy={40} r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 40 40)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={styles.scoreInner}>
        <span style={{ ...styles.scoreNum, color }}>{score}</span>
        <span style={styles.scoreOf}>/100</span>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    padding: '20px 20px 100px',
    maxWidth: 600,
    margin: '0 auto',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--cream-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: 20,
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  imageStrip: {
    position: 'relative',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    height: 140,
    boxShadow: 'var(--shadow-card)',
  },
  stripImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  stripOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.35))',
  },
  stripBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(250,246,240,0.95)',
    borderRadius: 'var(--radius-full)',
    padding: '5px 10px',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--green)',
    letterSpacing: '0.04em',
    backdropFilter: 'blur(6px)',
  },
  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    backgroundColor: 'var(--cream-dark)',
    borderRadius: 'var(--radius-xl)',
    padding: '20px 22px',
    boxShadow: 'var(--shadow-soft)',
  },
  scoreRing: { flexShrink: 0 },
  summaryText: { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 },
  servingLabel: { fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase' },
  verdictText: { fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, lineHeight: 1.2, marginTop: 2 },
  highlights: { display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 },
  highlight: {
    fontSize: 11, fontWeight: 600,
    backgroundColor: 'var(--green-subtle)',
    color: 'var(--green-dark)',
    borderRadius: 'var(--radius-full)',
    padding: '3px 9px',
  },
  scoreWrap: { position: 'relative', width: 80, height: 80 },
  scoreInner: {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    lineHeight: 1,
  },
  scoreNum: { fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-serif)' },
  scoreOf: { fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, marginTop: 1 },
  sectionRow: {
    display: 'flex', alignItems: 'center', gap: 7,
  },
  sectionLabel: {
    fontSize: 12, fontWeight: 700, color: 'var(--amber)',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  nutrientGrid: {
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  nutrientCard: {
    backgroundColor: 'var(--cream-dark)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px 18px',
    border: '1px solid',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  nutrientHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
  },
  nutrientMeta: { display: 'flex', flexDirection: 'column', gap: 2 },
  nutrientName: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' },
  nutrientValue: { fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.1 },
  nutrientUnit: { fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 2 },
  statusBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    fontSize: 11, fontWeight: 700, letterSpacing: '0.03em',
    border: '1px solid', borderRadius: 'var(--radius-full)',
    padding: '4px 10px', whiteSpace: 'nowrap', flexShrink: 0,
  },
  nutrientExplanation: { fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 },
  statusBar: {
    height: 4, borderRadius: 'var(--radius-full)', overflow: 'hidden',
  },
  statusBarFill: {
    height: '100%', borderRadius: 'var(--radius-full)',
    transition: 'width 0.8s ease',
  },
  altCard: {
    backgroundColor: 'var(--green-subtle)',
    border: '1.5px solid rgba(74,124,89,0.2)',
    borderRadius: 'var(--radius-xl)',
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  altHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  altIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(74,124,89,0.12)',
  },
  altTitleGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  altEyebrow: {
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--green)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  altName: {
    fontFamily: 'var(--font-serif)',
    fontSize: 17,
    fontWeight: 500,
    color: 'var(--green-dark)',
    lineHeight: 1.2,
  },
  altReason: {
    fontSize: 13,
    color: 'var(--green-dark)',
    lineHeight: 1.55,
  },
  altSwaps: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  altSwapPill: {
    fontSize: 11,
    fontWeight: 700,
    backgroundColor: 'white',
    color: 'var(--green)',
    borderRadius: 'var(--radius-full)',
    padding: '4px 10px',
    border: '1px solid rgba(74,124,89,0.2)',
  },
  actions: {
    display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4,
  },
  saveBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: 'var(--green)', color: 'white',
    fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16,
    padding: '16px', borderRadius: 'var(--radius-xl)',
    boxShadow: '0 4px 16px rgba(74,124,89,0.3)',
    transition: 'background 0.15s',
  },
  scanAgainBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: 'transparent', color: 'var(--green)',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15,
    padding: '14px', borderRadius: 'var(--radius-xl)',
    border: '1.5px solid rgba(74,124,89,0.3)',
    transition: 'background 0.15s',
  },
};
