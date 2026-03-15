import React from 'react';

interface NavbarProps {
  userEmail?: string;
  userName?: string;
  onLogout?: () => void;
}

export default function Navbar({ userEmail, userName, onLogout }: NavbarProps) {
  const displayName = userName || userEmail?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <nav className="nav">
      <div className="nav-logo">
        <i className="bi bi-grid-fill" style={{ fontSize: '20px', color: '#000' }}></i>
        VISION
      </div>
      <div className="nav-links">
        <a className="active"><i className="bi bi-map"></i> Map</a>
      </div>
      <div className="nav-right">
        <span className="nav-user">{displayName}</span>
        <div className="avatar">{initial}</div>
        {onLogout && (
          <button 
            onClick={onLogout} 
            style={{ 
              marginLeft: '10px', 
              background: 'rgba(255, 77, 77, 0.15)', 
              border: '1px solid rgba(255, 77, 77, 0.3)', 
              cursor: 'pointer', 
              fontSize: '12px', 
              fontWeight: '700',
              color: '#ff4d4d',
              padding: '8px 12px',
              borderRadius: '8px'
            }}
          >
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        )}
      </div>
    </nav>
  );
}
