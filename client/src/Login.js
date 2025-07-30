import { useState } from 'react';
import TrueFocus from './TrueFocus';
import Silk from './Silk'; // 🧵 Importing Silk background

const logoUrl = process.env.PUBLIC_URL + '/tcil-logo.png';

const keyframes = `
@keyframes popIn {
  0% { opacity: 0; transform: scale(0.97);}
  100% { opacity: 1; transform: scale(1);}
}
@keyframes shake {
  0%, 100% { transform: translateX(0);}
  20%, 60% { transform: translateX(-8px);}
  40%, 80% { transform: translateX(8px);}
}
`;

// 🎨 Updated navbar with React Bits styling
const navbarStyle = {
  width: '100%',
  background: 'linear-gradient(90deg, rgba(43, 22, 255, 0.9) 0%, rgba(50, 25, 220, 0.9) 100%)',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  boxShadow: '0 4px 25px rgba(43, 22, 255, 0.3)',
  paddingBottom: 0,
  zIndex: 2,
  backdropFilter: 'blur(10px)',
};

const navbarContent = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  padding: '0 40px',
  minHeight: 80,
  boxSizing: 'border-box',
};

const logoStyle = {
  height: 75,
  width: 75,
  objectFit: 'contain',
  background: '#fff',
  borderRadius: '15%',
  boxShadow: '0 4px 20px rgba(43, 22, 255, 0.3)',
  marginRight: 20,
  border: '2.5px solid rgba(255, 255, 255, 0.8)'
};

const headingStyle = {
  flex: 1,
  fontSize: 33,
  fontWeight: 900,
  letterSpacing: 1,
  textAlign: 'center',
  color: 'white',
  textShadow: '0 2px 15px rgba(43, 22, 255, 0.6), 0 1px 0 rgba(255, 255, 255, 0.3)',
  filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
};

// 🎨 Updated footer with React Bits styling
const footerStyle = {
  width: '100%',
  textAlign: 'center',
  color: 'rgba(255, 255, 255, 0.8)',
  background: 'rgba(43, 22, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  padding: '16px 0 8px 0',
  fontSize: 15,
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  borderTop: "1px solid rgba(255, 255, 255, 0.2)",
  zIndex: 2,
  position: "relative"
};

// 🎨 React Bits style overlay - very subtle
const overlayStyle = {
  content: '',
  position: 'fixed',
  zIndex: 1, // Above Silk, below content
  left: 0, top: 0, width: '100vw', height: '100vh',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 50%, rgba(255, 255, 255, 0.05) 100%)',
  pointerEvents: 'none'
};

const overlayContainer = {
  position: 'relative',
  minHeight: '100vh',
  minWidth: '100vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 2,
  justifyContent: "center"
};

const centerPanelHolder = {
  minHeight: 'calc(100vh - 120px)',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
  position: "relative",
  margin: "auto"
};

// 🎨 Glassmorphism card like React Bits
const card = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  borderRadius: 20,
  boxShadow: '0 25px 50px rgba(43, 22, 255, 0.3), 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  padding: '40px 40px 35px',
  width: '98%',
  maxWidth: 430,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  animation: 'popIn 0.47s cubic-bezier(.55,1.45,.5,1) forwards',
  zIndex: 20,
  position: "relative",
  border: "1px solid rgba(255, 255, 255, 0.2)"
};

const tabs = {
  display: 'flex',
  width: '100%',
  marginBottom: 24,
  borderRadius: 12,
  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.1)'
};

// 🎨 Updated tabs with React Bits purple theme
const tabBtn = (active) => ({
  flex: 1,
  padding: '14px 0',
  fontWeight: 700,
  cursor: 'pointer',
  background: active ? 'linear-gradient(90deg, #2b16ff, #3219dc 170%)' : 'rgba(255, 255, 255, 0.1)',
  color: active ? 'white' : 'rgba(255, 255, 255, 0.9)',
  border: 'none',
  fontSize: 18,
  letterSpacing: 0.8,
  outline: 'none',
  transition: 'all 0.3s ease',
  boxShadow: active ? '0 0px 20px rgba(43, 22, 255, 0.5)' : 'none'
});

