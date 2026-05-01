import { BookOpen, BarChart2, Stethoscope, Users } from 'lucide-react';

const TABS = [
  { id: 'food-log',    label: 'Food Log',    Icon: BookOpen       },
  { id: 'nutrition',   label: 'Nutrition',   Icon: BarChart2      },
  { id: 'doctor-prep', label: 'Doctor Prep', Icon: Stethoscope    },
  { id: 'community',   label: 'Community',   Icon: Users          },
];

export default function Navigation({ activeTab, onTabChange }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              style={{ ...styles.tab, ...(active ? styles.tabActive : {}) }}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.2 : 1.7}
                style={{ color: active ? 'var(--green)' : 'var(--text-muted)', transition: 'color 0.2s' }}
              />
              <span style={{ ...styles.label, color: active ? 'var(--green)' : 'var(--text-muted)' }}>
                {label}
              </span>
              {active && <span style={styles.dot} />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'var(--cream)',
    borderTop: '1px solid var(--cream-deeper)',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
    zIndex: 100,
    paddingBottom: 'env(safe-area-inset-bottom, 0)',
  },
  inner: {
    display: 'flex',
    maxWidth: 600,
    margin: '0 auto',
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    padding: '10px 4px 8px',
    position: 'relative',
    transition: 'opacity 0.15s',
  },
  tabActive: {},
  label: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.02em',
    transition: 'color 0.2s',
    fontFamily: 'var(--font-sans)',
  },
  dot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: '50%',
    backgroundColor: 'var(--green)',
  },
};
