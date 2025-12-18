import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyEmailPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify email with token
    console.log('Verifying token:', token);
    // On success, redirect to login
    setTimeout(() => navigate('/login'), 2000);
  }, [token, navigate]);

  return (
    <div className="verify-email-page">
      <h1>Verificando email...</h1>
    </div>
  );
};

export default VerifyEmailPage;
