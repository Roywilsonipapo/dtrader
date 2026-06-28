import React from 'react';

// Cipheredge Markets branded full-screen splash/loading screen.
// Used as the top-level overlay in App/app.jsx for SPLASH_TOTAL_DURATION_MS.
// Minimalist version: icon, wordmark, tagline, progress bar + percentage,
// a single cycling caption, and a Powered by Deriv badge.
// Fully HTML/CSS based so it adapts correctly to any screen size.

const CAPTIONS = [
    'LOADING LIVE CHARTS...',
    'CONNECTING TRADING BOTS...',
    'FETCHING LIVE MARKET PREVIEW...',
    'SECURING YOUR SESSION...',
    'CALIBRATING RISK ENGINE...',
    'SYNCING MARKET DATA FEED...',
    'VERIFYING ENCRYPTION KEYS...',
    'OPTIMIZING TRADE EXECUTION...',
];

const CAPTION_INTERVAL_MS = 2400;
const SPLASH_TOTAL_DURATION_MS = 10000;

// Decorative background only — grid lines + binary digits + ghosted candlesticks.
// Safe to crop on any aspect ratio since it's purely decorative.
const BACKGROUND_SVG = `
<svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="42%" r="65%">
      <stop offset="0%" stop-color="#1a0508"/>
      <stop offset="55%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#bgGlow)"/>
  <g stroke="#2a2a2a" stroke-width="1" opacity="0.3">
    <line x1="0" y1="180" x2="1920" y2="180"/>
    <line x1="0" y1="360" x2="1920" y2="360"/>
    <line x1="0" y1="720" x2="1920" y2="720"/>
    <line x1="0" y1="900" x2="1920" y2="900"/>
    <line x1="320" y1="0" x2="320" y2="1080"/>
    <line x1="640" y1="0" x2="640" y2="1080"/>
    <line x1="1280" y1="0" x2="1280" y2="1080"/>
    <line x1="1600" y1="0" x2="1600" y2="1080"/>
  </g>
  <g font-family="Courier New, monospace" font-size="14" fill="#E50914" opacity="0.15">
    <text x="60" y="120">01001 10110 00101</text>
    <text x="1500" y="160">11010 01100 10011</text>
    <text x="80" y="980">00110 11001 01010</text>
    <text x="1480" y="960">10101 00111 11000</text>
  </g>
  <g opacity="0.18">
    <rect x="110" y="640" width="14" height="90" fill="#2ecc71"/>
    <rect x="140" y="600" width="14" height="150" fill="#E50914"/>
    <rect x="170" y="660" width="14" height="70" fill="#2ecc71"/>
    <rect x="200" y="580" width="14" height="180" fill="#2ecc71"/>
    <rect x="230" y="620" width="14" height="110" fill="#E50914"/>
    <rect x="1680" y="610" width="14" height="160" fill="#2ecc71"/>
    <rect x="1710" y="650" width="14" height="80" fill="#E50914"/>
    <rect x="1740" y="590" width="14" height="170" fill="#2ecc71"/>
    <rect x="1770" y="630" width="14" height="100" fill="#E50914"/>
  </g>
</svg>
`;

const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: '#000000',
        overflow: 'hidden',
    },
    backgroundLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
    },
    content: {
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
        padding: '40px 20px',
        boxSizing: 'border-box',
    },
    ring: {
        width: 84,
        height: 84,
        borderRadius: 14,
        backgroundColor: '#141414',
        border: '2px solid #E50914',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 30px rgba(229, 9, 20, 0.5)',
        animation: 'cipheredge_pulse 2.2s ease-in-out infinite',
    },
    iconText: {
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 700,
        fontSize: 38,
        color: '#E50914',
        lineHeight: 1,
    },
    wordmark: {
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 700,
        fontSize: 'clamp(20px, 3.2vw, 36px)',
        letterSpacing: 1.5,
        color: '#FFFFFF',
        textAlign: 'center',
        whiteSpace: 'nowrap',
    },
    tagline: {
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 400,
        fontSize: 'clamp(10px, 1.1vw, 13px)',
        letterSpacing: 3,
        color: '#8c8c8c',
        textAlign: 'center',
    },
    progressRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 14,
    },
    barTrack: {
        width: 280,
        maxWidth: '60vw',
        height: 4,
        borderRadius: 2,
        backgroundColor: '#2a2a2a',
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        width: '40%',
        borderRadius: 2,
        background: 'linear-gradient(90deg, #E50914, #831010)',
        animation: 'cipheredge_bar 2.4s ease-in-out infinite',
    },
    percentText: {
        fontFamily: 'Courier New, monospace',
        fontSize: 12,
        color: '#E50914',
        minWidth: 32,
        textAlign: 'right',
    },
    caption: {
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 400,
        fontSize: 'clamp(10px, 1.1vw, 13px)',
        letterSpacing: 1.5,
        color: '#bdbdbd',
        textAlign: 'center',
        minHeight: 16,
    },
    badge: {
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '8px 22px',
        borderRadius: 20,
        backgroundColor: '#141414',
        border: '1px solid #333333',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: 12,
        letterSpacing: 1,
        color: '#bdbdbd',
        whiteSpace: 'nowrap',
        zIndex: 2,
    },
};

const keyframes = `
@keyframes cipheredge_pulse {
    0%, 100% { box-shadow: 0 0 16px rgba(229, 9, 20, 0.4); }
    50% { box-shadow: 0 0 40px rgba(229, 9, 20, 0.75); }
}
@keyframes cipheredge_bar {
    0% { width: 0%; margin-left: 0%; }
    50% { width: 100%; margin-left: 0%; }
    100% { width: 0%; margin-left: 100%; }
}
`;

const BrandSplashScreen = () => {
    const [caption_index, setCaptionIndex] = React.useState(0);
    const [percent, setPercent] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCaptionIndex(prev => (prev + 1) % CAPTIONS.length);
        }, CAPTION_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        const start = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const next = Math.min(99, Math.round((elapsed / SPLASH_TOTAL_DURATION_MS) * 100));
            setPercent(next);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div data-testid='brand_splash_screen' style={styles.wrapper}>
            <style>{keyframes}</style>
            <div style={styles.backgroundLayer} dangerouslySetInnerHTML={{ __html: BACKGROUND_SVG }} />

            <div style={styles.content}>
                <div style={styles.ring}>
                    <span style={styles.iconText}>C</span>
                </div>
                <div style={styles.wordmark}>
                    CIPHEREDGE <span style={{ color: '#E50914' }}>MARKETS</span>
                </div>
                <div style={styles.tagline}>PRECISION TRADING. CODED FOR THE EDGE.</div>

                <div style={styles.progressRow}>
                    <div style={styles.barTrack}>
                        <div style={styles.barFill} />
                    </div>
                    <span style={styles.percentText}>{percent}%</span>
                </div>

                <div style={styles.caption}>{CAPTIONS[caption_index]}</div>
            </div>

            <div style={styles.badge}>
                POWERED BY <strong style={{ color: '#FFFFFF' }}>DERIV</strong>
            </div>
        </div>
    );
};

export default BrandSplashScreen;
