const { useState, useEffect, useRef } = React;

const DOOR_MAX = 10;
const CELL = 32; // base size
const GAP = 4;

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
    "Cargo manifest confirmed! 🚀",
    "Excellent navigation! 🌟",
    "Mission success! 🛸",
    "Spaceship loaded! 🪐",
    "Crates locked in! ☄️",
];

function generatePallet() {
    // Width is ALWAYS between 11 and 20.
    const width = Math.floor(Math.random() * 10) + 11;
    // Depth 1–10.
    const depth = Math.floor(Math.random() * 10) + 1;
    return { width, depth };
}

// ─── 3D Premium Crate Component ──────────────────────────────────────────────
function Crate({ side, isHovered, cutAfter, colIdx }) {
    const isLeft = side === 'left';
    // Use blue for left side (fits door), orange for right (back to Earth?)
    const color = isLeft ? '#3b82f6' : '#f97316';
    const darkColor = isLeft ? '#1e40af' : '#c2410c';
    const lightColor = isLeft ? '#60a5fa' : '#fb923c';

    return (
        <div className={`premium-crate ${isHovered ? 'hover' : ''}`} style={{
            '--crate-color': color,
            '--crate-dark': darkColor,
            '--crate-light': lightColor,
            width: CELL + 'px',
            height: CELL + 'px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.3s ease',
            margin: '2px'
        }}>
            <div className="crate-face front">📦</div>
            <div className="crate-face top"></div>
            <div className="crate-face right"></div>
        </div>
    );
}

// ─── SVG Detailed Spaceship ──────────────────────────────────────────────────
function Spaceship({ doorWidth, cutAfter, palletWidth }) {
    // doorWidth: always DOOR_MAX (10)
    // cutAfter: null or 1-10
    // palletWidth: 11-20

    // Ratio for the door visual: DOOR_MAX is the standard width (10 units).
    // Let's make the door wide enough to look like it fits 10 crates.
    // Spaceship design is more detailed here.
    const W = 600, H = 240;

    // Calculate the width of the highlighted part of the door
    const doorUnitPx = 18; // px per crate unit for the door visual
    const doorW = DOOR_MAX * doorUnitPx;
    const doorH = 90;
    const centerX = W / 2;
    const centerY = H / 2;
    const doorX = centerX - doorW / 2;
    const doorY = centerY - doorH / 2;

    const cutW = cutAfter ? cutAfter * doorUnitPx : 0;

    return (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', filter: 'drop-shadow(0 0 20px rgba(96,165,250,0.2))' }}>
                <defs>
                    <linearGradient id="shipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="50%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <linearGradient id="doorLight" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(34,211,238,0.3)" />
                        <stop offset="100%" stopColor="rgba(34,211,238,0.1)" />
                    </linearGradient>
                    <filter id="neon" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Main Body */}
                <rect x="50" y="60" width="500" height="120" rx="60" fill="url(#shipGrad)" stroke="#475569" strokeWidth="3" />

                {/* Nose Cone */}
                <ellipse cx="530" cy="120" rx="40" ry="50" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <circle cx="545" cy="110" r="15" fill="#bae6fd" opacity="0.4" />

                {/* Fins */}
                <path d="M120,60 L80,20 L180,60" fill="#334155" stroke="#475569" strokeWidth="2" />
                <path d="M120,180 L80,220 L180,180" fill="#334155" stroke="#475569" strokeWidth="2" />

                {/* Thrusters */}
                <rect x="30" y="90" width="30" height="60" rx="5" fill="#1e293b" stroke="#475569" />
                <path d="M30,100 L0,105 L0,135 L30,140 Z" fill="#f97316" className="thruster-fire" />

                {/* Cargo Door Opening */}
                <rect x={doorX - 5} y={doorY - 5} width={doorW + 10} height={doorH + 10} rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="5" />
                <rect x={doorX} y={doorY} width={doorW} height={doorH} rx="5" fill="#020617" />

                {/* Scanning Light (The Door limit indication) */}
                <text x={centerX} y={doorY - 15} textAnchor="middle" fill="#22d3ee" style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }} filter="url(#neon)">
                    MAX 10 WIDE CARGO DOOR
                </text>

                <line x1={doorX} y1={doorY - 5} x2={doorX + doorW} y2={doorY - 5} stroke="#22d3ee" strokeWidth="2" strokeDasharray="4" opacity="0.6" />

                {/* Cut visualization inside door */}
                {cutAfter && (
                    <g>
                        <rect x={doorX} y={doorY} width={cutW} height={doorH} rx="5" fill="url(#doorLight)" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5" />
                        <line x1={doorX + cutW} y1={doorY} x2={doorX + cutW} y2={doorY + doorH} stroke="#facc15" strokeWidth="3" filter="url(#neon)" />
                    </g>
                )}

                {/* Rivets and details */}
                {[100, 200, 300, 400].map(x => (
                    <circle key={x} cx={x} cy="75" r="3" fill="#64748b" />
                ))}
            </svg>
        </div>
    );
}

