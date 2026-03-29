const { useState, useEffect, useRef } = React;

const GRID_SIZE = 6;
const ITEMS = [
    { id: 'star', emoji: '🔯', name: 'Ninja Star' },
    { id: 'sword', emoji: '⚔️', name: 'Sword' },
    { id: 'suit', emoji: '🥋', name: 'Ninja Suit' },
    { id: 'belt', emoji: '🎗️', name: 'Ninja Belt' },
    { id: 'water', emoji: '🚰', name: 'Drink of Water' },
    { id: 'snack', emoji: '🍓', name: 'Fruit Snack' }
];

const RARE_STICKERS = [
    { emoji: '💎', name: 'Diamond' }, { emoji: '👑', name: 'Crown' },
    { emoji: '🐉', name: 'Dragon' }, { emoji: '🌈', name: 'Rainbow' }, { emoji: '🔮', name: 'Crystal Ball' },
    { emoji: '🍀', name: 'Lucky Clover' }, { emoji: '🦅', name: 'Eagle' }, { emoji: '🎆', name: 'Fireworks' },
    { emoji: '⚡', name: 'Lightning Bolt' }, { emoji: '🌙', name: 'Golden Moon' }, { emoji: '🎭', name: 'Magic Mask' },
    { emoji: '🐋', name: 'Blue Whale' }, { emoji: '🌋', name: 'Volcano' },
];

const DIRECTIONS = [
    { x: 0, y: -1, icon: '⬆️' }, // 0: Up
    { x: 1, y: 0, icon: '➡️' },  // 1: Right
    { x: 0, y: 1, icon: '⬇️' },  // 2: Down
    { x: -1, y: 0, icon: '⬅️' }  // 3: Left
];

