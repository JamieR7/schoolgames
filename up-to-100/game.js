const { useState, useEffect, useRef } = React;

const THEMES = [
  { name: 'Real Madrid', emoji: '🏆', stickers: ['⚽', '🏟️', '🥅', '👟', '🏆', '🧤', '🥇', '📣', '🎽', '🧣', '🎖️', '🔵', '⬜', '🌟', '🎯'], congrats: ["GOOOAL! Top bins, Archie! ⚽", "Hala Madrid! What a strike! 🥅", "Bellingham would be proud! 🏆", "You scored a hat-trick with that math! 🎩"] },
  { name: 'Beyblade', emoji: '🌪️', stickers: ['🌪️', '💥', '🌀', '⚙️', '🔧', '🔥', '⚡', '💫', '🛸', '🎯', '💿', '🔩', '🎪', '🎰', '🌀'], congrats: ["Let it RIP! Perfect answer! 🌪️", "Hypervitesse! Réponse parfaite! 🌪️", "That math was spinning out of control! 🌀", "Burst finish! You crushed it! 💥"] },
  { name: 'Bruno', emoji: '🐶', stickers: ['🐶', '🦴', '🎾', '🐾', '🐕', '🥩', '🦮', '🥎', '🚿', '🐕‍🦺', '🌿', '🏡', '🎀'], congrats: ["Woof! Bruno gives you a high paw! 🐾", "Ouaf! Bruno te donne la patte! 🐾", "Bruno is fetching you a gold star! 🎾", "Bark bark! That means 'Great Job!' 🐶"] },
  { name: 'Judo Master', emoji: '🥋', stickers: ['🥋', '💪', '🥇', '🤸', '⛩️', '🇯🇵', '🧘', '🏆', '💯', '🎖️', '🏯', '🌸', '🥁'], congrats: ["Ippon! Perfect throw! 🥋", "Ippon! Prise parfaite! 🥋", "You pinned that question down! 💪", "Black belt level math skills! 🥋"] },
  { name: 'Agent P', emoji: '🦆', stickers: ['🦆', '🎩', '🎸', '🛠️', '🧪', '🎢', '📻', '🗺️', '⚙️', '🔩', '🔬', '🧲', '📡', '🎬', '🛩️'], congrats: ["Ferb, I know what we're going to do today! MATH! 🎸", "Curse you, tricky math problem! 🦆", "Perry the Platypus approves! 🎩", "Dr. Doofenshmirtz is defeated! 💥"] },
  { name: 'Space', emoji: '🚀', stickers: ['🚀', '🌍', '🌙', '⭐', '🛸', '☄️', '🪐', '👨‍🚀', '🌠', '🔭', '🛰️', '💫', '🌌', '🌟'], congrats: ["You unlocked the secret of the universe! 🌍", "Space explorer Archie strikes again! 🚀", "Man on the moon math! 🌙", "Star-studded answer! ⭐"] },
];

const RARE_STICKERS = [
  { emoji: '💎', name: 'Diamond' }, { emoji: '👑', name: 'Crown' },
  { emoji: '🐉', name: 'Dragon' }, { emoji: '🌈', name: 'Rainbow' }, { emoji: '🔮', name: 'Crystal Ball' },
  { emoji: '🍀', name: 'Lucky Clover' }, { emoji: '🦅', name: 'Eagle' }, { emoji: '🎆', name: 'Fireworks' },
  { emoji: '⚡', name: 'Lightning Bolt' }, { emoji: '🌙', name: 'Golden Moon' }, { emoji: '🎭', name: 'Magic Mask' },
  { emoji: '🐋', name: 'Blue Whale' }, { emoji: '🌋', name: 'Volcano' },
];
const RARE_CHANCE = 0.2;

