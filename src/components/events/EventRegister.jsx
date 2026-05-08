import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

  .reg-root { min-height: 100vh; background: #f8f7f4; font-family: 'DM Sans', sans-serif; padding: 2rem 1rem; }
  .reg-wrapper { max-width: 560px; margin: 0 auto; }
  .event-info-card { background: #fff; border: 1px solid #e8e4dd; border-radius: 14px; overflow: hidden; margin-bottom: 1.5rem; }
  .event-poster-box { width: 100%; height: 220px; background: #f5f3ef; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .event-poster-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .event-info-body { padding: 1.25rem; }
  .event-info-name { font-family: 'Playfair Display', serif; font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0; }
  .event-info-meta { font-size: 13px; color: #888; margin: 4px 0; }
  .event-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .badge { font-size: 12px; font-weight: 500; padding: 3px 10px; border-radius: 20px; background: #f2ede6; color: #8a6a3e; }
  .badge-full { background: #fee2e2; color: #991b1b; }
  .badge-almost { background: #fef3c7; color: #92400e; }
  .badge-open { background: #dcfce7; color: #166534; }
  .capacity-bar-wrap { margin-top: 10px; }
  .capacity-bar-bg { background: #f0ebe3; border-radius: 99px; height: 6px; overflow: hidden; }
  .capacity-bar-fill { height: 100%; border-radius: 99px; transition: width 0.3s; }
  .capacity-text { font-size: 11.5px; color: #bbb; margin-top: 4px; }
  .form-card { background: #fff; border: 1px solid #e8e4dd; border-radius: 14px; padding: 1.75rem; }
  .form-title { font-family: 'Playfair Display', serif; font-size: 20px; color: #1a1a1a; margin: 0 0 1.5rem 0; }
  .field-group { margin-bottom: 1.1rem; }
  .field-label { display: block; font-size: 12px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 5px; }
  .field-input { width: 100%; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; border: 1.5px solid #e5e2db; border-radius: 9px; background: #fff; color: #1a1a1a; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
  .field-input:focus { border-color: #c8a97e; }
  .field-input::placeholder { color: #bbb; }
  .error-msg { background: #fff0f0; border: 1px solid #f5c6c6; color: #c0392b; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-top: 0.75rem; }
  .submit-btn { width: 100%; padding: 13px; margin-top: 1.25rem; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; background: #1a1a1a; color: #fff; border: none; border-radius: 9px; cursor: pointer; transition: background 0.2s; }
  .submit-btn:hover { background: #333; }
  .submit-btn:disabled { background: #ccc; cursor: not-allowed; }
  .full-box { text-align: center; padding: 2rem; background: #fff5f5; border-radius: 10px; border: 1px solid #fecaca; }
  .full-box-title { font-weight: 600; color: #991b1b; font-size: 16px; margin: 0.5rem 0 0.25rem; }
  .full-box-sub { color: #888; font-size: 13px; margin: 0 0 1rem; }
  .back-btn { padding: 10px 20px; background: #1a1a1a; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; }
  .back-btn:hover { background: #333; }
  .loading-state { text-align: center; padding: 3rem 1rem; color: #bbb; font-family: 'DM Sans', sans-serif; }
`;

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

function EventRegister() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const [formData, setFormData] = useState({
    participant: "", phone: "", email: "", college: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:8000/events/${id}`)
      .then((r) => r.json())
      .then(setEvent)
      .catch(() => setError("Event not found"));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, event_id: parseInt(id) }),
      });

      const data = await res.json();

      if (res.status === 401) { localStorage.clear(); navigate("/login"); return; }
      if (!res.ok) { setError(data.detail); return; }

      navigate("/success", { state: data });

    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  if (!event) return (
    <>
      <style>{styles}</style>
      <div className="loading-state"><p>Loading event...</p></div>
    </>
  );

  const isFull = event.registered_count >= event.max_participants;

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">
        <div className="reg-wrapper">

          {/* Event info card */}
          <div className="event-info-card">
            <div className="event-poster-box">
              {event.poster_url ? (
                <img
                  src={event.poster_url}
                  alt={`${event.name} poster`}
                  onError={(e) => e.target.parentElement.innerHTML = "<span style='font-size:36px'>🎉</span>"}
                />
              ) : (
                <span style={{ fontSize: "36px" }}>🎉</span>
              )}
            </div>

            <div className="event-info-body">
              <h3 className="event-info-name">{event.name}</h3>
              <p className="event-info-meta">📍 {event.venue}</p>
              <p className="event-info-meta">📅 {event.date_time}</p>
              <p className="event-info-meta">💰 INR {event.entry_fee?.toFixed(2)}</p>

              {event.description && (
                <p style={{ fontSize: "13px", color: "#aaa", marginTop: "8px" }}>
                  {event.description}
                </p>
              )}

              <div className="event-badges">
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
            </div>
          </div>

          {/* ✅ Show form OR full message */}
          <div className="form-card">
            {isFull ? (
              // ✅ Event is full — block registration
              <div className="full-box">
                <p style={{ fontSize: "32px", margin: 0 }}>🔴</p>
                <p className="full-box-title">Registrations Closed</p>
                <p className="full-box-sub">
                  This event has reached its maximum capacity of {event.max_participants} participants.
                </p>
                <button className="back-btn" onClick={() => navigate(-1)}>
                  ← Go Back
                </button>
              </div>
            ) : (
              // ✅ Event has space — show form
              <>
                <h2 className="form-title">Register for Event</h2>

                <form onSubmit={handleSubmit}>
                  <div className="field-group">
                    <label className="field-label">Participant Name *</label>
                    <input className="field-input" name="participant" placeholder="Your full name" onChange={handleChange} required />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Phone Number</label>
                    <input className="field-input" name="phone" type="tel" placeholder="10-digit number" onChange={handleChange} maxLength={10} />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Email Address *</label>
                    <input className="field-input" name="email" type="email" placeholder="Your email" onChange={handleChange} required />
                  </div>

                  <div className="field-group">
                    <label className="field-label">College / Organization</label>
                    <input className="field-input" name="college" placeholder="Your college or organization" onChange={handleChange} />
                  </div>

                  {error && <div className="error-msg">⚠️ {error}</div>}

                  <button className="submit-btn" disabled={loading}>
                    {loading ? "Registering..." : "Confirm Registration"}
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default EventRegister;