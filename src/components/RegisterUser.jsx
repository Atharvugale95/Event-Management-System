import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

  .auth-root { min-height: 100vh; background: #f8f7f4; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
  .auth-wrapper { width: 100%; max-width: 420px; }
  .auth-back { display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; background: #fff; color: #555; border: 1px solid #e8e4dd; border-radius: 8px; cursor: pointer; transition: all 0.18s; margin-bottom: 1.5rem; }
  .auth-back:hover { background: #f5f3ef; color: #1a1a1a; }
  .auth-brand { text-align: center; margin-bottom: 2rem; }
  .auth-brand-icon { font-size: 36px; display: block; margin-bottom: 0.5rem; }
  .auth-brand-name { font-family: 'Playfair Display', serif; font-size: 22px; color: #1a1a1a; margin: 0 0 4px 0; letter-spacing: -0.2px; }
  .auth-brand-sub { font-size: 13px; color: #aaa; margin: 0; }
  .auth-card { background: #fff; border: 1px solid #e8e4dd; border-radius: 16px; padding: 2rem; }
  .auth-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #1a1a1a; margin: 0 0 1.75rem 0; letter-spacing: -0.2px; }
  .field-group { margin-bottom: 1.1rem; }
  .field-label { display: block; font-size: 12px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; }
  .field-input { width: 100%; padding: 11px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; border: 1.5px solid #e5e2db; border-radius: 9px; background: #fff; color: #1a1a1a; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
  .field-input:focus { border-color: #c8a97e; }
  .field-input::placeholder { color: #bbb; }
  .role-cards { display: flex; flex-direction: column; gap: 0.6rem; }
  .role-card { display: flex; align-items: center; gap: 0.75rem; padding: 12px 14px; border: 1.5px solid #e5e2db; border-radius: 10px; cursor: pointer; transition: all 0.18s; background: #fff; }
  .role-card:hover { border-color: #c8a97e; background: #faf8f5; }
  .role-card.selected { border-color: #1a1a1a; background: #faf8f5; }
  .role-card-icon { font-size: 20px; flex-shrink: 0; }
  .role-card-text { flex: 1; }
  .role-card-name { font-size: 14px; font-weight: 600; color: #1a1a1a; margin: 0 0 2px 0; }
  .role-card-desc { font-size: 12px; color: #aaa; margin: 0; }
  .role-check { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #e5e2db; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.18s; }
  .role-card.selected .role-check { background: #1a1a1a; border-color: #1a1a1a; }
  .role-check-dot { width: 7px; height: 7px; border-radius: 50%; background: #fff; }
  .error-msg { background: #fff0f0; border: 1px solid #f5c6c6; color: #c0392b; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 1rem; }
  .auth-btn { width: 100%; padding: 13px; margin-top: 0.5rem; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; background: #1a1a1a; color: #fff; border: none; border-radius: 9px; cursor: pointer; transition: background 0.2s; }
  .auth-btn:hover { background: #333; }
  .auth-btn:disabled { background: #ccc; cursor: not-allowed; }
  .auth-footer { text-align: center; margin-top: 1.25rem; font-size: 13.5px; color: #aaa; }
  .auth-link { color: #c8a97e; cursor: pointer; font-weight: 500; }
  .auth-link:hover { color: #a88860; }
`;

const roles = [
  { value: "guest",     icon: "🎟️", name: "Guest",     desc: "Browse and register for events" },
  { value: "organizer", icon: "📋", name: "Organizer", desc: "Create and manage events" },
  { value: "admin",     icon: "🛡️", name: "Admin",     desc: "Full access to everything" },
];

function RegisterUser() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("guest");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Registration failed");
        return;
      }

      alert(`Account created as ${role}! Please login.`);
      navigate("/login");

    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="auth-wrapper">

          {/* ✅ Back button */}
          <button className="auth-back" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div className="auth-brand">
            <span className="auth-brand-icon">🏆</span>
            <h1 className="auth-brand-name">Eventify</h1>
            <p className="auth-brand-sub">Create your account</p>
          </div>

          <div className="auth-card">
            <h2 className="auth-title">Join the festival</h2>

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label">Email Address</label>
                <input
                  className="field-input"
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label">Password</label>
                <input
                  className="field-input"
                  type="password"
                  placeholder="Min 6 characters"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label">Register as</label>
                <div className="role-cards">
                  {roles.map((r) => (
                    <div
                      key={r.value}
                      className={`role-card ${role === r.value ? "selected" : ""}`}
                      onClick={() => setRole(r.value)}
                    >
                      <span className="role-card-icon">{r.icon}</span>
                      <div className="role-card-text">
                        <p className="role-card-name">{r.name}</p>
                        <p className="role-card-desc">{r.desc}</p>
                      </div>
                      <div className="role-check">
                        {role === r.value && <div className="role-check-dot" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {error && <div className="error-msg">⚠️ {error}</div>}

              <button className="auth-btn" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </div>

          <p className="auth-footer">
            Already have an account?{" "}
            <span className="auth-link" onClick={() => navigate("/login")}>
              Sign in here
            </span>
          </p>

        </div>
      </div>
    </>
  );
}

export default RegisterUser;