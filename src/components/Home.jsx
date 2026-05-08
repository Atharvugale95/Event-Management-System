import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .home-root {
    min-height: 100vh;
    background: #f8f7f4;
    font-family: 'DM Sans', sans-serif;
    color: #1a1a1a;
  }

  /* ── HERO ── */
  .hero {
    background: #1a1a1a;
    color: #fff;
    padding: 5rem 2rem 4rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 40px,
      rgba(255,255,255,0.015) 40px,
      rgba(255,255,255,0.015) 41px
    );
    pointer-events: none;
  }

  .hero-badge {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #c8a97e;
    border: 1px solid rgba(200,169,126,0.4);
    border-radius: 20px;
    padding: 5px 16px;
    margin-bottom: 1.5rem;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 6vw, 72px);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1.25rem;
    letter-spacing: -1px;
  }

  .hero-title span {
    color: #c8a97e;
    font-style: italic;
  }

  .hero-sub {
    font-size: 17px;
    color: rgba(255,255,255,0.6);
    max-width: 520px;
    margin: 0 auto 2.5rem;
    line-height: 1.7;
    font-weight: 300;
  }

  .hero-cta-row {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 3rem;
  }

  .btn-primary {
    padding: 13px 28px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    background: #c8a97e;
    color: #1a1a1a;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    letter-spacing: 0.2px;
  }
  .btn-primary:hover { background: #b8956a; transform: translateY(-1px); }

  .btn-ghost {
    padding: 13px 28px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    background: transparent;
    color: rgba(255,255,255,0.8);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 9px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
    padding-top: 3rem;
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .hero-stat { text-align: center; }
  .hero-stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: #c8a97e;
  }
  .hero-stat-label { font-size: 12px; color: rgba(255,255,255,0.4); letter-spacing: 0.8px; text-transform: uppercase; margin-top: 2px; }

  /* ── EVENT STATUS STRIP ── */
  .status-strip {
    background: #c8a97e;
    padding: 0.75rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }
  .status-item { display: flex; align-items: center; gap: 0.5rem; font-size: 13px; font-weight: 600; color: #1a1a1a; }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #1a1a1a; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  /* ── SECTIONS ── */
  .section { padding: 4rem 2rem; }
  .section-inner { max-width: 1100px; margin: 0 auto; }

  .section-eyebrow {
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #c8a97e;
    margin-bottom: 0.5rem;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(24px, 3vw, 36px);
    color: #1a1a1a;
    margin-bottom: 0.5rem;
    letter-spacing: -0.5px;
  }

  .section-sub {
    font-size: 15px;
    color: #888;
    margin-bottom: 2.5rem;
    max-width: 500px;
    line-height: 1.6;
  }

  /* ── EVENT CARDS ── */
  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.25rem;
  }

  .event-card {
    background: #fff;
    border: 1px solid #e8e4dd;
    border-radius: 14px;
    overflow: hidden;
    transition: box-shadow 0.2s, transform 0.2s;
    cursor: pointer;
  }
  .event-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }

  .event-card-poster {
    width: 100%;
    height: 160px;
    background: linear-gradient(135deg, #f2ede6, #e8e0d4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    position: relative;
    overflow: hidden;
  }

  .event-card-poster img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .event-status-pill {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .pill-live { background: #dcfce7; color: #166534; }
  .pill-upcoming { background: #dbeafe; color: #1e40af; }
  .pill-full { background: #fee2e2; color: #991b1b; }

  .event-card-body { padding: 1.1rem 1.25rem; }
  .event-card-name { font-size: 15px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; }
  .event-card-meta { font-size: 12.5px; color: #888; margin: 3px 0; display: flex; align-items: center; gap: 6px; }

  .capacity-bar {
    height: 4px;
    background: #f0ebe3;
    border-radius: 99px;
    margin-top: 10px;
    overflow: hidden;
  }
  .capacity-fill { height: 100%; border-radius: 99px; transition: width 0.5s; }

  .event-card-footer {
    padding: 0.75rem 1.25rem;
    border-top: 1px solid #f0ede8;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .event-fee { font-size: 13px; font-weight: 600; color: #1a1a1a; }
  .event-register-btn {
    padding: 6px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    background: #1a1a1a;
    color: #fff;
    border: none;
    border-radius: 7px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .event-register-btn:hover { background: #333; }
  .event-register-btn:disabled { background: #ccc; cursor: not-allowed; }

  /* ── JOIN SLIDER ── */
  .join-section { background: #1a1a1a; padding: 5rem 2rem; overflow: hidden; }
  .join-inner { max-width: 1100px; margin: 0 auto; }

  .join-slider-track {
    display: flex;
    gap: 1.25rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding-bottom: 0.5rem;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .join-slider-track::-webkit-scrollbar { display: none; }

  .join-card {
    flex-shrink: 0;
    width: 260px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 1.75rem 1.5rem;
    transition: background 0.2s, border-color 0.2s;
  }
  .join-card:hover { background: rgba(255,255,255,0.09); border-color: rgba(200,169,126,0.4); }

  .join-card-icon {
    font-size: 28px;
    margin-bottom: 1rem;
  }

  .join-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    color: #fff;
    margin-bottom: 0.5rem;
  }

  .join-card-desc { font-size: 13.5px; color: rgba(255,255,255,0.5); line-height: 1.6; margin-bottom: 1.25rem; }

  .join-card-btn {
    padding: 8px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    background: transparent;
    color: #c8a97e;
    border: 1px solid rgba(200,169,126,0.4);
    border-radius: 7px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .join-card-btn:hover { background: #c8a97e; color: #1a1a1a; }

  .join-nav { display: flex; gap: 0.5rem; margin-top: 1.5rem; }
  .join-nav-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.15);
    background: transparent;
    color: rgba(255,255,255,0.6);
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .join-nav-btn:hover { border-color: #c8a97e; color: #c8a97e; }

  /* ── HOW IT WORKS ── */
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .step-card {
    background: #fff;
    border: 1px solid #e8e4dd;
    border-radius: 14px;
    padding: 1.75rem;
    position: relative;
    overflow: hidden;
  }

  .step-number {
    font-family: 'Playfair Display', serif;
    font-size: 48px;
    font-weight: 700;
    color: #f0ede8;
    position: absolute;
    top: 10px;
    right: 16px;
    line-height: 1;
  }

  .step-icon-wrap {
    width: 44px;
    height: 44px;
    background: #f2ede6;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-bottom: 1rem;
  }

  .step-title { font-size: 15px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; }
  .step-desc { font-size: 13px; color: #888; line-height: 1.6; }

  /* ── TESTIMONIALS ── */
  .testimonials-section { background: #fff; }

  .testi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  .testi-card {
    background: #f8f7f4;
    border: 1px solid #e8e4dd;
    border-radius: 14px;
    padding: 1.5rem;
  }

  .testi-stars { color: #c8a97e; font-size: 14px; margin-bottom: 0.75rem; letter-spacing: 2px; }
  .testi-text { font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 1rem; font-style: italic; }
  .testi-author { display: flex; align-items: center; gap: 0.75rem; }
  .testi-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: #1a1a1a;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600; color: #c8a97e;
    flex-shrink: 0;
  }
  .testi-name { font-size: 13.5px; font-weight: 600; color: #1a1a1a; }
  .testi-role { font-size: 12px; color: #aaa; }

  /* ── CTA BANNER ── */
  .cta-section {
    background: #1a1a1a;
    padding: 4rem 2rem;
    text-align: center;
  }

  .cta-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(26px, 4vw, 44px);
    color: #fff;
    margin-bottom: 1rem;
    letter-spacing: -0.5px;
  }

  .cta-title span { color: #c8a97e; font-style: italic; }
  .cta-sub { font-size: 15px; color: rgba(255,255,255,0.5); margin-bottom: 2rem; max-width: 440px; margin-left: auto; margin-right: auto; }

  /* ── FOOTER ── */
  .footer {
    background: #111;
    color: rgba(255,255,255,0.5);
    padding: 3rem 2rem 1.5rem;
  }

  .footer-inner { max-width: 1100px; margin: 0 auto; }

  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 2rem;
    padding-bottom: 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    margin-bottom: 1.5rem;
  }

  @media (max-width: 700px) {
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .footer-brand-col { grid-column: 1 / -1; }
    .hero-stats { gap: 1.5rem; }
    .join-card { width: 220px; }
  }

  .footer-brand {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    color: #fff;
    margin-bottom: 0.75rem;
  }

  .footer-brand-sub { font-size: 13px; line-height: 1.7; max-width: 260px; margin-bottom: 1.25rem; }

  .footer-col-title {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    margin-bottom: 1rem;
  }

  .footer-links { list-style: none; }
  .footer-links li { margin-bottom: 0.5rem; }
  .footer-links a { font-size: 13.5px; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.18s; cursor: pointer; }
  .footer-links a:hover { color: #c8a97e; }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: 12.5px;
  }

  .footer-bottom-links { display: flex; gap: 1.5rem; }
  .footer-bottom-links a { color: rgba(255,255,255,0.35); text-decoration: none; cursor: pointer; transition: color 0.18s; }
  .footer-bottom-links a:hover { color: #c8a97e; }

  .no-events { text-align: center; padding: 3rem; color: #bbb; font-size: 14px; }
`;

const joinCards = [
  { icon: "🏅", title: "Compete as a Participant", desc: "Register as a participant and compete in your favorite sports category. Open to all skill levels.", cta: "Register Now" },
  { icon: "📋", title: "Become an Organizer", desc: "Help manage events, coordinate participants, and ensure everything runs smoothly on the ground.", cta: "Apply as Organizer" },
  { icon: "🤝", title: "Volunteer with Us", desc: "Join our volunteer crew and be part of the action — from setup to prize distribution.", cta: "Volunteer" },
  { icon: "🏢", title: "Sponsor an Event", desc: "Partner with Eventify and get your brand in front of thousands of sports enthusiasts.", cta: "Become a Sponsor" },
];

const steps = [
  { icon: "👤", title: "Create Account", desc: "Sign up in under a minute. Choose your role — guest, organizer, or admin." },
  { icon: "🔍", title: "Browse Events", desc: "Explore current and upcoming sports events with full details and posters." },
  { icon: "📝", title: "Register", desc: "Fill in your details and confirm your spot. Get instant confirmation." },
  { icon: "🏆", title: "Compete & Win", desc: "Show up, compete, and take home the glory. Results tracked in real time." },
];

const testimonials = [
  { text: "An incredibly well-organised festival. The registration process was seamless and the events were top-notch.", name: "Ravi Patil", role: "Athlete, 2025 Edition", initials: "RP" },
  { text: "As an organizer, the dashboard made managing registrations a breeze. Highly recommend this platform.", name: "Sneha Kulkarni", role: "Event Organizer", initials: "SK" },
  { text: "The best sports event in Kolhapur — period. We'll be back every year without question.", name: "Arjun Desai", role: "Participant", initials: "AD" },
];

function Home() {
  const navigate   = useNavigate();
  const sliderRef  = useRef(null);
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/events")
      .then((r) => r.json())
      .then((data) => { setEvents(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleRegister = (eventId) => {
    const user = localStorage.getItem("user");
    if (user) navigate(`/events/${eventId}/register`);
    else navigate("/login");
  };

  const handleBrowse = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) navigate(`/${user.role}`);
    else navigate("/login");
  };

  const scrollSlider = (dir) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
    }
  };

  // split events into ongoing and upcoming
  const now = new Date();

  const getEventStatus = (event) => {
    const isFull = event.registered_count >= event.max_participants;
    if (isFull) return "full";
    const eventDate = new Date(event.date_time);
    const diffHours = (eventDate - now) / (1000 * 60 * 60);
    if (diffHours < 0) return "live";
    return "upcoming";
  };

  const ongoingEvents  = events.filter(e => getEventStatus(e) === "live");
  const upcomingEvents = events.filter(e => getEventStatus(e) === "upcoming");
  const fullEvents     = events.filter(e => getEventStatus(e) === "full");

  const statusLabel = { live: "Live Now", upcoming: "Upcoming", full: "Full" };
  const statusClass = { live: "pill-live", upcoming: "pill-upcoming", full: "pill-full" };

  const getCapacityColor = (registered, max) => {
    const pct = registered / max;
    if (pct >= 1) return "#dc2626";
    if (pct >= 0.8) return "#f59e0b";
    return "#22c55e";
  };

  const renderEventCard = (event) => {
    const status  = getEventStatus(event);
    const isFull  = status === "full";
    const pct     = Math.min((event.registered_count / event.max_participants) * 100, 100);
    const remaining = event.max_participants - event.registered_count;

    return (
      <div key={event.id} className="event-card" onClick={() => !isFull && handleRegister(event.id)}>
        <div className="event-card-poster">
          {event.poster_url ? (
            <img src={event.poster_url} alt={event.name} onError={(e) => { e.target.style.display = "none"; }} />
          ) : (
            <span>🏆</span>
          )}
          <span className={`event-status-pill ${statusClass[status]}`}>
            {statusLabel[status]}
          </span>
        </div>

        <div className="event-card-body">
          <p className="event-card-name">{event.name}</p>
          <p className="event-card-meta">📍 {event.venue}</p>
          <p className="event-card-meta">📅 {event.date_time}</p>
          <p className="event-card-meta" style={{ color: isFull ? "#dc2626" : remaining <= Math.ceil(event.max_participants * 0.2) ? "#f59e0b" : "#22c55e" }}>
            👥 {isFull ? "No seats left" : `${remaining} seats remaining`}
          </p>
          <div className="capacity-bar">
            <div className="capacity-fill" style={{ width: `${pct}%`, background: getCapacityColor(event.registered_count, event.max_participants) }} />
          </div>
        </div>

        <div className="event-card-footer">
          <span className="event-fee">
            {event.entry_fee === 0 ? "Free" : `INR ${event.entry_fee.toFixed(2)}`}
          </span>
          <button
            className="event-register-btn"
            disabled={isFull}
            onClick={(e) => { e.stopPropagation(); handleRegister(event.id); }}
          >
            {isFull ? "Full" : "Register →"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className="home-root">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-badge">Kolhapur · May 2026</div>
          <h1 className="hero-title">
            The Biggest<br />
            <span>Sports Festival</span><br />
            of the Year
          </h1>
          <p className="hero-sub">
            Compete, connect, and celebrate sport at its finest.
            Register for events across 10+ categories in Kolhapur.
          </p>
          <div className="hero-cta-row">
            <button className="btn-primary" onClick={handleBrowse}>
              Explore Events →
            </button>
            <button className="btn-ghost" onClick={() => navigate("/user-register")}>
              Create Account
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">{events.length || "10"}+</div>
              <div className="hero-stat-label">Events</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">500+</div>
              <div className="hero-stat-label">Athletes</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">10+</div>
              <div className="hero-stat-label">Categories</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">1</div>
              <div className="hero-stat-label">City · Kolhapur</div>
            </div>
          </div>
        </section>

        {/* ── LIVE STRIP ── */}
        {ongoingEvents.length > 0 && (
          <div className="status-strip">
            <div className="status-item">
              <div className="status-dot" />
              <span>{ongoingEvents.length} event{ongoingEvents.length > 1 ? "s" : ""} live now</span>
            </div>
            {ongoingEvents.slice(0, 2).map(e => (
              <div key={e.id} className="status-item">· {e.name}</div>
            ))}
          </div>
        )}

        {/* ── ONGOING EVENTS ── */}
        {ongoingEvents.length > 0 && (
          <section className="section" style={{ background: "#fff" }}>
            <div className="section-inner">
              <p className="section-eyebrow">Happening Now</p>
              <h2 className="section-title">Live Events</h2>
              <p className="section-sub">These events are currently underway. Register now before spots run out.</p>
              <div className="events-grid">
                {ongoingEvents.map(renderEventCard)}
              </div>
            </div>
          </section>
        )}

        {/* ── UPCOMING EVENTS ── */}
        <section className="section" style={{ background: ongoingEvents.length > 0 ? "#f8f7f4" : "#fff" }}>
          <div className="section-inner">
            <p className="section-eyebrow">Coming Up</p>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-sub">Secure your spot before registrations close. Limited seats available.</p>

            {loading && <div className="no-events">Loading events...</div>}

            {!loading && upcomingEvents.length === 0 && (
              <div className="no-events">No upcoming events right now. Check back soon!</div>
            )}

            <div className="events-grid">
              {upcomingEvents.map(renderEventCard)}
            </div>

            {/* Full events at the bottom */}
            {fullEvents.length > 0 && (
              <>
                <p style={{ fontSize: "13px", color: "#bbb", margin: "2rem 0 1rem", fontWeight: 500 }}>
                  SOLD OUT EVENTS
                </p>
                <div className="events-grid" style={{ opacity: 0.65 }}>
                  {fullEvents.map(renderEventCard)}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── JOIN US SLIDER ── */}
        <section className="join-section">
          <div className="join-inner">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <p style={{ fontSize: "11.5px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c8a97e", marginBottom: "0.5rem" }}>
                  Get Involved
                </p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 3vw, 36px)", color: "#fff", letterSpacing: "-0.5px" }}>
                  Join the Festival
                </h2>
              </div>
              <div className="join-nav">
                <button className="join-nav-btn" onClick={() => scrollSlider(-1)}>←</button>
                <button className="join-nav-btn" onClick={() => scrollSlider(1)}>→</button>
              </div>
            </div>

            <div className="join-slider-track" ref={sliderRef}>
              {joinCards.map((card, i) => (
                <div key={i} className="join-card">
                  <div className="join-card-icon">{card.icon}</div>
                  <p className="join-card-title">{card.title}</p>
                  <p className="join-card-desc">{card.desc}</p>
                  <button
                    className="join-card-btn"
                    onClick={() => navigate("/user-register")}
                  >
                    {card.cta} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="section">
          <div className="section-inner">
            <p className="section-eyebrow">Simple Process</p>
            <h2 className="section-title">How it Works</h2>
            <p className="section-sub">Get started in four simple steps and be part of the festival.</p>
            <div className="steps-grid">
              {steps.map((step, i) => (
                <div key={i} className="step-card">
                  <span className="step-number">{String(i + 1).padStart(2, "0")}</span>
                  <div className="step-icon-wrap">{step.icon}</div>
                  <p className="step-title">{step.title}</p>
                  <p className="step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="section testimonials-section">
          <div className="section-inner">
            <p className="section-eyebrow">What People Say</p>
            <h2 className="section-title">Voices from the Festival</h2>
            <p className="section-sub">Hear from past participants, organizers, and volunteers.</p>
            <div className="testi-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="testi-card">
                  <div className="testi-stars">★★★★★</div>
                  <p className="testi-text">"{t.text}"</p>
                  <div className="testi-author">
                    <div className="testi-avatar">{t.initials}</div>
                    <div>
                      <p className="testi-name">{t.name}</p>
                      <p className="testi-role">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="cta-section">
          <p style={{ fontSize: "11.5px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c8a97e", marginBottom: "0.75rem" }}>
            Don't Miss Out
          </p>
          <h2 className="cta-title">
            Ready to <span>Join?</span>
          </h2>
          <p className="cta-sub">
            Join hundreds of participants at Eventify.
            Registrations are open — secure your spot today.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={handleBrowse}>
              Register for an Event →
            </button>
            <button className="btn-ghost" onClick={() => navigate("/user-register")}>
              Create Account
            </button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-grid">

              <div className="footer-brand-col">
                <p className="footer-brand">🏆 Eventify</p>
                <p className="footer-brand-sub">
                  Your one-stop platform for all event needs. Connecting organizers and participants since 2020.
                </p>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {["Instagram", "Twitter", "Facebook"].map((s) => (
                    <div key={s} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "11px", color: "rgba(255,255,255,0.4)", transition: "border-color 0.2s, color 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#c8a97e"; e.currentTarget.style.color = "#c8a97e"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                    >
                      {s[0]}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="footer-col-title">Events</p>
                <ul className="footer-links">
                  <li><a onClick={handleBrowse}>All Events</a></li>
                  <li><a onClick={handleBrowse}>Live Now</a></li>
                  <li><a onClick={handleBrowse}>Upcoming</a></li>
                  <li><a onClick={() => navigate("/user-register")}>Register</a></li>
                </ul>
              </div>

              <div>
                <p className="footer-col-title">Get Involved</p>
                <ul className="footer-links">
                  <li><a onClick={() => navigate("/user-register")}>Compete</a></li>
                  <li><a onClick={() => navigate("/user-register")}>Organize</a></li>
                  <li><a onClick={() => navigate("/user-register")}>Volunteer</a></li>
                  <li><a>Sponsor</a></li>
                </ul>
              </div>

              <div>
                <p className="footer-col-title">Info</p>
                <ul className="footer-links">
                  <li><a>About</a></li>
                  <li><a>Contact</a></li>
                  <li><a>FAQ</a></li>
                  <li><a onClick={() => navigate("/login")}>Login</a></li>
                </ul>
              </div>

            </div>

            <div className="footer-bottom">
              <span>© Eventify. All rights reserved.</span>
              <div className="footer-bottom-links">
                <a>Privacy Policy</a>
                <a>Terms of Use</a>
                <a>Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

export default Home;