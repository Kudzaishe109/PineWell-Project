import { useState, useCallback } from 'react';
import FoodLogHome from './FoodLogHome';
import Scanner from './Scanner';
import AnalyzingScreen from './AnalyzingScreen';
import Results from './Results';
import { analyzeFoodLabel } from '../../services/aiAnalysis';

const SCREENS = { HOME: 'home', SCANNER: 'scanner', ANALYZING: 'analyzing', RESULTS: 'results' };

export default function FoodLog() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [currentImage, setCurrentImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [error, setError] = useState(null);

  const handleAnalyze = useCallback(async (image) => {
    setCurrentImage(image);
    setScreen(SCREENS.ANALYZING);
    setError(null);
    try {
      const result = await analyzeFoodLabel(image.file);
      setAnalysisResult({ ...result, imageUrl: image.url });
      setScreen(SCREENS.RESULTS);
    } catch (err) {
      setError('Analysis failed. Please try again.');
      setScreen(SCREENS.SCANNER);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!analysisResult) return;
    setRecentScans(prev => [analysisResult, ...prev].slice(0, 10));
    setScreen(SCREENS.HOME);
    setCurrentImage(null);
    setAnalysisResult(null);
  }, [analysisResult]);

  const handleScanAnother = () => {
    setCurrentImage(null);
    setAnalysisResult(null);
    setScreen(SCREENS.SCANNER);
  };

  return (
    <div style={{ minHeight: '100%' }}>
      {error && (
        <div style={errorBanner}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ fontWeight: 700, color: 'inherit' }}>✕</button>
        </div>
      )}

      {screen === SCREENS.HOME && (
        <FoodLogHome
          onStartScan={() => setScreen(SCREENS.SCANNER)}
          recentScans={recentScans}
        />
      )}
      {screen === SCREENS.SCANNER && (
        <Scanner
          onBack={() => setScreen(SCREENS.HOME)}
          onAnalyze={handleAnalyze}
        />
      )}
      {screen === SCREENS.ANALYZING && (
        <AnalyzingScreen imageUrl={currentImage?.url} />
      )}
      {screen === SCREENS.RESULTS && analysisResult && (
        <Results
          result={analysisResult}
          imageUrl={analysisResult.imageUrl}
          onScanAnother={handleScanAnother}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

const errorBanner = {
  position: 'fixed',
  top: 0, left: 0, right: 0,
  backgroundColor: '#c0392b',
  color: 'white',
  padding: '12px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: 14,
  fontWeight: 500,
  zIndex: 200,
};
