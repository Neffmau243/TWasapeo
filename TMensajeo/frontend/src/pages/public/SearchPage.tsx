import React from 'react';
import SearchBar from '../../components/search/SearchBar';
import SearchFilters from '../../components/search/SearchFilters';

const SearchPage: React.FC = () => {
  return (
    <div className="search-page">
      <h1>Buscar negocios</h1>
      <SearchBar onSearch={(query) => console.log(query)} />
      <SearchFilters onFilterChange={(filters) => console.log(filters)} />
    </div>
  );
};

export default SearchPage;