function App() {
  const [number, setNumber] = useState(0);
  const [tens, setTens] = useState('');
  const [units, setUnits] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState('playing'); // playing, correct, incorrect, reward
  const [collection, setCollection] = useState(() => JSON.parse(sessionStorage.getItem('stickers_up-to-100') || '[]'));
  const [nextSticker, setNextSticker] = useState('');
  const [congratsMsg, setCongratsMsg] = useState('');
  const [isRarePending, setIsRarePending] = useState(false);
  const [rareInfo, setRareInfo] = useState(null);
  const [showRare, setShowRare] = useState(false);
  const [flashEmoji, setFlashEmoji] = useState(null);

  const tensRef = useRef(null);
  const unitsRef = useRef(null);

  useEffect(() => {
    newQuestion();
  }, []);

  useEffect(() => {
    sessionStorage.setItem('stickers_up-to-100', JSON.stringify(collection));
  }, [collection]);

  const newQuestion = () => {
    let n;
    do { n = Math.floor(Math.random() * 95) + 5; } while (n % 10 === 0 && Math.random() > 0.2);
    setNumber(n);
    setTens(''); setUnits(''); setStatus('playing');

    const theme = THEMES[level % THEMES.length];
    if (Math.random() < RARE_CHANCE) {
      const rareOwned = JSON.parse(sessionStorage.getItem('stickers_rare') || '[]');
      const available = RARE_STICKERS.filter(s => !rareOwned.includes(s.emoji));
      const pool = available.length > 0 ? available : RARE_STICKERS;
      const r = pool[Math.floor(Math.random() * pool.length)];
      setNextSticker(r.emoji); setRareInfo(r); setIsRarePending(true);
    } else {
      setNextSticker(theme.stickers[Math.floor(Math.random() * theme.stickers.length)]);
      setIsRarePending(false);
    }
    setTimeout(() => unitsRef.current?.focus(), 100);
  };

  const checkAnswer = () => {
    const val = parseInt(tens || 0) * 10 + parseInt(units || 0);
    if (number + val === 100) {
      const theme = THEMES[level % THEMES.length];
      setCongratsMsg(theme.congrats[Math.floor(Math.random() * theme.congrats.length)]);
      setScore(s => s + 100); setStreak(s => s + 1);
      showStickerFlash(nextSticker);
      setCollection(p => [...p, nextSticker]);

      if (isRarePending && rareInfo) {
        const rareOwned = JSON.parse(sessionStorage.getItem('stickers_rare') || '[]');
        if (!rareOwned.includes(rareInfo.emoji)) {
          rareOwned.push(rareInfo.emoji); sessionStorage.setItem('stickers_rare', JSON.stringify(rareOwned));
        }
        setTimeout(() => { setShowRare(true); playRareFanfare(); }, 500);
      }

      const nextProgress = progress + 1;
      if (nextProgress >= 5) {
        setTimeout(() => setStatus('reward'), 1000);
      } else {
        setProgress(nextProgress); setStatus('correct');
      }
    } else {
      setStatus('incorrect'); setStreak(0);
    }
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

  const nextLevel = () => {
    setLevel(l => l + 1); setProgress(0); setStatus('playing'); newQuestion();
  };

  const currentTheme = THEMES[level % THEMES.length];
  const rareOwned = JSON.parse(sessionStorage.getItem('stickers_rare') || '[]');

  return (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <header>
        <h1>Up to 100 👑</h1>
        <div className="stats">
          <div className="header-stickers">
            {[...collection.slice(-3), ...rareOwned.slice(-2)].slice(-5).map((s, i) => <span key={i}>{s}</span>)}
          </div>
          <div className="stat-pill">⭐ {score}</div>
          <div className="stat-pill">🔥 {streak}</div>
        </div>
      </header>

      <div className="progress-wrap">
        <div className="progress-label">
          <span>Collecting: {currentTheme.name} {currentTheme.emoji}</span>
          <span>{progress} / 5</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(progress / 5) * 100}%` }}></div>
        </div>
      </div>

      {collection.length > 0 && (
        <div className="stickers visible">
          <div className="stickers-label">Knowledge Collection:</div>
          <div className="sticker-row">
            {collection.map((s, i) => <span key={i}>{s}</span>)}
            {rareOwned.map((s, i) => <span key={'r' + i}>{s}</span>)}
          </div>
        </div>
      )}

      <div className="card">
        {status === 'reward' ? (
          <div className="celebration show" style={{ position: 'static', background: 'none', color: 'inherit', backdropFilter: 'none', padding: 0 }}>
            <div className="celebration-emoji">{currentTheme.emoji}</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#059669' }}>Level Up! 🎉</h2>
            <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>You collected all stickers!</p>
            <div className="sticker-reward">{currentTheme.stickers[0]}</div>
            <button className="check-btn" onClick={nextLevel}>Keep Going! 🚀</button>
          </div>
        ) : status === 'correct' ? (
          <div>
            <div className="equation-wrap">
              <span className="num-big">{number}</span>
              <span className="op-big">+</span>
              <span className="target-big">{tens}{units}</span>
              <span className="op-big">=</span>
              <span className="target-big">100</span>
            </div>
            <div className="feedback-area">
              <div className="feedback show correct">
                <div className="feedback-emoji">{nextSticker}</div>
                <div className="feedback-msg">{congratsMsg}</div>
              </div>
            </div>
            <div className="strategy-wrap">
              <div className="strategy-title">How did you figure it out, Archie? 🤔</div>
              <div className="strategy-btns">
                <button className="strat-btn" onClick={newQuestion}>Jumped to the next 10! 🦘</button>
                <button className="strat-btn" onClick={newQuestion}>Counted backwards! ⏪</button>
                <button className="strat-btn" onClick={newQuestion}>I just knew it! 🧠</button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="badge">Question {progress + 1}</div>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Complete the equation to make 100!
            </p>

            <div className={`badge`} style={{ background: isRarePending ? '#fbbf24' : '#059669', marginBottom: '2rem' }}>
              {isRarePending ? '⭐ RARE CHALLENGE' : `Next Sticker: ${nextSticker}`}
            </div>

            <div className="equation-wrap">
              <span className="num-big">{number}</span>
              <span className="op-big">+</span>
              <div className="inputs-row">
                <div className="input-box">
                  <div className="input-label">Tens</div>
                  <input
                    ref={tensRef}
                    type="number"
                    className="massive-input"
                    value={tens}
                    onChange={e => {
                      const v = e.target.value.slice(-1); setTens(v);
                      if (v && !units) unitsRef.current.focus();
                    }}
                    onKeyDown={e => e.key === 'Enter' && checkAnswer()}
                  />
                </div>
                <div className="input-box">
                  <div className="input-label">Units</div>
                  <input
                    ref={unitsRef}
                    type="number"
                    className="massive-input"
                    value={units}
                    onChange={e => {
                      const v = e.target.value.slice(-1); setUnits(v);
                      if (v && !tens) tensRef.current.focus();
                    }}
                    onKeyDown={e => e.key === 'Enter' && checkAnswer()}
                  />
                </div>
              </div>
              <span className="op-big">=</span>
              <span className="target-big">100</span>
            </div>

            <div className="feedback-area">
              {status === 'incorrect' && (
                <div className="feedback show wrong">
                  <div className="feedback-emoji">🤔</div>
                  <div className="feedback-msg">Not quite! Try again, Archie!</div>
                </div>
              )}
            </div>

            <button className="check-btn" onClick={checkAnswer}>Check! ✨</button>
          </div>
        )}
      </div>

      {showRare && rareInfo && (
        <div className="rare-banner show">
          <div className="rare-inner">
            <span style={{ fontSize: '7rem', display: 'block' }}>{rareInfo.emoji}</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: '1rem 0' }}>RARE STICKER!</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, opacity: 0.9 }}>{rareInfo.name}</p>
            <button className="check-btn" onClick={() => setShowRare(false)} style={{ background: '#92400e', boxShadow: '0 6px 0 #451a03' }}>Amazing! 🎉</button>
          </div>
        </div>
      )}

      {flashEmoji && (
        <div id="sticker-flash-overlay" className="animate-sticker-pop">
          {flashEmoji}
        </div>
      )}
    </div>
  );
}
