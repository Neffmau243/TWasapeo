import React from 'react';

interface CategoryFilterProps {
  categories: any[];
  selectedCategory?: string;
  onChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onChange }) => {
  return (
    <div className="category-filter">
      {categories.map((cat) => (
        <button 
          key={cat.id} 
          onClick={() => onChange(cat.slug)}
          className={selectedCategory === cat.slug ? 'selected' : ''}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
