import React, { useState } from 'react';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(email); }}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit">Enviar enlace de recuperación</button>
    </form>
  );
};

export default ForgotPasswordForm;
