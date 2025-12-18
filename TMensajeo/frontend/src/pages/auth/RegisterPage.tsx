import React, { useState } from 'react';
import RegisterForm from '../../components/auth/RegisterForm';
import { useNavigate, Link } from 'react-router-dom';
import * as authService from '../../services/authService';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleRegister = async (data: any) => {
    await authService.register(data);
    setSuccess(true);
    
    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Crear cuenta en TMensajeo
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Inicia sesión
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-center">
              <p className="font-semibold">¡Registro exitoso!</p>
              <p className="text-sm mt-1">Redirigiendo al login...</p>
            </div>
          ) : (
            <RegisterForm onSubmit={handleRegister} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
