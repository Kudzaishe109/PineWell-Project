import { useState } from 'react';
import { BarChart2, Stethoscope, Users } from 'lucide-react';
import Navigation from './components/Navigation';
import FoodLog from './pages/FoodLog';
import PlaceholderTab from './pages/PlaceholderTab';
import './App.css';

const TABS = {
  'food-log':    null,
  'nutrition':   { title: 'Nutrition', description: 'Detailed macro and micronutrient tracking across your logged meals will live here.', icon: <BarChart2 size={28} strokeWidth={1.5} style={{ color: 'var(--green)' }} /> },
  'doctor-prep': { title: 'Doctor Prep', description: 'Summarize your food patterns and health trends to share with your healthcare provider.', icon: <Stethoscope size={28} strokeWidth={1.5} style={{ color: 'var(--amber)' }} /> },
  'community':   { title: 'Community', description: "Connect with others on their wellness journey and share what's working.", icon: <Users size={28} strokeWidth={1.5} style={{ color: 'var(--green)' }} /> },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('food-log');
  const placeholder = TABS[activeTab];

  return (
    <div style={styles.shell}>
      <main style={styles.main}>
        {activeTab === 'food-log' ? (
          <FoodLog />
        ) : (
          <PlaceholderTab
            title={placeholder.title}
            description={placeholder.description}
            icon={placeholder.icon}
          />
        )}
      </main>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

const styles = {
  shell: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100dvh',
    backgroundColor: 'var(--cream)',
    maxWidth: 600,
    margin: '0 auto',
    position: 'relative',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: 80,
  },
};
