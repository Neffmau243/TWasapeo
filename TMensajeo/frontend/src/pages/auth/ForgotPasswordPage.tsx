import React from 'react';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

const ForgotPasswordPage: React.FC = () => {
  const handleSubmit = (email: string) => {
    console.log('Forgot password:', email);
  };

  return (
    <div className="forgot-password-page">
      <h1>Recuperar contraseña</h1>
      <ForgotPasswordForm onSubmit={handleSubmit} />
    </div>
  );
};

export default ForgotPasswordPage;
