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
    const depth = Math.floor(Math.random() * Math.min(round + 3, 10)) + 1;
    const width = Math.floor(Math.random() * (Math.min(round + 8, 11))) + 10; // 10–20
    return { depth, width };
}

function ColumnAdditionForm({ leftTotal, rightTotal, onCorrect }) {
    // We need: left_ones, left_tens, right_ones, right_tens, carry, total_ones, total_tens
    const leftTens = Math.floor(leftTotal / 10);
    const leftOnes = leftTotal % 10;
    const rightTens = Math.floor(rightTotal / 10);
    const rightOnes = rightTotal % 10;
    const grandTotal = leftTotal + rightTotal;
    const needsCarry = leftOnes + rightOnes >= 10;

    const [inputs, setInputs] = useState({ carry: '', totalTens: '', totalOnes: '' });
    const [checked, setChecked] = useState(false);
    const [result, setResult] = useState(null); // 'correct' | 'wrong'

    const set = (k, v) => setInputs(p => ({ ...p, [k]: v }));

    const checkAnswer = () => {
        setChecked(true);
        const carry = parseInt(inputs.carry || '0');
        const tOnes = parseInt(inputs.totalOnes || '-1');
        const tTens = parseInt(inputs.totalTens || '-1');
        const correctCarry = needsCarry ? 1 : 0;
        const correctOnes = (leftOnes + rightOnes) % 10;
        const correctTens = leftTens + rightTens + correctCarry;

        const allCorrect = (!needsCarry || carry === correctCarry) &&
            tOnes === correctOnes && tTens === correctTens;

        if (allCorrect) {
            setResult('correct');
            setTimeout(() => onCorrect(), 800);
        } else {
            setResult('wrong');
            setTimeout(() => setResult(null), 1500);
        }
    };

    const inputClass = (field) => {
        if (!checked || result === null) return 'form-col-input';
        if (result === 'correct') return 'form-col-input correct';
        return 'form-col-input wrong';
    };

    return (
        <div className="addition-form flex flex-col items-center" style={{ gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                Cargo Manifest — Count the Crates
            </div>

            {/* Column addition layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* LEFT SIDE */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', marginBottom: '4px' }}>🔵 Left of cut</div>
                    {/* Rows label */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#93c5fd' }}>{leftTotal > 9 ? Math.floor(leftTotal / 10) : ''}</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#93c5fd' }}>{leftTotal % 10 === 0 && leftTotal > 0 ? '0' : leftTotal % 10}</div>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>crates</div>
                </div>

                {/* RIGHT SIDE */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#fb923c', textTransform: 'uppercase', marginBottom: '4px' }}>🟠 Right of cut</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fdba74' }}>{rightTotal > 9 ? Math.floor(rightTotal / 10) : ''}</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fdba74' }}>{rightTotal % 10 === 0 && rightTotal > 0 ? '0' : rightTotal % 10}</div>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>crates</div>
                </div>
            </div>

            {/* Divider line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <div style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.2)' }} />
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'rgba(255,255,255,0.5)' }}>+</span>
                <div style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.2)' }} />
            </div>

            {/* Answer row - vertical addition style */}
            <div style={{ marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '8px' }}>
                    Total crates to report:
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', justifyContent: 'center' }}>
                    {/* Carry box */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.6rem', color: '#facc15', fontWeight: 800, textTransform: 'uppercase' }}>carry</span>
                        <input
                            className="carry-input"
                            type="number"
                            inputMode="numeric"
                            min="0" max="1"
                            value={inputs.carry}
                            onChange={e => set('carry', e.target.value.slice(-1))}
                            placeholder="?"
                            disabled={!needsCarry}
                            style={{ opacity: needsCarry ? 1 : 0.3, cursor: needsCarry ? 'text' : 'not-allowed' }}
                        />
                    </div>

                    {/* Tens */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase' }}>tens</span>
                        <input
                            className={inputClass('totalTens')}
                            type="number"
                            inputMode="numeric"
                            min="0" max="9"
                            value={inputs.totalTens}
                            onChange={e => set('totalTens', e.target.value.slice(-1))}
                            placeholder="?"
                        />
                    </div>

                    {/* Ones */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase' }}>ones</span>
                        <input
                            className={inputClass('totalOnes')}
                            type="number"
                            inputMode="numeric"
                            min="0" max="9"
                            value={inputs.totalOnes}
                            onChange={e => set('totalOnes', e.target.value.slice(-1))}
                            placeholder="?"
                        />
                    </div>
                </div>
            </div>

            {result === 'wrong' && (
                <div style={{ color: '#f87171', fontWeight: 800, fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Check your numbers again! 🤔
                </div>
            )}

            <button
                className="space-btn btn-primary"
                onClick={checkAnswer}
                style={{ marginTop: '1rem' }}
                disabled={result === 'correct'}
            >
                Submit Manifest ✅
            </button>
        </div>
    );
}

function App() {
    const [round, setRound] = useState(1);
    const [pallet, setPallet] = useState(null);
    const [cutCol, setCutCol] = useState(null);     // 1-indexed column where laser cuts
    const [hoverCol, setHoverCol] = useState(null);
    const [phase, setPhase] = useState('cut');       // 'cut' | 'form' | 'success'
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
        setCutCol(null);
        setPhase('cut');
        setMsg('');
        setHoverCol(null);
    };

    const handleCellClick = (col1indexed) => {
        if (phase !== 'cut') return;
        if (col1indexed > DOOR_MAX) {
            setMsg(`⚠️ The door is only ${DOOR_MAX} wide! Cut must be at column ${DOOR_MAX} or less.`);
            return;
        }
        if (col1indexed < 1) return;
        setCutCol(col1indexed);
        setMsg('');
        setTimeout(() => setPhase('form'), 600);
    };

    const handleCorrect = () => {
        const enc = ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)];
        setMsg(enc);

        // Award badge
        const pool = SPACE_BADGES;
        const badge = pool[Math.floor(Math.random() * pool.length)];
        showStickerFlash(badge.emoji);
        setBadges(prev => [...prev, badge.emoji]);

        // Maybe award rare
        if (Math.random() < 0.2) {
            const available = RARE_STICKERS.filter(s => !rareOwned.includes(s.emoji));
            if (available.length > 0) {
                const r = available[Math.floor(Math.random() * available.length)];
                setRareInfo(r);
                setRareOwned(prev => [...prev, r.emoji]);
                setTimeout(() => { setShowRare(true); playFanfare(); }, 1000);
            }
        }

        setTimeout(() => setPhase('success'), 1200);
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

    const nextRound = () => {
        const next = round + 1;
        setRound(next);
        startRound(next);
    };

    if (!pallet) return <div style={{ color: 'white', padding: '2rem' }}>Loading...</div>;

    const leftCrates = cutCol ? pallet.depth * cutCol : 0;
    const rightCrates = cutCol ? pallet.depth * (pallet.width - cutCol) : 0;

    return (
        <div style={{ minHeight: '100vh', padding: '5rem 1rem 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '900px', marginBottom: '1.5rem' }}>
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
                        <div className="space-card" style={{ padding: '0.4rem 1rem', fontSize: '1.1rem', fontWeight: 800 }}>
                            Mission {round}
                        </div>
                        <div style={{ display: 'flex', gap: '0.3rem', fontSize: '1.4rem' }}>
                            {[...badges.slice(-5), ...rareOwned.slice(-2)].map((s, i) => <span key={i}>{s}</span>)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pallet info strip */}
            <div style={{ width: '100%', maxWidth: '900px', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="space-card" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 800 }}>
                    📦 Pallet: <span style={{ color: '#60a5fa' }}>{pallet.width}</span> wide × <span style={{ color: '#60a5fa' }}>{pallet.depth}</span> deep
                </div>
                {cutCol && (
                    <>
                        <div className="space-card" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 800, borderColor: 'rgba(96,165,250,0.4)' }}>
                            🔵 Left: {cutCol} × {pallet.depth} = <span style={{ color: '#60a5fa' }}>{leftCrates}</span>
                        </div>
                        <div className="space-card" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 800, borderColor: 'rgba(249,115,22,0.4)' }}>
                            🟠 Right: {pallet.width - cutCol} × {pallet.depth} = <span style={{ color: '#fb923c' }}>{rightCrates}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Instruction */}
            <div style={{ width: '100%', maxWidth: '900px', marginBottom: '1.2rem' }}>
                {phase === 'cut' && (
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>⚡</span>
                        Click a column to laser-cut the pallet! The left piece must be <span style={{ color: '#facc15', margin: '0 4px' }}>≤ {DOOR_MAX}</span> wide to fit the door.
                    </div>
                )}
                {phase === 'form' && (
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>📋</span>
                        Laser cut complete! Now fill in the cargo manifest to report the total crates.
                    </div>
                )}
                {msg && (
                    <div style={{ marginTop: '0.5rem', fontWeight: 800, fontSize: '1rem', color: msg.startsWith('⚠️') ? '#f87171' : '#86efac' }}>
                        {msg}
                    </div>
                )}
            </div>

            {/* Main content */}
            <div style={{ width: '100%', maxWidth: '900px', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* Grid */}
                <div className="space-card" style={{ padding: '1.5rem', flex: '1 1 auto' }}>
                    <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Cargo Pallet
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#facc15' }}>
                            🚪 Door limit: {DOOR_MAX}
                        </span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        {/* Column numbers */}
                        <div style={{ display: 'flex', gap: '3px', marginBottom: '4px', paddingLeft: '0px' }}>
                            {Array.from({ length: pallet.width }, (_, c) => (
                                <div
                                    key={c}
                                    style={{
                                        width: '34px', textAlign: 'center',
                                        fontSize: '0.65rem', fontWeight: 800,
                                        color: c + 1 <= DOOR_MAX ? '#facc15' : 'rgba(255,255,255,0.25)',
                                    }}
                                >
                                    {c + 1}
                                </div>
                            ))}
                        </div>

                        {/* Crate rows */}
                        <div
                            style={{ position: 'relative' }}
                            onMouseLeave={() => setHoverCol(null)}
                        >
                            {Array.from({ length: pallet.depth }, (_, row) => (
                                <div key={row} style={{ display: 'flex', gap: '3px', marginBottom: '3px' }}>
                                    {Array.from({ length: pallet.width }, (_, col) => {
                                        const col1 = col + 1;
                                        const isLeft = cutCol ? col1 <= cutCol : col1 <= DOOR_MAX;
                                        const isHoverZone = hoverCol && col1 <= hoverCol;
                                        return (
                                            <div
                                                key={col}
                                                className={`crate ${isLeft ? 'crate-left' : 'crate-right'}`}
                                                style={{
                                                    opacity: cutCol && col1 === cutCol + 1 && row === 0 ? 1 : 1,
                                                    outline: hoverCol && col1 === hoverCol && phase === 'cut' ? '2px solid #facc15' : 'none',
                                                }}
                                                onClick={() => handleCellClick(col1)}
                                                onMouseEnter={() => phase === 'cut' && setHoverCol(col1)}
                                                title={`Cut at column ${col1}${col1 > DOOR_MAX ? ' ⚠️ too wide!' : ''}`}
                                            >
                                                📦
                                                {/* Laser line after the cut col */}
                                                {cutCol && col1 === cutCol && row === 0 && (
                                                    <div className="laser-line" style={{ right: '-4px' }} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}

                            {/* Hover cut preview */}
                            {hoverCol && phase === 'cut' && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0, bottom: 0,
                                    left: `${hoverCol * 37 - 3}px`,
                                    width: '2px',
                                    background: hoverCol > DOOR_MAX ? 'rgba(248,113,113,0.7)' : 'rgba(250,204,21,0.7)',
                                    pointerEvents: 'none',
                                    borderRadius: '1px',
                                }} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Form panel */}
                {phase === 'form' && (
                    <div className="space-card" style={{ padding: '1.5rem', minWidth: '260px' }}>
                        <ColumnAdditionForm
                            leftTotal={leftCrates}
                            rightTotal={rightCrates}
                            onCorrect={handleCorrect}
                        />
                    </div>
                )}
            </div>

            {/* Success screen */}
            {phase === 'success' && (
                <div className="success-screen">
                    <div style={{ fontSize: '8rem', marginBottom: '1rem' }}>🚀</div>
                    <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', textAlign: 'center' }}>Mission Complete!</h2>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '3rem', textAlign: 'center', maxWidth: '400px' }}>
                        {msg}
                    </p>
                    <div style={{ fontSize: '4rem', marginBottom: '3rem' }}>
                        {badges.slice(-3).map((b, i) => <span key={i} style={{ margin: '0 0.3rem' }}>{b}</span>)}
                    </div>
                    <button className="space-btn btn-success" onClick={nextRound}>
                        Next Mission 🌌
                    </button>
                </div>
            )}

            {/* Rare banner */}
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
                        >
                            Amazing! 🎉
                        </button>
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
