import React from 'react';

const BOTS = [
    { id: 'ou_martingale', name: 'Over/Under Martingale', strategy: 'OVER/UNDER', desc: 'Starts with Over 5. On loss, switches to Under and doubles stake. Recovers previous loss on next win.', risk: 'HIGH', tags: ['Martingale', 'Recovery', 'Digit'], color: '#E50914' },
    { id: 'digit_switcher', name: 'Digit Switcher', strategy: 'MATCHES/DIFFERS', desc: 'Monitors last-digit frequency and switches target digit based on least-frequent appearance in last 50 ticks.', risk: 'MEDIUM', tags: ['Adaptive', 'Digit', 'Smart'], color: '#E50914' },
    { id: 'eo_recovery', name: 'Even/Odd Recovery', strategy: 'EVEN/ODD', desc: 'Trades Even/Odd with a 3-step recovery sequence. Resets to base stake after 3 consecutive wins.', risk: 'MEDIUM', tags: ['Even/Odd', 'Recovery'], color: '#E50914' },
    { id: 'rf_scalper', name: 'Rise/Fall Scalper', strategy: 'RISE/FALL', desc: 'Fast 1-tick Rise/Fall strategy. Trades in the direction of the last 3 ticks. Fixed stake, no martingale.', risk: 'LOW', tags: ['Rise/Fall', 'Scalper', 'Safe'], color: '#2ecc71' },
    { id: 'under_sniper', name: 'Under Sniper', strategy: 'OVER/UNDER', desc: 'Waits for 3 consecutive Over results, then trades Under with confidence. Patience-based entry system.', risk: 'LOW', tags: ['Under', 'Pattern', 'Safe'], color: '#2ecc71' },
    { id: 'over_hitnrun', name: 'Over Hit & Run', strategy: 'OVER/UNDER', desc: 'Places Over trades with a fixed profit target per session. Stops automatically when target is hit.', risk: 'LOW', tags: ['Over', 'Target', 'Auto-stop'], color: '#2ecc71' },
    { id: 'accumulator_bot', name: 'Accumulator Scalper', strategy: 'ACCUMULATORS', desc: 'Opens Accumulators at 1% growth rate with a tight take-profit. Compounds gains across multiple rounds.', risk: 'MEDIUM', tags: ['Accumulator', 'Compound'], color: '#E50914' },
    { id: 'cascade_recovery', name: 'Cascade Recovery', strategy: 'OVER/UNDER', desc: 'A 4-step stake cascade: 1→2→4→8. Resets on any win. Best for high-volatility synthetic indices.', risk: 'HIGH', tags: ['Cascade', 'Martingale', 'Aggressive'], color: '#E50914' },
];

const riskColors: Record<string, string> = { LOW: '#2ecc71', MEDIUM: '#ffad3a', HIGH: '#E50914' };
const riskBg: Record<string, string> = { LOW: '#0a2a0a', MEDIUM: '#1a1500', HIGH: '#1a0a0a' };

const styles: Record<string, React.CSSProperties> = {
    page: { backgroundColor: '#000', minHeight: '100vh', fontFamily: 'Helvetica,Arial,sans-serif', color: '#fff', padding: '24px' },
    header: { marginBottom: 24 },
    title: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
    subtitle: { fontSize: 13, color: '#666' },
    filterRow: { display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' as const },
    filterBtn: { background: 'transparent', border: '1px solid #2a2a2a', color: '#bdbdbd', padding: '7px 16px', borderRadius: 20, fontSize: 12, cursor: 'pointer', transition: 'all .2s' },
    filterBtnActive: { background: '#E50914', border: '1px solid #E50914', color: '#fff', padding: '7px 16px', borderRadius: 20, fontSize: 12, cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 },
    card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '20px', transition: 'border-color .25s, transform .2s', cursor: 'default' },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    cardName: { fontSize: 15, fontWeight: 700, marginBottom: 4 },
    strategyBadge: { fontSize: 10, background: '#1a1a1a', color: '#bdbdbd', border: '1px solid #2a2a2a', borderRadius: 10, padding: '3px 8px' },
    riskBadge: { fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '3px 10px' },
    desc: { fontSize: 12.5, color: '#7c7c7c', lineHeight: 1.6, marginBottom: 14 },
    tags: { display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 16 },
    tag: { fontSize: 10, background: '#0d0d0d', color: '#555', border: '1px solid #1e1e1e', borderRadius: 8, padding: '2px 8px' },
    loadBtn: { width: '100%', background: 'linear-gradient(90deg, #E50914, #831010)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'opacity .2s' },
    warningBox: { background: '#0d0a0a', border: '1px solid #2a1010', borderLeft: '4px solid #E50914', borderRadius: 6, padding: '12px 16px', marginBottom: 24, fontSize: 12, color: '#7c7c7c', lineHeight: 1.6 },
    warningLabel: { fontSize: 11, fontWeight: 700, color: '#E50914', letterSpacing: 1, marginBottom: 6 },
    loadedMsg: { background: '#0a1a0a', border: '1px solid #1a4a1a', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#2ecc71', marginTop: 8 },
};

const FreeBots: React.FC = () => {
    const [filter, setFilter] = React.useState('ALL');
    const [loaded, setLoaded] = React.useState<string | null>(null);

    const filters = ['ALL', 'LOW', 'MEDIUM', 'HIGH'];
    const filtered = filter === 'ALL' ? BOTS : BOTS.filter(b => b.risk === filter);

    const handleLoad = (id: string) => {
        setLoaded(id);
        setTimeout(() => setLoaded(null), 3000);
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div style={styles.title}>Free Bots Library</div>
                <div style={styles.subtitle}>{BOTS.length} pre-built strategies · Load and run instantly in Bot Builder</div>
            </div>
            <div style={styles.warningBox}>
                <div style={styles.warningLabel}>IMPORTANT</div>
                These strategies are provided for educational purposes. Past performance does not guarantee future results. Always test on a demo account before using real funds. Trading derivatives carries significant risk of loss.
            </div>
            <div style={styles.filterRow}>
                {filters.map(f => (
                    <button key={f} style={filter === f ? styles.filterBtnActive : styles.filterBtn} onClick={() => setFilter(f)}>
                        {f === 'ALL' ? 'All strategies' : `${f} risk`}
                    </button>
                ))}
            </div>
            <div style={styles.grid}>
                {filtered.map(bot => (
                    <div key={bot.id} style={styles.card}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#E50914'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e1e'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}>
                        <div style={styles.cardTop}>
                            <div>
                                <div style={styles.cardName}>{bot.name}</div>
                                <span style={styles.strategyBadge}>{bot.strategy}</span>
                            </div>
                            <span style={{ ...styles.riskBadge, color: riskColors[bot.risk], background: riskBg[bot.risk], border: `1px solid ${riskColors[bot.risk]}33` }}>{bot.risk} RISK</span>
                        </div>
                        <div style={styles.desc}>{bot.desc}</div>
                        <div style={styles.tags}>
                            {bot.tags.map(t => <span key={t} style={styles.tag}>{t}</span>)}
                        </div>
                        <button style={styles.loadBtn} onClick={() => handleLoad(bot.id)}
                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'}
                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}>
                            Load Strategy →
                        </button>
                        {loaded === bot.id && <div style={styles.loadedMsg}>✓ Strategy loaded — open Bot Builder to run it</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FreeBots;
