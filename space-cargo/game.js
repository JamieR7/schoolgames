const { useState, useEffect, useRef } = React;

const DOOR_MAX = 10;
const CELL = 34; // Slightly larger for better clarity
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

function generatePallet() {
    const width = Math.floor(Math.random() * 10) + 11;
    const depth = Math.floor(Math.random() * 10) + 1;
    return { width, depth };
}

// ─── 3D Premium Crate Component ──────────────────────────────────────────────
function Crate({ side, isHovered, isGhost }) {
    const isLeft = side === 'left';
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
            opacity: isGhost ? 0.35 : 1,
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease',
        }}>
            <div className="crate-face front" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>📦</div>
            <div className="crate-face top"></div>
            <div className="crate-face right"></div>
        </div>
    );
}

// ─── SVG Professional Spaceship ──────────────────────────────────────────────
function Spaceship({ doorWidth, cutAfter, palletWidth }) {
    const W = 800, H = 240;

    // Door unit scaling: matches the visual grid
    const doorUnitPx = 18;
    const doorW = DOOR_MAX * doorUnitPx;
    const doorH = 100;
    const centerX = W / 2;
    const centerY = H / 2;
    const doorX = centerX - doorW / 2;
    const doorY = centerY - doorH / 2;

    const cutW = cutAfter ? cutAfter * doorUnitPx : 0;

    return (
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.5))' }}>
                <defs>
                    <linearGradient id="hullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="50%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <linearGradient id="doorInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#020617" />
                        <stop offset="100%" stopColor="#000000" />
                    </linearGradient>
                    <radialGradient id="thrusterGlow">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </radialGradient>
                    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Engine Pods */}
                <rect x="50" y="80" width="80" height="80" rx="15" fill="#1e293b" stroke="#334155" />
                <rect x="670" y="80" width="80" height="80" rx="15" fill="#1e293b" stroke="#334155" />

                {/* Static Thruster Glows */}
                <circle cx="90" cy="120" r="30" fill="url(#thrusterGlow)" />
                <circle cx="710" cy="120" r="30" fill="url(#thrusterGlow)" />

                {/* Main Hull (Sleeker Box Shape) */}
                <rect x="130" y="50" width="540" height="140" rx="20" fill="url(#hullGrad)" stroke="#334155" strokeWidth="2" />

                {/* Top Section */}
                <path d="M250,50 L300,20 L500,20 L550,50 Z" fill="#1e293b" stroke="#334155" />

                {/* Details / Panels */}
                <rect x="160" y="65" width="480" height="5" rx="2.5" fill="#334155" opacity="0.5" />
                <rect x="160" y="170" width="480" height="5" rx="2.5" fill="#334155" opacity="0.5" />

                {/* Cargo Bay Area */}
                <rect x={doorX - 8} y={doorY - 8} width={doorW + 16} height={doorH + 16} rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="4" />
                <rect x={doorX} y={doorY} width={doorW} height={doorH} rx="8" fill="url(#doorInnerGrad)" />
                <rect x={doorX} y={doorY} width={doorW} height={doorH} rx="8" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.3" />

                {/* SCANNER LABEL */}
                <g filter="url(#neonGlow)">
                    <text x={centerX} y={doorY - 20} textAnchor="middle" fill="#22d3ee" style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>
                        Bay Width Limit: 10 Units
                    </text>
                    <path d={`M${doorX},${doorY - 10} L${doorX},${doorY - 15} L${doorX + doorW},${doorY - 15} L${doorX + doorW},${doorY - 10}`} fill="none" stroke="#22d3ee" strokeWidth="2" />
                </g>

                {/* Cargo Visualization */}
                {cutAfter && (
                    <g className="animate-fade-in">
                        <rect x={doorX} y={doorY} width={cutW} height={doorH} rx="8" fill="rgba(34,211,238,0.15)" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6" />
                        <line x1={doorX + cutW} y1={doorY} x2={doorX + cutW} y2={doorY + doorH} stroke="#facc15" strokeWidth="4" filter="url(#neonGlow)" />
                        <text x={doorX + cutW / 2} y={doorY + doorH / 2 + 5} textAnchor="middle" fill="#60a5fa" style={{ fontSize: '12px', fontWeight: 900 }}>LOADED: {cutAfter}</text>
                    </g>
                )}

                {/* Cockpit / Bridge Area */}
                <rect x="350" y="65" width="100" height="15" rx="7.5" fill="#0369a1" opacity="0.8" />
                <rect x="360" y="68" width="20" height="5" rx="2.5" fill="#7dd3fc" opacity="0.5" />
            </svg>
        </div>
    );
}

