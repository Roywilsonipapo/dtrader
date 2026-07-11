import React from 'react';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';

const TICKER_ITEMS = [
    { sym: 'VOL 100', price: '778.33', up: true, pct: '0.04%' },
    { sym: 'VOL 75', price: '301.18', up: true, pct: '0.11%' },
    { sym: 'VOL 50', price: '215.92', up: false, pct: '0.03%' },
    { sym: 'VOL 25', price: '189.44', up: true, pct: '0.07%' },
    { sym: 'VOL 10', price: '9650.22', up: false, pct: '0.02%' },
    { sym: 'BOOM 1000', price: '8912.44', up: true, pct: '0.18%' },
    { sym: 'CRASH 1000', price: '8744.10', up: false, pct: '0.21%' },
    { sym: 'EUR/USD', price: '1.0842', up: false, pct: '0.02%' },
    { sym: 'BTC/USD', price: '67,210', up: true, pct: '1.21%' },
];

const FEATURES = [
    { icon: '📈', tag: 'LIVE DATA', title: 'Real-time price feed', desc: 'Live market data streamed from Deriv\'s WebSocket API with zero delay.' },
    { icon: '⚡', tag: 'CONTRACTS', title: '6+ trading products', desc: 'Rise/Fall, Accumulators, Multipliers, Turbos, Vanillas and more.' },
    { icon: '🔒', tag: 'SECURITY', title: 'OAuth2 secure login', desc: 'Log in with your Deriv account. We never see or store your password.' },
    { icon: '🤖', tag: 'AUTOMATION', title: 'Bot strategies', desc: 'Load pre-built bots or build your own with the visual bot builder.' },
    { icon: '🎯', tag: 'ANALYSIS', title: 'Digit analysis tool', desc: 'Live digit frequency, Even/Odd splits, Over/Under breakdowns in real time.' },
    { icon: '📊', tag: 'REPORTS', title: 'Full trade history', desc: 'Open positions, profit table, account statements — all in one click.' },
];

const TOOLS = [
    { icon: '📉', title: 'Digit Analysis', desc: 'Live digit frequency, Even/Odd, Over/Under — tick by tick.', badge: 'LIVE', route: '/digit-analysis' },
    { icon: '🤖', title: 'Bot Builder', desc: 'Visual drag-and-drop strategy builder. No coding required.', badge: 'INTERACTIVE', route: '/bot-builder' },
    { icon: '📦', title: 'Free Bots', desc: 'Pre-built strategies: Martingale, Digit switcher, Over/Under and more.', badge: 'FREE', route: '/free-bots' },
    { icon: '📈', title: 'Live Charts', desc: 'Candlestick charts with real-time tick data across all synthetic indices.', badge: 'REAL-TIME', route: routes.index },
    { icon: '📋', title: 'Trade Reports', desc: 'Full history, profit table and account statement — always accessible.', badge: 'ACCOUNT', route: routes.reports },
];

const CHECKLIST = [
    'Powered by Deriv\'s regulated trading engine',
    'No deposit required to start practicing',
    'Real-time market data with zero added delay',
    'Secure authentication via Deriv OAuth2',
    'Trade synthetic indices, forex, and crypto',
    'Both demo and real account support',
    'Pre-built bot strategies, free to load',
    'Full trade history and position tracking',
];

const css = `
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.ce-feature-card:hover{transform:translateY(-6px)!important;border-color:#E50914!important;box-shadow:0 12px 30px rgba(229,9,20,.15)!important}
.ce-tool-card:hover{transform:translateX(4px)!important;border-color:#E50914!important}
.ce-stat-card:hover{transform:translateY(-4px)!important;border-color:#E50914!important}
.ce-check-item:hover{transform:translateX(4px)!important;border-color:#333!important}
.ce-btn-primary:hover{transform:scale(1.04)!important}
.ce-btn-secondary:hover{border-color:#666!important}
`;