// 🎨 Updated logo with white color for better contrast
const logoFont = {
  fontSize: 30,
  fontWeight: 800,
  letterSpacing: 1.5,
  margin: '-8px 0 10px 0',
  color: 'white',
  filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))',
  textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
};

// 🎨 Updated subtitle with white color
const subtitleFont = {
  fontSize: 17,
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.9)',
  marginBottom: 24,
  textAlign: 'center',
  width: "100%",
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
};

// 🎨 Glass-style inputs
const input = {
  width: '100%',
  padding: 15,
  fontSize: 16,
  borderRadius: 10,
  border: '1px solid rgba(255, 255, 255, 0.3)',
  marginBottom: 19,
  outline: 'none',
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
};

// 🎨 Vibrant React Bits style button
const button = {
  width: '100%',
  padding: 15,
  fontSize: 18,
  fontWeight: 700,
  borderRadius: 12,
  border: 'none',
  color: 'white',
  background: 'linear-gradient(135deg, #2b16ff 0%, #3219dc 100%)',
  cursor: 'pointer',
  boxShadow: '0 8px 25px rgba(43, 22, 255, 0.4), 0 3px 15px rgba(43, 22, 255, 0.3)',
  marginBottom: 5,
  transition: 'all 0.3s cubic-bezier(.3,1.1,.5,1.2)',
};

const buttonHover = {
  transform: 'translateY(-3px) scale(1.02)',
  boxShadow: '0 15px 35px rgba(43, 22, 255, 0.5), 0 5px 20px rgba(43, 22, 255, 0.4)'
};

// 🎨 Updated text colors for better contrast
const note = {
  fontSize: 13,
  textAlign: 'center',
  color: 'rgba(255, 255, 255, 0.8)',
  marginTop: 14,
  lineHeight: 1.5,
  userSelect: 'none',
  wordBreak: 'break-word',
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
};

const info = {
  color: '#4ade80',
  fontWeight: 600,
  marginBottom: 18,
  userSelect: 'none',
  textShadow: '0 0 10px rgba(74, 222, 128, 0.3)'
};

const error = {
  color: '#f87171',
  fontWeight: 700,
  marginBottom: 18,
  userSelect: 'none',
  animation: 'shake 0.4s',
  textShadow: '0 0 10px rgba(248, 113, 113, 0.3)'
};