function App() {
    const [level, setLevel] = useState(1);
    const [archie, setArchie] = useState({ x: 0, y: 0, dir: 1 }); // Start at 0,0 facing Right
    const [startPos, setStartPos] = useState({ x: 0, y: 0, dir: 1 });
    const [exit, setExit] = useState({ x: 5, y: 5 });
    const [gridItems, setGridItems] = useState([]);
    const [collected, setCollected] = useState([]);
    const [commands, setCommands] = useState([]);
    const [status, setStatus] = useState('planning'); // planning, running, success, failure, reward
    const [executingIdx, setExecutingIdx] = useState(-1);
    const [message, setMessage] = useState("Help Archie collect his gear!");
    const [collection, setCollection] = useState(() => JSON.parse(sessionStorage.getItem('stickers_ninja-path') || '[]'));
    const [rareOwned, setRareOwned] = useState(() => JSON.parse(sessionStorage.getItem('stickers_rare') || '[]'));
    const [flashEmoji, setFlashEmoji] = useState(null);
    const [showRare, setShowRare] = useState(false);
    const [rareInfo, setRareInfo] = useState(null);

    useEffect(() => {
        generateLevel(1);
    }, []);

    useEffect(() => {
        sessionStorage.setItem('stickers_ninja-path', JSON.stringify(collection));
    }, [collection]);

    useEffect(() => {
        sessionStorage.setItem('stickers_rare', JSON.stringify(rareOwned));
    }, [rareOwned]);

    const generateLevel = (lvl) => {
        // Entry point can vary (edges)
        const entries = [
            { x: 0, y: 0, dir: 1 },
            { x: 0, y: 5, dir: 0 },
            { x: 5, y: 0, dir: 2 },
            { x: 0, y: 2, dir: 1 }
        ];
        const entry = entries[Math.floor(Math.random() * entries.length)];
        setArchie(entry);
        setStartPos(entry);

        // Exit point is opposite corner or far edge
        const exitX = entry.x === 0 ? 5 : 0;
        const exitY = entry.y === 0 ? 5 : 0;
        setExit({ x: exitX, y: exitY });

        // Place items randomly (excluding entry/exit)
        const newItems = [];
        const usedPos = new Set([`${entry.x},${entry.y}`, `${exitX},${exitY}`]);

        // Pick 3-5 items based on level
        const count = Math.min(ITEMS.length, 3 + Math.floor(lvl / 3));
        const pool = [...ITEMS].sort(() => Math.random() - 0.5).slice(0, count);

        pool.forEach(item => {
            let x, y;
            do {
                x = Math.floor(Math.random() * GRID_SIZE);
                y = Math.floor(Math.random() * GRID_SIZE);
            } while (usedPos.has(`${x},${y}`));
            usedPos.add(`${x},${y}`);
            newItems.push({ ...item, x, y });
        });

        setGridItems(newItems);
        setCollected([]);
        setCommands([]);
        setStatus('planning');
        setExecutingIdx(-1);
        setMessage("Plan Archie's path to the exit!");
    };

    const addCommand = (type, val) => {
        if (status !== 'planning') return;
        setCommands([...commands, { type, val }]);
    };

    const removeCommand = (idx) => {
        if (status !== 'planning') return;
        setCommands(commands.filter((_, i) => i !== idx));
    };

    const runPath = async () => {
        if (status !== 'planning' || commands.length === 0) return;
        setStatus('running');
        let currentPos = { ...archie };
        let currentCollected = [];

        for (let i = 0; i < commands.length; i++) {
            setExecutingIdx(i);
            const cmd = commands[i];

            if (cmd.type === 'move') {
                for (let step = 0; step < cmd.val; step++) {
                    const nextX = currentPos.x + DIRECTIONS[currentPos.dir].x;
                    const nextY = currentPos.y + DIRECTIONS[currentPos.dir].y;

                    if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
                        setStatus('failure');
                        setMessage("Oops! Archie hit a wall! 🧱");
                        return;
                    }

                    currentPos = { ...currentPos, x: nextX, y: nextY };
                    setArchie(currentPos);

                    // Check for item pickup
                    const itemIdx = gridItems.findIndex(it => it.x === currentPos.x && it.y === currentPos.y && !currentCollected.includes(it.id));
                    if (itemIdx !== -1) {
                        const item = gridItems[itemIdx];
                        currentCollected = [...currentCollected, item.id];
                        setCollected(v => [...v, item.id]);
                        showStickerFlash(item.emoji);
                        if (!collection.includes(item.emoji)) {
                            setCollection(prev => [...prev, item.emoji]);
                        }
                    }
                    await new Promise(r => setTimeout(r, 400));
                }
            } else if (cmd.type === 'turn') {
                const turnMap = { 'left': -1, 'right': 1 };
                let nextDir = (currentPos.dir + turnMap[cmd.val]) % 4;
                if (nextDir < 0) nextDir += 4;
                currentPos = { ...currentPos, dir: nextDir };
                setArchie(currentPos);
                await new Promise(r => setTimeout(r, 400));
            }
        }

        // Finish execution
        if (currentPos.x === exit.x && currentPos.y === exit.y) {
            if (currentCollected.length === gridItems.length) {
                setStatus('success');
                setMessage("Incredible! All items collected! 🏆");
                handleWin();
            } else {
                setStatus('failure');
                setMessage("Wait! Archie forgot some gear! 🎒");
            }
        } else {
            setStatus('failure');
            setMessage("Archie didn't reach the exit! 🏁");
        }
    };

    const handleWin = () => {
        // Guaranteed rare sticker for this game as requested
        const rareOwnedList = JSON.parse(sessionStorage.getItem('stickers_rare') || '[]');
        const available = RARE_STICKERS.filter(s => !rareOwnedList.includes(s.emoji));

        if (available.length > 0) {
            const r = available[Math.floor(Math.random() * available.length)];
            setRareInfo(r);
            const newList = [...rareOwnedList, r.emoji];
            setRareOwned(newList);
            sessionStorage.setItem('stickers_rare', JSON.stringify(newList));
            setTimeout(() => {
                setShowRare(true);
                playRareFanfare();
            }, 1000);
        }
        setTimeout(() => setStatus('reward'), 2000);
    };

    const showStickerFlash = (emoji) => {
        setFlashEmoji(emoji);
        setTimeout(() => setFlashEmoji(null), 1500);
    };

    const playRareFanfare = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator(); const gain = ctx.createGain();
                osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now + i * 0.1);
                gain.gain.setValueAtTime(0.2, now + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.1) + 0.3);
                osc.connect(gain); gain.connect(ctx.destination);
                osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.3);
            });
        } catch (e) { }
    };

    const reset = () => {
        setArchie(startPos);
        setCollected([]);
        setStatus('planning');
        setMessage("Try again! Plan the path carefully.");
    };

    const nextLevel = () => {
        setLevel(l => l + 1);
        generateLevel(level + 1);
    };

    return (
        <div className="w-full max-w-4xl font-montserrat text-white">
            <header className="w-full bg-dojo-card border-4 border-dojo-border rounded-3xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black text-dojo-green uppercase tracking-tight">Ninja Path ⚔️</h1>
                    <div className="flex gap-1 mt-2 text-2xl">
                        {[...collection.slice(-5), ...rareOwned.slice(-3)].map((s, i) => <span key={i}>{s}</span>)}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="bg-dojo-bg border-2 border-dojo-border rounded-full px-4 py-2 font-bold text-dojo-gold">Level {level}</div>
                    <div className="bg-dojo-bg border-2 border-dojo-border rounded-full px-4 py-2 font-bold text-dojo-green">Gear: {collected.length}/{gridItems.length}</div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Dojo Grid */}
                <div className="ninja-card rounded-3xl p-4 overflow-hidden">
                    <div className="grid grid-cols-6 gap-1 bg-dojo-border p-1 rounded-xl">
                        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                            const x = i % GRID_SIZE;
                            const y = Math.floor(i / GRID_SIZE);
                            const isArchie = archie.x === x && archie.y === y;
                            const isExit = exit.x === x && exit.y === y;
                            const item = gridItems.find(it => it.x === x && it.y === y && !collected.includes(it.id));
                            const isEntry = startPos.x === x && startPos.y === y;

                            return (
                                <div key={i} className={`grid-cell rounded-lg transition-all duration-300 ${isEntry ? 'entry' : ''} ${isExit ? 'exit' : ''}`}>
                                    {isArchie ? (
                                        <div className="relative transform transition-transform duration-300 flex items-center justify-center" style={{ transform: `rotate(${(archie.dir - 1) * 90}deg)` }}>
                                            <div className="absolute -top-4 text-sm animate-bounce text-dojo-accent">▲</div>
                                            <span className="text-3xl">🥷</span>
                                        </div>
                                    ) : item ? (
                                        <div className="animate-pulse">{item.emoji}</div>
                                    ) : isExit ? (
                                        <div className="text-2xl">⛩️</div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4 p-4 bg-dojo-bg rounded-xl border-2 border-dojo-border text-center font-bold text-lg italic">
                        "{message}"
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-6">
                    <div className="ninja-card rounded-3xl p-6">
                        <h3 className="text-xl font-black mb-4 uppercase text-dojo-gold flex items-center gap-2">
                            Command Center 🏯
                        </h3>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button onClick={() => addCommand('move', 1)} className="command-btn bg-gray-700 p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-600">
                                <span>Forward 1</span> {DIRECTIONS[archie.dir].icon}
                            </button>
                            <button onClick={() => addCommand('move', 2)} className="command-btn bg-gray-700 p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-600">
                                <span>Forward 2</span> {DIRECTIONS[archie.dir].icon}
                            </button>
                            <button onClick={() => addCommand('turn', 'left')} className="command-btn bg-dojo-accent p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-500">
                                <span>Turn Left</span> ↩️
                            </button>
                            <button onClick={() => addCommand('turn', 'right')} className="command-btn bg-dojo-green p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-500">
                                <span>Turn Right</span> ↪️
                            </button>
                        </div>

                        <div className="bg-dojo-bg rounded-2xl p-4 min-h-[200px] border-2 border-dojo-border">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-400 font-bold uppercase text-xs">Path Sequence</span>
                                <button onClick={() => setCommands([])} className="text-xs font-bold text-dojo-accent uppercase">Clear All</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {commands.map((cmd, i) => (
                                    <div key={i} className={`flex items-center gap-1 p-2 rounded-lg font-bold text-sm border-2 transition-all ${executingIdx === i ? 'bg-dojo-gold text-dojo-bg border-white scale-110' : 'bg-dojo-card border-dojo-border'}`}>
                                        {cmd.type === 'move' ? `Move ${cmd.val}` : `Turn ${cmd.val}`}
                                        <button onClick={() => removeCommand(i)} className="ml-1 text-gray-500 hover:text-white">✕</button>
                                    </div>
                                ))}
                                {commands.length === 0 && <div className="text-gray-500 italic text-sm">Add commands to build Archie's path...</div>}
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            {status === 'planning' ? (
                                <button onClick={runPath} disabled={commands.length === 0} className={`flex-1 p-4 rounded-full font-black text-xl uppercase tracking-wider transition-all ${commands.length === 0 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-dojo-gold text-dojo-bg shadow-[0_6px_0_#b45309] active:translate-y-1 active:shadow-none'}`}>
                                    Execute Path! 🥷
                                </button>
                            ) : (
                                <button onClick={reset} className="flex-1 p-4 rounded-full font-black text-xl uppercase tracking-wider bg-dojo-accent text-white shadow-[0_6px_0_#991b1b] active:translate-y-1 active:shadow-none">
                                    Reset Position 🔄
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Reward Screen */}
            {status === 'reward' && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-dojo-green bg-opacity-95 z-[2000] backdrop-blur-lg animate-in fade-in duration-500">
                    <div className="text-8xl mb-4">🏆</div>
                    <h2 className="text-6xl font-black mb-2 uppercase italic">Success!</h2>
                    <p className="text-2xl font-bold opacity-80 mb-8">Archie is back in the dojo!</p>
                    <div className="text-9xl mb-12 animate-bounce">🥷</div>
                    <button onClick={nextLevel} className="bg-white text-dojo-green px-12 py-4 rounded-full font-black text-2xl uppercase shadow-[0_8px_0_#d1d5db] active:translate-y-1 active:shadow-none transition-all">
                        Next Mission 🚀
                    </button>
                </div>
            )}

            {/* Rare Sticker Modal */}
            {showRare && rareInfo && (
                <div className="rare-banner show">
                    <div className="rare-inner">
                        <div className="text-9xl mb-4">{rareInfo.emoji}</div>
                        <h2 className="text-3xl font-black mb-2 uppercase">Rare Item Found!</h2>
                        <p className="text-xl font-bold opacity-90 mb-8">{rareInfo.name}</p>
                        <button onClick={() => setShowRare(false)} className="bg-white text-dojo-gold px-8 py-3 rounded-full font-black uppercase shadow-[0_6px_0_#d97706] active:translate-y-1 active:shadow-none">
                            Awesome! ✨
                        </button>
                    </div>
                </div>
            )}

            {/* Item Flash */}
            {flashEmoji && (
                <div id="sticker-flash-overlay" className="animate-sticker-pop">
                    {flashEmoji}
                </div>
            )}
        </div>
    );
}

window.App = App;
