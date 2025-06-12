
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface User {
  email: string;
  name: string;
  availableRoles: ('employee' | 'recruiter')[];
}

interface LoginProps {
  onLogin: (userData: User) => void;
}

// Enhanced user data with role detection
const DUMMY_USERS = {
  'employee@dasi.com': { name: 'John Employee', availableRoles: ['employee'] as ('employee' | 'recruiter')[] },
  'employee2@dasi.com': { name: 'Jane Employee', availableRoles: ['employee'] as ('employee' | 'recruiter')[] },
  'recruiter@dasi.com': { name: 'Sarah Recruiter', availableRoles: ['recruiter'] as ('employee' | 'recruiter')[] },
  'hr@dasi.com': { name: 'HR Manager', availableRoles: ['recruiter'] as ('employee' | 'recruiter')[] },
  // Admin users who can access both dashboards
  'admin@dasi.com': { name: 'Admin User', availableRoles: ['employee', 'recruiter'] as ('employee' | 'recruiter')[] },
  'manager@dasi.com': { name: 'Department Manager', availableRoles: ['employee', 'recruiter'] as ('employee' | 'recruiter')[] },
};

const Login = ({ onLogin }: LoginProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.email && formData.password) {
      const user = DUMMY_USERS[formData.email as keyof typeof DUMMY_USERS];
      
      if (user && formData.password === 'password123') {
        onLogin({
          email: formData.email,
          name: user.name,
          availableRoles: user.availableRoles
        });
      } else {
        setError('Invalid email or password');
      }
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">DASI Transport Claims</CardTitle>
          <CardDescription className="text-slate-600">
            Sign in to manage your transport claims
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </form>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Admin :</strong> admin@dasi.com / password123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
