import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

export interface FilterOptions {
  categories: string[];
  priceRange: string;
  minRating: number;
  isOpenNow: boolean;
  sortBy: string;
}

interface FiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  availableCategories: string[];
}

export function Filters({ onFilterChange, availableCategories }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: 'all',
    minRating: 0,
    isOpenNow: false,
    sortBy: 'popular'
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    handleFilterChange('categories', newCategories);
  };

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      categories: [],
      priceRange: 'all',
      minRating: 0,
      isOpenNow: false,
      sortBy: 'popular'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFiltersCount = 
    filters.categories.length + 
    (filters.priceRange !== 'all' ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.isOpenNow ? 1 : 0);

  return (
    <div className="relative">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filtros</span>
        {activeFiltersCount > 0 && (
          <span className="px-2 py-0.5 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] text-xs">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      <div className={`
        lg:block
        ${isOpen ? 'block' : 'hidden'}
        fixed lg:static inset-0 lg:inset-auto
        bg-black/50 lg:bg-transparent
        z-50 lg:z-auto
      `}>
        <div className="
          absolute lg:static right-0 top-0 bottom-0
          w-80 lg:w-full
          bg-[rgb(var(--background))] lg:bg-transparent
          overflow-y-auto
          p-6 lg:p-0
        ">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <h3 className="text-2xl">Filtros</h3>
            <button onClick={() => setIsOpen(false)} className="p-2">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Sort By */}
            <div>
              <label className="block mb-3 text-sm uppercase tracking-wider">
                Ordenar por
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))]"
              >
                <option value="popular">Popularidad</option>
                <option value="rating">Mejor Calificación</option>
                <option value="recent">Más Reciente</option>
                <option value="name">Nombre A-Z</option>
              </select>
            </div>

            {/* Categories */}
            <div>
              <label className="block mb-3 text-sm uppercase tracking-wider">
                Categorías
              </label>
              <div className="space-y-2">
                {availableCategories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 cursor-pointer hover:text-[rgb(var(--muted-foreground))] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block mb-3 text-sm uppercase tracking-wider">
                Rango de Precio
              </label>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'Todos' },
                  { value: '$', label: '$ - Económico' },
                  { value: '$$', label: '$$ - Moderado' },
                  { value: '$$$', label: '$$$ - Elevado' },
                  { value: '$$$$', label: '$$$$ - Premium' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer hover:text-[rgb(var(--muted-foreground))] transition-colors"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      value={option.value}
                      checked={filters.priceRange === option.value}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block mb-3 text-sm uppercase tracking-wider">
                Calificación Mínima
              </label>
              <div className="space-y-2">
                {[0, 3, 4, 4.5].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-3 cursor-pointer hover:text-[rgb(var(--muted-foreground))] transition-colors"
                  >
                    <input
                      type="radio"
                      name="minRating"
                      value={rating}
                      checked={filters.minRating === rating}
                      onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                      className="w-4 h-4"
                    />
                    <span>{rating === 0 ? 'Todas' : `${rating}+ ⭐`}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Open Now */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer hover:text-[rgb(var(--muted-foreground))] transition-colors">
                <input
                  type="checkbox"
                  checked={filters.isOpenNow}
                  onChange={(e) => handleFilterChange('isOpenNow', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm uppercase tracking-wider">Abierto Ahora</span>
              </label>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="w-full py-3 border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] transition-colors"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
