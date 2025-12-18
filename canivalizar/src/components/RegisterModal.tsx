import { X } from 'lucide-react';
import { useState } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('usuario');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    // Aquí iría la lógica de registro
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[rgb(var(--background))] border border-[rgb(var(--border))] max-w-md w-full p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[rgb(var(--muted))] transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl mb-6">Registrarse</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="register-name" className="block mb-2 text-[rgb(var(--muted-foreground))]">
              Nombre Completo
            </label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))]"
              required
            />
          </div>

          <div>
            <label htmlFor="register-email" className="block mb-2 text-[rgb(var(--muted-foreground))]">
              Correo Electrónico
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))]"
              required
            />
          </div>

          <div>
            <label htmlFor="register-role" className="block mb-2 text-[rgb(var(--muted-foreground))]">
              Tipo de Cuenta
            </label>
            <select
              id="register-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))]"
            >
              <option value="usuario">Usuario (Para dejar reseñas)</option>
              <option value="cliente">Cliente (Dueño de local)</option>
            </select>
          </div>

          <div>
            <label htmlFor="register-password" className="block mb-2 text-[rgb(var(--muted-foreground))]">
              Contraseña
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))]"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="register-confirm-password" className="block mb-2 text-[rgb(var(--muted-foreground))]">
              Confirmar Contraseña
            </label>
            <input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))]"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] hover:opacity-90 transition-opacity"
          >
            Crear Cuenta
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[rgb(var(--muted-foreground))]">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => {
                onClose();
                onSwitchToLogin();
              }}
              className="text-[rgb(var(--foreground))] hover:underline"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
