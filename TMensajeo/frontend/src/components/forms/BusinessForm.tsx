import React, { useState } from 'react';

interface BusinessFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
}

const BusinessForm: React.FC<BusinessFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {});

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <input 
        type="text" 
        placeholder="Nombre del negocio" 
        value={formData.name || ''} 
        onChange={(e) => setFormData({...formData, name: e.target.value})} 
      />
      <textarea 
        placeholder="Descripción" 
        value={formData.description || ''} 
        onChange={(e) => setFormData({...formData, description: e.target.value})} 
      />
      <button type="submit">Guardar</button>
    </form>
  );
};

export default BusinessForm;