// ─── Main Game Component ─────────────────────────────────────────────────────
function App() {
    const [pallet, setPallet] = useState(() => generatePallet());
    const [cutAfter, setCutAfter] = useState(null);
    const [hoverCol, setHoverCol] = useState(null);
    const [phase, setPhase] = useState('cut');
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
        if (col > DOOR_MAX) return;
        setCutAfter(col);
        setTimeout(() => setPhase('multiply'), 600);
    };

    const handleMultiComplete = (l, r) => {
        setMultiAnswers({ left: l, right: r });
        setPhase('add');
    };

    const handleAddComplete = () => {
        const badge = SPACE_BADGES[Math.floor(Math.random() * SPACE_BADGES.length)];
        setBadges(prev => [...prev, badge.emoji]);
        setFlashEmoji(badge.emoji);
        setTimeout(() => setFlashEmoji(null), 1500);

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

    const recut = () => {
        setCutAfter(null);
        setPhase('cut');
        setHoverCol(null);
    };

    if (phase === 'success') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in text-center p-8">
                <div className="text-[12rem] animate-bounce mb-8">🚀</div>
                <h1 className="text-6xl font-black text-white mb-4 uppercase italic tracking-tighter">Mission Success!</h1>
                <p className="text-2xl text-cyan-400 font-bold mb-12 uppercase tracking-[0.2em]">Crates safely loaded by Archie the Ninja</p>
                <div className="flex gap-4 mb-12">
                    {badges.slice(-5).map((b, i) => <span key={i} className="text-6xl">{b}</span>)}
                </div>
                <button onClick={nextMission} className="space-btn py-6 px-16 text-3xl font-black bg-blue-600 rounded-full uppercase tracking-tighter">Next Deployment 🌌</button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-10 glass p-5 rounded-3xl border border-white/10">
                <div className="flex flex-col">
                    <span className="text-3xl font-black text-white italic tracking-tighter uppercase">Space Logistics Co. 🚀</span>
                    <span className="text-cyan-400 font-black uppercase tracking-[0.3em] text-[10px]">Cargo Mission #{level} • Commander Archie</span>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="text-2xl flex gap-1 bg-black/30 p-2 rounded-2xl border border-white/5">
                        {rareOwned.slice(-2).map((s, i) => <span key={i}>{s}</span>)}
                        {badges.slice(-3).map((s, i) => <span key={i}>{s}</span>)}
                    </div>
                </div>
            </div>

            {/* Ship Visual */}
            <Spaceship doorWidth={DOOR_MAX} cutAfter={cutAfter} palletWidth={pallet.width} />

            <div className="w-full max-w-4xl flex justify-between items-center my-6 px-4">
                <div className="flex gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Pallet Dimensions</span>
                        <span className="text-white font-black text-lg">{pallet.width}w × {pallet.depth}d</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">Bay Capacity</span>
                        <span className="text-white font-black text-lg">Max {DOOR_MAX} Wide</span>
                    </div>
                </div>
                {cutAfter && (
                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Left Piece</span>
                            <span className="text-white font-black text-lg">{cutAfter} Wide</span>
                        </div>
                        <div className="w-px h-8 bg-white/10 mx-2"></div>
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] text-orange-400 font-black uppercase tracking-widest">Right Piece</span>
                            <span className="text-white font-black text-lg">{pallet.width - cutAfter} Wide</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Grid Area */}
            <div className="w-full flex flex-col items-center gap-10">
                {phase === 'cut' && (
                    <div className="space-card rounded-[4rem] p-16 w-full max-w-6xl overflow-x-auto relative" style={{ perspective: '1600px' }}>
                        <div className="mb-12 text-center">
                            <h2 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase italic">Laser Deployment ⚡</h2>
                            <p className="text-cyan-400/80 font-black uppercase tracking-widest text-xs">Target: Split cargo to fit 10-Unit ship door</p>
                        </div>

                        <div className="flex" style={{ transform: 'rotateX(25deg)', transformOrigin: 'top center', marginBottom: '40px' }}>
                            {/* Row Labels (Depth Indicator) */}
                            <div className="flex flex-col gap-1 pr-6 pt-5">
                                {Array.from({ length: pallet.depth }).map((_, r) => (
                                    <div key={r} className="h-[34px] flex items-center justify-end text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                                        Row {r + 1}
                                    </div>
                                ))}
                                <div className="mt-4 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">DEPTH</div>
                            </div>

                            <div className="flex flex-col items-center">
                                {/* Column Numbers */}
                                <div className="flex mb-4">
                                    {Array.from({ length: pallet.width }).map((_, i) => (
                                        <div key={i} className={`w-[34px] text-center text-[10px] font-black transition-colors ${i < DOOR_MAX ? 'text-cyan-400' : 'text-gray-600'}`}>
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>

                                {/* Grid with Floor Effect */}
                                <div className="relative flex flex-col gap-1 group">
                                    {/* Floor Grid */}
                                    <div className="absolute inset-x-0 inset-y-0 -m-4 border border-white/5 rounded-2xl pointer-events-none" style={{ background: 'repeating-linear-gradient(rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 38px)' }}></div>

                                    {Array.from({ length: pallet.depth }).map((_, r) => (
                                        <div key={r} className="flex gap-1 relative">
                                            {Array.from({ length: pallet.width }).map((_, c) => {
                                                const id = c + 1;
                                                const isLeft = hoverCol ? id <= hoverCol : id <= DOOR_MAX;
                                                return (
                                                    <div
                                                        key={c}
                                                        onMouseEnter={() => setHoverCol(id)}
                                                        onMouseLeave={() => setHoverCol(null)}
                                                        onClick={() => handleCut(id)}
                                                        className={`cursor-pointer transition-all duration-300 ${id > DOOR_MAX ? 'opacity-20' : ''}`}
                                                    >
                                                        <Crate
                                                            side={isLeft ? 'left' : 'right'}
                                                            isHovered={hoverCol === id}
                                                            isGhost={hoverCol && id > hoverCol}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}

                                    {/* Premium Laser UI */}
                                    {hoverCol && (
                                        <div
                                            className={`absolute top-0 bottom-0 w-1 pointer-events-none transition-all duration-150 z-50`}
                                            style={{
                                                left: (hoverCol * 38) - 2 + 'px',
                                                background: hoverCol > DOOR_MAX ? '#ef4444' : '#22d3ee',
                                                boxShadow: `0 0 20px ${hoverCol > DOOR_MAX ? '#ef4444' : '#22d3ee'}`
                                            }}
                                        >
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 border border-white/20 rounded-md whitespace-nowrap">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${hoverCol > DOOR_MAX ? 'text-red-500' : 'text-cyan-400'}`}>
                                                    {hoverCol > DOOR_MAX ? '⚠ Too Wide' : `Laser Point: ${hoverCol}`}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {phase === 'multiply' && (
                    <div className="flex flex-col items-center gap-8">
                        <MultiplicationPhase
                            left={cutAfter}
                            right={pallet.width - cutAfter}
                            depth={pallet.depth}
                            onComplete={handleMultiComplete}
                        />
                        <button onClick={recut} className="text-gray-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors italic border-b border-white/10 pb-1">↩ Adjust Laser Cut Position</button>
                    </div>
                )}

                {phase === 'add' && (
                    <div className="flex flex-col items-center gap-8">
                        <AdditionManifest left={multiAnswers.left} right={multiAnswers.right} onComplete={handleAddComplete} />
                        <button onClick={recut} className="text-gray-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors italic border-b border-white/10 pb-1">↩ Adjust Laser Cut Position</button>
                    </div>
                )}
            </div>

            {/* Rare Badge Find Modal */}
            {showRare && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-8 animate-fade-in">
                    <div className="max-w-md w-full text-center">
                        <div className="text-[12rem] mb-10 animate-spin-slow">{rareInfo.emoji}</div>
                        <h2 className="text-6xl font-black text-white mb-4 tracking-tighter uppercase italic">Rare Badge Discovered!</h2>
                        <p className="text-2xl text-yellow-400 font-bold mb-14 uppercase tracking-widest">{rareInfo.name}</p>
                        <button onClick={() => setShowRare(false)} className="space-btn py-6 px-16 text-2xl font-black bg-yellow-600 rounded-full uppercase tracking-tighter">Mission Logged! ✨</button>
                    </div>
                </div>
            )}

            {/* Reward Pop Animation */}
            {flashEmoji && (
                <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[100] animate-sticker-pop">
                    <div className="text-[22rem]">{flashEmoji}</div>
                </div>
            )}
        </div>
    );
}

// ─── Multiplication Component ────────────────────────────────────────────────
function MultiplicationPhase({ left, right, depth, onComplete }) {
    const lAns = left * depth;
    const rAns = right * depth;
    const [lIn, setLIn] = useState('');
    const [rIn, setRIn] = useState('');
    const [checked, setChecked] = useState(false);

    const check = () => {
        setChecked(true);
        if (parseInt(lIn) === lAns && parseInt(rIn) === rAns) {
            setTimeout(() => onComplete(lAns, rAns), 800);
        } else {
            setTimeout(() => setChecked(false), 2000);
        }
    };

    const boxBase = "w-28 h-20 text-4xl font-black text-center rounded-2xl border-4 bg-black/20 outline-none transition-all";

    return (
        <div className="glass p-10 rounded-[3rem] border border-white/10 animate-fade-in">
            <h3 className="text-xl font-black text-blue-400 mb-10 uppercase tracking-widest text-center">Manifest Calculation (Initial)</h3>
            <div className="flex gap-12 justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Left Piece (Loaded)</span>
                    <div className="text-3xl font-black text-white tracking-tighter">{left} × {depth} =</div>
                    <input type="number" value={lIn} onChange={e => setLIn(e.target.value)} placeholder="?"
                        className={`${boxBase} ${checked ? (parseInt(lIn) === lAns ? 'border-green-500 text-green-400' : 'border-red-500 animate-shake') : 'border-blue-500 text-white focus:border-white'}`}
                    />
                </div>
                <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Right Piece (Stored)</span>
                    <div className="text-3xl font-black text-white tracking-tighter">{right} × {depth} =</div>
                    <input type="number" value={rIn} onChange={e => setRIn(e.target.value)} placeholder="?"
                        className={`${boxBase} ${checked ? (parseInt(rIn) === rAns ? 'border-green-500 text-green-400' : 'border-red-500 animate-shake') : 'border-orange-500 text-white focus:border-white'}`}
                    />
                </div>
            </div>
            <div className="flex justify-center mt-12">
                <button onClick={check} className="space-btn py-5 px-14 text-xl font-black bg-blue-600 rounded-full uppercase tracking-tighter">Process Calculations</button>
            </div>
        </div>
    );
}

// ─── Addition Manifest Form (Dino Style) ─────────────────────────────────────
function AdditionManifest({ left, right, onComplete }) {
    const total = left + right;
    const lStr = String(left).padStart(3, ' ');
    const rStr = String(right).padStart(3, ' ');

    const [c1, setC1] = useState('');
    const [c2, setC2] = useState('');
    const [aH, setAH] = useState('');
    const [aT, setAT] = useState('');
    const [aO, setAO] = useState('');
    const [checked, setChecked] = useState(false);

    const check = () => {
        const userTotal = parseInt(`${aH || ''}${aT || ''}${aO || '0'}`);
        setChecked(true);
        if (userTotal === total) {
            setTimeout(() => onComplete(), 1000);
        } else {
            setTimeout(() => setChecked(false), 2000);
        }
    };

    const inBase = "w-16 h-18 rounded-2xl border-4 border-cyan-500 text-center text-5xl font-black bg-white/5 text-white outline-none focus:border-white transition-colors";

    return (
        <div className="glass p-12 rounded-[3.5rem] border border-white/10">
            <h3 className="text-xl font-black text-cyan-400 mb-10 uppercase tracking-widest text-center">Control Center: Total Manifest</h3>
            <div className="flex flex-col items-center gap-3">
                {/* Carry Row */}
                <div className="flex gap-4 mb-4">
                    <input type="number" value={c2} onChange={e => setC2(e.target.value.slice(-1))} className="w-14 h-14 rounded-xl border-2 border-dashed border-yellow-500/50 text-center text-2xl font-black bg-transparent text-yellow-500 outline-none" placeholder="?" />
                    <input type="number" value={c1} onChange={e => setC1(e.target.value.slice(-1))} className="w-14 h-14 rounded-xl border-2 border-dashed border-yellow-500/50 text-center text-2xl font-black bg-transparent text-yellow-500 outline-none" placeholder="?" />
                    <div className="w-14 h-14"></div>
                </div>

                {/* Numbers */}
                <div className="text-6xl font-black tracking-widest text-blue-400 flex gap-4 pr-16">
                    {lStr.split('').map((d, i) => <span key={i} className="w-14 text-center">{d}</span>)}
                </div>
                <div className="text-6xl font-black tracking-widest text-orange-400 flex gap-4 pr-16 relative">
                    <span className="absolute -left-12 bottom-0 text-white/30 text-5xl">+</span>
                    {rStr.split('').map((d, i) => <span key={i} className="w-14 text-center">{d}</span>)}
                </div>

                <div className="w-72 h-3 bg-white/20 rounded-full my-6"></div>

                {/* Answer Row */}
                <div className="flex gap-4">
                    <input type="number" value={aH} onChange={e => setAH(e.target.value.slice(-1))} className={inBase} />
                    <input type="number" value={aT} onChange={e => setAT(e.target.value.slice(-1))} className={inBase} />
                    <input type="number" value={aO} onChange={e => setAO(e.target.value.slice(-1))} className={inBase} />
                </div>
            </div>
            <div className="flex justify-center mt-12">
                <button onClick={check} className="space-btn py-5 px-14 text-xl font-black bg-cyan-600 rounded-full uppercase tracking-tighter">Final Manifest Log</button>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
