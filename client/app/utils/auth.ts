// Authentication utilities

export interface User {
  email: string;
  name: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  currentScreen: 'landing' | 'login' | 'signup' | 'app';
}

export const initialAuthState: AuthState = {
  isLoggedIn: false,
  user: null,
  currentScreen: 'landing',
};

export function login(email: string, name?: string): User {
  const user = {
    email,
    name: name || email.split('@')[0],
  };
  
  // In production, you would save to localStorage or session
  localStorage.setItem('vision_user', JSON.stringify(user));
  
  return user;
}

export function logout(): void {
  localStorage.removeItem('vision_user');
}

export function getCurrentUser(): User | null {
  try {
    const userStr = localStorage.getItem('vision_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export function validateLogin(email: string, password: string): string | null {
  if (!email || !password) {
    return 'Please fill in all fields';
  }
  
  if (!email.includes('@')) {
    return 'Please enter a valid email';
  }
  
  return null;
}

export function validateSignup(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): string | null {
  if (!name || !email || !password) {
    return 'Please fill in all fields';
  }
  
  if (!email.includes('@')) {
    return 'Please enter a valid email';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
}
