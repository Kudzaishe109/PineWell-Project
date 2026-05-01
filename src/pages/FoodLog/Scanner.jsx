import { useRef, useState, useCallback } from 'react';
import { Camera, Upload, X, ArrowLeft, ScanLine, ImageIcon } from 'lucide-react';

export default function Scanner({ onBack, onAnalyze }) {
  const [image, setImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setImage({ file, url });
  }, []);

  const handleFileInput = (e) => handleFile(e.target.files[0]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const clearImage = () => {
    if (image?.url) URL.revokeObjectURL(image.url);
    setImage(null);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} style={{ color: 'var(--text-primary)' }} />
        </button>
        <div>
          <h1 style={styles.title}>Scan Label</h1>
          <p style={styles.subtitle}>Take or upload a photo of the nutrition facts</p>
        </div>
      </div>

      {/* Upload area */}
      {!image ? (
        <div
          style={{ ...styles.dropZone, ...(dragging ? styles.dropZoneDragging : {}) }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div style={styles.dropIllustration}>
            <div style={styles.dropIconOuter}>
              <ImageIcon size={32} style={{ color: 'var(--green-light)' }} strokeWidth={1.5} />
            </div>
          </div>
          <p style={styles.dropTitle}>Drop your image here</p>
          <p style={styles.dropHint}>or choose from the options below</p>

          <div style={styles.uploadOptions}>
            {/* Camera capture */}
            <button style={styles.optionBtn} onClick={() => cameraInputRef.current?.click()}>
              <div style={styles.optionIconWrap}>
                <Camera size={22} style={{ color: 'var(--green)' }} strokeWidth={1.8} />
              </div>
              <span style={styles.optionLabel}>Camera</span>
            </button>

            <div style={styles.optionDivider} />

            {/* File upload */}
            <button style={styles.optionBtn} onClick={() => fileInputRef.current?.click()}>
              <div style={styles.optionIconWrap}>
                <Upload size={22} style={{ color: 'var(--amber)' }} strokeWidth={1.8} />
              </div>
              <span style={styles.optionLabel}>Upload</span>
            </button>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
        </div>
      ) : (
        /* Image preview */
        <div style={styles.previewWrap}>
          <div style={styles.previewImageWrap}>
            <img src={image.url} alt="Label preview" style={styles.previewImage} />
            <button style={styles.clearBtn} onClick={clearImage}>
              <X size={16} style={{ color: 'white' }} />
            </button>
            <div style={styles.previewOverlay}>
              <ScanLine size={48} style={{ color: 'rgba(255,255,255,0.7)' }} strokeWidth={1} />
            </div>
          </div>
          <p style={styles.previewHint}>Make sure the nutrition facts panel is clearly visible</p>
        </div>
      )}

      {/* Tips */}
      {!image && (
        <div style={styles.tips}>
          <p style={styles.tipsTitle}>For best results</p>
          <ul style={styles.tipsList}>
            {[
              'Point camera at the Nutrition Facts box',
              'Ensure good lighting — no shadows',
              'Hold steady to avoid blur',
              'Capture the full label in frame',
            ].map((tip, i) => (
              <li key={i} style={styles.tipItem}>
                <span style={styles.tipNum}>{i + 1}</span>
                <span style={styles.tipText}>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analyze button */}
      <div style={styles.footer}>
        <button
          style={{ ...styles.analyzeBtn, ...(image ? {} : styles.analyzeBtnDisabled) }}
          disabled={!image}
          onClick={() => image && onAnalyze(image)}
        >
          <ScanLine size={20} />
          Analyze Label
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    padding: '20px 20px 32px',
    maxWidth: 600,
    margin: '0 auto',
    gap: 24,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--cream-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
    transition: 'background 0.15s',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: 26,
    fontWeight: 400,
    color: 'var(--text-primary)',
    lineHeight: 1.25,
  },
  subtitle: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    marginTop: 4,
  },
  dropZone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'var(--cream-dark)',
    border: '2px dashed var(--cream-deeper)',
    borderRadius: 'var(--radius-xl)',
    padding: '36px 24px',
    gap: 8,
    transition: 'border-color 0.2s, background 0.2s',
  },
  dropZoneDragging: {
    borderColor: 'var(--green)',
    backgroundColor: 'var(--green-subtle)',
  },
  dropIllustration: {
    marginBottom: 8,
  },
  dropIconOuter: {
    width: 72,
    height: 72,
    borderRadius: 'var(--radius-xl)',
    backgroundColor: 'var(--cream)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-soft)',
  },
  dropTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: 18,
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginTop: 4,
  },
  dropHint: {
    fontSize: 13,
    color: 'var(--text-muted)',
    marginBottom: 20,
  },
  uploadOptions: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    backgroundColor: 'var(--cream)',
    borderRadius: 'var(--radius-xl)',
    padding: '6px',
    boxShadow: 'var(--shadow-soft)',
  },
  optionBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '14px 32px',
    borderRadius: 'var(--radius-lg)',
    transition: 'background 0.15s',
  },
  optionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--cream-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    letterSpacing: '0.02em',
  },
  optionDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'var(--cream-deeper)',
    margin: '0 4px',
  },
  previewWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
  },
  previewImageWrap: {
    position: 'relative',
    width: '100%',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-elevated)',
    maxHeight: 340,
  },
  previewImage: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
    display: 'block',
  },
  clearBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
  },
  previewOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to top, rgba(0,0,0,0.15), transparent)',
    pointerEvents: 'none',
  },
  previewHint: {
    fontSize: 12,
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
  tips: {
    backgroundColor: 'var(--cream-dark)',
    borderRadius: 'var(--radius-xl)',
    padding: '20px',
    flex: 1,
  },
  tipsTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--amber)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  tipsList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  tipItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  tipNum: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: 'var(--cream)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--green)',
    flexShrink: 0,
    lineHeight: 1,
  },
  tipText: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 8,
  },
  analyzeBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'var(--green)',
    color: 'white',
    fontFamily: 'var(--font-sans)',
    fontWeight: 700,
    fontSize: 16,
    padding: '16px',
    borderRadius: 'var(--radius-xl)',
    transition: 'background 0.15s, transform 0.1s, opacity 0.2s',
    boxShadow: '0 4px 16px rgba(74,124,89,0.3)',
    letterSpacing: '0.01em',
  },
  analyzeBtnDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
};