// ─── Multiplication Step Form ────────────────────────────────────────────────
function MultiplicationStep({ leftCols, rightCols, depth, onComplete }) {
    const leftAns = leftCols * depth;
    const rightAns = rightCols * depth;
    const [leftInput, setLeftInput] = useState('');
    const [rightInput, setRightInput] = useState('');
    const [checked, setChecked] = useState(false);

    const check = () => {
        setChecked(true);
        if (parseInt(leftInput) === leftAns && parseInt(rightInput) === rightAns) {
            setTimeout(() => onComplete(leftAns, rightAns), 800);
        } else {
            setTimeout(() => setChecked(false), 2000);
        }
    };

    return (
        <div className="glass-form p-6 rounded-3xl animate-fade-in" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 className="text-xl font-black text-blue-400 mb-6 uppercase tracking-tighter">Manifest: Initial Count</h3>
            <div className="flex gap-8 justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 uppercase">Left Cargo</span>
                    <div className="text-2xl font-black text-white">{leftCols} × {depth}</div>
                    <input
                        type="number"
                        value={leftInput}
                        onChange={e => setLeftInput(e.target.value)}
                        placeholder="?"
                        className={`w-24 h-16 text-3xl font-black text-center rounded-2xl border-4 bg-transparent outline-none transition-all
                            ${checked ? (parseInt(leftInput) === leftAns ? 'border-green-500 text-green-400' : 'border-red-500 animate-shake') : 'border-blue-500 text-white focus:border-white'}`}
                    />
                </div>
                <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 uppercase">Right Cargo</span>
                    <div className="text-2xl font-black text-white">{rightCols} × {depth}</div>
                    <input
                        type="number"
                        value={rightInput}
                        onChange={e => setRightInput(e.target.value)}
                        placeholder="?"
                        className={`w-24 h-16 text-3xl font-black text-center rounded-2xl border-4 bg-transparent outline-none transition-all
                            ${checked ? (parseInt(rightInput) === rightAns ? 'border-green-500 text-green-400' : 'border-red-500 animate-shake') : 'border-orange-500 text-white focus:border-white'}`}
                    />
                </div>
            </div>
            <button onClick={check} className="mt-8 space-btn py-4 px-12 text-xl font-black bg-blue-600 rounded-full hover:bg-blue-400 transition-all uppercase">Check Calculation</button>
        </div>
    );
}

