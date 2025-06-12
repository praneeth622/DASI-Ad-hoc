
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Login from '@/components/Login';
import EmployeeDashboard from '@/components/EmployeeDashboard';
import RecruiterDashboard from '@/components/RecruiterDashboard';
import { ClaimsProvider } from '@/contexts/ClaimsContext';

interface User {
  email: string;
  name: string;
  availableRoles: ('employee' | 'recruiter')[];
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<'employee' | 'recruiter'>('employee');

  const handleLogin = (userData: User) => {
    setUser(userData);
    // Set initial role to the first available role
    setCurrentRole(userData.availableRoles[0]);
  };

  const handleRoleSwitch = (role: 'employee' | 'recruiter') => {
    setCurrentRole(role);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentRole('employee');
  };

  const renderDashboard = () => {
    if (!user) return null;
    
    switch (currentRole) {
      case 'employee':
        return <EmployeeDashboard userEmail={user.email} userName={user.name} />;
      case 'recruiter':
        return <RecruiterDashboard userEmail={user.email} userName={user.name} />;
      default:
        return null;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ClaimsProvider>
      <Layout 
        userRole={currentRole} 
        availableRoles={user.availableRoles}
        onRoleSwitch={handleRoleSwitch}
        onLogout={handleLogout}
      >
        {renderDashboard()}
      </Layout>
    </ClaimsProvider>
  );
};

export default Index;