export default function Login({ onLogin }) {
  const [panel, setPanel] = useState('login');
  const [username, setUser] = useState('');
  const [password, setPass] = useState('');
  const [secret, setSecret] = useState('');
  const [errorMsg, setError] = useState('');
  const [infoMsg, setInfo] = useState('');
  const [btnHover, setBtnHover] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setInfo('');
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        onLogin(data.token);
      } else setError(data.error || 'Login failed');
    } catch { setError('Server error, try again later.'); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setError(''); setInfo('');
    if (!username || !password || !secret) {
      setError('All fields required'); return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/secret-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, secret }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInfo('Registration successful! Use combined password+secret to login now.');
        setPanel('login'); setPass(''); setSecret('');
      } else setError(data.error || 'Registration failed');
    } catch { setError('Server error, try again later.'); }
  };

  function changePanel(panelName) {
    setError(''); setInfo(''); setPanel(panelName); setPass(''); setSecret('');
  }

  return (
    <>
      <style>{keyframes}</style>

      {/* 🎨 React Bits Silk Background - EXACT MATCH */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <Silk
          speed={5}
          scale={1}
          color="#2B16FF"      // 🎨 EXACT React Bits signature color
          noiseIntensity={1.5} // 🎨 Perfect silk texture
          rotation={0.15}      // 🎨 Subtle natural flow
        />
      </div>

      {/* 🎨 Subtle overlay like React Bits */}
      <div style={overlayStyle}></div>

      <div style={overlayContainer}>
        <nav style={navbarStyle}>
          <div style={navbarContent}>
            <img src={logoUrl} style={logoStyle} alt="TCIL Logo" />
            <span style={headingStyle}>
              TCIL CCTV Tracker Portal - 
              <TrueFocus
                sentence="Leading the way in smart surveillance"
                manualMode={false}
                blurAmount={2.5}
                borderColor="red"
                animationDuration={0.8}
                pauseBetweenAnimations={0.5}
              />
            </span>
          </div>
        </nav>

        <div style={centerPanelHolder}>
          <div style={card}>
            <div style={logoFont}><span role="img" aria-label="camera">📷</span> CCTV Tracker</div>
            <div style={subtitleFont}>
              Track, update and resolve CCTV installations for Delhi Police.<br />
              <span style={{ fontSize: 13.5, color: "rgba(255, 255, 255, 0.7)" }}>(Secure login for Station Heads and TCIL employees)</span>
            </div>
            <div style={tabs}>
              <button style={tabBtn(panel === 'login')} onClick={() => changePanel('login')}>LOGIN</button>
              <button style={tabBtn(panel === 'register')} onClick={() => changePanel('register')}>REGISTER</button>
            </div>
            {infoMsg && <div style={info}>{infoMsg}</div>}
            {errorMsg && <div style={error}>{errorMsg}</div>}
            {panel === 'login' && (
              <form onSubmit={handleLogin} style={{ width: '100%' }}>
                <input 
                  style={input} 
                  placeholder="Username" 
                  value={username} 
                  autoComplete="username" 
                  onChange={e => setUser(e.target.value)} 
                  required 
                />
                <input 
                  style={input} 
                  placeholder="Password (For heads: password+secret)" 
                  type="password" 
                  autoComplete="current-password" 
                  value={password} 
                  onChange={e => setPass(e.target.value)} 
                  required 
                />
                <button 
                  type="submit"
                  style={btnHover ? { ...button, ...buttonHover } : button}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                >
                  Login
                </button>
                <p style={note}>
                  <b>Station Heads:</b> Login with <i>your-password+secret</i> (no spaces).<br />
                  <b>Employees:</b> Use your assigned password only.
                </p>
              </form>
            )}
            {panel === 'register' && (
              <form onSubmit={handleRegister} style={{ width: '100%' }}>
                <input 
                  style={input} 
                  placeholder="Username" 
                  value={username} 
                  autoComplete="username" 
                  onChange={e => setUser(e.target.value)} 
                  required 
                />
                <input 
                  style={input} 
                  placeholder="Initial Password" 
                  type="password" 
                  autoComplete="new-password" 
                  value={password} 
                  onChange={e => setPass(e.target.value)} 
                  required 
                />
                <input 
                  style={input} 
                  placeholder="Choose Secret Code" 
                  type="password" 
                  autoComplete="new-password" 
                  value={secret} 
                  onChange={e => setSecret(e.target.value)} 
                  required 
                />
                <button 
                  type="submit"
                  style={btnHover ? { ...button, ...buttonHover } : button}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                >
                  Register
                </button>
                <p style={note}>
                  For <b>Station Heads only</b> (first time): After registration, login with <i>password+secret</i> as your new password.<br />
                  Employees do not need to register.
                </p>
              </form>
            )}
          </div>
        </div>

        <footer style={footerStyle}>
          <div>© 2025 TCIL & Delhi Police | CCTV Tracker Portal</div>
          <div style={{ fontSize: 13 }}>
            Powered by <span style={{ color: '#2b16ff', fontWeight: 'bold' }}>TCIL</span> | For authorized use only
          </div>
        </footer>
      </div>
    </>
  );
}
