import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Suggestion {
  id: number;
  name: string;
  category: string;
  type: 'business' | 'category';
}

interface SearchWithAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: Suggestion) => void;
}

export function SearchWithAutocomplete({
  value,
  onChange,
  suggestions,
  onSuggestionClick
}: SearchWithAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(value.length > 0 && suggestions.length > 0);
  }, [value, suggestions]);

  return (
    <div ref={wrapperRef} className="max-w-2xl mx-auto relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--muted-foreground))] z-10" />
      <input
        type="text"
        placeholder="Buscar negocios, categorías o ubicaciones..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-12 py-4 border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))] text-lg"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[rgb(var(--muted))] transition-colors z-10"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[rgb(var(--card))] border border-[rgb(var(--border))] shadow-lg max-h-96 overflow-y-auto z-50">
          {suggestions.map((suggestion) => (
            <button
              key={`${suggestion.type}-${suggestion.id}`}
              onClick={() => {
                onSuggestionClick(suggestion);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-[rgb(var(--muted))] transition-colors border-b border-[rgb(var(--border))] last:border-b-0"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg">{suggestion.name}</p>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">
                    {suggestion.type === 'category' ? 'Categoría' : suggestion.category}
                  </p>
                </div>
                <Search className="w-4 h-4 text-[rgb(var(--muted-foreground))]" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
