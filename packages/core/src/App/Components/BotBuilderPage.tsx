import React from 'react';

// Cipheredge Markets Bot Builder page.
// Embeds Deriv's live, actively-maintained DBot product via iframe,
// wrapped in Cipheredge branding/header. If Deriv blocks iframing
// (X-Frame-Options/CSP), this will show a fallback "open in new tab" card
// instead of a broken embed.

const DBOT_URL = 'https://dbot.deriv.com';

const styles: Record<string, React.CSSProperties> = {
    page: {
        backgroundColor: '#000000',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 22px',
        borderBottom: '1px solid #232323',
        backgroundColor: '#0a0a0a',
    },
    titleWrap: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    icon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#141414',
        border: '1px solid #E50914',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#E50914',
        fontWeight: 700,
        fontSize: 16,
    },
    title: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 700,
        fontFamily: 'Helvetica, Arial, sans-serif',
    },
    subtitle: {
        color: '#8c8c8c',
        fontSize: 11,
        fontFamily: 'Helvetica, Arial, sans-serif',
    },
    openNewTabBtn: {
        backgroundColor: 'transparent',
        border: '1px solid #333333',
        color: '#bdbdbd',
        fontSize: 12,
        padding: '7px 14px',
        borderRadius: 6,
        cursor: 'pointer',
        fontFamily: 'Helvetica, Arial, sans-serif',
    },
    iframeWrap: {
        flex: 1,
        position: 'relative',
    },
    iframe: {
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block',
    },
    fallbackWrap: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 40,
        color: '#bdbdbd',
        fontFamily: 'Helvetica, Arial, sans-serif',
    },
    fallbackTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 10,
    },
    fallbackText: {
        fontSize: 13,
        color: '#8c8c8c',
        maxWidth: 420,
        marginBottom: 22,
        lineHeight: 1.6,
    },
    fallbackBtn: {
        background: 'linear-gradient(90deg, #E50914, #831010)',
        color: '#ffffff',
        border: 'none',
        borderRadius: 24,
        padding: '12px 28px',
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-block',
    },
};

const BotBuilderPage: React.FC = () => {
    const [blocked, setBlocked] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    React.useEffect(() => {
        // If the iframe hasn't fired onLoad within 6s, assume it was blocked
        // by X-Frame-Options/CSP (browsers don't expose that error to JS,
        // so a timeout is the most reliable client-side signal).
        const timer = setTimeout(() => {
            if (!loaded) setBlocked(true);
        }, 6000);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div style={styles.titleWrap}>
                    <div style={styles.icon}>C</div>
                    <div>
                        <div style={styles.title}>Bot Builder</div>
                        <div style={styles.subtitle}>Powered by Deriv</div>
                    </div>
                </div>
                <button
                    style={styles.openNewTabBtn}
                    onClick={() => window.open(DBOT_URL, '_blank', 'noopener,noreferrer')}
                >
                    Open in new tab ↗
                </button>
            </div>

            {!blocked && (
                <div style={styles.iframeWrap}>
                    <iframe
                        ref={iframeRef}
                        src={DBOT_URL}
                        style={styles.iframe}
                        title='Deriv Bot Builder'
                        onLoad={() => setLoaded(true)}
                        allow='clipboard-write'
                    />
                </div>
            )}

            {blocked && (
                <div style={styles.fallbackWrap}>
                    <div style={styles.fallbackTitle}>Bot Builder opens in a new tab</div>
                    <p style={styles.fallbackText}>
                        Deriv&rsquo;s Bot Builder doesn&rsquo;t allow embedding inside other sites for security
                        reasons. Click below to open it directly &mdash; you&rsquo;ll stay logged in with the
                        same Deriv account.
                    </p>
                    <a
                        style={styles.fallbackBtn}
                        href={DBOT_URL}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Open Bot Builder ↗
                    </a>
                </div>
            )}
        </div>
    );
};

export default BotBuilderPage;
