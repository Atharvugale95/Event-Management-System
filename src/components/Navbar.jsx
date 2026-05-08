import { useNavigate, useLocation } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    height: 58px;
    background: #fff;
    border-bottom: 1px solid #e8e4dd;
    position: sticky;
    top: 0;
    z-index: 100;
    font-family: 'DM Sans', sans-serif;
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    background: #f5f3ef;
    color: #555;
    border: 1px solid #e8e4dd;
    border-radius: 7px;
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
  }
  .back-btn:hover { background: #edeae4; color: #1a1a1a; }

  .nav-divider {
    width: 1px;
    height: 20px;
    background: #e8e4dd;
  }

  .brand {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    cursor: pointer;
    letter-spacing: -0.2px;
    white-space: nowrap;
  }
  .brand:hover { color: #555; }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-role-badge {
    font-size: 11.5px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    text-transform: capitalize;
    letter-spacing: 0.3px;
  }

  .role-admin    { background: #fef3c7; color: #92400e; }
  .role-organizer { background: #dbeafe; color: #1e40af; }
  .role-guest    { background: #dcfce7; color: #166534; }

  .nav-email {
    font-size: 13px;
    color: #888;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .logout-btn {
    padding: 6px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    background: none;
    border: 1px solid #e8e4dd;
    color: #888;
    border-radius: 7px;
    cursor: pointer;
    transition: all 0.18s;
  }
  .logout-btn:hover { border-color: #e24b4a; color: #e24b4a; background: #fff5f5; }

  .login-btn {
    padding: 6px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    background: #1a1a1a;
    border: none;
    color: #fff;
    border-radius: 7px;
    cursor: pointer;
    transition: background 0.18s;
  }
  .login-btn:hover { background: #333; }
`;

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user  = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const hideOn = ["/login", "/user-register"];
  if (hideOn.includes(location.pathname)) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ✅ pages where back button doesn't make sense
  const hideBackOn = ["/", "/admin", "/organizer", "/guest"];
  const showBack = !hideBackOn.includes(location.pathname);

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar">

        {/* Left — back button + brand */}
        <div className="navbar-left">
          {showBack && (
            <>
              <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back
              </button>
              <div className="nav-divider" />
            </>
          )}
          <span className="brand" onClick={() => navigate("/")}>
            🏆 Eventify
          </span>
        </div>

        {/* Right — user info + logout */}
        <div className="navbar-right">
          {token && user ? (
            <>
              {/* ✅ role badge */}
              <span className={`nav-role-badge role-${user.role}`}>
                {user.role}
              </span>
              <span className="nav-email">{user.email}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>

      </nav>
    </>
  );
}

export default Navbar;