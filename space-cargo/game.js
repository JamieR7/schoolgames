const { useState, useEffect, useRef } = React;

const DOOR_MAX = 10;

const SPACE_BADGES = [
    { emoji: '🚀', name: 'Rocket' },
    { emoji: '🛸', name: 'UFO' },
    { emoji: '🌍', name: 'Planet Earth' },
    { emoji: '🪐', name: 'Saturn' },
    { emoji: '☄️', name: 'Comet' },
    { emoji: '⭐', name: 'Star' },
    { emoji: '🌙', name: 'Moon' },
    { emoji: '👨‍🚀', name: 'Astronaut' },
    { emoji: '🛰️', name: 'Satellite' },
    { emoji: '🌠', name: 'Shooting Star' },
    { emoji: '🔭', name: 'Telescope' },
    { emoji: '🌌', name: 'Galaxy' },
];

const RARE_STICKERS = [
    { emoji: '💎', name: 'Diamond' }, { emoji: '👑', name: 'Crown' },
    { emoji: '🐉', name: 'Dragon' }, { emoji: '🌈', name: 'Rainbow' }, { emoji: '🔮', name: 'Crystal Ball' },
    { emoji: '🍀', name: 'Lucky Clover' }, { emoji: '🦅', name: 'Eagle' }, { emoji: '🎆', name: 'Fireworks' },
    { emoji: '⚡', name: 'Lightning Bolt' }, { emoji: '🌙', name: 'Golden Moon' },
    { emoji: '🐋', name: 'Blue Whale' }, { emoji: '🌋', name: 'Volcano' },
];

const ENCOURAGEMENT = [
    "Cargo manifest confirmed! Docking in progress! 🚀",
    "Excellent navigation, Commander Archie! 🌟",
    "All crates accounted for! Mission success! 🛸",
    "Perfect cargo report! Spaceship loaded! 🪐",
    "Copy that, Control! Crates locked in! ☄️",
];

function generatePallet(round) {
    // Width is ALWAYS > 10 (so 11–20)
    const width = Math.floor(Math.random() * 10) + 11; // 11–20
    // Depth 1–min(round+2, 9)
    const depth = Math.floor(Math.random() * Math.min(round + 2, 9)) + 1;
    return { width, depth };
}

// ─── Multiplication check form ───────────────────────────────────────────────
function MultiplicationForm({ leftCols, rightCols, depth, onCorrect }) {
    const leftAns = leftCols * depth;
    const rightAns = rightCols * depth;

    const [leftInput, setLeftInput] = useState('');
    const [rightInput, setRightInput] = useState('');
    const [status, setStatus] = useState(null); // null | 'wrong' | 'correct'

    const check = () => {
        const ok = parseInt(leftInput) === leftAns && parseInt(rightInput) === rightAns;
        if (ok) {
            setStatus('correct');
            setTimeout(() => onCorrect(leftAns, rightAns), 700);
        } else {
            setStatus('wrong');
            setTimeout(() => setStatus(null), 1400);
        }
    };

    const colClass = (actual, val) => {
        if (status === null) return 'form-col-input';
        if (status === 'correct') return 'form-col-input correct';
        return parseInt(val) === actual ? 'form-col-input correct' : 'form-col-input wrong';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Step 1 — Count each side
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                {/* LEFT */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase' }}>🔵 Left</div>
                    <div style={{ fontWeight: 900, fontSize: '1.3rem', textAlign: 'center', color: '#93c5fd' }}>
                        {leftCols} × {depth}
                    </div>
                    <div style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.4)' }}>=</div>
                    <input
                        className={colClass(leftAns, leftInput)}
                        type="number"
                        inputMode="numeric"
                        value={leftInput}
                        onChange={e => setLeftInput(e.target.value.replace(/\D/, ''))}
                        placeholder="?"
                        autoFocus
                    />
                </div>

                {/* RIGHT */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#fb923c', textTransform: 'uppercase' }}>🟠 Right</div>
                    <div style={{ fontWeight: 900, fontSize: '1.3rem', textAlign: 'center', color: '#fdba74' }}>
                        {rightCols} × {depth}
                    </div>
                    <div style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.4)' }}>=</div>
                    <input
                        className={colClass(rightAns, rightInput)}
                        type="number"
                        inputMode="numeric"
                        value={rightInput}
                        onChange={e => setRightInput(e.target.value.replace(/\D/, ''))}
                        placeholder="?"
                    />
                </div>
            </div>

            {status === 'wrong' && (
                <div style={{ color: '#f87171', fontWeight: 800, fontSize: '0.9rem' }}>Not quite — check your multiplications! 🤔</div>
            )}

            <button className="space-btn btn-primary" onClick={check} style={{ marginTop: '0.5rem' }}>
                Check ✅
            </button>
        </div>
    );
}

