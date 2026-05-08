import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
  .org-root { min-height: 100vh; background: #f8f7f4; font-family: 'DM Sans', sans-serif; padding: 2rem 1rem; }
  .org-wrapper { max-width: 780px; margin: 0 auto; }
  .org-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.75rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e5e2db; }
  .org-title { font-family: 'Playfair Display', serif; font-size: 26px; color: #1a1a1a; margin: 0 0 4px 0; letter-spacing: -0.3px; }
  .org-subtitle { font-size: 13px; color: #999; margin: 0; }
  .org-subtitle strong { color: #666; font-weight: 500; }
  .create-btn { padding: 9px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; background: #1a1a1a; color: #fff; border: none; border-radius: 8px; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
  .create-btn:hover { background: #333; }
  .stats-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1.75rem; }
  .stat-card { background: #fff; border: 1px solid #e8e4dd; border-radius: 12px; padding: 1.1rem 1.5rem; display: flex; align-items: center; gap: 1rem; }
  .stat-icon { font-size: 26px; line-height: 1; }
  .stat-value { font-size: 26px; font-weight: 600; color: #1a1a1a; line-height: 1; }
  .stat-label { font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 0.7px; margin-top: 2px; }
  .tabs { display: flex; gap: 4px; background: #fff; border: 1px solid #e8e4dd; border-radius: 10px; padding: 4px; margin-bottom: 1.25rem; }
  .tab-btn { flex: 1; padding: 8px 12px; border: none; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.18s; background: transparent; color: #888; }
  .tab-btn.active { background: #1a1a1a; color: #fff; }
  .search-wrap { position: relative; margin-bottom: 1.25rem; }
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #bbb; font-size: 14px; pointer-events: none; }
  .search-input { width: 100%; padding: 10px 14px 10px 40px; font-family: 'DM Sans', sans-serif; font-size: 13.5px; border: 1.5px solid #e5e2db; border-radius: 9px; background: #fff; color: #1a1a1a; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
  .search-input:focus { border-color: #c8a97e; }
  .search-input::placeholder { color: #bbb; }
  .event-card { background: #fff; border: 1px solid #e8e4dd; border-radius: 12px; margin-bottom: 1rem; overflow: hidden; transition: box-shadow 0.2s; }
  .event-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
  .event-poster-wrap { width: 100%; height: 130px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .event-poster-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .event-body { padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
  .event-name { font-size: 15px; font-weight: 600; color: #1a1a1a; margin: 0 0 5px 0; }
  .event-meta { font-size: 12.5px; color: #888; margin: 2px 0; display: flex; gap: 12px; flex-wrap: wrap; }
  .event-owner { font-size: 11.5px; margin-top: 4px; }
  .action-group { display: flex; gap: 0.5rem; flex-shrink: 0; flex-direction: column; align-items: flex-end; }
  .btn-edit { padding: 7px 14px; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500; background: #edf4ff; color: #3a6db5; border: 1px solid #cfe0fa; border-radius: 7px; cursor: pointer; transition: background 0.18s; }
  .btn-edit:hover { background: #ddeaff; }
  .btn-delete { padding: 7px 14px; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500; background: #fff0f0; color: #c0392b; border: 1px solid #f5c6c6; border-radius: 7px; cursor: pointer; transition: background 0.18s; }
  .btn-delete:hover { background: #ffe0e0; }
  .view-only { font-size: 11px; color: #aaa; border: 1px solid #eee; border-radius: 6px; padding: 5px 10px; white-space: nowrap; }
  .reg-card { background: #fff; border: 1px solid #e8e4dd; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 0.875rem; transition: box-shadow 0.2s; }
  .reg-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
  .reg-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
  .reg-id { font-size: 11px; color: #bbb; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  .reg-name { font-size: 15px; font-weight: 600; color: #1a1a1a; margin: 2px 0 6px; }
  .reg-meta { font-size: 12.5px; color: #888; margin: 3px 0; }
  .status-badge { display: inline-block; font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: 20px; background: #dcfce7; color: #166534; }
  .reg-event-tag { display: inline-block; margin-top: 6px; font-size: 12px; font-weight: 500; padding: 3px 10px; border-radius: 20px; background: #f2ede6; color: #8a6a3e; }
  .reg-date { font-size: 11px; color: #ccc; margin-top: 6px; }
  .empty-state { text-align: center; padding: 2.5rem 1rem; }
  .empty-state p { font-size: 13.5px; margin: 6px 0 0; color: #bbb; }
  .count-line { font-size: 12px; color: #bbb; text-align: right; margin-top: 0.25rem; }
  .error-msg { background: #fff0f0; border: 1px solid #f5c6c6; color: #c0392b; padding: 10px 14px; border-radius: 8px; font-size: 13.5px; margin-bottom: 1rem; }
`;

function OrganizerDashboard() {
  const navigate = useNavigate();
  const user  = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const headers = { "Authorization": `Bearer ${token}` };

  const [tab, setTab]                     = useState("events");
  const [events, setEvents]               = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [search, setSearch]               = useState("");

  useEffect(() => { setSearch(""); }, [tab]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [evRes, regRes] = await Promise.all([
          fetch("http://localhost:8000/events"),
          fetch("http://localhost:8000/registrations", { headers }),
        ]);
        if (regRes.status === 401) { localStorage.clear(); navigate("/login"); return; }
        if (regRes.status === 403) { setError("Access denied."); return; }
        setEvents(await evRes.json());
        setRegistrations(await regRes.json());
      } catch {
        setError("Cannot connect to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    const res = await fetch(`http://localhost:8000/events/${id}`, { method: "DELETE", headers });
    if (res.ok) {
      setEvents(events.filter((e) => e.id !== id));
    } else {
      const data = await res.json();
      alert(data.detail || "Cannot delete this event");
    }
  };

  const filteredEvents = events.filter((e) => {
    const q = search.toLowerCase();
    return e.name?.toLowerCase().includes(q) || e.venue?.toLowerCase().includes(q) || e.date_time?.toLowerCase().includes(q);
  });

  const filteredRegs = registrations.filter((r) => {
    const q = search.toLowerCase();
    return r.participant?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q) || r.college?.toLowerCase().includes(q) || r.event_name?.toLowerCase().includes(q);
  });

  // ✅ helper — organizer owns this event?
  const isOwner = (event) => event.created_by === user?.email;

  return (
    <>
      <style>{styles}</style>
      <div className="org-root">
        <div className="org-wrapper">

          <div className="org-header">
            <div>
              <h2 className="org-title">Organizer Dashboard</h2>
              <p className="org-subtitle">Signed in as <strong>{user?.email}</strong></p>
            </div>
            <button className="create-btn" onClick={() => navigate("/events/create")}>
              + Create Event
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-icon">🎉</span>
              <div>
                <div className="stat-value">{events.length}</div>
                <div className="stat-label">Total Events</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📋</span>
              <div>
                <div className="stat-value">{registrations.length}</div>
                <div className="stat-label">Registrations</div>
              </div>
            </div>
          </div>

          <div className="tabs">
            <button className={`tab-btn ${tab === "events" ? "active" : ""}`} onClick={() => setTab("events")}>🎉 Events</button>
            <button className={`tab-btn ${tab === "registrations" ? "active" : ""}`} onClick={() => setTab("registrations")}>📋 Registrations</button>
          </div>

          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input type="text" className="search-input"
              placeholder={tab === "events" ? "Search by event name, venue or date..." : "Search by participant, email or college..."}
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {error && <div className="error-msg">⚠️ {error}</div>}
          {loading && <div className="empty-state"><div style={{ fontSize: 28 }}>⏳</div><p>Loading data...</p></div>}

          {/* Events tab */}
          {!loading && tab === "events" && (
            <>
              {filteredEvents.length === 0 ? (
                <div className="empty-state"><div style={{ fontSize: 28 }}>🔎</div><p>{search ? `No events found for "${search}"` : "No events yet."}</p></div>
              ) : filteredEvents.map((e) => (
                <div key={e.id} className="event-card">
                  <div className="event-poster-wrap">
                    {e.poster_url ? (
                      <img src={e.poster_url} alt={e.name} onError={(ev) => ev.target.parentElement.innerHTML = "<span style='font-size:28px'>🎉</span>"} />
                    ) : (
                      <span style={{ fontSize: "28px" }}>🎉</span>
                    )}
                  </div>
                  <div className="event-body">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="event-name">{e.name}</p>
                      <p className="event-meta"><span>📍 {e.venue}</span><span>📅 {e.date_time}</span></p>
                      <p className="event-meta"><span>💰 INR {e.entry_fee?.toFixed(2)}</span><span>👥 {e.max_participants} seats</span></p>
                      {/* ✅ show ownership label */}
                      <p className="event-owner" style={{ color: isOwner(e) ? "#357a35" : "#bbb" }}>
                        {isOwner(e) ? "✅ Your event" : `👤 by ${e.created_by}`}
                      </p>
                    </div>
                    <div className="action-group">
                      {/* ✅ only show edit/delete if organizer owns this event */}
                      {isOwner(e) ? (
                        <>
                          <button className="btn-edit" onClick={() => navigate(`/events/${e.id}/edit`)}>Edit</button>
                          <button className="btn-delete" onClick={() => deleteEvent(e.id)}>Delete</button>
                        </>
                      ) : (
                        <span className="view-only">👁️ View only</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <p className="count-line">Showing {filteredEvents.length} of {events.length} event(s)</p>
            </>
          )}

          {/* Registrations tab */}
          {!loading && tab === "registrations" && (
            <>
              {filteredRegs.length === 0 ? (
                <div className="empty-state"><div style={{ fontSize: 28 }}>🔎</div><p>{search ? `No results for "${search}"` : "No registrations yet."}</p></div>
              ) : filteredRegs.map((r) => (
                <div key={r.id} className="reg-card">
                  <div className="reg-top">
                    <div>
                      <p className="reg-id">Registration #{r.id}</p>
                      <p className="reg-name">{r.participant}</p>
                    </div>
                    <span className="status-badge">{r.status}</span>
                  </div>
                  <p className="reg-meta">📧 {r.email} &nbsp;·&nbsp; 📞 {r.phone}</p>
                  {r.college && <p className="reg-meta">🏫 {r.college}</p>}
                  <div style={{ marginTop: "6px" }}>
                    <span className="reg-event-tag">🎉 {r.event_name}</span>
                  </div>
                  <p className="reg-date">{new Date(r.created_at).toLocaleString()}</p>
                </div>
              ))}
              <p className="count-line">Showing {filteredRegs.length} of {registrations.length} registration(s)</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default OrganizerDashboard;