const WelcomeLanding: React.FC = () => {
    const history = useHistory();
    const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh', fontFamily: 'Helvetica,Arial,sans-serif', color: '#fff', overflowX: 'hidden' }}>
            <style>{css}</style>

            {/* Ticker */}
            <div style={{ width: '100%', background: '#0d0d0d', borderBottom: '1px solid #1a1a1a', overflow: 'hidden', height: 36, display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 28s linear infinite' }}>
                    {doubled.map((t, i) => (
                        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 22px', fontFamily: 'monospace', fontSize: 12, color: '#bdbdbd' }}>
                            <span style={{ color: '#fff', fontWeight: 600 }}>{t.sym}</span>
                            {t.price}
                            <span style={{ color: t.up ? '#2ecc71' : '#E50914' }}>{t.up ? '▲' : '▼'} {t.pct}</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Hero */}
            <div style={{ padding: '80px 32px 60px', textAlign: 'center', background: 'radial-gradient(ellipse at 50% 0%,rgba(229,9,20,.1),transparent 60%)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #2a2a2a', borderRadius: 20, padding: '6px 16px', fontSize: 12, color: '#bdbdbd', letterSpacing: .5, marginBottom: 28 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2ecc71', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                    Powered by Deriv's Trading Engine
                </div>
                <h1 style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 18, letterSpacing: -1 }}>
                    Precision Trading.<br /><span style={{ color: '#E50914' }}>Coded for the Edge.</span>
                </h1>
                <p style={{ fontSize: 16, color: '#9c9c9c', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
                    A professional-grade derivatives trading platform. Real-time pricing, analysis tools, and automated strategies — all in one place.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                    <button className="ce-btn-primary" onClick={() => history.push(routes.index)}
                        style={{ background: 'linear-gradient(90deg,#E50914,#831010)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 28, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'transform .2s' }}>
                        Start Trading →
                    </button>
                    <button className="ce-btn-secondary" onClick={() => history.push('/digit-analysis')}
                        style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '13px 28px', borderRadius: 28, fontSize: 14, cursor: 'pointer', transition: 'border-color .2s' }}>
                        Explore Tools
                    </button>
                </div>
                <div style={{ marginTop: 16, fontSize: 12, color: '#444' }}>No credit card required · Demo account included · Powered by Deriv</div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, padding: '0 32px 56px' }}>
                {[['$10,000', 'Virtual demo balance'], ['24/7', 'Market access'], ['0%', 'Setup fees'], ['100%', 'OAuth secured'], ['6+', 'Contract types']].map(([val, label]) => (
                    <div key={label} className="ce-stat-card" style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 10, padding: '18px 26px', textAlign: 'center', minWidth: 130, transition: 'all .25s', cursor: 'default' }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#E50914', marginBottom: 4 }}>{val}</div>
                        <div style={{ fontSize: 11, color: '#555', letterSpacing: .3 }}>{label}</div>
                    </div>
                ))}
            </div>

            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#2a2a2a,transparent)', margin: '0 32px' }} />

            {/* Features */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 32px' }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: '#E50914', border: '1px solid #2a1214', borderRadius: 14, padding: '4px 14px', display: 'inline-block', marginBottom: 14 }}>PLATFORM</div>
                <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, marginBottom: 10 }}>Built for serious traders</h2>
                <p style={{ fontSize: 14, color: '#7c7c7c', marginBottom: 36, maxWidth: 520, lineHeight: 1.6 }}>Professional tools backed by Deriv's regulated trading infrastructure.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
                    {FEATURES.map(f => (
                        <div key={f.title} className="ce-feature-card" style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '22px 18px', transition: 'all .25s', cursor: 'default' }}>
                            <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                            <div style={{ fontSize: 10, color: '#E50914', letterSpacing: 1, marginBottom: 6 }}>{f.tag}</div>
                            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                            <p style={{ fontSize: 12, color: '#7c7c7c', lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#2a2a2a,transparent)', margin: '0 32px' }} />

            {/* Tools */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 32px' }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: '#E50914', border: '1px solid #2a1214', borderRadius: 14, padding: '4px 14px', display: 'inline-block', marginBottom: 14 }}>TOOLS</div>
                <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, marginBottom: 10 }}>Your trading toolkit</h2>
                <p style={{ fontSize: 14, color: '#7c7c7c', marginBottom: 36, maxWidth: 520, lineHeight: 1.6 }}>Analysis, automation, and execution — all in one place.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12 }}>
                    {TOOLS.map(t => (
                        <div key={t.title} className="ce-tool-card" onClick={() => history.push(t.route)}
                            style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start', transition: 'all .2s', cursor: 'pointer' }}>
                            <div style={{ width: 42, height: 42, background: '#1a0a0b', border: '1px solid #3a1818', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{t.icon}</div>
                            <div>
                                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{t.title}</h4>
                                <p style={{ fontSize: 12, color: '#6c6c6c', lineHeight: 1.5, marginBottom: 6 }}>{t.desc}</p>
                                <span style={{ fontSize: 10, background: '#1a0a0b', color: '#E50914', border: '1px solid #3a1818', borderRadius: 10, padding: '2px 8px' }}>{t.badge}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#2a2a2a,transparent)', margin: '0 32px' }} />

            {/* Checklist */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 32px' }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: '#E50914', border: '1px solid #2a1214', borderRadius: 14, padding: '4px 14px', display: 'inline-block', marginBottom: 14 }}>WHY CIPHEREDGE</div>
                <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, marginBottom: 10 }}>Trade with clarity</h2>
                <p style={{ fontSize: 14, color: '#7c7c7c', marginBottom: 36, lineHeight: 1.6 }}>No inflated claims — just a clean, honest trading experience.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 10 }}>
                    {CHECKLIST.map(item => (
                        <div key={item} className="ce-check-item" style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '13px 16px', fontSize: 13, color: '#d0d0d0', transition: 'all .2s' }}>
                            <span style={{ color: '#E50914', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>✓</span>
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a', padding: '28px 32px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto 12px', background: '#111', border: '1px solid #1e1e1e', borderLeft: '4px solid #E50914', borderRadius: 6, padding: '16px 20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#E50914', marginBottom: 8 }}>RISK WARNING</div>
                    <div style={{ fontSize: 12, color: '#7c7c7c', lineHeight: 1.7 }}>The products offered include Options, Contracts for Difference ("CFDs"), and other complex derivatives. Trading Options may not be suitable for everyone. Trading CFDs carries a high level of risk since leverage can work both to your advantage and disadvantage. As a result, these products may not be suitable for all investors due to the risk of losing all invested funds.</div>
                </div>
                <div style={{ maxWidth: 900, margin: '0 auto', background: '#111', border: '1px solid #1e1e1e', borderLeft: '4px solid #333', borderRadius: 6, padding: '14px 20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#555', marginBottom: 6 }}>PARTNERSHIP DISCLOSURE</div>
                    <div style={{ fontSize: 12, color: '#555', lineHeight: 1.6 }}>Cipheredge Markets is an independent affiliate of Deriv. Trading services and financial products are offered by Deriv, not by Cipheredge Markets. Cipheredge Markets does not hold, custody, or pool client funds.</div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeLanding;
