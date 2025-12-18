import React from 'react';

interface SortOptionsProps {
  onChange: (sortBy: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ onChange }) => {
  return (
    <div className="sort-options">
      <select onChange={(e) => onChange(e.target.value)}>
        <option value="rating">Mejor valorados</option>
        <option value="distance">Más cercanos</option>
        <option value="name">Nombre A-Z</option>
      </select>
    </div>
  );
};

export default SortOptions;
