import { useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import StationList from "./StationList";
import StationDetails from "./StationDetails";
import StationHeadDashboard from "./StationHeadDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

import TrueFocus from "./TrueFocus";
import "./TrueFocus.css";

const logoUrl = process.env.PUBLIC_URL + "/tcil-logo.png";

const keyframesCSS = `
@keyframes backgroundShift {
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
}

@keyframes logoRotate {
  0% { transform: rotateY(0deg);}
  50% { transform: rotateY(20deg);}
  100% { transform: rotateY(0deg);}
}

@keyframes cardFloatShadow {
  0%, 100% {
    box-shadow: 0 20px 45px rgba(33, 150, 243, 0.35);
    transform: translateY(0);
  }
  50% {
    box-shadow: 0 30px 60px rgba(33, 150, 243, 0.45);
    transform: translateY(-8px);
  }
}

@keyframes logoutBtnBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
`;

const styles = {
  background: {
    minHeight: "100vh",
    background:
      "linear-gradient(270deg, #006fd66f, #0093d4, #0a8ef7, #0191ff, #006dd6)",
    backgroundSize: "300% 300%",
    animation: "backgroundShift 30s ease infinite",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },

  navbar: {
    position: "sticky",
    top: 0,
    background: "linear-gradient(90deg, #006fd6 78%, #0093d4 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    padding: "10px 40px",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
    zIndex: 20,
  },

  logo: {
    height: 78,
    width: 78,
    objectFit: "contain",
    borderRadius: "16%",
    marginRight: 18,
    backgroundColor: "#fff",
    border: "2.5px solid #e0f1ff",
    animation: "logoRotate 20s linear infinite",
    transformStyle: "preserve-3d",
  },

  titleContainer: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
  },

  userBadge: {
    background: "rgba(255, 255, 255, 0.2)",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    marginRight: "15px",
    backdropFilter: "blur(10px)",
  },

  card: {
    margin: "0 auto 40px auto",
    maxWidth: 1100,
    background: "white",
    borderRadius: 18,
    boxShadow: "0 20px 45px rgba(33, 150, 243, 0.35)",
    padding: "30px 40px 50px 40px",
    animation: "cardFloatShadow 6s ease infinite",
    transition: "transform 0.5s ease, box-shadow 0.5s ease",
    transformStyle: "preserve-3d",
  },

  header: {
    marginBottom: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #dee7f3",
    paddingBottom: 12,
  },

  navLink: {
    fontWeight: 600,
    fontSize: 17,
    color: "#1966d2",
    textDecoration: "none",
    marginRight: 20,
    userSelect: "none",
  },

  logoutBtn: {
    fontWeight: 600,
    fontSize: 15,
    color: "white",
    backgroundColor: "#d33c46",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    userSelect: "none",
    transition: "background-color 0.25s, transform 0.3s",
    animation: "logoutBtnBounce 3s ease infinite",
    transformStyle: "preserve-3d",
  },

  logoutBtnHover: {
    backgroundColor: "#b52f37",
    transform: "translateY(-6px) scale(1.05)",
    boxShadow: "0 8px 20px rgba(211, 60, 70, 0.75)",
  },

  quote: {
    backgroundColor: "#0073d263",
    color: "#d3e5fb",
    fontStyle: "italic",
    fontSize: 14,
    padding: "6px 24px",
    borderRadius: "0 0 12px 12px",
    textAlign: "center",
    userSelect: "none",
    boxShadow: "inset 0 0 15px #0b54d840",
    marginBottom: 24,
  },

  container: {
    maxWidth: 1100,
    margin: "24px auto",
    padding: "0 16px 90px 16px",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: "#1b2232",
  },

  footer: {
    marginTop: 48,
    padding: "18px 0 15px",
    borderTop: "1px solid #dee3e8",
    textAlign: "center",
    fontSize: 14,
    fontWeight: 500,
    color: "#64707a",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    userSelect: "none",
  },
};

// Helper function to decode JWT
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default function Dashboard({ token, logout }) {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoutHover, setLogoutHover] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    // Decode JWT to get user info
    const decoded = parseJwt(token);
    if (decoded) {
      setUserInfo(decoded);
    }

    fetch("http://localhost:4000/api/stations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          if (mounted.current) {
            logout();
            navigate("/login");
          }
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (mounted.current) {
          if (data) setStations(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted.current) setLoading(false);
      });

    return () => {
      mounted.current = false;
    };
  }, [token, logout, navigate]);

  if (loading)
    return (
      <div
        style={{
          padding: 50,
          fontSize: 22,
          textAlign: "center",
          color: "#228dc1",
        }}
      >
        Loading stations...
      </div>
    );

  // Role-based routing
  const isStationHead = userInfo?.role === 'head';
  const isEmployee = userInfo?.role === 'employee';

  return (
    <>
      <style>{keyframesCSS}</style>

      <div style={styles.background}>
        <nav style={styles.navbar}>
          <img src={logoUrl} alt="TCIL Logo" style={styles.logo} />
          <div style={styles.titleContainer}>
            <TrueFocus
              sentence="TCIL CCTV PORTAL"
              manualMode={false}
              blurAmount={5}
              borderColor="#1ab8ff"
              glowColor="rgba(57, 189, 253, 0.85)"
              animationDuration={2}
              pauseBetweenAnimations={1.5}
            />
          </div>
          {userInfo && (
            <div style={styles.userBadge}>
              {userInfo.role === 'head' ? '👮 Station Head' : '👨‍💼 TCIL Employee'}: {userInfo.username}
            </div>
          )}
        </nav>

        <div style={styles.quote}>{"\" Leading the way in smart surveillance\""}</div>

        <main style={styles.container}>
          <div style={styles.card}>
            <header style={styles.header}>
              <nav>
                {isStationHead && (
                  <Link to="/dashboard" style={styles.navLink}>
                    My Dashboard
                  </Link>
                )}
                {isEmployee && (
                  <Link to="/dashboard" style={styles.navLink}>
                    Employee Dashboard
                  </Link>
                )}
                {!isStationHead && !isEmployee && (
                  <Link to="/dashboard" style={styles.navLink}>
                    Stations
                  </Link>
                )}
              </nav>
              <button
                style={logoutHover ? { ...styles.logoutBtn, ...styles.logoutBtnHover } : styles.logoutBtn}
                onMouseEnter={() => setLogoutHover(true)}
                onMouseLeave={() => setLogoutHover(false)}
                onClick={logout}
                aria-label="Logout"
              >
                Logout
              </button>
            </header>

            <Routes>
              <Route 
                path="/" 
                element={
                  isStationHead ? (
                    <StationHeadDashboard token={token} userInfo={userInfo} />
                  ) : isEmployee ? (
                    <EmployeeDashboard token={token} userInfo={userInfo} />
                  ) : (
                    <StationList stations={stations} />
                  )
                } 
              />
              <Route
                path="station/:id"
                element={
                  <StationDetails
                    token={token}
                    stations={stations}
                    setStations={setStations}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </main>

        <footer style={styles.footer}>
          &copy; 2025 — TCIL CCTV Portal — Powered by Delhi Police
        </footer>
      </div>
    </>
  );
}