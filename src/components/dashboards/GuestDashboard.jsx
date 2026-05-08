import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

  .guest-root { min-height: 100vh; background: #f8f7f4; font-family: 'DM Sans', sans-serif; padding: 2rem 1rem; }
  .guest-wrapper { max-width: 720px; margin: 0 auto; }
  .guest-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e5e2db; }
  .guest-title { font-family: 'Playfair Display', serif; font-size: 28px; color: #1a1a1a; margin: 0 0 4px 0; letter-spacing: -0.3px; }
  .guest-subtitle { font-size: 13.5px; color: #888; margin: 0; }
  .guest-subtitle strong { color: #555; font-weight: 500; }
  .search-wrap { position: relative; margin-bottom: 1.75rem; }
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #bbb; font-size: 15px; pointer-events: none; }
  .search-input { width: 100%; padding: 11px 14px 11px 40px; font-family: 'DM Sans', sans-serif; font-size: 14px; border: 1.5px solid #e5e2db; border-radius: 10px; background: #fff; color: #1a1a1a; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
  .search-input:focus { border-color: #c8a97e; }
  .search-input::placeholder { color: #bbb; }
  .event-card { background: #fff; border-radius: 14px; border: 1px solid #e8e4dd; margin-bottom: 1.25rem; overflow: hidden; transition: box-shadow 0.2s, transform 0.2s; }
  .event-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-1px); }
  .event-card.is-full { opacity: 0.8; }
  .event-poster { width: 100%; height: 200px; background: linear-gradient(135deg, #f2ede6 0%, #e8e0d4 100%); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
  .event-poster img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .event-poster-placeholder { font-size: 40px; opacity: 0.5; }
  .full-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
  .full-banner { background: #dc2626; color: #fff; font-size: 14px; font-weight: 700; padding: 8px 24px; border-radius: 8px; letter-spacing: 1px; }
  .event-body { padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
  .event-info { flex: 1; min-width: 0; }
  .event-name { font-size: 16px; font-weight: 600; color: #1a1a1a; margin: 0 0 6px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .event-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 6px; }
  .meta-tag { font-size: 12.5px; color: #777; }
  .meta-divider { width: 1px; height: 12px; background: #ddd; align-self: center; }
  .event-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .badge { font-size: 12px; font-weight: 500; padding: 3px 10px; border-radius: 20px; background: #f2ede6; color: #8a6a3e; }
  .badge-full { background: #fee2e2; color: #991b1b; }
  .badge-almost { background: #fef3c7; color: #92400e; }
  .badge-open { background: #dcfce7; color: #166534; }
  .capacity-bar-wrap { margin-top: 8px; }
  .capacity-bar-bg { background: #f0ebe3; border-radius: 99px; height: 5px; overflow: hidden; }
  .capacity-bar-fill { height: 100%; border-radius: 99px; transition: width 0.3s; }
  .capacity-text { font-size: 11px; color: #bbb; margin-top: 3px; }
  .event-desc { font-size: 12.5px; color: #999; margin-top: 6px; line-height: 1.5; }
  .register-btn { flex-shrink: 0; padding: 9px 20px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; background: #1a1a1a; color: #fff; border: none; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
  .register-btn:hover { background: #333; }
  .register-btn:disabled { background: #ccc; cursor: not-allowed; }
  .count-line { font-size: 12.5px; color: #aaa; text-align: right; margin-top: 0.5rem; }
  .empty-state { text-align: center; padding: 3rem 1rem; color: #bbb; }
  .empty-state p { font-size: 14px; margin: 0.5rem 0 0 0; }
`;

// ✅ reusable capacity badge
const CapacityBadge = ({ registered, max }) => {
  const remaining = max - registered;
  const isFull    = remaining <= 0;
  const isAlmost  = !isFull && remaining <= Math.ceil(max * 0.2);

  return (
    <span className={`badge ${isFull ? "badge-full" : isAlmost ? "badge-almost" : "badge-open"}`}>
      {isFull ? "🔴 Full" : isAlmost ? `🟡 ${remaining} seats left` : `🟢 ${remaining} seats left`}
    </span>
  );
};

// ✅ reusable capacity progress bar
const CapacityBar = ({ registered, max }) => {
  const pct     = Math.min((registered / max) * 100, 100);
  const isFull  = registered >= max;
  const isAlmost = !isFull && (max - registered) <= Math.ceil(max * 0.2);
  const color   = isFull ? "#dc2626" : isAlmost ? "#f59e0b" : "#22c55e";

  return (
    <div className="capacity-bar-wrap">
      <div className="capacity-bar-bg">
        <div className="capacity-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="capacity-text">{registered} / {max} registered</p>
    </div>
  );
};

function GuestDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [events, setEvents]   = useState([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/events")
      .then((r) => r.json())
      .then((data) => { setEvents(data); setLoading(false); })
      .catch(() => { setError("Cannot load events."); setLoading(false); });
  }, []);

  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.name?.toLowerCase().includes(q)      ||
      e.venue?.toLowerCase().includes(q)     ||
      e.date_time?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <style>{styles}</style>
      <div className="guest-root">
        <div className="guest-wrapper">

          <div className="guest-header">
            <div>
              <h2 className="guest-title">Upcoming Events</h2>
              <p className="guest-subtitle">
                Welcome back, <strong>{user?.email}</strong>
              </p>
            </div>
          </div>

          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by event name, venue or date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading && <div className="empty-state"><div style={{ fontSize: 32 }}>⏳</div><p>Loading events...</p></div>}
          {error   && <div className="empty-state"><div style={{ fontSize: 32 }}>⚠️</div><p style={{ color: "#d9534f" }}>{error}</p></div>}

          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <div style={{ fontSize: 32 }}>🔎</div>
              <p>{search ? `No events found for "${search}"` : "No events available yet."}</p>
            </div>
          )}

          {filtered.map((event) => {
            const isFull = event.registered_count >= event.max_participants;

            return (
              <div key={event.id} className={`event-card ${isFull ? "is-full" : ""}`}>

                {/* Poster */}
                <div className="event-poster">
                  {event.poster_url ? (
                    <img
                      src={event.poster_url}
                      alt={`${event.name} poster`}
                      onError={(e) => {
                        e.target.parentElement.innerHTML = `<span class="event-poster-placeholder">🎉</span>`;
                      }}
                    />
                  ) : (
                    <span className="event-poster-placeholder">🎉</span>
                  )}

                  {/* ✅ Full overlay on poster */}
                  {isFull && (
                    <div className="full-overlay">
                      <span className="full-banner">REGISTRATIONS CLOSED</span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="event-body">
                  <div className="event-info">
                    <h3 className="event-name">{event.name}</h3>

                    <div className="event-meta">
                      <span className="meta-tag">📍 {event.venue}</span>
                      <div className="meta-divider" />
                      <span className="meta-tag">📅 {event.date_time}</span>
                    </div>

                    <div className="event-badges">
                      <span className="badge">💰 INR {event.entry_fee?.toFixed(2)}</span>
                      {/* ✅ capacity badge */}
                      <CapacityBadge
                        registered={event.registered_count}
                        max={event.max_participants}
                      />
                    </div>

                    {/* ✅ progress bar */}
                    <CapacityBar
                      registered={event.registered_count}
                      max={event.max_participants}
                    />

                    {event.description && (
                      <p className="event-desc">{event.description}</p>
                    )}
                  </div>

                  {/* ✅ Register button — disabled when full */}
                  <button
                    className="register-btn"
                    disabled={isFull}
                    onClick={() => !isFull && navigate(`/events/${event.id}/register`)}
                  >
                    {isFull ? "Full" : "Register →"}
                  </button>
                </div>
              </div>
            );
          })}

          {!loading && events.length > 0 && (
            <p className="count-line">Showing {filtered.length} of {events.length} event(s)</p>
          )}
        </div>
      </div>
    </>
  );
}

export default GuestDashboard;