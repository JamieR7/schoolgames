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
    const depth = Math.floor(Math.random() * 10) + 1;  // 1 to 10
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

    const strA = valA.toString().padStart(Math.max(valA.toString().length, 2), ' ');
    const strB = valB.toString().padStart(Math.max(valB.toString().length, 2), ' ');

    return (
        <div className="min-h-screen flex flex-col font-sans">
            {/* --- HEADER --- */}
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-panel">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-pink flex items-center justify-center shadow-neon-blue">
                        <i className="ph-fill ph-planet text-2xl text-white"></i>
                    </div>
                    <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        ANTIGRAVITY <span className="text-neon-blue">MATH</span>
                    </h1>
                </div>

                <nav className="hidden md:flex gap-8">
                    <a href="../index.html" className="font-bold text-gray-400 hover:text-white transition-colors">My Games</a>
                    <a href="#" className="font-bold text-gray-400 hover:text-white transition-colors">Challenges</a>
                    <a href="#" className="font-bold text-gray-400 hover:text-white transition-colors">Store</a>
                    <a href="#" className="font-bold text-gray-400 hover:text-white transition-colors">Progress</a>
                </nav>

                <div className="flex items-center gap-4 bg-space-800 rounded-full py-1 pr-4 pl-1 border border-gray-600">
                    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Archie&backgroundColor=1F2833" alt="Avatar" className="w-9 h-9 rounded-full bg-space-900 border border-neon-green" />
                    <span className="font-bold text-sm text-gray-200">Archie Ninja</span>
                    <i className="ph-bold ph-caret-down text-gray-400"></i>
                </div>
            </header>

            {/* --- MAIN LAYOUT --- */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">

                {/* LEFT COLUMN: GAME AREA */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Mission Title */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-neon-orange bg-opacity-20 rounded-xl text-neon-orange">
                            <i className="ph-fill ph-sword text-3xl"></i>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white shadow-sm">{pallet.width} × {pallet.depth} = ?</h2>
                            <p className="text-gray-400 font-semibold italic text-sm uppercase tracking-widest">Operation: Cargo Slicer</p>
                        </div>
                    </div>

                    {/* Crate Slicer Visualization */}
                    <div className="glass-panel p-8 rounded-3xl relative overflow-hidden flex flex-col items-center">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-pink to-neon-blue"></div>

                        {/* SLIDER CONTROL */}
                        <div className="w-full max-w-lg mb-8 bg-space-800 p-4 rounded-xl border border-gray-600 shadow-panel">
                            <label className="block text-neon-orange font-bold mb-3 text-center flex justify-center items-center gap-2">
                                <i className="ph-fill ph-sliders"></i> Drag the laser to choose your cut!
                            </label>
                            <input
                                type="range"
                                min="1"
                                max={pallet.width - 1}
                                step="1"
                                value={splitIndex}
                                onChange={handleSplitChange}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-pink"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-2 font-bold px-1">
                                <span>1</span>
                                <span className="text-white bg-space-900 px-3 py-1 rounded-full border border-gray-600">Cut at: {splitIndex}</span>
                                <span>{pallet.width - 1}</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full">

                            {/* PART A */}
                            <div className="flex flex-col items-center gap-4">
                                <div className={`transition-all duration-500 rounded-xl p-2 border-2 ${isPartACorrect ? 'border-neon-green shadow-neon-green' : 'border-neon-pink bg-neon-pink/5'}`}>
                                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${colsA}, minmax(0, 1fr))`, gap: '0.25rem' }}>
                                        {Array.from({ length: valA }).map((_, i) => (
                                            <div key={i} className={`w-4 h-4 md:w-5 md:h-5 rounded-sm transition-all ${isPartACorrect ? 'bg-neon-green' : 'bg-neon-pink opacity-80'}`}></div>
                                        ))}
                                    </div>
                                    <div className={`text-center mt-2 font-bold ${isPartACorrect ? 'text-neon-green' : 'text-neon-pink'}`}>{colsA} × {pallet.depth}</div>
                                </div>

                                <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 border border-gray-600">
                                    <span className="text-xl font-bold text-gray-300">{colsA} × {pallet.depth} =</span>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={partA}
                                            onChange={(e) => setPartA(e.target.value)}
                                            className={`w-20 text-center text-2xl font-black bg-space-900 border-2 rounded-xl py-2 outline-none transition-colors ${isPartACorrect ? 'border-neon-green text-neon-green' : 'border-neon-pink text-white focus:border-white'}`}
                                            placeholder="?"
                                            disabled={isPartACorrect}
                                        />
                                        {isPartACorrect && <i className="ph-fill ph-check-circle text-neon-green absolute -right-3 -top-3 text-xl bg-space-900 rounded-full"></i>}
                                    </div>
                                </div>
                            </div>

                            {/* Slicer Laser Line */}
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="w-1 h-24 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                                <i className="ph-fill ph-scissors text-2xl text-white my-2"></i>
                                <div className="w-1 h-24 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                            </div>

                            {/* PART B */}
                            <div className="flex flex-col items-center gap-4">
                                <div className={`transition-all duration-500 rounded-xl p-2 border-2 ${isPartBCorrect ? 'border-neon-green shadow-neon-green' : 'border-neon-blue bg-neon-blue/5'}`}>
                                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${colsB}, minmax(0, 1fr))`, gap: '0.25rem' }}>
                                        {Array.from({ length: valB }).map((_, i) => (
                                            <div key={i} className={`w-4 h-4 md:w-5 md:h-5 rounded-sm transition-all ${isPartBCorrect ? 'bg-neon-green' : 'bg-neon-blue opacity-80'}`}></div>
                                        ))}
                                    </div>
                                    <div className={`text-center mt-2 font-bold ${isPartBCorrect ? 'text-neon-green' : 'text-neon-blue'}`}>{colsB} × {pallet.depth}</div>
                                </div>

                                <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 border border-gray-600">
                                    <span className="text-xl font-bold text-gray-300">{colsB} × {pallet.depth} =</span>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={partB}
                                            onChange={(e) => setPartB(e.target.value)}
                                            className={`w-20 text-center text-2xl font-black bg-space-900 border-2 rounded-xl py-2 outline-none transition-colors ${isPartBCorrect ? 'border-neon-green text-neon-green' : 'border-neon-blue text-white focus:border-white'}`}
                                            placeholder="?"
                                            disabled={isPartBCorrect}
                                        />
                                        {isPartBCorrect && <i className="ph-fill ph-check-circle text-neon-green absolute -right-3 -top-3 text-xl bg-space-900 rounded-full"></i>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Addition Module (Appears when parts are calculated) */}
                    <div className={`transition-all duration-1000 transform ${isAdditionReady ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
                        <div className="glass-panel rounded-3xl p-8 border-2 border-gray-600 flex flex-col items-center relative overflow-hidden">
                            {isFullyCorrect && <div className="absolute inset-0 bg-neon-green opacity-10 animate-pulse"></div>}

                            <h3 className="text-2xl font-black mb-6 text-white text-center">
                                Final Step: Add the cargo together!
                            </h3>

                            <div className="bg-space-900 p-8 rounded-2xl border border-gray-700 shadow-panel font-mono text-3xl relative">

                                {/* Column Headers */}
                                <div className="flex justify-end gap-6 mb-4 text-[10px] font-sans text-gray-500 font-black border-b border-gray-700 pb-2">
                                    <div className="w-12 text-center tracking-tighter text-neon-orange uppercase">Hundreds</div>
                                    <div className="w-12 text-center tracking-tighter text-neon-orange uppercase">Tens</div>
                                    <div className="w-12 text-center tracking-tighter text-neon-orange uppercase">Ones</div>
                                </div>

                                {/* Carry Row */}
                                <div className="flex justify-end gap-6 mb-2 relative pr-4">
                                    <div className="absolute left-[-2rem] top-2 text-[10px] font-sans text-gray-400 uppercase font-black">Carry</div>
                                    <div className="w-12 flex justify-center">
                                        <input
                                            type="number"
                                            value={carry}
                                            onChange={(e) => setCarry(e.target.value.slice(-1))}
                                            className="w-10 h-10 text-center text-lg font-bold bg-transparent border-2 border-dashed border-gray-500 rounded text-neon-orange focus:border-neon-orange outline-none"
                                            placeholder="+"
                                        />
                                    </div>
                                    <div className="w-12"></div>
                                    <div className="w-12"></div>
                                </div>

                                {/* Row 1 (Part A) */}
                                <div className="flex justify-end gap-6 mb-2 text-neon-pink font-bold pr-4">
                                    <div className="w-12 text-center">{valA >= 100 ? valA.toString().slice(-3, -2) : ''}</div>
                                    <div className="w-12 text-center">{valA >= 10 ? valA.toString().slice(-2, -1) : ''}</div>
                                    <div className="w-12 text-center">{valA.toString().slice(-1)}</div>
                                </div>

                                {/* Row 2 (Part B) */}
                                <div className="flex items-center justify-end gap-6 mb-4 text-neon-blue font-bold relative pr-4">
                                    <div className="absolute left-[-2rem] text-white opacity-40 font-black">+</div>
                                    <div className="w-12 text-center">{valB >= 100 ? valB.toString().slice(-3, -2) : ''}</div>
                                    <div className="w-12 text-center">{valB >= 10 ? valB.toString().slice(-2, -1) : ''}</div>
                                    <div className="w-12 text-center">{valB.toString().slice(-1)}</div>
                                </div>

                                {/* Divider */}
                                <div className="h-1 w-full bg-gray-600/50 rounded-full mb-4"></div>

                                {/* Sum Row (Inputs) */}
                                <div className="flex justify-end gap-6 pr-4">
                                    <input
                                        type="number"
                                        value={sumHundreds}
                                        onChange={(e) => setSumHundreds(e.target.value.slice(-1))}
                                        className={`w-12 h-14 text-center text-3xl font-black rounded-xl outline-none transition-all ${isFullyCorrect ? 'bg-neon-green text-space-900 border-none shadow-neon-green' : 'bg-space-800 text-white border-2 border-gray-600 focus:border-white focus:bg-space-700'}`}
                                        placeholder="?"
                                    />
                                    <input
                                        type="number"
                                        value={sumTens}
                                        onChange={(e) => setSumTens(e.target.value.slice(-1))}
                                        className={`w-12 h-14 text-center text-3xl font-black rounded-xl outline-none transition-all ${isFullyCorrect ? 'bg-neon-green text-space-900 border-none shadow-neon-green' : 'bg-space-800 text-white border-2 border-gray-600 focus:border-white focus:bg-space-700'}`}
                                        placeholder="?"
                                    />
                                    <input
                                        type="number"
                                        value={sumOnes}
                                        onChange={(e) => setSumOnes(e.target.value.slice(-1))}
                                        className={`w-12 h-14 text-center text-3xl font-black rounded-xl outline-none transition-all ${isFullyCorrect ? 'bg-neon-green text-space-900 border-none shadow-neon-green' : 'bg-space-800 text-white border-2 border-gray-600 focus:border-white focus:bg-space-700'}`}
                                        placeholder="?"
                                    />
                                </div>

                                {/* Success Message overlay */}
                                {isFullyCorrect && (
                                    <div className="absolute -right-24 top-1/2 transform -translate-y-1/2 flex flex-col items-center animate-bounce z-10">
                                        <i className="ph-fill ph-star text-5xl text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]"></i>
                                        <span className="font-bold text-yellow-400 font-sans mt-2">Awesome!</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: DASHBOARD & CARD */}
                <div className="space-y-6">

                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <i className="ph-fill ph-monitor"></i> Archie's Dashboard
                    </h2>

                    {/* The Landing Page Card */}
                    <div className="bg-gradient-to-b from-space-800 to-space-900 rounded-3xl p-1 shadow-panel border border-neon-green shadow-neon-green relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green opacity-10 rounded-full blur-3xl group-hover:opacity-30 transition-opacity"></div>

                        <div className="bg-space-900 rounded-[22px] p-6 h-full relative z-10 flex flex-col items-center text-center">

                            {/* Rare Badge Preview */}
                            <div className="flex gap-2 mb-4">
                                {rareOwned.slice(-3).map((s, i) => <span key={i} className="text-2xl animate-pulse">{s}</span>)}
                            </div>

                            {/* Illustration/Icon */}
                            <div className="w-24 h-24 mb-4 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-neon-pink to-neon-blue rounded-2xl animate-spin" style={{ animationDuration: '10s' }}></div>
                                <div className="absolute inset-1 bg-space-900 rounded-xl flex items-center justify-center">
                                    <i className="ph-duotone ph-alien text-5xl text-white"></i>
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-white mb-2 leading-tight">
                                Galactic Cargo Master
                            </h3>
                            <div className="flex flex-wrap justify-center gap-1 mb-6">
                                {badges.slice(-8).map((b, i) => <span key={i} className="text-xl">{b}</span>)}
                            </div>

                            <button onClick={nextMission} className="w-full bg-neon-orange hover:bg-[#ff7b4f] text-white font-black py-4 rounded-xl transition-all transform hover:scale-105 shadow-neon-orange mb-3 uppercase tracking-tighter">
                                NEXT MISSION!
                            </button>

                            <a href="../index.html" className="w-full bg-space-800 hover:bg-space-700 text-gray-300 border border-gray-600 font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2">
                                <i className="ph-bold ph-arrow-left"></i> Return to Hangar
                            </a>
                        </div>
                    </div>

                    {/* Progress Bar & Mascot */}
                    <div className="glass-panel p-6 rounded-3xl border border-gray-700">
                        <div className="flex justify-between items-end mb-2">
                            <span className="font-bold text-gray-300 text-sm">Mission Progress</span>
                            <span className="font-black text-neon-blue text-xl">{badges.length * 10}%</span>
                        </div>
                        <div className="w-full bg-space-900 rounded-full h-3 mb-6 overflow-hidden">
                            <div className="bg-gradient-to-r from-neon-blue to-neon-pink h-3 rounded-full transition-all duration-1000" style={{ width: `${Math.min(badges.length * 10, 100)}%` }}></div>
                        </div>

                        <div className="flex items-center gap-4 bg-space-800 p-4 rounded-2xl">
                            <div className="text-4xl text-white">🥷</div>
                            <div>
                                <p className="text-xs text-gray-300 font-bold italic leading-relaxed">
                                    {isFullyCorrect
                                        ? "\"Mission accomplished! You're a math ninja!\""
                                        : (isAdditionReady
                                            ? "\"Now add them up to find the total!\""
                                            : "\"Use the laser to split the numbers into easier ones!\"")}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* Rare Badge Modal */}
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
