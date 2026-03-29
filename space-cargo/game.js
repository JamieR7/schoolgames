const { useState, useEffect, useRef } = React;

const DOOR_MAX = 10;
const CELL = 32; // px per cell
const GAP = 3;

const SPACE_BADGES = [
    { emoji: '🚀' }, { emoji: '🛸' }, { emoji: '🌍' }, { emoji: '🪐' },
    { emoji: '☄️' }, { emoji: '⭐' }, { emoji: '🌙' }, { emoji: '👨‍🚀' },
    { emoji: '🛰️' }, { emoji: '🌠' }, { emoji: '🔭' }, { emoji: '🌌' },
];
const RARE_STICKERS = [
    { emoji: '💎', name: 'Diamond' }, { emoji: '👑', name: 'Crown' },
    { emoji: '🐉', name: 'Dragon' }, { emoji: '🌈', name: 'Rainbow' },
    { emoji: '🔮', name: 'Crystal Ball' }, { emoji: '🍀', name: 'Lucky Clover' },
    { emoji: '🦅', name: 'Eagle' }, { emoji: '🎆', name: 'Fireworks' },
    { emoji: '⚡', name: 'Lightning Bolt' }, { emoji: '🐋', name: 'Blue Whale' },
    { emoji: '🌋', name: 'Volcano' },
];
const ENCOURAGEMENT = [
    "Cargo manifest confirmed! Docking in progress! 🚀",
    "Excellent navigation, Commander Archie! 🌟",
    "All crates accounted for! Mission success! 🛸",
    "Perfect cargo report! Spaceship loaded! 🪐",
    "Copy that, Control! Crates locked in! ☄️",
];

function generatePallet(round) {
    const width = Math.floor(Math.random() * 10) + 11; // 11–20, always > 10
    const depth = Math.floor(Math.random() * Math.min(round + 2, 9)) + 1;
    return { width, depth };
}

