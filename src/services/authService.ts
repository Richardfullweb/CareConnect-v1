import axios from 'axios';

const API_URL = 'YOUR_API_URL';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  company: string;
}

export const login = async (credentials: LoginCredentials) => {
  // Simulate API call
  if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
    return {
      user: {
        id: '1',
        name: 'Demo User',
        email: credentials.email,
        role: 'admin'
      },
      token: 'demo-token'
    };
  }
  throw new Error('Invalid credentials');
};

export const register = async (data: RegisterData) => {
  // Simulate API call
  return {
    user: {
      id: '1',
      name: data.name,
      email: data.email,
      role: 'user'
    },
    token: 'demo-token'
  };
};

export const logout = async () => {
  // Simulate API call for logout
  return true;
};