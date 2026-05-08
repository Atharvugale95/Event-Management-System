import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

  .list-root { min-height: 100vh; background: #f8f7f4; font-family: 'DM Sans', sans-serif; padding: 2rem 1rem; }
  .list-wrapper { max-width: 700px; margin: 0 auto; }
  .list-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.75rem; padding-bottom: 1.25rem; border-bottom: 1px solid #e5e2db; }
  .list-title { font-family: 'Playfair Display', serif; font-size: 26px; color: #1a1a1a; margin: 0 0 4px 0; letter-spacing: -0.3px; }
  .list-subtitle { font-size: 13px; color: #999; margin: 0; }
  .create-btn { padding: 9px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; background: #1a1a1a; color: #fff; border: none; border-radius: 8px; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
  .create-btn:hover { background: #333; }
  .search-wrap { position: relative; margin-bottom: 1.5rem; }
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #bbb; pointer-events: none; }
  .search-input { width: 100%; padding: 11px 14px 11px 40px; font-family: 'DM Sans', sans-serif; font-size: 13.5px; border: 1.5px solid #e5e2db; border-radius: 9px; background: #fff; color: #1a1a1a; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
  .search-input:focus { border-color: #c8a97e; }
  .search-input::placeholder { color: #bbb; }
  .event-card { background: #fff; border: 1px solid #e8e4dd; border-radius: 14px; margin-bottom: 1.25rem; overflow: hidden; transition: box-shadow 0.2s; }
  .event-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07); }
  .poster-box { width: 100%; height: 200px; background: #f5f3ef; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .poster-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .poster-emoji { font-size: 36px; }
  .event-body { padding: 1.25rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
  .event-name { font-size: 16px; font-weight: 600; color: #1a1a1a; margin: 0 0 6px 0; }
  .event-meta { font-size: 13px; color: #888; margin: 3px 0; }
  .event-creator { font-size: 11.5px; color: #bbb; margin-top: 6px; }
  .action-col { display: flex; flex-direction: column; gap: 0.5rem; flex-shrink: 0; }
  .btn-register { padding: 8px 16px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; background: #1a1a1a; color: #fff; border: none; border-radius: 8px; cursor: pointer; white-space: nowrap; transition: background 0.2s; }
  .btn-register:hover { background: #333; }
  .btn-edit { padding: 7px 14px; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500; background: #edf4ff; color: #3a6db5; border: 1px solid #cfe0fa; border-radius: 7px; cursor: pointer; transition: background 0.18s; }
  .btn-edit:hover { background: #ddeaff; }
  .btn-delete { padding: 7px 14px; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500; background: #fff0f0; color: #c0392b; border: 1px solid #f5c6c6; border-radius: 7px; cursor: pointer; transition: background 0.18s; }
  .btn-delete:hover { background: #ffe0e0; }
  .view-only { font-size: 11px; color: #bbb; border: 1px solid #eee; border-radius: 6px; padding: 5px 10px; white-space: nowrap; text-align: center; }
  .empty-state { text-align: center; padding: 3rem 1rem; }
  .empty-state p { font-size: 13.5px; color: #bbb; margin: 8px 0 0; }
  .count-line { font-size: 12px; color: #bbb; text-align: right; margin-top: 0.5rem; }
`;

function EventList() {
  const [events, setEvents]   = useState([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user  = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/events")
      .then((r) => r.json())
      .then((data) => { setEvents(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.name?.toLowerCase().includes(q)      ||
      e.venue?.toLowerCase().includes(q)     ||
      e.date_time?.toLowerCase().includes(q)
    );
  });

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    const res = await fetch(`http://localhost:8000/events/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      setEvents(events.filter((e) => e.id !== id));
    } else {
      const data = await res.json();
      alert(data.detail || "Cannot delete this event");
    }
  };

  const canModify = (event) =>
    user?.role === "admin" ||
    (user?.role === "organizer" && event.created_by === user?.email);

  return (
    <>
      <style>{styles}</style>
      <div className="list-root">
        <div className="list-wrapper">

          <div className="list-header">
            <div>
              <h2 className="list-title">All Events</h2>
              <p className="list-subtitle">{events.length} event{events.length !== 1 ? "s" : ""} available</p>
            </div>
            {(user?.role === "admin" || user?.role === "organizer") && (
              <button className="create-btn" onClick={() => navigate("/events/create")}>
                + Create Event
              </button>
            )}
          </div>

          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, venue or date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading && (
            <div className="empty-state">
              <div style={{ fontSize: 28 }}>⏳</div>
              <p>Loading events...</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <div style={{ fontSize: 28 }}>🔎</div>
              <p>{search ? `No events found for "${search}"` : "No events yet."}</p>
            </div>
          )}

          {filtered.map((event) => (
            <div key={event.id} className="event-card">
              <div className="poster-box">
                {event.poster_url ? (
                  <img
                    src={event.poster_url}
                    alt={`${event.name} poster`}
                    onError={(e) => e.target.parentElement.innerHTML = "<span class='poster-emoji'>🎉</span>"}
                  />
                ) : (
                  <span className="poster-emoji">🎉</span>
                )}
              </div>

              <div className="event-body">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="event-name">{event.name}</p>
                  <p className="event-meta">📍 {event.venue}</p>
                  <p className="event-meta">📅 {event.date_time}</p>
                  <p className="event-meta">
                    💰 INR {event.entry_fee?.toFixed(2)} &nbsp;·&nbsp;
                    👥 {event.max_participants} seats
                  </p>
                  {event.description && (
                    <p style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>
                      {event.description}
                    </p>
                  )}
                  <p className="event-creator">Created by: {event.created_by}</p>
                </div>

                <div className="action-col">
                  {user?.role === "guest" && (
                    <button
                      className="btn-register"
                      onClick={() => navigate(`/events/${event.id}/register`)}
                    >Register</button>
                  )}

                  {canModify(event) ? (
                    <>
                      <button className="btn-edit" onClick={() => navigate(`/events/${event.id}/edit`)}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteEvent(event.id)}>Delete</button>
                    </>
                  ) : (
                    user?.role === "organizer" && (
                      <span className="view-only">👁️ View only</span>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}

          {!loading && (
            <p className="count-line">Showing {filtered.length} of {events.length} event(s)</p>
          )}
        </div>
      </div>
    </>
  );
}

export default EventList;