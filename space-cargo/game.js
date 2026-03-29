const { useState, useEffect } = React;

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
    const width = Math.floor(Math.random() * 10) + 11; // 11 to 20
    const depth = Math.floor(Math.random() * 8) + 2;  // 2 to 9
    return { width, depth };
}

const App = () => {
    // Game State
    const [pallet, setPallet] = useState(() => generatePallet());
    const [splitIndex, setSplitIndex] = useState(10);
    const [partA, setPartA] = useState('');
    const [partB, setPartB] = useState('');
    const [sumHundreds, setSumHundreds] = useState('');
    const [sumTens, setSumTens] = useState('');
    const [sumOnes, setSumOnes] = useState('');
    const [carry, setCarry] = useState('');

    // Reward State
    const [badges, setBadges] = useState(() => JSON.parse(sessionStorage.getItem('stickers_space-cargo') || '[]'));
    const [rareOwned, setRareOwned] = useState(() => JSON.parse(sessionStorage.getItem('stickers_rare') || '[]'));
    const [showRare, setShowRare] = useState(false);
    const [rareInfo, setRareInfo] = useState(null);
    const [flashEmoji, setFlashEmoji] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        sessionStorage.setItem('stickers_space-cargo', JSON.stringify(badges));
        sessionStorage.setItem('stickers_rare', JSON.stringify(rareOwned));
    }, [badges, rareOwned]);

    // Derived values
    const colsA = splitIndex;
    const colsB = pallet.width - splitIndex;
    const valA = colsA * pallet.depth;
    const valB = colsB * pallet.depth;
    const total = valA + valB;

    const handleSplitChange = (e) => {
        setSplitIndex(parseInt(e.target.value));
        setPartA('');
        setPartB('');
        setSumHundreds('');
        setSumTens('');
        setSumOnes('');
        setCarry('');
    };

    // Correctness checks
    const isPartACorrect = partA.trim() !== '' && parseInt(partA) === valA;
    const isPartBCorrect = partB.trim() !== '' && parseInt(partB) === valB;
    const isAdditionReady = isPartACorrect && isPartBCorrect;

    const userTotal = parseInt(`${sumHundreds || '0'}${sumTens || '0'}${sumOnes || '0'}`);
    const isTotalCorrect = userTotal === total;
    const isFullyCorrect = isAdditionReady && isTotalCorrect;

    // Handle Victory
    useEffect(() => {
        if (isFullyCorrect && !isSuccess) {
            setIsSuccess(true);
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
        }
    }, [isFullyCorrect]);

    const nextMission = () => {
        setPallet(generatePallet());
        setSplitIndex(10);
        setPartA('');
        setPartB('');
        setSumHundreds('');
        setSumTens('');
        setSumOnes('');
        setCarry('');
        setIsSuccess(false);
        setShowRare(false);
    };

    const isTenSplit = splitIndex === 10;

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-neon-pink selection:text-white">
            {/* --- HEADER --- */}
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-panel">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-pink flex items-center justify-center shadow-neon-blue">
                        <i className="ph-fill ph-planet text-2xl text-white"></i>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-none">
                            SPACE <span className="text-neon-blue">CARGO</span>
                        </h1>
                        <span className="text-[10px] font-bold text-neon-pink tracking-[0.2em] uppercase mt-1">Slicer Tactics</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-space-800 px-4 py-2 rounded-xl border border-gray-700">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Badges</span>
                        <div className="flex gap-1">
                            {badges.slice(-5).map((b, i) => <span key={i} className="text-lg">{b}</span>)}
                            {badges.length > 5 && <span className="text-xs text-gray-500 font-bold">+{badges.length - 5}</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-space-800 rounded-full py-1 pr-4 pl-1 border border-gray-600">
                        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Archie&backgroundColor=1F2833" alt="Avatar" className="w-8 h-8 rounded-full bg-space-900 border border-neon-green" />
                        <span className="font-bold text-sm text-gray-200">Archie Ninja</span>
                    </div>
                </div>
            </header>

            {/* --- MAIN CENTRALISED LAYOUT --- */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-8 mt-4">

                {/* STRATEGY BANNER */}
                <div className="glass-panel p-6 rounded-3xl border-l-4 border-neon-blue shadow-lg animate-fade-in relative overflow-hidden">
                    <div className="absolute top-[-20px] right-[-20px] text-6xl text-neon-blue opacity-5">
                        <i className="ph-fill ph-lightbulb"></i>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-neon-blue/20 rounded-2xl text-neon-blue shrink-0">
                            <i className="ph-bold ph-strategy text-2xl"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1 italic">Ninja Strategy: The Distributive Property</h3>
                            <p className="text-gray-400 text-sm font-medium leading-relaxed">
                                Don't solve the big problem at once! Use the <span className="text-white font-bold italic">Laser Slicer</span> to split it into two tiny ones.
                                <span className="text-neon-pink"> Pro Tip: </span> Splitting at <span className="text-neon-blue font-black underline decoration-2 underline-offset-4">10</span> is the easiest way!
                            </p>
                        </div>
                    </div>
                </div>

                {/* MISSION HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-neon-orange/20 rounded-2xl text-neon-orange shadow-neon-orange/20">
                            <i className="ph-fill ph-package text-4xl"></i>
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white">{pallet.width} × {pallet.depth} = ?</h2>
                            <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                                <span className="text-neon-blue">Mission HQ</span>
                                <i className="ph-bold ph-caret-right text-[8px]"></i>
                                <span>Cargo Partitioning</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Formula</div>
                        <div className="bg-space-900 px-6 py-3 rounded-2xl border border-gray-700 font-mono text-xl shadow-inner">
                            ({colsA} + {colsB}) × {pallet.depth}
                        </div>
                    </div>
                </div>

                {/* GAME AREA */}
                <div className={`glass-panel p-8 rounded-[40px] relative transition-all duration-700 ${isTenSplit ? 'border-2 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.2)]' : 'border border-gray-700'}`}>

                    {/* Ten Split Badge */}
                    {isTenSplit && (
                        <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 bg-yellow-400 text-space-900 font-black px-6 py-1 rounded-full text-xs uppercase tracking-widest shadow-lg animate-bounce z-20">
                            ✨ GOLDEN CUT DETECTED ✨
                        </div>
                    )}

                    {/* Laser Slicer Controls */}
                    <div className="w-full max-w-2xl mx-auto mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Laser Calibration</span>
                            <div className={`flex items-center gap-2 px-4 py-1 rounded-full text-xs font-black transition-all ${isTenSplit ? 'bg-yellow-400 text-space-900' : 'bg-space-800 text-neon-pink border border-neon-pink/30'}`}>
                                <i className="ph-fill ph-scissors"></i> CUT AT: {splitIndex}
                            </div>
                        </div>
                        <div className="relative h-4 flex items-center">
                            <div className="absolute inset-0 bg-space-800 rounded-full border border-gray-700"></div>
                            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-neon-pink via-white to-neon-blue rounded-full opacity-30"></div>
                            <input
                                type="range"
                                min="1"
                                max={pallet.width - 1}
                                step="1"
                                value={splitIndex}
                                onChange={handleSplitChange}
                                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                            />
                            <div
                                className={`absolute h-8 w-8 rounded-full border-4 border-white shadow-lg transition-all transform -translate-x-1/2 flex items-center justify-center ${isTenSplit ? 'bg-yellow-400 scale-125' : 'bg-neon-pink'}`}
                                style={{ left: `${(splitIndex / pallet.width) * 100}%` }}
                            >
                                <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mt-4 font-black uppercase tracking-widest px-1">
                            <span>1 Unit</span>
                            <span className={isTenSplit ? 'text-yellow-400' : 'text-gray-400'}>Optimal Split (10)</span>
                            <span>{pallet.width - 1} Units</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-12 items-start justify-center w-full">

                        {/* PART A (PINK) */}
                        <div className="flex flex-col items-center gap-6 group">
                            <div className={`transition-all duration-500 rounded-2xl p-4 border-2 relative ${isPartACorrect ? 'border-neon-green shadow-neon-green bg-neon-green/5' : 'border-neon-pink/30 bg-neon-pink/5 hover:border-neon-pink'}`}>
                                <div className="absolute -top-3 -left-3 bg-neon-pink text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-lg">PART A</div>
                                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${colsA}, minmax(0, 1fr))`, gap: '0.25rem' }}>
                                    {Array.from({ length: valA }).map((_, i) => (
                                        <div key={i} className={`w-4 h-4 rounded-sm transition-all duration-700 ${isPartACorrect ? 'bg-neon-green' : 'bg-neon-pink opacity-80 shadow-[0_0_5px_rgba(236,72,153,0.3)]'}`}></div>
                                    ))}
                                </div>
                                <div className={`text-center mt-4 font-black text-lg ${isPartACorrect ? 'text-neon-green' : 'text-neon-pink'}`}>{colsA} × {pallet.depth}</div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={partA}
                                        onChange={(e) => setPartA(e.target.value)}
                                        className={`w-28 text-center text-3xl font-black bg-space-900 border-2 rounded-2xl py-4 pt-8 outline-none transition-all ${isPartACorrect ? 'border-neon-green text-neon-green shadow-neon-green' : 'border-gray-700 text-white focus:border-neon-pink'}`}
                                        placeholder="?"
                                        disabled={isPartACorrect}
                                    />
                                    <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-500 uppercase">Answer A</span>
                                    {isPartACorrect && <i className="ph-fill ph-check-circle text-neon-green absolute -right-3 -top-3 text-2xl bg-space-900 rounded-full"></i>}
                                </div>
                            </div>
                        </div>

                        {/* LASER LINE */}
                        <div className="hidden lg:flex flex-col items-center justify-center self-stretch py-4">
                            <div className={`w-0.5 flex-1 rounded-full transition-all duration-500 ${isTenSplit ? 'bg-yellow-400 shadow-[0_0_15px_#fbbf24]' : 'bg-white/20'}`}></div>
                            <div className={`my-4 transition-all duration-500 ${isTenSplit ? 'text-yellow-400 scale-150' : 'text-white/40'}`}>
                                <i className="ph-fill ph-scissors text-2xl"></i>
                            </div>
                            <div className={`w-0.5 flex-1 rounded-full transition-all duration-500 ${isTenSplit ? 'bg-yellow-400 shadow-[0_0_15px_#fbbf24]' : 'bg-white/20'}`}></div>
                        </div>

                        {/* PART B (BLUE) */}
                        <div className="flex flex-col items-center gap-6 group">
                            <div className={`transition-all duration-500 rounded-2xl p-4 border-2 relative ${isPartBCorrect ? 'border-neon-green shadow-neon-green bg-neon-green/5' : 'border-neon-blue/30 bg-neon-blue/5 hover:border-neon-blue'}`}>
                                <div className="absolute -top-3 -left-3 bg-neon-blue text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-lg">PART B</div>
                                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${colsB}, minmax(0, 1fr))`, gap: '0.25rem' }}>
                                    {Array.from({ length: valB }).map((_, i) => (
                                        <div key={i} className={`w-4 h-4 rounded-sm transition-all duration-700 ${isPartBCorrect ? 'bg-neon-green' : 'bg-neon-blue opacity-80 shadow-[0_0_5px_rgba(6,182,212,0.3)]'}`}></div>
                                    ))}
                                </div>
                                <div className={`text-center mt-4 font-black text-lg ${isPartBCorrect ? 'text-neon-green' : 'text-neon-blue'}`}>{colsB} × {pallet.depth}</div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={partB}
                                        onChange={(e) => setPartB(e.target.value)}
                                        className={`w-28 text-center text-3xl font-black bg-space-900 border-2 rounded-2xl py-4 pt-8 outline-none transition-all ${isPartBCorrect ? 'border-neon-green text-neon-green shadow-neon-green' : 'border-gray-700 text-white focus:border-neon-blue'}`}
                                        placeholder="?"
                                        disabled={isPartBCorrect}
                                    />
                                    <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-500 uppercase">Answer B</span>
                                    {isPartBCorrect && <i className="ph-fill ph-check-circle text-neon-green absolute -right-3 -top-3 text-2xl bg-space-900 rounded-full"></i>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ADDITION MODULE (CENTERED) */}
                <div className={`transition-all duration-1000 transform ${isAdditionReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}>
                    <div className="glass-panel rounded-[40px] p-10 border-2 border-gray-700 flex flex-col items-center relative shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-pink to-neon-blue"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <i className="ph-fill ph-plus-circle text-3xl text-gray-400"></i>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight text-center">
                                Final Step: Combine the Results!
                            </h3>
                        </div>

                        <div className="bg-space-900 p-10 rounded-[32px] border border-gray-800 shadow-2xl font-mono text-4xl relative max-w-sm w-full">

                            {/* Column Headers */}
                            <div className="flex justify-end gap-8 mb-6 text-[10px] font-sans text-gray-500 font-black border-b border-gray-800 pb-3 uppercase tracking-widest">
                                <div className="w-14 text-center">H</div>
                                <div className="w-14 text-center">T</div>
                                <div className="w-14 text-center">O</div>
                            </div>

                            {/* Carry Row */}
                            <div className="flex justify-end gap-8 mb-4 relative pr-4">
                                <div className="absolute left-[0rem] top-3 text-[10px] font-sans text-gray-600 uppercase font-black italic">Carry</div>
                                <div className="w-14 flex justify-center">
                                    <input
                                        type="number"
                                        value={carry}
                                        onChange={(e) => setCarry(e.target.value.slice(-1))}
                                        className="w-12 h-12 text-center text-xl font-bold bg-transparent border-2 border-dashed border-gray-600 rounded-xl text-neon-orange focus:border-neon-orange outline-none transition-all"
                                        placeholder="+"
                                    />
                                </div>
                                <div className="w-14"></div>
                                <div className="w-14"></div>
                            </div>

                            {/* Row 1 (Part A) */}
                            <div className="flex justify-end gap-8 mb-3 text-neon-pink font-black pr-4 opacity-90">
                                <div className="w-14 text-center">{valA >= 100 ? valA.toString().slice(-3, -2) : ''}</div>
                                <div className="w-14 text-center">{valA >= 10 ? valA.toString().slice(-2, -1) : ''}</div>
                                <div className="w-14 text-center">{valA.toString().slice(-1)}</div>
                            </div>

                            {/* Row 2 (Part B) */}
                            <div className="flex items-center justify-end gap-8 mb-6 text-neon-blue font-black relative pr-4 opacity-90">
                                <div className="absolute left-[0rem] text-gray-600 font-light">+</div>
                                <div className="w-14 text-center">{valB >= 100 ? valB.toString().slice(-3, -2) : ''}</div>
                                <div className="w-14 text-center">{valB >= 10 ? valB.toString().slice(-2, -1) : ''}</div>
                                <div className="w-14 text-center">{valB.toString().slice(-1)}</div>
                            </div>

                            {/* Divider */}
                            <div className="h-1.5 w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-full mb-8"></div>

                            {/* Sum Row */}
                            <div className="flex justify-end gap-8 pr-4">
                                <input
                                    type="number"
                                    value={sumHundreds}
                                    onChange={(e) => setSumHundreds(e.target.value.slice(-1))}
                                    className={`w-14 h-20 text-center text-5xl font-black rounded-2xl outline-none transition-all ${isFullyCorrect ? 'bg-neon-green text-space-900 border-none scale-110 shadow-neon-green' : 'bg-space-800 text-white border-2 border-gray-700 focus:border-white focus:bg-space-700'}`}
                                    placeholder="?"
                                />
                                <input
                                    type="number"
                                    value={sumTens}
                                    onChange={(e) => setSumTens(e.target.value.slice(-1))}
                                    className={`w-14 h-20 text-center text-5xl font-black rounded-2xl outline-none transition-all ${isFullyCorrect ? 'bg-neon-green text-space-900 border-none scale-110 shadow-neon-green' : 'bg-space-800 text-white border-2 border-gray-700 focus:border-white focus:bg-space-700'}`}
                                    placeholder="?"
                                />
                                <input
                                    type="number"
                                    value={sumOnes}
                                    onChange={(e) => setSumOnes(e.target.value.slice(-1))}
                                    className={`w-14 h-20 text-center text-5xl font-black rounded-2xl outline-none transition-all ${isFullyCorrect ? 'bg-neon-green text-space-900 border-none scale-110 shadow-neon-green' : 'bg-space-800 text-white border-2 border-gray-700 focus:border-white focus:bg-space-700'}`}
                                    placeholder="?"
                                />
                            </div>

                            {/* Success Blast */}
                            {isFullyCorrect && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                                    <div className="text-9xl animate-sticker-pop">✨</div>
                                </div>
                            )}
                        </div>

                        {/* MASCOT QUOTE (INTEGRATED) */}
                        <div className="mt-12 flex items-center gap-6 bg-space-800 p-6 rounded-[32px] border border-gray-700 max-w-lg">
                            <div className="text-5xl shrink-0">🥷</div>
                            <div>
                                <p className="text-sm text-gray-300 font-bold italic leading-relaxed">
                                    {isFullyCorrect
                                        ? "\"Perfectly executed! You just turned a hard problem into two easy ones.\""
                                        : (isAdditionReady
                                            ? "\"Now add them together. You're almost there, Ninja!\""
                                            : (isTenSplit
                                                ? "\"Excellent choice! Splitting at 10 is the ultimate math tactic.\""
                                                : "\"That works! But have you tried splitting at 10? It's even faster!\""))}
                                </p>
                            </div>
                        </div>

                        {/* FINAL NAVIGATION (APPEARS ON SUCCESS) */}
                        <div className={`mt-10 flex gap-4 w-full max-w-md transition-all duration-700 ${isFullyCorrect ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                            <button onClick={nextMission} className="flex-1 bg-neon-orange hover:bg-[#ff7b4f] text-white font-black py-5 rounded-2xl transition-all transform hover:scale-105 shadow-neon-orange uppercase tracking-widest text-lg">
                                Next Discovery!
                            </button>
                            <a href="../index.html" className="px-8 bg-space-800 hover:bg-space-700 text-gray-400 border border-gray-700 font-bold py-5 rounded-2xl transition-all flex items-center gap-2">
                                <i className="ph-bold ph-door-open"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* FOOTER NAVIGATION (WHEN NOT SUCCESSFUL) */}
                {!isFullyCorrect && (
                    <div className="flex justify-center gap-8 py-8 opacity-50 hover:opacity-100 transition-opacity">
                        <a href="../index.html" className="flex items-center gap-2 text-gray-400 font-bold hover:text-white transition-colors uppercase tracking-widest text-xs">
                            <i className="ph-bold ph-arrow-left"></i> Return to Hangar
                        </a>
                        <button onClick={nextMission} className="flex items-center gap-2 text-gray-400 font-bold hover:text-white transition-colors uppercase tracking-widest text-xs">
                            <i className="ph-bold ph-arrows-clockwise"></i> New Mission
                        </button>
                    </div>
                )}
            </main>

            {/* RARE BADGE MODAL */}
            {showRare && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-8">
                    <div className="max-w-md w-full text-center">
                        <div className="text-[12rem] mb-8 drop-shadow-[0_0_30px_white]">{rareInfo.emoji}</div>
                        <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">RARE BADGE FOUND!</h2>
                        <p className="text-2xl text-neon-blue font-bold mb-12 uppercase tracking-widest">{rareInfo.name}</p>
                        <button onClick={() => setShowRare(false)} className="bg-white text-black font-black py-4 px-12 rounded-xl hover:scale-105 transition-transform uppercase tracking-widest leading-none">Incredible! ✨</button>
                    </div>
                </div>
            )}

            {/* Reward Pop Animation */}
            {flashEmoji && (
                <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[110] animate-sticker-pop">
                    <div className="text-[20rem]">{flashEmoji}</div>
                </div>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
