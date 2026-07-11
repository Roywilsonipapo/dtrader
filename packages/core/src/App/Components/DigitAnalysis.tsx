import React from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────
const WS_URL = 'wss://api.derivws.com/trading/v1/options/ws/public?app_id=1089';
const MAX_TICKS = 1000;

const SYMBOLS = [
    { label: 'Volatility 10 (1s)', value: 'R_10' },
    { label: 'Volatility 25 (1s)', value: 'R_25' },
    { label: 'Volatility 50 (1s)', value: 'R_50' },
    { label: 'Volatility 75 (1s)', value: 'R_75' },
    { label: 'Volatility 100 (1s)', value: 'R_100' },
    { label: 'Volatility 10', value: 'R_10' },
    { label: 'Boom 1000', value: 'BOOM1000' },
    { label: 'Crash 1000', value: 'CRASH1000' },
];

const TICK_WINDOWS = [50, 100, 200, 500, 1000];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getLastDigit = (price: number): number => {
    const str = price.toFixed(2);
    return parseInt(str[str.length - 1]);
};

const analyseOUStreak = (seq: string[]): string => {
    if (seq.length < 10) return 'Collecting data...';
    const last = seq.slice(-10);
    const oCount = last.filter(x => x === 'O').length;
    const uCount = last.filter(x => x === 'U').length;
    // Streak detection
    let streak = 1;
    for (let i = last.length - 2; i >= 0; i--) {
        if (last[i] === last[last.length - 1]) streak++;
        else break;
    }
    if (streak >= 5) return `⚠️ ${streak}-tick ${last[last.length-1] === 'O' ? 'OVER' : 'UNDER'} streak — statistically, a reversal may be due`;
    if (oCount >= 8) return `📈 Over dominant in last 10 ticks (${oCount}/10) — consider Under`;
    if (uCount >= 8) return `📉 Under dominant in last 10 ticks (${uCount}/10) — consider Over`;
    return `⚖️ Balanced — Over ${oCount}/10, Under ${uCount}/10 in last 10 ticks`;
};

const analyseMDStreak = (seq: string[], digit: number): string => {
    if (seq.length < 20) return 'Collecting data...';
    const last = seq.slice(-20);
    const mCount = last.filter(x => x === 'M').length;
    let streak = 1;
    for (let i = last.length - 2; i >= 0; i--) {
        if (last[i] === last[last.length - 1]) streak++;
        else break;
    }
    if (streak >= 4) return `⚠️ ${streak} consecutive ${last[last.length-1] === 'M' ? `Matches on ${digit}` : 'Differs'} — watch for change`;
    if (mCount >= 4) return `🎯 Digit ${digit} appeared ${mCount} times in last 20 ticks — above average`;
    if (mCount === 0) return `❄️ Digit ${digit} has NOT appeared in last 20 ticks — statistically due`;
    return `📊 Digit ${digit} matched ${mCount}/20 ticks in last 20 (expected ~2)`;
};

const getOUSignalColor = (type: string): string => {
    if (type === 'O') return '#2ecc71';
    if (type === 'U') return '#E50914';
    return '#ffad3a'; // Equal
};

const getMDSignalColor = (type: string): string => {
    if (type === 'M') return '#E50914';
    return '#4a4a4a';
};

