import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="category-page">
      <h1>Categoría: {slug}</h1>
    </div>
  );
};

export default CategoryPage;
