import { Utensils, Coffee, ShoppingBag, Dumbbell, Sparkles, Cake } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

interface CategoriesSectionProps {
  onCategoryClick: (category: string) => void;
}

export function CategoriesSection({ onCategoryClick }: CategoriesSectionProps) {
  const categories: Category[] = [
    { id: 'restaurante', name: 'Restaurante', icon: <Utensils className="w-8 h-8" />, count: 1 },
    { id: 'cafeteria', name: 'Cafetería', icon: <Coffee className="w-8 h-8" />, count: 1 },
    { id: 'tienda', name: 'Tienda de Ropa', icon: <ShoppingBag className="w-8 h-8" />, count: 1 },
    { id: 'gimnasio', name: 'Gimnasio', icon: <Dumbbell className="w-8 h-8" />, count: 1 },
    { id: 'spa', name: 'Spa & Wellness', icon: <Sparkles className="w-8 h-8" />, count: 1 },
    { id: 'panaderia', name: 'Panadería', icon: <Cake className="w-8 h-8" />, count: 1 }
  ];

  return (
    <section className="py-16 px-4 border-b border-[rgb(var(--border))]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl mb-10 text-center">Categorías Principales</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.name)}
              className="border border-[rgb(var(--border))] p-6 hover:bg-[rgb(var(--muted))] transition-colors group"
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[rgb(var(--muted))] group-hover:bg-[rgb(var(--background))] transition-colors">
                  {category.icon}
                </div>
                <div>
                  <p className="mb-1">{category.name}</p>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">
                    {category.count} {category.count === 1 ? 'negocio' : 'negocios'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
