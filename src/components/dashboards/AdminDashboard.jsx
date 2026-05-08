import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
  .dash-root { min-height: 100vh; background: #f8f7f4; font-family: 'DM Sans', sans-serif; padding: 2rem 1rem; }
  .dash-wrapper { max-width: 780px; margin: 0 auto; }
  .dash-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.75rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e5e2db; }
  .dash-title { font-family: 'Playfair Display', serif; font-size: 26px; color: #1a1a1a; margin: 0 0 4px 0; letter-spacing: -0.3px; }
  .dash-subtitle { font-size: 13px; color: #999; margin: 0; }
  .dash-subtitle strong { color: #666; font-weight: 500; }
  .create-btn { padding: 9px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; background: #1a1a1a; color: #fff; border: none; border-radius: 8px; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
  .create-btn:hover { background: #333; }
  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.75rem; }
  .stat-card { background: #fff; border: 1px solid #e8e4dd; border-radius: 12px; padding: 1rem 1.25rem; text-align: center; }
  .stat-value { font-size: 28px; font-weight: 600; color: #1a1a1a; line-height: 1; margin-bottom: 4px; }
  .stat-label { font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 0.8px; }
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
  .event-poster-wrap { width: 100%; height: 140px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .event-poster-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .event-body { padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
  .event-name { font-size: 15px; font-weight: 600; color: #1a1a1a; margin: 0 0 5px 0; }
  .event-meta { font-size: 12.5px; color: #888; margin: 2px 0; display: flex; gap: 10px; flex-wrap: wrap; }
  .event-created { font-size: 11.5px; color: #bbb; margin-top: 4px; }
  .action-group { display: flex; gap: 0.5rem; flex-shrink: 0; flex-direction: column; }
  .btn-edit { padding: 7px 14px; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500; background: #edf4ff; color: #3a6db5; border: 1px solid #cfe0fa; border-radius: 7px; cursor: pointer; transition: background 0.18s; }
  .btn-edit:hover { background: #ddeaff; }
  .btn-delete { padding: 7px 14px; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500; background: #fff0f0; color: #c0392b; border: 1px solid #f5c6c6; border-radius: 7px; cursor: pointer; transition: background 0.18s; }
  .btn-delete:hover { background: #ffe0e0; }
  .reg-card { background: #fff; border: 1px solid #e8e4dd; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 0.875rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; transition: box-shadow 0.2s; }
  .reg-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
  .reg-id { font-size: 11px; color: #bbb; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .reg-name { font-size: 15px; font-weight: 600; color: #1a1a1a; margin-bottom: 4px; }
  .reg-meta { font-size: 12.5px; color: #888; margin: 2px 0; }
  .reg-event-tag { display: inline-block; margin-top: 6px; font-size: 12px; font-weight: 500; padding: 3px 10px; border-radius: 20px; background: #f0f9f0; color: #357a35; }
  .user-card { background: #fff; border: 1px solid #e8e4dd; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 0.875rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; transition: box-shadow 0.2s; }
  .user-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
  .user-email { font-size: 14.5px; font-weight: 500; color: #1a1a1a; margin-bottom: 5px; }
  .role-badge { display: inline-block; font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: 20px; text-transform: capitalize; letter-spacing: 0.3px; }
  .role-admin { background: #fef3c7; color: #92400e; }
  .role-organizer { background: #dbeafe; color: #1e40af; }
  .role-guest { background: #dcfce7; color: #166534; }
  .empty-state { text-align: center; padding: 2.5rem 1rem; color: #ccc; }
  .empty-state p { font-size: 13.5px; margin: 6px 0 0; color: #bbb; }
  .count-line { font-size: 12px; color: #bbb; text-align: right; margin-top: 0.25rem; }
`;

function AdminDashboard() {
  const navigate = useNavigate();
  const user  = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const headers = { "Authorization": `Bearer ${token}` };

  const [tab, setTab]                     = useState("events");
  const [events, setEvents]               = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");

  useEffect(() => { setSearch(""); }, [tab]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [evRes, regRes, userRes] = await Promise.all([
          fetch("http://localhost:8000/events"),
          fetch("http://localhost:8000/registrations", { headers }),
          fetch("http://localhost:8000/users",         { headers }),
        ]);
        if (regRes.status === 401) { localStorage.clear(); navigate("/login"); return; }
        setEvents(await evRes.json());
        setRegistrations(await regRes.json());
        setUsers(await userRes.json());
      } catch {
        alert("Cannot connect to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    await fetch(`http://localhost:8000/events/${id}`, { method: "DELETE", headers });
    setEvents(events.filter((e) => e.id !== id));
  };

  const deleteRegistration = async (id) => {
    if (!confirm("Delete this registration?")) return;
    await fetch(`http://localhost:8000/registrations/${id}`, { method: "DELETE", headers });
    setRegistrations(registrations.filter((r) => r.id !== id));
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`http://localhost:8000/users/${id}`, { method: "DELETE", headers });
    setUsers(users.filter((u) => u.id !== id));
  };

  const filteredEvents = events.filter((e) => {
    const q = search.toLowerCase();
    return e.name?.toLowerCase().includes(q) || e.venue?.toLowerCase().includes(q) || e.date_time?.toLowerCase().includes(q);
  });

  const filteredRegs = registrations.filter((r) => {
    const q = search.toLowerCase();
    return r.participant?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q) || r.college?.toLowerCase().includes(q) || r.event_name?.toLowerCase().includes(q);
  });

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q);
  });

  const searchPlaceholder = {
    events: "Search by event name, venue or date...",
    registrations: "Search by participant, email or college...",
    users: "Search by email or role...",
  };

  return (
    <>
      <style>{styles}</style>
      <div className="dash-root">
        <div className="dash-wrapper">

          <div className="dash-header">
            <div>
              <h2 className="dash-title">Admin Dashboard</h2>
              <p className="dash-subtitle">Signed in as <strong>{user?.email}</strong></p>
            </div>
            <button className="create-btn" onClick={() => navigate("/events/create")}>
              + Create Event
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">{events.length}</div>
              <div className="stat-label">Events</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{registrations.length}</div>
              <div className="stat-label">Registrations</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{users.length}</div>
              <div className="stat-label">Users</div>
            </div>
          </div>

          <div className="tabs">
            {["events", "registrations", "users"].map((t) => (
              <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {{ events: "🎉 Events", registrations: "📋 Registrations", users: "👥 Users" }[t]}
              </button>
            ))}
          </div>

          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input type="text" className="search-input" placeholder={searchPlaceholder[tab]} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {loading && <div className="empty-state"><div style={{ fontSize: 28 }}>⏳</div><p>Loading data...</p></div>}

          {/* Events tab */}
          {!loading && tab === "events" && (
            <>
              {filteredEvents.length === 0 ? (
                <div className="empty-state"><div style={{ fontSize: 28 }}>🔎</div><p>{search ? `No events for "${search}"` : "No events yet."}</p></div>
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
                      {/* ✅ show creator so admin knows who made it */}
                      <p className="event-created">
                        Created by: <strong>{e.created_by}</strong>
                      </p>
                    </div>
                    {/* ✅ admin always sees edit + delete for ALL events */}
                    <div className="action-group">
                      <button className="btn-edit" onClick={() => navigate(`/events/${e.id}/edit`)}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteEvent(e.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              <p className="count-line">Showing {filteredEvents.length} of {events.length}</p>
            </>
          )}

          {/* Registrations tab */}
          {!loading && tab === "registrations" && (
            <>
              {filteredRegs.length === 0 ? (
                <div className="empty-state"><div style={{ fontSize: 28 }}>🔎</div><p>{search ? `No results for "${search}"` : "No registrations yet."}</p></div>
              ) : filteredRegs.map((r) => (
                <div key={r.id} className="reg-card">
                  <div>
                    <p className="reg-id">Registration #{r.id}</p>
                    <p className="reg-name">{r.participant}</p>
                    <p className="reg-meta">📧 {r.email} &nbsp;·&nbsp; 📞 {r.phone}</p>
                    {r.college && <p className="reg-meta">🏫 {r.college}</p>}
                    <span className="reg-event-tag">🎉 {r.event_name}</span>
                    <p style={{ fontSize: "11px", color: "#ccc", marginTop: "6px" }}>{new Date(r.created_at).toLocaleString()}</p>
                  </div>
                  <button className="btn-delete" onClick={() => deleteRegistration(r.id)}>Delete</button>
                </div>
              ))}
              <p className="count-line">Showing {filteredRegs.length} of {registrations.length}</p>
            </>
          )}

          {/* Users tab */}
          {!loading && tab === "users" && (
            <>
              {filteredUsers.length === 0 ? (
                <div className="empty-state"><div style={{ fontSize: 28 }}>🔎</div><p>{search ? `No users for "${search}"` : "No users yet."}</p></div>
              ) : filteredUsers.map((u) => (
                <div key={u.id} className="user-card">
                  <div>
                    <p className="user-email">{u.email}</p>
                    <span className={`role-badge role-${u.role}`}>{u.role}</span>
                  </div>
                  <button className="btn-delete" onClick={() => deleteUser(u.id)}>Delete</button>
                </div>
              ))}
              <p className="count-line">Showing {filteredUsers.length} of {users.length}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;