// ─── Addition Manifest Form (Dino Style) ─────────────────────────────────────
function AdditionManifest({ left, right, onComplete }) {
    const total = left + right;
    const lStr = String(left).padStart(3, '0');
    const rStr = String(right).padStart(3, '0');

    const [c1, setC1] = useState(''); // Carry 10s
    const [c2, setC2] = useState(''); // Carry 100s
    const [aH, setAH] = useState('');
    const [aT, setAT] = useState('');
    const [aO, setAO] = useState('');
    const [checked, setChecked] = useState(false);

    const check = () => {
        const userTotal = parseInt(`${aH || 0}${aT || 0}${aO || 0}`);
        setChecked(true);
        if (userTotal === total) {
            setTimeout(() => onComplete(), 1000);
        } else {
            setTimeout(() => setChecked(false), 2000);
        }
    };

    return (
        <div className="glass-form p-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 className="text-xl font-black text-cyan-400 mb-8 uppercase tracking-tighter">Mission Control: Final Manifest</h3>
            <div className="flex flex-col items-center gap-2">
                {/* Carry Row */}
                <div className="flex gap-4 mb-2">
                    <input type="number" value={c2} onChange={e => setC2(e.target.value.slice(-1))} className="w-12 h-12 rounded-lg border-2 border-dashed border-yellow-500 text-center text-xl font-black bg-transparent text-yellow-500 outline-none" placeholder="?" />
                    <input type="number" value={c1} onChange={e => setC1(e.target.value.slice(-1))} className="w-12 h-12 rounded-lg border-2 border-dashed border-yellow-500 text-center text-xl font-black bg-transparent text-yellow-500 outline-none" placeholder="?" />
                    <div className="w-12 h-12"></div>
                </div>

                {/* Numbers */}
                <div className="text-5xl font-black tracking-widest text-blue-400 flex gap-4 pr-12">
                    {lStr.split('').map((d, i) => <span key={i} className="w-12 text-center">{d === '0' && i < 2 ? ' ' : d}</span>)}
                </div>
                <div className="text-5xl font-black tracking-widest text-orange-400 flex gap-4 pr-12 relative">
                    <span className="absolute -left-12 text-gray-500">+</span>
                    {rStr.split('').map((d, i) => <span key={i} className="w-12 text-center">{d === '0' && i < 2 ? ' ' : d}</span>)}
                </div>

                {/* Line */}
                <div className="w-64 h-2 bg-white rounded-full my-4"></div>

                {/* Answer Row */}
                <div className="flex gap-4">
                    <input type="number" value={aH} onChange={e => setAH(e.target.value.slice(-1))} className="w-16 h-16 rounded-2xl border-4 border-cyan-500 text-center text-4xl font-black bg-white/10 text-white outline-none" />
                    <input type="number" value={aT} onChange={e => setAT(e.target.value.slice(-1))} className="w-16 h-16 rounded-2xl border-4 border-cyan-500 text-center text-4xl font-black bg-white/10 text-white outline-none" />
                    <input type="number" value={aO} onChange={e => setAO(e.target.value.slice(-1))} className="w-16 h-16 rounded-2xl border-4 border-cyan-500 text-center text-4xl font-black bg-white/10 text-white outline-none" />
                </div>
            </div>
            <button onClick={check} className="mt-8 space-btn py-4 px-12 text-xl font-black bg-cyan-600 rounded-full hover:bg-cyan-400 transition-all uppercase">Verify Manifest</button>
        </div>
    );
}

