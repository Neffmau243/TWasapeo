import React from 'react';

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilterChange }) => {
  const handleFilterChange = () => {
    onFilterChange({}); // Placeholder
  };

  return (
    <div className="search-filters">
      <h3>Filtros</h3>
      {/* Add filter controls here */}
      <button onClick={handleFilterChange}>Aplicar</button>
    </div>
  );
};

export default SearchFilters;