// ─── SVG Spaceship ───────────────────────────────────────────────────────────
function Spaceship({ doorCols, cutCols }) {
    // doorCols: always DOOR_MAX (10)
    // cutCols: how many columns were cut to the left (or null)
    const W = 600, H = 260;
    const bodyX = 30, bodyW = 520, bodyY = 70, bodyH = 120;
    const cx = bodyX + bodyW / 2;

    // Door dimensions: proportional to the spaceship body
    const doorW = 130; // px — represents 10 units
    const doorH = 80;
    const doorX = cx - doorW / 2;
    const doorY = bodyY + (bodyH - doorH) / 2;

    // Cut indicator inside the door
    const cutFraction = cutCols ? cutCols / DOOR_MAX : null;
    const cutPx = cutFraction ? Math.min(cutFraction, 1) * doorW : null;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: '200px', overflow: 'visible' }}>
            <defs>
                <filter id="s-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="s-glow-lg" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="10" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="40%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="wingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="doorBg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#001a2e" />
                    <stop offset="100%" stopColor="#000d1a" />
                </linearGradient>
                <radialGradient id="thruster1" cx="50%" cy="30%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                    <stop offset="60%" stopColor="#f97316" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="cockpitGrad" cx="35%" cy="35%">
                    <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
                </radialGradient>
            </defs>

            {/* Engine exhaust glow */}
            <ellipse cx={bodyX + 15} cy={bodyY + bodyH / 2} rx="28" ry="18"
                fill="url(#thruster1)" filter="url(#s-glow-lg)" opacity="0.8" />

            {/* Lower wings */}
            <polygon points={`${bodyX + 80},${bodyY + bodyH}  ${bodyX + 20},${H - 20}  ${bodyX + 160},${bodyY + bodyH}`}
                fill="url(#wingGrad)" stroke="#334155" strokeWidth="1.5" />
            <polygon points={`${bodyX + bodyW - 80},${bodyY + bodyH}  ${bodyX + bodyW - 20},${H - 20}  ${bodyX + bodyW - 160},${bodyY + bodyH}`}
                fill="url(#wingGrad)" stroke="#334155" strokeWidth="1.5" />

            {/* Top fin */}
            <polygon points={`${cx - 25},${bodyY}  ${cx},${bodyY - 50}  ${cx + 25},${bodyY}`}
                fill="url(#wingGrad)" stroke="#334155" strokeWidth="1.5" />

            {/* Main fuselage */}
            <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx="58"
                fill="url(#bodyGrad)" stroke="#475569" strokeWidth="2" />

            {/* Fuselage highlight strip */}
            <rect x={bodyX + 60} y={bodyY + 8} width={bodyW - 140} height="7" rx="3.5"
                fill="#94a3b8" opacity="0.25" />

            {/* Panel rivets */}
            {[100, 160, 380, 440].map((x, i) => (
                <circle key={i} cx={x} cy={bodyY + 20} r="3" fill="#64748b" opacity="0.6" />
            ))}

            {/* Cockpit */}
            <ellipse cx={bodyX + bodyW - 70} cy={bodyY + bodyH / 2} rx="52" ry="38"
                fill="url(#cockpitGrad)" stroke="#38bdf8" strokeWidth="1.5" />
            <ellipse cx={bodyX + bodyW - 55} cy={bodyY + bodyH / 2 - 10} rx="20" ry="14"
                fill="white" opacity="0.12" />

            {/* Control panel lights */}
            {[{ x: 380, c: '#22c55e' }, { x: 395, c: '#f59e0b' }, { x: 410, c: '#ef4444' }].map((d, i) => (
                <circle key={i} cx={d.x} cy={bodyY + bodyH - 22} r="5"
                    fill={d.c} filter="url(#s-glow)" opacity="0.9" />
            ))}

            {/* CARGO DOOR FRAME */}
            <rect x={doorX - 4} y={doorY - 4} width={doorW + 8} height={doorH + 8} rx="6"
                fill="#0f172a" stroke="#334155" strokeWidth="1" />
            {/* Door opening (black) */}
            <rect x={doorX} y={doorY} width={doorW} height={doorH} rx="4"
                fill="url(#doorBg)" />
            {/* Door glow border */}
            <rect x={doorX} y={doorY} width={doorW} height={doorH} rx="4"
                fill="none" stroke="#22d3ee" strokeWidth="2.5" filter="url(#s-glow)" />
            {/* Inner ambient light */}
            <rect x={doorX + 3} y={doorY + 3} width={doorW - 6} height={doorH - 6} rx="3"
                fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.4" />

            {/* Door interior crate silhouettes */}
            {[0, 1, 2].map(i => (
                <rect key={i} x={doorX + 10 + i * 35} y={doorY + doorH - 30}
                    width="28" height="22" rx="3" fill="#1e4a5a" stroke="#22d3ee"
                    strokeWidth="0.8" opacity="0.55" />
            ))}

            {/* Cut preview inside door — if a cut has been made */}
            {cutPx && (
                <>
                    <rect x={doorX} y={doorY} width={cutPx} height={doorH} rx="4"
                        fill="rgba(59,130,246,0.18)" />
                    <line x1={doorX + cutPx} y1={doorY} x2={doorX + cutPx} y2={doorY + doorH}
                        stroke="#f97316" strokeWidth="2.5" strokeDasharray="4 3"
                        filter="url(#s-glow)" />
                </>
            )}

            {/* Door dimension callout */}
            {/* Horizontal bracket above door */}
            <line x1={doorX} y1={doorY - 14} x2={doorX + doorW} y2={doorY - 14}
                stroke="#22d3ee" strokeWidth="1.5" markerStart="url(#arr)" markerEnd="url(#arr)" />
            <line x1={doorX} y1={doorY - 20} x2={doorX} y2={doorY - 8}
                stroke="#22d3ee" strokeWidth="1.5" />
            <line x1={doorX + doorW} y1={doorY - 20} x2={doorX + doorW} y2={doorY - 8}
                stroke="#22d3ee" strokeWidth="1.5" />
            <text x={doorX + doorW / 2} y={doorY - 20} textAnchor="middle"
                fill="#22d3ee" fontFamily="monospace" fontWeight="900" fontSize="13"
                filter="url(#s-glow)">
                MAX {DOOR_MAX} WIDE
            </text>

            {/* Door "CARGO DOOR" label */}
            <text x={doorX + doorW / 2} y={doorY + doorH + 18} textAnchor="middle"
                fill="#67e8f9" fontFamily="monospace" fontWeight="700" fontSize="10"
                opacity="0.8">
                CARGO DOOR
            </text>
        </svg>
    );
}