// ─── Sub-components ──────────────────────────────────────────────────────────
const DigitRing: React.FC<{ digit: number; count: number; total: number; isCurrent: boolean; isMax: boolean; isMin: boolean }> = 
({ digit, count, total, isCurrent, isMax, isMin }) => {
    const pct = total > 0 ? (count / total) * 100 : 0;
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (pct / 100) * circumference;
    const ringColor = isMax ? '#2ecc71' : isMin ? '#E50914' : '#E50914';
    const bgColor = isMax ? 'rgba(46,204,113,0.08)' : isMin ? 'rgba(229,9,20,0.08)' : 'transparent';

    return (
        <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            background: bgColor, borderRadius: 10, padding: '10px 6px',
            border: isCurrent ? '2px solid #fff' : isMax ? '1px solid #2ecc7133' : isMin ? '1px solid #E5091433' : '1px solid #1e1e1e',
            position: 'relative', transition: 'all .3s', minWidth: 68,
        }}>
            {isCurrent && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', fontSize: 12 }}>▼</div>
            )}
            <svg width={70} height={70} viewBox="0 0 70 70">
                <circle cx={35} cy={35} r={radius} fill="none" stroke="#1e1e1e" strokeWidth={5} />
                <circle cx={35} cy={35} r={radius} fill="none" stroke={ringColor} strokeWidth={5}
                    strokeDasharray={circumference} strokeDashoffset={dashOffset}
                    strokeLinecap="round" transform="rotate(-90 35 35)"
                    style={{ transition: 'stroke-dashoffset .4s ease' }} />
                <text x={35} y={35} textAnchor="middle" dominantBaseline="central"
                    fill="#fff" fontSize={18} fontWeight={700} fontFamily="Helvetica,Arial,sans-serif">{digit}</text>
            </svg>
            <div style={{ 
                fontSize: 12, fontWeight: 700, color: isMax ? '#2ecc71' : isMin ? '#E50914' : '#bdbdbd',
                background: (isMax || isMin) ? (isMax ? 'rgba(46,204,113,0.15)' : 'rgba(229,9,20,0.15)') : 'transparent',
                borderRadius: 8, padding: '2px 6px',
            }}>{pct.toFixed(1)}%</div>
            <div style={{ fontSize: 10, color: '#555' }}>{count} ticks</div>
            {isMax && <div style={{ fontSize: 9, color: '#2ecc71', letterSpacing: 1 }}>MOST</div>}
            {isMin && <div style={{ fontSize: 9, color: '#E50914', letterSpacing: 1 }}>LEAST</div>}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DigitAnalysisPro: React.FC = () => {
    const [symbol, setSymbol] = React.useState('R_100');
    const [price, setPrice] = React.useState('--');
    const [digits, setDigits] = React.useState<number[]>([]);
    const [connected, setConnected] = React.useState(false);
    const [tab, setTab] = React.useState<'ou' | 'md'>('ou');
    const [ouBarrier, setOuBarrier] = React.useState(4);
    const [mdDigit, setMdDigit] = React.useState(5);
    const [tickWindow, setTickWindow] = React.useState(100);
    const wsRef = React.useRef<WebSocket | null>(null);

    // Connect WebSocket
    React.useEffect(() => {
        if (wsRef.current) wsRef.current.close();
        setDigits([]);
        setPrice('--');
        setConnected(false);

        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            setConnected(true);
            ws.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
        };
        ws.onmessage = (e) => {
            const d = JSON.parse(e.data);
            if (d.tick) {
                const p = d.tick.quote;
                setPrice(p.toFixed(2));
                const digit = getLastDigit(p);
                setDigits(prev => [...prev.slice(-(MAX_TICKS - 1)), digit]);
            }
        };
        ws.onerror = () => setConnected(false);
        ws.onclose = () => setConnected(false);
        return () => ws.close();
    }, [symbol]);

    // Computed values
    const windowDigits = digits.slice(-tickWindow);
    const total = windowDigits.length || 1;
    const counts = Array.from({ length: 10 }, (_, i) => windowDigits.filter(d => d === i).length);
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts.filter(c => c > 0));
    const maxDigit = counts.indexOf(maxCount);
    const minDigit = counts.indexOf(minCount);
    const currentDigit = digits.length > 0 ? digits[digits.length - 1] : -1;

    // O/U sequence
    const ouSequence = windowDigits.map(d => {
        if (d > ouBarrier) return 'O';
        if (d < ouBarrier) return 'U';
        return 'E';
    });

    // M/D sequence
    const mdSequence = windowDigits.map(d => d === mdDigit ? 'M' : 'D');

    // Even/Odd
    const evenCount = windowDigits.filter(d => d % 2 === 0).length;
    const oddCount = windowDigits.filter(d => d % 2 !== 0).length;

    // O/U counts
    const overCount = ouSequence.filter(s => s === 'O').length;
    const underCount = ouSequence.filter(s => s === 'U').length;
    const equalCount = ouSequence.filter(s => s === 'E').length;

    // M/D counts
    const matchCount = mdSequence.filter(s => s === 'M').length;
    const differCount = mdSequence.filter(s => s === 'D').length;

    const ouSignal = analyseOUStreak(ouSequence);
    const mdSignal = analyseMDStreak(mdSequence, mdDigit);

    const s: Record<string, React.CSSProperties> = {
        page: { background: '#000', minHeight: '100vh', fontFamily: 'Helvetica,Arial,sans-serif', color: '#fff', padding: 20 },
        topRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' as const },
        select: { background: '#111', border: '1px solid #2a2a2a', color: '#fff', padding: '9px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer' },
        priceBox: { background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, padding: '9px 16px', fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: '#E50914', display: 'flex', alignItems: 'center', gap: 8 },
        dot: { width: 8, height: 8, borderRadius: '50%', background: connected ? '#2ecc71' : '#E50914', animation: 'pulse 2s infinite', flexShrink: 0 as const },
        statusPill: { background: '#111', border: `1px solid ${connected ? '#2ecc7133' : '#E5091433'}`, color: connected ? '#2ecc71' : '#E50914', borderRadius: 20, padding: '5px 12px', fontSize: 12, letterSpacing: .5 },
        tickInfo: { marginLeft: 'auto', fontSize: 12, color: '#555', fontFamily: 'monospace' },
        ringGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 20 },
        tabRow: { display: 'flex', gap: 10, marginBottom: 20 },
        tab: { padding: '9px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1px solid #2a2a2a', background: 'transparent', color: '#bdbdbd', transition: 'all .2s' },
        tabActive: { padding: '9px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1px solid #E50914', background: '#E50914', color: '#fff' },
        panel: { background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: 12, padding: 20, marginBottom: 16 },
        panelTitle: { fontSize: 13, fontWeight: 700, color: '#bdbdbd', marginBottom: 14, letterSpacing: .5 },
        controlRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' as const },
        label: { fontSize: 12, color: '#666' },
        seqWrap: { display: 'flex', flexWrap: 'wrap' as const, gap: 4, maxHeight: 200, overflowY: 'auto' as const, padding: 4 },
        signal: { background: '#0d0d0d', border: '1px solid #2a1a1a', borderLeft: '3px solid #E50914', borderRadius: 6, padding: '12px 16px', fontSize: 13, color: '#bdbdbd', lineHeight: 1.6 },
        statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 },
        statBox: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '12px', textAlign: 'center' as const },
        statVal: { fontSize: 22, fontWeight: 700, marginBottom: 2 },
        statLabel: { fontSize: 11, color: '#555', letterSpacing: .3 },
        disclaimer: { fontSize: 11, color: '#444', lineHeight: 1.5, marginTop: 16, padding: '10px 14px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 6 },
        windowBtns: { display: 'flex', gap: 6, flexWrap: 'wrap' as const },
        windowBtn: { padding: '5px 12px', borderRadius: 14, fontSize: 11, cursor: 'pointer', border: '1px solid #2a2a2a', background: 'transparent', color: '#bdbdbd', transition: 'all .2s' },
        windowBtnActive: { padding: '5px 12px', borderRadius: 14, fontSize: 11, cursor: 'pointer', border: '1px solid #E50914', background: '#E5091422', color: '#E50914' },
    };

    return (
        <div style={s.page}>
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

            {/* Header */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Digit Analysis</div>
                <div style={{ fontSize: 13, color: '#555' }}>Live last-digit distribution — real WebSocket data from Deriv</div>
            </div>

            {/* Top controls */}
            <div style={s.topRow}>
                <select style={s.select} value={symbol} onChange={e => setSymbol(e.target.value)}>
                    {SYMBOLS.map(sym => <option key={sym.value + sym.label} value={sym.value}>{sym.label}</option>)}
                </select>
                <div style={s.priceBox}>
                    <span style={s.dot} />
                    {price}
                </div>
                <span style={s.statusPill}>{connected ? '● CONNECTED' : '○ CONNECTING...'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                    <span style={s.label}>Window:</span>
                    <div style={s.windowBtns}>
                        {TICK_WINDOWS.map(w => (
                            <button key={w} style={tickWindow === w ? s.windowBtnActive : s.windowBtn} onClick={() => setTickWindow(w)}>{w}</button>
                        ))}
                    </div>
                </div>
                <span style={s.tickInfo}>{windowDigits.length}/{tickWindow} ticks</span>
            </div>

            {/* Digit rings */}
            <div style={s.ringGrid}>
                {Array.from({ length: 10 }, (_, i) => (
                    <DigitRing key={i} digit={i} count={counts[i]} total={total}
                        isCurrent={currentDigit === i} isMax={i === maxDigit && total > 20} isMin={i === minDigit && total > 20} />
                ))}
            </div>

            {/* Even/Odd quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                <div style={{ background: '#0d2a15', border: '1px solid #1a4a2a', borderRadius: 10, padding: '14px 18px' }}>
                    <div style={{ fontSize: 11, color: '#2ecc71', letterSpacing: 1, marginBottom: 6 }}>EVEN</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#2ecc71' }}>{((evenCount / total) * 100).toFixed(1)}%</div>
                    <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{evenCount} of {total} ticks</div>
                </div>
                <div style={{ background: '#1a0d0d', border: '1px solid #3a1818', borderRadius: 10, padding: '14px 18px' }}>
                    <div style={{ fontSize: 11, color: '#E50914', letterSpacing: 1, marginBottom: 6 }}>ODD</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#E50914' }}>{((oddCount / total) * 100).toFixed(1)}%</div>
                    <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{oddCount} of {total} ticks</div>
                </div>
            </div>

            {/* Tabs */}
            <div style={s.tabRow}>
                <button style={tab === 'ou' ? s.tabActive : s.tab} onClick={() => setTab('ou')}>Over / Under</button>
                <button style={tab === 'md' ? s.tabActive : s.tab} onClick={() => setTab('md')}>Matches / Differs</button>
            </div>

            {/* Over/Under Panel */}
            {tab === 'ou' && (
                <>
                    <div style={s.panel}>
                        <div style={s.panelTitle}>OVER / UNDER ANALYSIS</div>
                        <div style={s.controlRow}>
                            <span style={s.label}>Barrier digit:</span>
                            {[1,2,3,4,5,6,7,8].map(n => (
                                <button key={n} style={ouBarrier === n ? s.windowBtnActive : s.windowBtn} onClick={() => setOuBarrier(n)}>{n}</button>
                            ))}
                        </div>
                        <div style={s.statsRow}>
                            <div style={s.statBox}>
                                <div style={{ ...s.statVal, color: '#2ecc71' }}>{overCount}</div>
                                <div style={s.statLabel}>Over {ouBarrier}</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: '#2ecc71', marginTop: 4 }}>{((overCount / total) * 100).toFixed(1)}%</div>
                            </div>
                            <div style={s.statBox}>
                                <div style={{ ...s.statVal, color: '#ffad3a' }}>{equalCount}</div>
                                <div style={s.statLabel}>Equal {ouBarrier}</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffad3a', marginTop: 4 }}>{((equalCount / total) * 100).toFixed(1)}%</div>
                            </div>
                            <div style={s.statBox}>
                                <div style={{ ...s.statVal, color: '#E50914' }}>{underCount}</div>
                                <div style={s.statLabel}>Under {ouBarrier}</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: '#E50914', marginTop: 4 }}>{((underCount / total) * 100).toFixed(1)}%</div>
                            </div>
                        </div>
                    </div>

                    <div style={s.panel}>
                        <div style={s.panelTitle}>O / U / E SEQUENCE — last {tickWindow} ticks (newest on right)</div>
                        <div style={s.seqWrap}>
                            {ouSequence.map((sym, i) => (
                                <div key={i} style={{
                                    width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                                    background: sym === 'O' ? '#0a2a15' : sym === 'U' ? '#1a0a0a' : '#1a1a0a',
                                    color: getOUSignalColor(sym),
                                    border: `1px solid ${sym === 'O' ? '#1a4a2a' : sym === 'U' ? '#3a1818' : '#3a3a18'}`,
                                    transform: i === ouSequence.length - 1 ? 'scale(1.2)' : 'none',
                                }}>
                                    {sym}
                                </div>
                            ))}
                        </div>
                        <div style={{ ...s.signal, marginTop: 14 }}>
                            <div style={{ fontSize: 10, color: '#E50914', letterSpacing: 1, marginBottom: 6 }}>PATTERN SIGNAL</div>
                            {ouSignal}
                        </div>
                        <div style={s.disclaimer}>
                            ⚠️ Educational purposes only. These are statistical observations based on historical tick data and do not predict future outcomes. Synthetic indices use a proprietary random number generator. Past patterns do not guarantee future results. Never trade with money you cannot afford to lose.
                        </div>
                    </div>
                </>
            )}

            {/* Matches/Differs Panel */}
            {tab === 'md' && (
                <>
                    <div style={s.panel}>
                        <div style={s.panelTitle}>MATCHES / DIFFERS ANALYSIS</div>
                        <div style={s.controlRow}>
                            <span style={s.label}>Target digit:</span>
                            {Array.from({ length: 10 }, (_, i) => (
                                <button key={i} style={mdDigit === i ? s.windowBtnActive : s.windowBtn} onClick={() => setMdDigit(i)}>{i}</button>
                            ))}
                        </div>
                        <div style={s.statsRow}>
                            <div style={s.statBox}>
                                <div style={{ ...s.statVal, color: '#E50914' }}>{matchCount}</div>
                                <div style={s.statLabel}>Matches ({mdDigit})</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: '#E50914', marginTop: 4 }}>{((matchCount / total) * 100).toFixed(1)}%</div>
                            </div>
                            <div style={s.statBox}>
                                <div style={{ ...s.statVal, color: '#555' }}>~{(total * 0.1).toFixed(0)}</div>
                                <div style={s.statLabel}>Expected matches</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: '#555', marginTop: 4 }}>~10%</div>
                            </div>
                            <div style={s.statBox}>
                                <div style={{ ...s.statVal, color: '#bdbdbd' }}>{differCount}</div>
                                <div style={s.statLabel}>Differs</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: '#bdbdbd', marginTop: 4 }}>{((differCount / total) * 100).toFixed(1)}%</div>
                            </div>
                        </div>
                    </div>

                    <div style={s.panel}>
                        <div style={s.panelTitle}>M / D SEQUENCE — last {tickWindow} ticks (newest on right)</div>
                        <div style={s.seqWrap}>
                            {mdSequence.map((sym, i) => (
                                <div key={i} style={{
                                    width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                                    background: sym === 'M' ? '#1a0a0a' : '#0d0d0d',
                                    color: getMDSignalColor(sym),
                                    border: `1px solid ${sym === 'M' ? '#3a1818' : '#2a2a2a'}`,
                                    transform: i === mdSequence.length - 1 ? 'scale(1.2)' : 'none',
                                }}>
                                    {sym}
                                </div>
                            ))}
                        </div>
                        <div style={{ ...s.signal, marginTop: 14 }}>
                            <div style={{ fontSize: 10, color: '#E50914', letterSpacing: 1, marginBottom: 6 }}>PATTERN SIGNAL</div>
                            {mdSignal}
                        </div>
                        <div style={s.disclaimer}>
                            ⚠️ Educational purposes only. Statistical observations only — not financial advice. Each tick is independently generated. Past patterns do not predict future outcomes.
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DigitAnalysisPro;
