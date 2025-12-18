import { Moon, Sun, Menu, X, ChevronDown, Search, MapPin } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { Language } from '../i18n/translations';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onHomeClick: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  isHomePage?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  locationQuery?: string;
  onLocationChange?: (value: string) => void;
  onCategoryClick?: (category: string) => void;
}

// Utility: Debounce function
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Categorías con subcategorías
const categories = [
  {
    name: 'Restaurantes',
    subcategories: ['Comida Rápida', 'Comida Internacional', 'Comida Local', 'Mariscos', 'Vegetariano']
  },
  {
    name: 'Cafeterías',
    subcategories: ['Café de Especialidad', 'Cafetería Tradicional', 'Té y Postres']
  },
  {
    name: 'Tiendas',
    subcategories: ['Ropa', 'Calzado', 'Accesorios', 'Boutiques']
  },
  {
    name: 'Bienestar',
    subcategories: ['Spa', 'Gimnasio', 'Yoga', 'Masajes']
  },
  {
    name: 'Servicios',
    subcategories: ['Belleza', 'Peluquería', 'Barbería', 'Estética']
  }
];

export function Navbar({ 
  isDark, 
  toggleTheme, 
  onLoginClick, 
  onRegisterClick,
  onHomeClick, 
  currentLanguage, 
  onLanguageChange, 
  isHomePage = false,
  searchQuery = '',
  onSearchChange,
  locationQuery = '',
  onLocationChange,
  onCategoryClick
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll behavior - solo en Home
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false);
        setIsMenuOpen(false);
        setOpenDropdown(null);
      }
      
      setLastScrollY(currentScrollY);
    };

    const debouncedHandleScroll = debounce(handleScroll, 10);
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [lastScrollY, isHomePage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (category: string, subcategory?: string) => {
    const selectedCategory = subcategory || category;
    if (onCategoryClick) {
      onCategoryClick(selectedCategory);
    }
    setOpenDropdown(null);
    setIsMenuOpen(false);
  };

  // Componente reutilizable para botón de theme
  const ThemeButton = () => (
    <button
      onClick={toggleTheme}
      className={`p-2 hover:bg-[rgb(var(--background))]/20 rounded-full transition-colors ${isHomePage ? 'text-[rgb(var(--background))]' : 'text-[rgb(var(--foreground))]'}`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );

  return (
    <nav 
      className={`border-b border-[rgb(var(--foreground))]/20 bg-[rgb(var(--foreground))]/95 backdrop-blur-md z-50 transition-all duration-300 ease-in-out ${
        isHomePage ? `absolute w-full ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}` : 'sticky top-0 shadow-sm translate-y-0 opacity-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Primera fila: Logo, Búsqueda, Acciones */}
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button 
            onClick={onHomeClick} 
            className={`flex items-center hover:opacity-80 transition-opacity shrink-0 ${isHomePage ? 'text-[rgb(var(--background))]' : 'text-[rgb(var(--foreground))]'}`}
          >
            <h1 className="text-2xl sm:text-3xl tracking-wide font-bold">LOCALES</h1>
          </button>

          {/* Barra de búsqueda junto al logo - Solo en home */}
          {isHomePage && onSearchChange && (
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar negocios, categorías..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
                />
              </div>
            </div>
          )}

          {/* Barra de búsqueda central - Solo en vistas no-home */}
          {!isHomePage && onSearchChange && onLocationChange && (
            <div className="flex items-center gap-2 flex-1 max-w-2xl mx-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
                <input
                  type="text"
                  placeholder="¿Qué estás buscando?"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[rgb(var(--background))]/30 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--background))] transition-all"
                />
              </div>
              <div className="w-48 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
                <input
                  type="text"
                  placeholder="Ubicación"
                  value={locationQuery}
                  onChange={(e) => onLocationChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[rgb(var(--background))]/30 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--background))] transition-all"
                />
              </div>
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
              isHomePage={isHomePage}
            />
            
            <ThemeButton />

            <button
              onClick={onLoginClick}
              className={`px-4 py-2 hover:bg-[rgb(var(--background))]/20 transition-colors ${isHomePage ? 'text-[rgb(var(--background))]' : 'text-[rgb(var(--foreground))]'}`}
            >
              Iniciar Sesión
            </button>

            <button
              onClick={onRegisterClick}
              className={`px-6 py-2 ${isHomePage ? 'bg-[rgb(var(--background))] text-[rgb(var(--foreground))]' : 'bg-[rgb(var(--foreground))] text-[rgb(var(--background))]'} hover:opacity-90 transition-opacity`}
            >
              Registrarse
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeButton />
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 ${isHomePage ? 'text-[rgb(var(--background))]' : 'text-[rgb(var(--foreground))]'}`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Segunda fila: Categorías con dropdowns - Desktop */}
        <div className="hidden md:flex items-center gap-6 py-3 border-t border-[rgb(var(--background))]/30" ref={dropdownRef}>
          {categories.map((category) => (
            <div key={category.name} className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === category.name ? null : category.name)}
                onMouseEnter={() => setOpenDropdown(category.name)}
                className={`flex items-center gap-1 transition-colors py-2 ${isHomePage ? 'text-[rgb(var(--background))] hover:text-[rgb(var(--background))]/70' : 'text-[rgb(var(--foreground))] hover:text-[rgb(var(--foreground))]/70'}`}
              >
                {category.name}
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === category.name ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {openDropdown === category.name && (
                <div 
                  className="absolute top-full left-0 mt-1 bg-white border border-[rgb(var(--foreground))]/20 shadow-lg min-w-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => handleCategorySelect(category.name)}
                    className="w-full px-4 py-2 text-left text-[rgb(var(--foreground))] hover:bg-[rgb(var(--foreground))]/10 transition-colors font-medium"
                  >
                    Ver todos
                  </button>
                  <div className="border-t border-[rgb(var(--foreground))]/20 my-1" />
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => handleCategorySelect(category.name, sub)}
                      className="w-full px-4 py-2 text-left text-[rgb(var(--foreground))] hover:bg-[rgb(var(--foreground))]/10 transition-colors text-sm"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[rgb(var(--background))]/30 bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
            <div className="flex flex-col gap-4">
              {/* Búsqueda móvil - Solo en vistas no-home */}
              {!isHomePage && onSearchChange && onLocationChange && (
                <div className="space-y-2 pb-4 border-b border-[rgb(var(--foreground))]/20">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--foreground))]/60" />
                    <input
                      type="text"
                      placeholder="¿Qué estás buscando?"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[rgb(var(--foreground))]/20 bg-white text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--foreground))]/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--foreground))]/30"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--foreground))]/60" />
                    <input
                      type="text"
                      placeholder="Ubicación"
                      value={locationQuery}
                      onChange={(e) => onLocationChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[rgb(var(--foreground))]/20 bg-white text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--foreground))]/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--foreground))]/30"
                    />
                  </div>
                </div>
              )}

              {/* Categorías móviles */}
              {categories.map((category) => (
                <div key={category.name} className="border-b border-[rgb(var(--foreground))]/20 pb-2">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === category.name ? null : category.name)}
                    className="w-full flex items-center justify-between py-2 text-[rgb(var(--foreground))] hover:text-[rgb(var(--foreground))]/70 transition-colors"
                  >
                    {category.name}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === category.name ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === category.name && (
                    <div className="pl-4 mt-2 space-y-2">
                      <button
                        onClick={() => handleCategorySelect(category.name)}
                        className="block w-full text-left py-1 text-sm text-[rgb(var(--foreground))]/90 hover:text-[rgb(var(--foreground))]/70 font-medium"
                      >
                        Ver todos
                      </button>
                      {category.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => handleCategorySelect(category.name, sub)}
                          className="block w-full text-left py-1 text-sm text-[rgb(var(--foreground))]/90 hover:text-[rgb(var(--foreground))]/70"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="py-2">
                <LanguageSelector
                  currentLanguage={currentLanguage}
                  onLanguageChange={onLanguageChange}
                />
              </div>
              
              <div className="pt-4 border-t border-[rgb(var(--foreground))]/20 space-y-2">
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-6 py-3 border border-[rgb(var(--foreground))]/30 text-[rgb(var(--foreground))] hover:bg-[rgb(var(--foreground))]/10 transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    onRegisterClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-6 py-3 bg-[rgb(var(--foreground))] text-white hover:opacity-90 transition-opacity"
                >
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}