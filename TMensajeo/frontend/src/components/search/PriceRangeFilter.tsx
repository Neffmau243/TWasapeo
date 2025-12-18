import React from 'react';

interface PriceRangeFilterProps {
  onChange: (range: string) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ onChange }) => {
  return (
    <div className="price-range-filter">
      <select onChange={(e) => onChange(e.target.value)}>
        <option value="">Todos</option>
        <option value="$">$</option>
        <option value="$$">$$</option>
        <option value="$$$">$$$</option>
      </select>
    </div>
  );
};

export default PriceRangeFilter;
