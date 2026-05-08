import { useLocation, useNavigate } from "react-router-dom";

function Success() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="page">
        <div className="card">
          <p>No registration data found.</p>
          <button className="submit-btn" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card" style={{ textAlign: "center" }}>
        
        {/* Success Icon */}
        <div style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#e8f5e9",
          color: "#2e7d32",
          fontSize: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 15px"
        }}>
          ✓
        </div>

        <h2 style={{ color: "#2e7d32" }}>Registration Successful</h2>

        {/* Details Box */}
        <div style={{
          background: "#f9f9f9",
          borderRadius: 10,
          padding: "15px",
          textAlign: "left",
          marginTop: "15px",
          fontSize: "14px"
        }}>
          <p><strong>🆔 ID:</strong> {state.id}</p>
          <p><strong>👤 Name:</strong> {state.participant}</p>
          <p><strong>📧 Email:</strong> {state.email}</p>
          <p><strong>📞 Phone:</strong> {state.phone}</p>
          <p><strong>🏫 College:</strong> {state.college || "N/A"}</p>
          <p><strong>🎉 Event:</strong> {state.event}</p>
          <p><strong>💰 Fee:</strong> {state.fee}</p>
          <p><strong>✅ Status:</strong> {state.status}</p>
          <p><strong>📅 Date:</strong> {new Date(state.created_at).toLocaleString()}</p>
        </div>

        {/* Buttons */}
        <button
          className="submit-btn"
          style={{ marginTop: "15px" }}
          onClick={() => navigate("/register")}
        >
          Register Another
        </button>

        <button
          className="submit-btn"
          style={{ marginTop: "10px", background: "#888" }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>

      </div>
    </div>
  );
}

export default Success;