// ─── Main Game Component ─────────────────────────────────────────────────────
function App() {
    const [pallet, setPallet] = useState(() => generatePallet());
    const [cutAfter, setCutAfter] = useState(null);
    const [hoverCol, setHoverCol] = useState(null);
    const [phase, setPhase] = useState('cut'); // 'cut', 'multiply', 'add', 'success'
    const [multiAnswers, setMultiAnswers] = useState({ left: 0, right: 0 });
    const [badges, setBadges] = useState(() => JSON.parse(sessionStorage.getItem('stickers_space-cargo') || '[]'));
    const [rareOwned, setRareOwned] = useState(() => JSON.parse(sessionStorage.getItem('stickers_rare') || '[]'));
    const [level, setLevel] = useState(1);
    const [showRare, setShowRare] = useState(false);
    const [rareInfo, setRareInfo] = useState(null);
    const [flashEmoji, setFlashEmoji] = useState(null);

    useEffect(() => {
        sessionStorage.setItem('stickers_space-cargo', JSON.stringify(badges));
        sessionStorage.setItem('stickers_rare', JSON.stringify(rareOwned));
    }, [badges, rareOwned]);

    const handleCut = (col) => {
        if (col > DOOR_MAX) return; // visual block or feedback
        setCutAfter(col);
        setTimeout(() => setPhase('multiply'), 600);
    };

    const handleMultiComplete = (l, r) => {
        setMultiAnswers({ left: l, right: r });
        setPhase('add');
    };

    const handleAddComplete = () => {
        // Award badge
        const badge = SPACE_BADGES[Math.floor(Math.random() * SPACE_BADGES.length)];
        setBadges(prev => [...prev, badge.emoji]);
        setFlashEmoji(badge.emoji);
        setTimeout(() => setFlashEmoji(null), 1500);

        // Rare check
        if (Math.random() < 0.25) {
            const available = RARE_STICKERS.filter(s => !rareOwned.includes(s.emoji));
            if (available.length > 0) {
                const r = available[Math.floor(Math.random() * available.length)];
                setRareInfo(r);
                setRareOwned(prev => [...prev, r.emoji]);
                setShowRare(true);
            }
        }
        setPhase('success');
    };

    const nextMission = () => {
        setPallet(generatePallet());
        setCutAfter(null);
        setPhase('cut');
        setLevel(l => l + 1);
        setShowRare(false);
    };

    if (phase === 'success') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in text-center p-8">
                <div className="text-[12rem] animate-bounce mb-8">🚀</div>
                <h1 className="text-6xl font-black text-white mb-4 uppercase italic">Mission Accomplished!</h1>
                <p className="text-2xl text-cyan-400 font-bold mb-12 uppercase tracking-widest">{ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)]}</p>
                <div className="flex gap-4 mb-12">
                    {badges.slice(-5).map((b, i) => <span key={i} className="text-6xl">{b}</span>)}
                </div>
                <button onClick={nextMission} className="space-btn py-6 px-16 text-3xl font-black bg-blue-600 rounded-full hover:bg-blue-400 transition-all uppercase tracking-tighter">Launch Next Mission 🌌</button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto flex flex-col items-center">
            {/* Header / Stats */}
            <div className="w-full flex justify-between items-center mb-12 glass p-4 rounded-3xl border border-white/10">
                <div className="flex flex-col">
                    <span className="text-3xl font-black text-white italic tracking-tighter">SPACE CARGO LOAD 🚀</span>
                    <span className="text-cyan-400 font-black uppercase tracking-widest text-xs">Commander Archie • Mission {level}</span>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-2 text-2xl">
                        {rareOwned.slice(-2).map((s, i) => <span key={i} title="Rare Badge">{s}</span>)}
                        {badges.slice(-3).map((s, i) => <span key={i}>{s}</span>)}
                    </div>
                </div>
            </div>

            {/* Visual Ship and Compare Area */}
            <Spaceship doorWidth={DOOR_MAX} cutAfter={cutAfter} palletWidth={pallet.width} />

            <div className="w-full max-w-3xl flex justify-between items-center my-8 text-cyan-500 font-black text-xs uppercase tracking-[0.2em] opacity-80">
                <span>Pallet Size: {pallet.width}w × {pallet.depth}d</span>
                <span>Door Limit: {DOOR_MAX} Max</span>
            </div>

            {/* Interactive Grid / Forms Area */}
            <div className="w-full flex flex-col items-center gap-12">
                {phase === 'cut' && (
                    <div className="space-card rounded-[3rem] p-12 w-full max-w-5xl overflow-hidden relative" style={{ perspective: '1200px' }}>
                        <div className="mb-10 text-center">
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Operation: Laser Cut ⚡</h2>
                            <p className="text-blue-300 font-bold uppercase tracking-widest text-sm">Target: Cut the pallet to fit the door (Max {DOOR_MAX} wide)</p>
                        </div>

                        <div className="flex flex-col items-center transition-transform duration-500" style={{ transform: 'rotateX(20deg)', transformOrigin: 'top center' }}>
                            {/* Column Numbers */}
                            <div className="flex mb-4">
                                {Array.from({ length: pallet.width }).map((_, i) => (
                                    <div key={i} className={`w-[36px] text-center text-[10px] font-black ${i < DOOR_MAX ? 'text-cyan-400' : 'text-red-500/50'}`}>
                                        {i + 1}
                                    </div>
                                ))}
                            </div>

                            {/* Crate Grid */}
                            <div className="flex flex-col gap-1 items-center">
                                {Array.from({ length: pallet.depth }).map((_, r) => (
                                    <div key={r} className="flex gap-1">
                                        {Array.from({ length: pallet.width }).map((_, c) => (
                                            <div
                                                key={c}
                                                onMouseEnter={() => setHoverCol(c + 1)}
                                                onMouseLeave={() => setHoverCol(null)}
                                                onClick={() => handleCut(c + 1)}
                                                className={`cursor-pointer transition-all duration-300 ${c + 1 > DOOR_MAX ? 'opacity-40 grayscale' : ''}`}
                                            >
                                                <Crate
                                                    side={c + 1 <= (hoverCol || 0) ? 'left' : 'right'}
                                                    isHovered={hoverCol ? (c + 1 <= hoverCol) : false}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}

                                {/* Hover Cut Preview Line */}
                                {hoverCol && (
                                    <div
                                        className={`absolute top-0 bottom-0 w-1 pointer-events-none transition-all duration-100 ${hoverCol > DOOR_MAX ? 'bg-red-500 shadow-[0_0_20px_red]' : 'bg-cyan-400 shadow-[0_0_20px_cyan]'}`}
                                        style={{ left: `calc(50% - ${(pallet.width * 40) / 2}px + ${hoverCol * 40}px - 2px)` }}
                                    ></div>
                                )}
                            </div>
                        </div>

                        {hoverCol > DOOR_MAX && <div className="mt-8 text-red-500 font-black uppercase text-center animate-pulse">⚠️ TOO WIDE FOR DOOR (MAX {DOOR_MAX})</div>}
                    </div>
                )}

                {phase === 'multiply' && (
                    <div className="flex flex-col items-center gap-6">
                        <MultiplicationStep
                            leftCols={cutAfter}
                            rightCols={pallet.width - cutAfter}
                            depth={pallet.depth}
                            onComplete={handleMultiComplete}
                        />
                        <button onClick={recut} className="text-gray-500 hover:text-white font-black uppercase tracking-widest text-xs transition-colors italic">↩ Reselect Cut Position</button>
                    </div>
                )}

                {phase === 'add' && (
                    <div className="flex flex-col items-center gap-6">
                        <AdditionManifest left={multiAnswers.left} right={multiAnswers.right} onComplete={handleAddComplete} />
                        <button onClick={recut} className="text-gray-500 hover:text-white font-black uppercase tracking-widest text-xs transition-colors italic">↩ Reselect Cut Position</button>
                    </div>
                )}
            </div>

            {/* Rare Banner */}
            {showRare && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in p-8">
                    <div className="max-w-md w-full text-center">
                        <div className="text-9xl mb-8 animate-spin-slow">{rareInfo.emoji}</div>
                        <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">Rare Badge Found!</h2>
                        <p className="text-2xl text-yellow-400 font-bold mb-12 uppercase tracking-[0.2em]">{rareInfo.name}</p>
                        <button onClick={() => setShowRare(false)} className="space-btn py-5 px-12 text-2xl font-black bg-yellow-600 rounded-full hover:bg-yellow-400 transition-all uppercase">Incredible! ✨</button>
                    </div>
                </div>
            )}

            {/* Flash Overlay */}
            {flashEmoji && (
                <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[100] animate-sticker-pop">
                    <div className="text-[20rem]">{flashEmoji}</div>
                </div>
            )}
        </div>
    );

    function recut() {
        setCutAfter(null);
        setPhase('cut');
        setHoverCol(null);
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
