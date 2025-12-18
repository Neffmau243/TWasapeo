import React from 'react';
import { useParams } from 'react-router-dom';

const EditBusinessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="edit-business-page">
      <h1>Editar Negocio</h1>
    </div>
  );
};

export default EditBusinessPage;