// ─── Door comparison meter ────────────────────────────────────────────────────
function DoorMeter({ palletWidth, cutAfter }) {
    // Visual bar showing 20 units, door limit at 10
    return (
        <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto 0.5rem' }}>
            <div style={{ position: 'relative', height: '28px', borderRadius: '9999px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', overflow: 'visible' }}>
                {/* Door limit marker */}
                <div style={{
                    position: 'absolute', top: '-8px', bottom: '-8px',
                    left: `${(DOOR_MAX / palletWidth) * 100}%`,
                    width: '2px', background: '#22d3ee',
                    boxShadow: '0 0 8px #22d3ee',
                    zIndex: 3,
                }} />
                {/* Door region */}
                <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${(DOOR_MAX / palletWidth) * 100}%`,
                    background: 'rgba(34,211,238,0.12)',
                    borderRadius: '9999px 0 0 9999px',
                }} />
                {/* Cut fill */}
                {cutAfter && (
                    <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0,
                        width: `${(cutAfter / palletWidth) * 100}%`,
                        background: cutAfter <= DOOR_MAX
                            ? 'linear-gradient(90deg, rgba(59,130,246,0.5), rgba(59,130,246,0.3))'
                            : 'rgba(239,68,68,0.4)',
                        borderRadius: '9999px 0 0 9999px',
                        transition: 'width 0.4s ease',
                    }} />
                )}
                {/* Labels */}
                <div style={{ position: 'absolute', left: '6px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.65rem', fontWeight: 800, color: '#22d3ee', letterSpacing: '0.04em', zIndex: 2 }}>
                    DOOR ≤ {DOOR_MAX}
                </div>
                <div style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', zIndex: 2 }}>
                    {palletWidth} wide
                </div>
            </div>
            {/* Tick marks */}
            <div style={{ display: 'flex', gap: 0, marginTop: '3px' }}>
                {Array.from({ length: palletWidth }, (_, i) => (
                    <div key={i} style={{
                        flex: 1, textAlign: 'center', fontSize: '0.5rem', fontWeight: 800,
                        color: i < DOOR_MAX ? 'rgba(34,211,238,0.6)' : 'rgba(255,255,255,0.2)',
                    }}>
                        {(i + 1) % 5 === 0 || i === 0 || i === DOOR_MAX - 1 ? i + 1 : '·'}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Multiplication check form ────────────────────────────────────────────────
function MultiplicationForm({ leftCols, rightCols, depth, onCorrect }) {
    const leftAns = leftCols * depth;
    const rightAns = rightCols * depth;
    const [leftInput, setLeftInput] = useState('');
    const [rightInput, setRightInput] = useState('');
    const [status, setStatus] = useState(null);

    const check = () => {
        if (parseInt(leftInput) === leftAns && parseInt(rightInput) === rightAns) {
            setStatus('correct');
            setTimeout(() => onCorrect(leftAns, rightAns), 700);
        } else {
            setStatus('wrong');
            setTimeout(() => setStatus(null), 1400);
        }
    };

    const boxStyle = (val, correct) => ({
        width: '80px', height: '70px', fontSize: '2.2rem', fontWeight: 900,
        textAlign: 'center', borderRadius: '1rem', outline: 'none', padding: 0,
        border: `4px solid ${status === 'correct' ? '#22c55e' : status === 'wrong' && parseInt(val) !== correct ? '#ef4444' : 'rgba(250,204,21,0.6)'}`,
        background: status === 'correct' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.06)',
        color: 'white',
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Step 1 — How many crates on each side?
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
                {/* LEFT */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#60a5fa', textTransform: 'uppercase' }}>🔵 Left</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#93c5fd' }}>{leftCols} × {depth} =</div>
                    <input type="number" inputMode="numeric" value={leftInput}
                        onChange={e => setLeftInput(e.target.value.replace(/\D/, ''))}
                        autoFocus style={boxStyle(leftInput, leftAns)} placeholder="?" />
                </div>
                {/* RIGHT */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#fb923c', textTransform: 'uppercase' }}>🟠 Right</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fdba74' }}>{rightCols} × {depth} =</div>
                    <input type="number" inputMode="numeric" value={rightInput}
                        onChange={e => setRightInput(e.target.value.replace(/\D/, ''))}
                        style={boxStyle(rightInput, rightAns)} placeholder="?" />
                </div>
            </div>
            {status === 'wrong' && (
                <div style={{ color: '#f87171', fontWeight: 800, fontSize: '0.85rem' }}>Check your multiplications! 🤔</div>
            )}
            <button className="space-btn btn-primary" onClick={check}>Check ✅</button>
        </div>
    );
}

// ─── Column addition form (Dino-game style) ───────────────────────────────────
function AdditionForm({ leftTotal, rightTotal, onCorrect }) {
    const grand = leftTotal + rightTotal;
    const a = String(leftTotal).padStart(3, ' ');
    const b = String(rightTotal).padStart(3, ' ');
    const [carries, setCarries] = useState({ h: false, t: false });
    const [ans, setAns] = useState({ h: '', t: '', u: '' });
    const [status, setStatus] = useState(null);

    const C = { width: '4rem', height: '4.5rem', textAlign: 'center' };
    const gap = '0.6rem';

    const check = () => {
        const userVal = parseInt(`${ans.h || 0}${ans.t || 0}${ans.u || 0}`);
        if (userVal === grand) { setStatus('correct'); setTimeout(() => onCorrect(), 700); }
        else { setStatus('wrong'); setTimeout(() => setStatus(null), 1400); }
    };

    const inputStyle = {
        ...C, fontSize: '2.5rem', fontWeight: 900, borderRadius: '1rem',
        border: `4px solid ${status === 'correct' ? '#22c55e' : status === 'wrong' ? '#ef4444' : 'rgba(250,204,21,0.6)'}`,
        background: status === 'correct' ? 'rgba(34,197,94,0.1)' : status === 'wrong' ? 'rgba(239,68,68,0.1)' : 'rgba(255,251,235,0.08)',
        color: 'white', outline: 'none', padding: 0,
        animation: status === 'wrong' ? 'shake 0.3s' : 'none',
    };

    const carryStyle = (active) => ({
        ...C, cursor: 'pointer',
        border: `3px dashed ${active ? '#facc15' : 'rgba(250,204,21,0.4)'}`,
        borderRadius: '0.7rem',
        background: active ? 'rgba(250,204,21,0.12)' : 'transparent',
        color: '#facc15', fontWeight: 900, fontSize: '1.6rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    });

    const digits = (s) => [s[0].trim(), s[1].trim(), s[2].trim()];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Step 2 — Add the totals
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                {/* Carry row */}
                <div style={{ display: 'flex', gap }}>
                    {['h', 't'].map(k => (
                        <div key={k} onClick={() => setCarries(p => ({ ...p, [k]: !p[k] }))} style={carryStyle(carries[k])}>
                            {carries[k] ? '1' : '\u00A0'}
                        </div>
                    ))}
                    <div style={{ ...C, visibility: 'hidden' }} />
                </div>
                {/* Top number */}
                <div style={{ display: 'flex', gap }}>
                    {digits(a).map((d, i) => (
                        <div key={i} style={{ ...C, fontSize: '2.5rem', fontWeight: 900, color: '#93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {d || '\u00A0'}
                        </div>
                    ))}
                </div>
                {/* Bottom number */}
                <div style={{ display: 'flex', gap, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '-3.5rem', ...C, fontSize: '2rem', fontWeight: 900, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</span>
                    {digits(b).map((d, i) => (
                        <div key={i} style={{ ...C, fontSize: '2.5rem', fontWeight: 900, color: '#fdba74', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {d || '\u00A0'}
                        </div>
                    ))}
                </div>
                {/* Divider */}
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.6)', width: '100%', borderRadius: '3px', margin: '0.2rem 0' }} />
                {/* Answer boxes */}
                <div style={{ display: 'flex', gap }}>
                    {['h', 't', 'u'].map(k => (
                        <input key={k} type="number" inputMode="numeric" value={ans[k]}
                            onChange={e => setAns(p => ({ ...p, [k]: e.target.value.replace(/\D/, '').slice(-1) }))}
                            placeholder="?" style={inputStyle} />
                    ))}
                </div>
            </div>
            {status === 'wrong' && (
                <div style={{ color: '#f87171', fontWeight: 800, fontSize: '0.85rem' }}>Check your columns! 🤔</div>
            )}
            <button className="space-btn btn-primary" onClick={check} style={{ marginTop: '0.4rem' }}>File Report ✅</button>
        </div>
    );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
    const [round, setRound] = useState(1);
    const [pallet, setPallet] = useState(null);
    const [cutAfter, setCutAfter] = useState(null);
    const [hoverGap, setHoverGap] = useState(null);
    const [phase, setPhase] = useState('cut');  // 'cut' | 'multiply' | 'add' | 'success'
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
        setPallet(generatePallet(r));
        setCutAfter(null); setHoverGap(null);
        setPhase('cut'); setMsg('');
    };

    const recut = () => {
        setCutAfter(null); setHoverGap(null);
        setPhase('cut'); setMsg('');
    };

    const handleGapClick = (gap) => {
        if (phase !== 'cut') return;
        if (gap > DOOR_MAX) {
            setMsg(`⚠️ Left piece would be ${gap} wide — door max is ${DOOR_MAX}! Cut closer.`);
            return;
        }
        setCutAfter(gap); setMsg('');
        setTimeout(() => setPhase('multiply'), 500);
    };

    const handleMultiplyCorrect = (l, r) => { setLeftTotal(l); setRightTotal(r); setPhase('add'); };

    const handleAddCorrect = () => {
        const enc = ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)];
        setMsg(enc);
        const badge = SPACE_BADGES[Math.floor(Math.random() * SPACE_BADGES.length)];
        triggerFlash(badge.emoji);
        setBadges(prev => [...prev, badge.emoji]);
        if (Math.random() < 0.2) {
            const avail = RARE_STICKERS.filter(s => !rareOwned.includes(s.emoji));
            if (avail.length > 0) {
                const r = avail[Math.floor(Math.random() * avail.length)];
                setRareInfo(r); setRareOwned(prev => [...prev, r.emoji]);
                setTimeout(() => { setShowRare(true); playFanfare(); }, 900);
            }
        }
        setTimeout(() => setPhase('success'), 1100);
    };

    const triggerFlash = (emoji) => { setFlashEmoji(emoji); setTimeout(() => setFlashEmoji(null), 1500); };

    const playFanfare = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = ctx.createOscillator(), gain = ctx.createGain();
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

    const gapX = (g) => g * (CELL + GAP) - 1;

    const phaseLabel = {
        cut: '⚡ Click between columns to laser-cut the pallet. Left piece must fit through the door.',
        multiply: '✖️  Laser cut done! Calculate the crates on each side.',
        add: '➕  Now add the two totals to complete the manifest.',
        success: '',
    }[phase];

    return (
        <div style={{ minHeight: '100vh', padding: '5rem 1rem 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '980px', marginBottom: '1rem' }}>
                <div className="space-card" style={{ padding: '0.8rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Space Cargo 🚀
                        </h1>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: '1px' }}>
                            Mission {round} · Pallet <strong style={{ color: '#60a5fa' }}>{pallet.width}</strong> × <strong style={{ color: '#60a5fa' }}>{pallet.depth}</strong>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '1.4rem' }}>
                        {[...badges.slice(-6), ...rareOwned.slice(-2)].map((s, i) => <span key={i}>{s}</span>)}
                    </div>
                </div>
            </div>

            {/* Spaceship scene */}
            <div style={{ width: '100%', maxWidth: '980px', marginBottom: '0.5rem' }}>
                <Spaceship doorCols={DOOR_MAX} cutCols={cutAfter} />
            </div>

            {/* Door meter */}
            <div style={{ width: '100%', maxWidth: '980px', marginBottom: '1rem', padding: '0 0.5rem' }}>
                <DoorMeter palletWidth={pallet.width} cutAfter={cutAfter} />
            </div>

            {/* Phase instruction + re-cut button */}
            <div style={{ width: '100%', maxWidth: '980px', marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'rgba(255,255,255,0.82)', flex: 1 }}>{phaseLabel}</div>
                {(phase === 'multiply' || phase === 'add') && (
                    <button
                        className="space-btn"
                        style={{ background: 'rgba(239,68,68,0.15)', border: '1.5px solid rgba(239,68,68,0.5)', color: '#f87171', padding: '0.5rem 1.2rem', fontSize: '0.85rem', borderRadius: '9999px', cursor: 'pointer' }}
                        onClick={recut}
                    >
                        ↩ Re-cut
                    </button>
                )}
                {msg && <div style={{ width: '100%', fontWeight: 800, fontSize: '0.95rem', color: msg.startsWith('⚠️') ? '#f87171' : '#86efac' }}>{msg}</div>}
            </div>

            {/* Main area: pallet + side panel */}
            <div style={{ width: '100%', maxWidth: '980px', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* 3D perspective grid */}
                <div className="space-card" style={{ padding: '1.5rem 1.2rem 1.2rem', flex: '1 1 auto', overflowX: 'auto' }}>
                    <div style={{ marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cargo Pallet</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#22d3ee' }}>🚪 Door ≤ {DOOR_MAX} cols</span>
                    </div>

                    {/* Column numbers */}
                    <div style={{ display: 'flex', gap: `${GAP}px`, marginBottom: '4px' }}>
                        {Array.from({ length: pallet.width }, (_, c) => (
                            <div key={c} style={{
                                width: `${CELL}px`, textAlign: 'center', fontSize: '0.6rem', fontWeight: 900,
                                color: c + 1 <= DOOR_MAX ? '#facc15' : 'rgba(255,255,255,0.2)',
                            }}>{c + 1}</div>
                        ))}
                    </div>

                    {/* Perspective wrapper */}
                    <div style={{ perspective: '900px' }}>
                        <div
                            style={{ transform: 'rotateX(18deg)', transformOrigin: 'top center', transformStyle: 'preserve-3d', position: 'relative', cursor: phase === 'cut' ? 'crosshair' : 'default' }}
                            onMouseLeave={() => setHoverGap(null)}
                        >
                            {/* Invisible gap click zones */}
                            {phase === 'cut' && Array.from({ length: pallet.width - 1 }, (_, i) => {
                                const g = i + 1;
                                return (
                                    <div key={g} style={{
                                        position: 'absolute', top: 0, bottom: 0,
                                        left: `${gapX(g) - 9}px`, width: '20px',
                                        zIndex: 20, cursor: g > DOOR_MAX ? 'not-allowed' : 'crosshair',
                                    }}
                                        onMouseEnter={() => setHoverGap(g)}
                                        onClick={() => handleGapClick(g)}
                                    />
                                );
                            })}

                            {/* Hover / laser line */}
                            {(hoverGap || cutAfter) && (() => {
                                const g = cutAfter || hoverGap;
                                const tooWide = g > DOOR_MAX;
                                return (
                                    <div style={{
                                        position: 'absolute', top: 0, bottom: 0,
                                        left: `${gapX(g)}px`,
                                        width: cutAfter ? '4px' : '2px',
                                        background: cutAfter
                                            ? 'linear-gradient(to bottom, #ff4444, #ff8800, #ff4444)'
                                            : tooWide ? 'rgba(239,68,68,0.7)' : 'rgba(250,204,21,0.8)',
                                        boxShadow: cutAfter ? '0 0 14px 4px rgba(255,100,0,0.7)' : 'none',
                                        animation: cutAfter ? 'laserPulse 0.5s ease-out forwards' : 'none',
                                        pointerEvents: 'none', borderRadius: '2px', zIndex: 10,
                                    }} />
                                );
                            })()}

                            {/* Crate rows */}
                            {Array.from({ length: pallet.depth }, (_, row) => (
                                <div key={row} style={{ display: 'flex', gap: `${GAP}px`, marginBottom: `${GAP}px` }}>
                                    {Array.from({ length: pallet.width }, (_, col) => {
                                        const col1 = col + 1;
                                        const isLeft = cutAfter ? col1 <= cutAfter : col1 <= DOOR_MAX;
                                        const atDoorLimit = col1 === DOOR_MAX;
                                        return (
                                            <div key={col}
                                                style={{
                                                    width: `${CELL}px`, height: `${CELL}px`,
                                                    borderRadius: '5px',
                                                    background: isLeft
                                                        ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                                                        : 'linear-gradient(135deg, #f97316, #c2410c)',
                                                    boxShadow: isLeft
                                                        ? '0 3px 0 #1e3a8a, inset 0 1px 0 rgba(255,255,255,0.2)'
                                                        : '0 3px 0 #7c2d12, inset 0 1px 0 rgba(255,255,255,0.2)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '1rem', userSelect: 'none',
                                                    outline: atDoorLimit && !cutAfter ? '2px dashed rgba(34,211,238,0.5)' : 'none',
                                                }}
                                                onClick={() => phase === 'cut' && handleGapClick(col1)}
                                                onMouseEnter={() => phase === 'cut' && setHoverGap(col1)}
                                            >
                                                📦
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cut stats below grid */}
                    {cutAfter && (
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                                <span style={{ color: '#93c5fd' }}>🔵 Left: {cutAfter} cols</span>
                                <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0.4rem' }}>×</span>
                                <span style={{ color: '#93c5fd' }}>{pallet.depth} deep</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                                <span style={{ color: '#fdba74' }}>🟠 Right: {pallet.width - cutAfter} cols</span>
                                <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0.4rem' }}>×</span>
                                <span style={{ color: '#fdba74' }}>{pallet.depth} deep</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Side panel */}
                {(phase === 'multiply' || phase === 'add') && (
                    <div className="space-card" style={{ padding: '1.5rem', minWidth: '270px', maxWidth: '340px' }}>
                        {phase === 'multiply' && (
                            <MultiplicationForm
                                leftCols={cutAfter} rightCols={pallet.width - cutAfter}
                                depth={pallet.depth} onCorrect={handleMultiplyCorrect}
                            />
                        )}
                        {phase === 'add' && (
                            <AdditionForm leftTotal={leftTotal} rightTotal={rightTotal} onCorrect={handleAddCorrect} />
                        )}
                    </div>
                )}
            </div>

            {/* Success screen */}
            {phase === 'success' && (
                <div className="success-screen">
                    <div style={{ fontSize: '7rem', marginBottom: '1rem' }}>🚀</div>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '0.5rem', textAlign: 'center' }}>Mission Complete!</h2>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', maxWidth: '380px', textAlign: 'center' }}>{msg}</p>
                    <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>
                        {badges.slice(-3).map((b, i) => <span key={i} style={{ margin: '0 0.3rem' }}>{b}</span>)}
                    </div>
                    <button className="space-btn btn-success" onClick={nextRound}>Next Mission 🌌</button>
                </div>
            )}

            {/* Rare sticker banner */}
            {showRare && rareInfo && (
                <div className="rare-banner show">
                    <div className="rare-inner">
                        <div style={{ fontSize: '7rem', display: 'block', marginBottom: '1rem' }}>{rareInfo.emoji}</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>RARE STICKER!</h2>
                        <p style={{ fontSize: '1.4rem', fontWeight: 800, opacity: 0.9, marginBottom: '2rem' }}>{rareInfo.name}</p>
                        <button className="space-btn" style={{ background: '#92400e', color: 'white', padding: '0.9rem 2.5rem', boxShadow: '0 6px 0 #451a03' }}
                            onClick={() => setShowRare(false)}>Amazing! 🎉</button>
                    </div>
                </div>
            )}

            {/* Sticker flash */}
            {flashEmoji && <div id="sticker-flash-overlay" className="animate-sticker-pop">{flashEmoji}</div>}
        </div>
    );
}
