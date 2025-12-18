import React, { useState } from 'react';

interface ProfileFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {});

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <input 
        type="text" 
        placeholder="Nombre" 
        value={formData.name || ''} 
        onChange={(e) => setFormData({...formData, name: e.target.value})} 
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={formData.email || ''} 
        onChange={(e) => setFormData({...formData, email: e.target.value})} 
      />
      <button type="submit">Actualizar perfil</button>
    </form>
  );
};

export default ProfileForm;
