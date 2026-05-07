import { useEffect, useState, useRef } from "react"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050508;
    --surface: #0d0d14;
    --surface2: #13131e;
    --border: rgba(255,255,255,0.06);
    --border-hover: rgba(255,255,255,0.14);
    --accent: #e63946;
    --accent2: #ff6b6b;
    --gold: #ffd60a;
    --text: #f0f0f8;
    --muted: #6b6b80;
    --dim: #2a2a38;
  }

  body { background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; overflow-x: hidden; cursor: none !important; }
  * { cursor: none !important; }

  /* Custom cursor */
  #cursor {
    position: fixed; width: 12px; height: 12px;
    background: var(--accent); border-radius: 50%;
    pointer-events: none; z-index: 9999;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, background 0.2s;
    mix-blend-mode: difference;
  }
  #cursor-ring {
    position: fixed; width: 36px; height: 36px;
    border: 1.5px solid rgba(230,57,70,0.5); border-radius: 50%;
    pointer-events: none; z-index: 9998;
    transform: translate(-50%, -50%);
    transition: all 0.12s ease;
  }
  #cursor.hovered { width: 20px; height: 20px; }
  #cursor-ring.hovered { width: 52px; height: 52px; border-color: rgba(230,57,70,0.3); }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

  /* Noise overlay */
  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 150px;
  }

  /* Animated grid bg */
  .grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }

  /* Glow orbs */
  .orb {
    position: fixed; border-radius: 50%; pointer-events: none; filter: blur(80px);
  }
  .orb1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(230,57,70,0.12) 0%, transparent 70%);
    top: -100px; left: -100px;
    animation: orbFloat1 20s ease-in-out infinite alternate;
  }
  .orb2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(255,214,10,0.06) 0%, transparent 70%);
    bottom: -80px; right: -80px;
    animation: orbFloat2 25s ease-in-out infinite alternate;
  }
  .orb3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(100,100,255,0.07) 0%, transparent 70%);
    top: 40%; left: 60%;
    animation: orbFloat3 18s ease-in-out infinite alternate;
  }

  @keyframes orbFloat1 { from { transform: translate(0,0) scale(1); } to { transform: translate(80px,60px) scale(1.2); } }
  @keyframes orbFloat2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-60px,-80px) scale(1.15); } }
  @keyframes orbFloat3 { from { transform: translate(0,0); } to { transform: translate(-40px,50px); } }

  /* Page */
  .page {
    position: relative; z-index: 2;
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center;
    padding: 0 24px 100px;
  }

  /* Hero */
  .hero {
    width: 100%; max-width: 900px;
    text-align: center;
    padding: 100px 0 70px;
    position: relative;
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(230,57,70,0.1);
    border: 1px solid rgba(230,57,70,0.25);
    border-radius: 100px;
    padding: 6px 16px;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--accent2);
    margin-bottom: 32px;
    animation: badgePop 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  .badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent);
    animation: pulseDot 2s ease-in-out infinite;
  }

  @keyframes pulseDot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.6; }
  }

  @keyframes badgePop {
    from { opacity: 0; transform: scale(0.8) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(80px, 14vw, 160px);
    line-height: 0.9;
    letter-spacing: 0.02em;
    color: var(--text);
    animation: titleReveal 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both;
    position: relative;
  }

  .hero-title .red { color: var(--accent); position: relative; }
  .hero-title .red::after {
    content: '';
    position: absolute; bottom: 4px; left: 0; right: 0; height: 4px;
    background: var(--accent);
    transform: scaleX(0); transform-origin: left;
    animation: underlineGrow 0.6s ease 0.9s forwards;
  }

  @keyframes underlineGrow { to { transform: scaleX(1); } }

  @keyframes titleReveal {
    from { opacity: 0; transform: translateY(40px) skewY(2deg); }
    to { opacity: 1; transform: translateY(0) skewY(0); }
  }

  .hero-sub {
    margin-top: 20px;
    font-size: 16px; font-weight: 300;
    color: var(--muted); letter-spacing: 0.02em;
    animation: fadeUp 0.6s ease 0.3s both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Search */
  .search-wrap {
    width: 100%; max-width: 620px;
    margin-bottom: 80px;
    position: relative;
    animation: fadeUp 0.6s ease 0.4s both;
  }

  .search-box {
    display: flex; align-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 6px 6px 6px 24px;
    transition: border-color 0.3s, box-shadow 0.3s;
    position: relative; overflow: visible;
  }

  .search-box::before {
    content: '';
    position: absolute; inset: -1px; border-radius: 4px;
    background: linear-gradient(135deg, var(--accent), transparent, var(--gold));
    opacity: 0;
    transition: opacity 0.3s;
    z-index: -1;
    padding: 1px;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  .search-box.focused { border-color: transparent; box-shadow: 0 0 0 1px var(--accent), 0 0 40px rgba(230,57,70,0.15); }
  .search-box.focused::before { opacity: 1; }

  .search-icon-wrap {
    width: 20px; height: 20px; flex-shrink: 0; margin-right: 14px;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted);
  }

  .search-input {
    flex: 1; background: none; border: none; outline: none;
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-size: 16px; font-weight: 400;
    padding: 14px 0;
  }

  .search-input::placeholder { color: var(--dim); }

  .search-btn {
    background: var(--accent);
    border: none; border-radius: 2px;
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 14px 28px; flex-shrink: 0;
    position: relative; overflow: hidden;
    transition: background 0.2s, transform 0.15s;
  }

  .search-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0; transition: opacity 0.2s;
  }

  .search-btn:hover { background: var(--accent2); transform: translateY(-1px); }
  .search-btn:hover::after { opacity: 1; }
  .search-btn:active { transform: scale(0.97) translateY(0); }
  .search-btn:disabled { background: #2a1a1c; color: #5a3a3c; }

  /* Dropdown */
  .dropdown {
    position: absolute; top: calc(100% + 8px); left: 0; right: 0;
    background: var(--surface);
    border: 1px solid var(--border-hover);
    border-radius: 4px; overflow: hidden;
    z-index: 100;
    box-shadow: 0 32px 64px rgba(0,0,0,0.8);
    animation: dropIn 0.2s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .dropdown-item {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 20px;
    font-size: 14px; color: #9090a8;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s, color 0.15s, padding-left 0.2s;
  }

  .dropdown-item:last-child { border-bottom: none; }
  .dropdown-item:hover { background: var(--surface2); color: var(--text); padding-left: 26px; }

  .dropdown-arrow {
    font-size: 10px; color: var(--accent); opacity: 0;
    transition: opacity 0.15s; flex-shrink: 0;
  }
  .dropdown-item:hover .dropdown-arrow { opacity: 1; }

  /* Status */
  .status {
    text-align: center; margin-top: 16px;
    font-size: 14px; color: var(--muted);
    font-style: italic;
  }

  .status.error { color: #ff6b6b; font-style: normal; font-size: 13px; letter-spacing: 0.02em; }

  /* Loading dots */
  .dots span {
    display: inline-block; width: 4px; height: 4px;
    border-radius: 50%; background: var(--accent);
    margin: 0 2px;
    animation: dotBounce 1.4s ease-in-out infinite;
  }
  .dots span:nth-child(2) { animation-delay: 0.2s; }
  .dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dotBounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  /* Results header */
  .results-header {
    width: 100%; max-width: 900px;
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 32px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
    animation: fadeUp 0.5s ease both;
  }

  .results-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px; letter-spacing: 0.05em;
    line-height: 1;
  }

  .results-query { color: var(--accent); }

  .results-count {
    font-size: 11px; font-weight: 500;
    color: var(--muted);
    letter-spacing: 0.15em; text-transform: uppercase;
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 6px 14px; border-radius: 100px;
  }

  /* Grid */
  .grid {
    width: 100%; max-width: 900px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
    gap: 20px;
  }

  /* Movie Card */
  .movie-card {
    animation: cardReveal 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .poster-wrap {
    position: relative; aspect-ratio: 2/3;
    border-radius: 6px; overflow: hidden;
    background: var(--surface2);
    border: 1px solid var(--border);
  }

  .poster-wrap img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
  }

  .movie-card:hover .poster-wrap img { transform: scale(1.07); }

  /* Poster overlay */
  .poster-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(5,5,8,0.97) 0%, rgba(5,5,8,0.3) 50%, transparent 100%);
    opacity: 0;
    transition: opacity 0.35s ease;
    display: flex; flex-direction: column;
    justify-content: flex-end; padding: 16px;
  }

  .movie-card:hover .poster-overlay { opacity: 1; }

  .overlay-genre {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 6px;
    transform: translateY(8px);
    transition: transform 0.35s ease 0.05s;
  }

  .movie-card:hover .overlay-genre { transform: translateY(0); }

  .overlay-title {
    font-size: 13px; font-weight: 600;
    color: white; line-height: 1.3;
    transform: translateY(8px);
    transition: transform 0.35s ease 0.08s;
  }

  .movie-card:hover .overlay-title { transform: translateY(0); }

  /* Corner accent on hover */
  .poster-wrap::after {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 0; height: 0;
    border-style: solid;
    border-width: 0 32px 32px 0;
    border-color: transparent var(--accent) transparent transparent;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .movie-card:hover .poster-wrap::after { opacity: 1; }

  /* Red line at bottom */
  .poster-wrap::before {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: var(--accent);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
    z-index: 2;
  }

  .movie-card:hover .poster-wrap::before { transform: scaleX(1); }

  .movie-info { padding: 10px 2px 0; }

  .movie-title-text {
    font-size: 13px; font-weight: 500;
    color: #9090a8; line-height: 1.3;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    transition: color 0.2s;
  }

  .movie-card:hover .movie-title-text { color: var(--text); }

  /* No poster */
  .no-poster {
    width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 10px; color: var(--dim);
  }

  .no-poster svg { opacity: 0.3; }

  /* Shimmer */
  .shimmer-card .shimmer-poster {
    aspect-ratio: 2/3; border-radius: 6px; overflow: hidden;
    background: var(--surface2); position: relative;
  }

  .shimmer-card .shimmer-poster::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
    animation: shimmer 1.6s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .shimmer-line {
    height: 12px; border-radius: 2px; background: var(--surface2);
    margin-top: 10px; width: 75%; position: relative; overflow: hidden;
  }

  .shimmer-line::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
    animation: shimmer 1.6s ease-in-out infinite;
  }

  /* Empty state */
  .empty {
    padding: 80px 0; text-align: center; color: var(--dim);
  }

  .empty-icon {
    font-size: 64px; margin-bottom: 20px;
    filter: grayscale(1); opacity: 0.3;
  }

  .empty-text { font-size: 15px; color: var(--muted); font-weight: 300; }

  /* Divider line decoration */
  .deco-line {
    width: 100%; max-width: 900px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    margin: 60px 0 0;
    opacity: 0.3;
  }
`

export default function App() {
  const [movie, setMovie] = useState("")
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [focused, setFocused] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [searchedTitle, setSearchedTitle] = useState("")
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const debounceRef = useRef(null)

  // Custom cursor
  useEffect(() => {
    const move = e => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px"
        cursorRef.current.style.top = e.clientY + "px"
      }
      if (ringRef.current) {
        ringRef.current.style.left = e.clientX + "px"
        ringRef.current.style.top = e.clientY + "px"
      }
    }
    const over = e => {
      if (e.target.closest("button, a, input, .dropdown-item, .movie-card")) {
        cursorRef.current?.classList.add("hovered")
        ringRef.current?.classList.add("hovered")
      } else {
        cursorRef.current?.classList.remove("hovered")
        ringRef.current?.classList.remove("hovered")
      }
    }
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseover", over)
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over) }
  }, [])
  const API_URL = "https://cinematch-movie-recommendation-system.onrender.com"

  // Suggestions debounce
  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (!movie.trim()) { setSuggestions([]); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://cinematch-movie-recommendation-system.onrender.com/search?query=${encodeURIComponent(movie)}`)
        const data = await res.json()
        setSuggestions(data)
      } catch { setSuggestions([]) }
    }, 250)
    return () => clearTimeout(debounceRef.current)
  }, [movie])

  const getRecommendations = async () => {
    if (!movie.trim()) { setError("Please enter a film title"); return }
    setLoading(true); setError(""); setSuggestions([])
    setSearchedTitle(movie)
    try {
      const res = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie }),
      })
      const data = await res.json()
      if (!data.length) { setError("No results found — try another title"); setRecommendations([]) }
      else setRecommendations(data)
    } catch { setError("Server unreachable — is Flask running?") }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <style>{CSS}</style>

      {/* Cursor */}
      <div id="cursor" ref={cursorRef} />
      <div id="cursor-ring" ref={ringRef} />

      {/* Bg layers */}
      <div className="noise" />
      <div className="grid-bg" />
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      <div className="page">

        {/* Hero */}
        <div className="hero">
          <div className="hero-badge">
            <div className="badge-dot" />
            AI-Powered Discovery
          </div>
          <h1 className="hero-title">
            CINE<span className="red">MATCH</span>
          </h1>
          <p className="hero-sub">
            Drop a title you love — we'll find your next obsession
          </p>
        </div>

        {/* Search */}
        <div className="search-wrap">
          <div className={`search-box ${focused ? "focused" : ""}`}>
            <div className="search-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              className="search-input"
              type="text"
              placeholder="e.g. Inception, Parasite, The Godfather…"
              value={movie}
              onChange={e => setMovie(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyDown={e => e.key === "Enter" && getRecommendations()}
            />
            <button
              className="search-btn"
              onClick={getRecommendations}
              disabled={loading}
            >
              {loading ? (
                <span className="dots">
                  <span /><span /><span />
                </span>
              ) : "Find Films"}
            </button>
          </div>

          {/* Dropdown */}
          {suggestions.length > 0 && focused && (
            <div className="dropdown">
              {suggestions.slice(0, 6).map((item, i) => (
                <div
                  key={i}
                  className="dropdown-item"
                  onMouseDown={() => { setMovie(item); setSuggestions([]) }}
                >
                  <span className="dropdown-arrow">▶</span>
                  {item}
                </div>
              ))}
            </div>
          )}

          {/* Status */}
          {error && <p className="status error">⚠ {error}</p>}
          {loading && <p className="status">Curating your watchlist…</p>}
        </div>

        {/* Shimmer */}
        {loading && (
          <div style={{ width: "100%", maxWidth: 900 }}>
            <div className="results-header" style={{ opacity: 0.25 }}>
              <span className="results-label">Loading…</span>
            </div>
            <div className="grid">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="shimmer-card">
                  <div className="shimmer-poster" style={{ animationDelay: `${i * 0.1}s` }} />
                  <div className="shimmer-line" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && recommendations.length > 0 && (
          <>
            <div className="results-header">
              <span className="results-label">
                Because you like <span className="results-query">"{searchedTitle}"</span>
              </span>
              <span className="results-count">{recommendations.length} picks</span>
            </div>
            <div className="grid">
              {recommendations.map((m, i) => (
                <div
                  key={i}
                  className="movie-card"
                  style={{ animationDelay: `${i * 0.07}s` }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="poster-wrap">
                    {m.poster ? (
                      <>
                        <img src={m.poster} alt={m.title} loading="lazy" />
                        <div className="poster-overlay">
                          <p className="overlay-genre">Film</p>
                          <p className="overlay-title">{m.title}</p>
                        </div>
                      </>
                    ) : (
                      <div className="no-poster">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="2" width="20" height="20" rx="2" />
                          <path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5" />
                        </svg>
                        <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>No poster</span>
                      </div>
                    )}
                  </div>
                  <div className="movie-info">
                    <p className="movie-title-text" title={m.title}>{m.title}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="deco-line" />
          </>
        )}

        {/* Empty state */}
        {!loading && recommendations.length === 0 && !error && (
          <div className="empty">
            <div className="empty-icon">🎬</div>
            <p className="empty-text">Search for a film to discover recommendations</p>
          </div>
        )}

      </div>
    </div>
  )
}
