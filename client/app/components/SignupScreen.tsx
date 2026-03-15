import React, { useState } from 'react';
import { validateSignup } from '../utils/auth';

interface SignupScreenProps {
  onBack: () => void;
  onSignupSuccess: (name: string, email: string) => void;
}

export default function SignupScreen({ onBack, onSignupSuccess }: SignupScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateSignup(name, email, password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // Mock signup - in production, call API
    onSignupSuccess(name, email);
  };

  return (
    <div className="login-card">
        <button className="back-btn" onClick={onBack}>← Back</button>
        
        <div className="login-header">
          <div className="login-icon">👁️</div>
          <h2>Join Vision</h2>
          <p>Create your account in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="signupName">Full Name</label>
            <input 
              type="text" 
              id="signupName" 
              placeholder="Your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signupEmail">Email Address</label>
            <input 
              type="email" 
              id="signupEmail" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signupPassword">Password</label>
            <input 
              type="password" 
              id="signupPassword" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signupConfirm">Confirm Password</label>
            <input 
              type="password" 
              id="signupConfirm" 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="form-error show">{error}</div>}

          <button type="submit" className="btn-primary">Create Account</button>
          <div className="login-divider"><span>or</span></div>
        </form>

        <p className="login-footer">Your privacy is important to us</p>
    </div>
  );
}
