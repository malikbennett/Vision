import React, { useState } from 'react';
import { validateLogin } from '../utils/auth';

interface LoginScreenProps {
  onBack: () => void;
  onSignupClick: () => void;
  onLoginSuccess: (email: string) => void;
}

export default function LoginScreen({ onBack, onSignupClick, onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateLogin(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // Mock login - in production, call API
    onLoginSuccess(email);
  };

  return (
    <div className="login-card">
        <button className="back-btn" onClick={onBack}>← Back</button>
        
        <div className="login-header">
          <div className="login-icon">👁️</div>
          <h2>Welcome Back</h2>
          <p>Sign in to your Vision account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="loginEmail">Email Address</label>
            <input 
              type="email" 
              id="loginEmail" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>
            <input 
              type="password" 
              id="loginPassword" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="form-error show">{error}</div>}

          <button type="submit" className="btn-primary">Sign In</button>
        </form>

        <div className="login-divider"><span>or</span></div>

        <button type="button" className="btn-secondary" onClick={onSignupClick}>Create New Account</button>

        <p className="login-footer">Secure login powered by Vision</p>
    </div>
  );
}
