import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const handleSubmit = (password: string) => {
    console.log('Reset password:', token, password);
    navigate('/login');
  };

  return (
    <div className="reset-password-page">
      <h1>Restablecer contraseña</h1>
      <ResetPasswordForm onSubmit={handleSubmit} />
    </div>
  );
};

export default ResetPasswordPage;