// ─── Column addition form (Dino-game style) ──────────────────────────────────
function AdditionForm({ leftTotal, rightTotal, onCorrect }) {
    const grand = leftTotal + rightTotal;
    // Pad numbers for column alignment (up to 3 digits since max ~90+90=180)
    const a = String(leftTotal).padStart(3, ' ');
    const b = String(rightTotal).padStart(3, ' ');

    const aH = a[0].trim(), aT = a[1].trim(), aU = a[2].trim();
    const bH = b[0].trim(), bT = b[1].trim(), bU = b[2].trim();

    const [carries, setCarries] = useState({ h: false, t: false });
    const [ans, setAns] = useState({ h: '', t: '', u: '' });
    const [status, setStatus] = useState(null); // null | 'wrong' | 'correct'

    const toggleCarry = (k) => setCarries(p => ({ ...p, [k]: !p[k] }));
    const setD = (k, v) => setAns(p => ({ ...p, [k]: v.replace(/\D/, '').slice(-1) }));

    const check = () => {
        const userVal = parseInt(`${ans.h || 0}${ans.t || 0}${ans.u || 0}`);
        if (userVal === grand) {
            setStatus('correct');
            setTimeout(() => onCorrect(), 700);
        } else {
            setStatus('wrong');
            setTimeout(() => setStatus(null), 1400);
        }
    };

    // Cell sizing (slightly smaller than dino to fit the side panel)
    const C = { width: '4rem', height: '4.5rem', textAlign: 'center' };
    const gap = '0.6rem';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Step 2 — Add the two totals
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>

                {/* Carry boxes row */}
                <div style={{ display: 'flex', gap, paddingRight: '0' }}>
                    {/* Hundreds carry */}
                    <div
                        onClick={() => toggleCarry('h')}
                        style={{
                            ...C,
                            border: `3px dashed ${carries.h ? '#facc15' : 'rgba(250,204,21,0.45)'}`,
                            borderRadius: '0.7rem',
                            background: carries.h ? 'rgba(250,204,21,0.15)' : 'transparent',
                            color: '#facc15', fontWeight: 900, fontSize: '1.6rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        {carries.h ? '1' : '\u00A0'}
                    </div>
                    {/* Tens carry */}
                    <div
                        onClick={() => toggleCarry('t')}
                        style={{
                            ...C,
                            border: `3px dashed ${carries.t ? '#facc15' : 'rgba(250,204,21,0.45)'}`,
                            borderRadius: '0.7rem',
                            background: carries.t ? 'rgba(250,204,21,0.15)' : 'transparent',
                            color: '#facc15', fontWeight: 900, fontSize: '1.6rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        {carries.t ? '1' : '\u00A0'}
                    </div>
                    {/* Placeholder for ones column (hidden) */}
                    <div style={{ ...C, visibility: 'hidden' }} />
                </div>

                {/* Top number */}
                <div style={{ display: 'flex', gap }}>
                    {[aH, aT, aU].map((d, i) => (
                        <div key={i} style={{ ...C, fontSize: '2.5rem', fontWeight: 900, color: '#93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {d || '\u00A0'}
                        </div>
                    ))}
                </div>

                {/* Bottom number with + sign */}
                <div style={{ display: 'flex', gap, position: 'relative' }}>
                    <span style={{
                        position: 'absolute', left: `calc(-3.5rem)`,
                        ...C, fontSize: '2rem', fontWeight: 900,
                        color: 'rgba(255,255,255,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>+</span>
                    {[bH, bT, bU].map((d, i) => (
                        <div key={i} style={{ ...C, fontSize: '2.5rem', fontWeight: 900, color: '#fdba74', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {d || '\u00A0'}
                        </div>
                    ))}
                </div>

                {/* Divider line */}
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.6)', width: '100%', borderRadius: '3px', margin: '0.2rem 0' }} />

                {/* Answer inputs */}
                <div style={{ display: 'flex', gap }}>
                    {(['h', 't', 'u']).map((k) => (
                        <input
                            key={k}
                            type="number"
                            inputMode="numeric"
                            value={ans[k]}
                            onChange={e => setD(k, e.target.value)}
                            placeholder="?"
                            style={{
                                ...C,
                                fontSize: '2.5rem', fontWeight: 900,
                                border: `4px solid ${status === 'correct' ? '#22c55e' : status === 'wrong' ? '#ef4444' : 'rgba(250,204,21,0.6)'}`,
                                borderRadius: '1rem',
                                background: status === 'correct' ? 'rgba(34,197,94,0.1)' : status === 'wrong' ? 'rgba(239,68,68,0.1)' : 'rgba(255,251,235,0.08)',
                                color: 'white', outline: 'none', padding: 0,
                                animation: status === 'wrong' ? 'shake 0.3s' : 'none',
                            }}
                        />
                    ))}
                </div>
            </div>

            {status === 'wrong' && (
                <div style={{ color: '#f87171', fontWeight: 800, fontSize: '0.9rem', marginTop: '0.3rem' }}>Check your columns! 🤔</div>
            )}

            <button className="space-btn btn-primary" onClick={check} style={{ marginTop: '0.5rem' }}>
                File Report ✅
            </button>
        </div>
    );
}

// ─── Main App ────────────────────────────────────────────────────────────────
function App() {
    const [round, setRound] = useState(1);
    const [pallet, setPallet] = useState(null);
    // cutAfter = the gap clicked: cut is BETWEEN column cutAfter and cutAfter+1 (1-indexed)
    // So left has columns 1..cutAfter, right has cutAfter+1..width
    const [cutAfter, setCutAfter] = useState(null);
    const [hoverGap, setHoverGap] = useState(null);   // gap index (1-indexed): gap between col i and col i+1
    const [phase, setPhase] = useState('cut');         // 'cut' | 'multiply' | 'add' | 'success'
    const [leftTotal, setLeftTotal] = useState(0);
    const [rightTotal, setRightTotal] = useState(0);
    const [msg, setMsg] = useState('');
    const [flashEmoji, setFlashEmoji] = useState(null);
    const [badges, setBadges] = useState(() => JSON.parse(sessionStorage.getItem('stickers_space-cargo') || '[]'));
    const [rareOwned, setRareOwned] = useState(() => JSON.parse(sessionStorage.getItem('stickers_rare') || '[]'));
    const [showRare, setShowRare] = useState(false);
    const [rareInfo, setRareInfo] = useState(null);

    useEffect(() => { startRound(1); }, []);
    useEffect(() => { sessionStorage.setItem('stickers_space-cargo', JSON.stringify(badges)); }, [badges]);
    useEffect(() => { sessionStorage.setItem('stickers_rare', JSON.stringify(rareOwned)); }, [rareOwned]);

    const startRound = (r) => {
        const p = generatePallet(r);
        setPallet(p);
        setCutAfter(null);
        setHoverGap(null);
        setPhase('cut');
        setMsg('');
    };

    // The laser cuts AFTER column `gap` (so left = gap cols, right = width - gap cols)
    const handleGapClick = (gap) => {
        if (phase !== 'cut') return;
        if (gap > DOOR_MAX) {
            setMsg(`⚠️ The left piece would be ${gap} wide — too big for the door (max ${DOOR_MAX})! Cut closer.`);
            return;
        }
        setCutAfter(gap);
        setMsg('');
        setTimeout(() => setPhase('multiply'), 500);
    };

    const handleMultiplyCorrect = (left, right) => {
        setLeftTotal(left);
        setRightTotal(right);
        setPhase('add');
    };

    const handleAddCorrect = () => {
        const enc = ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)];
        setMsg(enc);
        const badge = SPACE_BADGES[Math.floor(Math.random() * SPACE_BADGES.length)];
        showStickerFlash(badge.emoji);
        setBadges(prev => [...prev, badge.emoji]);

        if (Math.random() < 0.2) {
            const available = RARE_STICKERS.filter(s => !rareOwned.includes(s.emoji));
            if (available.length > 0) {
                const r = available[Math.floor(Math.random() * available.length)];
                setRareInfo(r);
                setRareOwned(prev => [...prev, r.emoji]);
                setTimeout(() => { setShowRare(true); playFanfare(); }, 900);
            }
        }
        setTimeout(() => setPhase('success'), 1100);
    };

    const showStickerFlash = (emoji) => {
        setFlashEmoji(emoji);
        setTimeout(() => setFlashEmoji(null), 1500);
    };

    const playFanfare = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = ctx.createOscillator(); const gain = ctx.createGain();
                osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now + i * 0.1);
                gain.gain.setValueAtTime(0.2, now + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
                osc.connect(gain); gain.connect(ctx.destination);
                osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.3);
            });
        } catch (e) { }
    };

    const nextRound = () => { const n = round + 1; setRound(n); startRound(n); };

    if (!pallet) return <div style={{ color: 'white', padding: '2rem' }}>Loading...</div>;

    const CELL = 34; // px per cell
    const GAP = 3;   // px gap between cells

    // Gap hover: between col `hoverGap` and col `hoverGap+1`  (hoverGap is 1-indexed)
    // Gap x position = hoverGap * (CELL + GAP) - GAP/2
    const gapX = (g) => g * (CELL + GAP) - 1;

    return (
        <div style={{ minHeight: '100vh', padding: '5rem 1rem 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '960px', marginBottom: '1.5rem' }}>
                <div className="space-card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Space Cargo 🚀
                        </h1>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                            Spaceship door: max <strong style={{ color: '#facc15' }}>{DOOR_MAX}</strong> wide
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="space-card" style={{ padding: '0.4rem 1rem', fontSize: '1.1rem', fontWeight: 800 }}>Mission {round}</div>
                        <div style={{ display: 'flex', gap: '0.3rem', fontSize: '1.4rem' }}>
                            {[...badges.slice(-5), ...rareOwned.slice(-2)].map((s, i) => <span key={i}>{s}</span>)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pallet info */}
            <div style={{ width: '100%', maxWidth: '960px', marginBottom: '0.8rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="space-card" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 800 }}>
                    📦 Pallet: <span style={{ color: '#60a5fa' }}>{pallet.width}</span> wide × <span style={{ color: '#60a5fa' }}>{pallet.depth}</span> deep
                </div>
                {cutAfter && (
                    <>
                        <div className="space-card" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 800, borderColor: 'rgba(96,165,250,0.4)' }}>
                            🔵 Left: {cutAfter} cols
                        </div>
                        <div className="space-card" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 800, borderColor: 'rgba(249,115,22,0.4)' }}>
                            🟠 Right: {pallet.width - cutAfter} cols
                        </div>
                    </>
                )}
            </div>

            {/* Instruction */}
            <div style={{ width: '100%', maxWidth: '960px', marginBottom: '1rem' }}>
                {phase === 'cut' && (
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>⚡</span> Click <em>between</em> columns to laser-cut the pallet. The left piece must be ≤&nbsp;{DOOR_MAX} wide.
                    </div>
                )}
                {phase === 'multiply' && (
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>✖️</span> Laser cut complete! Now calculate how many crates are on each side.
                    </div>
                )}
                {phase === 'add' && (
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>➕</span> Great! Now add the two totals to fill in the manifest.
                    </div>
                )}
                {msg && (
                    <div style={{ marginTop: '0.5rem', fontWeight: 800, fontSize: '1rem', color: msg.startsWith('⚠️') ? '#f87171' : '#86efac' }}>
                        {msg}
                    </div>
                )}
            </div>

            {/* Main layout */}
            <div style={{ width: '100%', maxWidth: '960px', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* Grid */}
                <div className="space-card" style={{ padding: '1.5rem', flex: '1 1 auto', overflowX: 'auto' }}>
                    <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Cargo Pallet
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#facc15' }}>🚪 Max {DOOR_MAX}</span>
                    </div>

                    {/* Column numbers */}
                    <div style={{ display: 'flex', gap: `${GAP}px`, marginBottom: '4px' }}>
                        {Array.from({ length: pallet.width }, (_, c) => (
                            <div key={c} style={{
                                width: `${CELL}px`, textAlign: 'center',
                                fontSize: '0.65rem', fontWeight: 800,
                                color: c + 1 <= DOOR_MAX ? '#facc15' : 'rgba(255,255,255,0.25)',
                            }}>{c + 1}</div>
                        ))}
                    </div>

                    {/* Crate rows + gap click zones */}
                    <div
                        style={{ position: 'relative', cursor: phase === 'cut' ? 'crosshair' : 'default' }}
                        onMouseLeave={() => setHoverGap(null)}
                    >
                        {/* Invisible gap zones — between column g and g+1 */}
                        {phase === 'cut' && Array.from({ length: pallet.width - 1 }, (_, i) => {
                            const g = i + 1; // this is the gap after column g
                            const x = gapX(g);
                            const tooWide = g > DOOR_MAX;
                            return (
                                <div
                                    key={g}
                                    style={{
                                        position: 'absolute', top: 0, bottom: 0,
                                        left: `${x - 8}px`, width: '18px',
                                        zIndex: 20, cursor: tooWide ? 'not-allowed' : 'crosshair',
                                    }}
                                    onMouseEnter={() => setHoverGap(g)}
                                    onClick={() => handleGapClick(g)}
                                />
                            );
                        })}

                        {/* Hover / cut line */}
                        {(hoverGap || cutAfter) && (
                            <div style={{
                                position: 'absolute',
                                top: 0, bottom: 0,
                                left: `${gapX(cutAfter || hoverGap)}px`,
                                width: cutAfter ? '4px' : '2px',
                                background: cutAfter
                                    ? 'linear-gradient(to bottom, #ff4444, #ff8800, #ff4444)'
                                    : hoverGap > DOOR_MAX ? 'rgba(248,113,113,0.7)' : 'rgba(250,204,21,0.7)',
                                boxShadow: cutAfter ? '0 0 12px 4px rgba(255,100,0,0.8)' : 'none',
                                animation: cutAfter ? 'laserPulse 0.4s ease-out' : 'none',
                                pointerEvents: 'none',
                                borderRadius: '2px',
                                zIndex: 10,
                            }} />
                        )}

                        {/* Rows of crates */}
                        {Array.from({ length: pallet.depth }, (_, row) => (
                            <div key={row} style={{ display: 'flex', gap: `${GAP}px`, marginBottom: `${GAP}px` }}>
                                {Array.from({ length: pallet.width }, (_, col) => {
                                    const col1 = col + 1;
                                    const isLeft = cutAfter ? col1 <= cutAfter : col1 <= DOOR_MAX;
                                    const isHover = hoverGap && col1 <= hoverGap;
                                    return (
                                        <div
                                            key={col}
                                            className={`crate crate-${isLeft ? 'left' : 'right'}`}
                                        >
                                            📦
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Side panel */}
                {(phase === 'multiply' || phase === 'add') && (
                    <div className="space-card" style={{ padding: '1.5rem', minWidth: '260px' }}>
                        {phase === 'multiply' && (
                            <MultiplicationForm
                                leftCols={cutAfter}
                                rightCols={pallet.width - cutAfter}
                                depth={pallet.depth}
                                onCorrect={handleMultiplyCorrect}
                            />
                        )}
                        {phase === 'add' && (
                            <AdditionForm
                                leftTotal={leftTotal}
                                rightTotal={rightTotal}
                                onCorrect={handleAddCorrect}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Success */}
            {phase === 'success' && (
                <div className="success-screen">
                    <div style={{ fontSize: '8rem', marginBottom: '1rem' }}>🚀</div>
                    <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', textAlign: 'center' }}>Mission Complete!</h2>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem', textAlign: 'center', maxWidth: '400px' }}>{msg}</p>
                    <div style={{ fontSize: '4rem', marginBottom: '2.5rem' }}>
                        {badges.slice(-3).map((b, i) => <span key={i} style={{ margin: '0 0.3rem' }}>{b}</span>)}
                    </div>
                    <button className="space-btn btn-success" onClick={nextRound}>Next Mission 🌌</button>
                </div>
            )}

            {/* Rare sticker */}
            {showRare && rareInfo && (
                <div className="rare-banner show">
                    <div className="rare-inner">
                        <div style={{ fontSize: '7rem', display: 'block', marginBottom: '1rem' }}>{rareInfo.emoji}</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>RARE STICKER!</h2>
                        <p style={{ fontSize: '1.4rem', fontWeight: 800, opacity: 0.9, marginBottom: '2rem' }}>{rareInfo.name}</p>
                        <button
                            className="space-btn"
                            style={{ background: '#92400e', color: 'white', padding: '0.9rem 2.5rem', boxShadow: '0 6px 0 #451a03' }}
                            onClick={() => setShowRare(false)}
                        >Amazing! 🎉</button>
                    </div>
                </div>
            )}

            {/* Sticker flash */}
            {flashEmoji && (
                <div id="sticker-flash-overlay" className="animate-sticker-pop">{flashEmoji}</div>
            )}
        </div>
    );
}
