import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  const handleLoginSuccess = (redirectPath) => {
    // In a real app, you would set auth state here
    navigate(redirectPath);
  };

  const handleRegisterSuccess = (redirectPath) => {
    // In a real app, you would set auth state here
    navigate(redirectPath);
  };

  return (
    <AuthCard activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'login' ? (
        <LoginForm 
          onSwitchToRegister={() => setActiveTab('register')}
          onSubmitSuccess={handleLoginSuccess}
        />
      ) : (
        <RegisterForm 
          onSwitchToLogin={() => setActiveTab('login')}
          onSubmitSuccess={handleRegisterSuccess}
        />
      )}
    </AuthCard>
  );
};

export default AuthPage;