import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BusinessCard } from './components/BusinessCard';
import { BusinessDetail } from './components/BusinessDetail';
import { LoginModal } from './components/LoginModal';
import { RegisterModal } from './components/RegisterModal';
import { Filters, FilterOptions } from './components/Filters';
import { HeroCarousel } from './components/HeroCarousel';
import { heroSlides } from './data/heroSlides';
import { CategoriesSection } from './components/home/CategoriesSection';
import { FeaturedBusinesses } from './components/home/FeaturedBusinesses';
import { RecentReviews } from './components/home/RecentReviews';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { translations, Language } from './i18n/translations';

// Helper function to determine if a business is open
const getBusinessStatus = (_hours: string): { isOpen: boolean; status: string } => {
  // Mock logic for demo purposes
  const randomStatus = Math.random();
  if (randomStatus > 0.7) {
    return { isOpen: false, status: 'Cerrado' };
  } else if (randomStatus > 0.5) {
    return { isOpen: true, status: 'Cierra pronto' };
  } else {
    return { isOpen: true, status: 'Abierto ahora' };
  }
};

// Mock data de negocios con información extendida
const mockBusinessesData = [
  {
    id: 1,
    name: 'La Maison',
    category: 'Restaurante',
    image: 'https://images.unsplash.com/photo-1756397481872-ed981ef72a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2NTY2MTU1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    reviewCount: 127,
    location: 'Centro, Calle Principal 123',
    description: 'Experiencia culinaria excepcional con platos de autor y ambiente sofisticado.',
    hours: 'Lun-Dom: 12:00 - 23:00',
    phone: '+1 234 567 8901',
    email: 'reservas@lamaison.com',
    website: 'https://lamaison.com',
    whatsapp: '+12345678901',
    fullDescription: 'La Maison es un restaurante de alta cocina que combina técnicas culinarias tradicionales con un toque contemporáneo. Nuestro chef ejecutivo crea experiencias gastronómicas únicas utilizando ingredientes locales de la más alta calidad.',
    amenities: ['WiFi Gratis', 'Estacionamiento', 'Reservaciones', 'Terraza', 'Bar', 'Menú Vegetariano'],
    gallery: [
      'https://images.unsplash.com/photo-1649553413086-50f78d330a3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZGluaW5nJTIwcm9vbXxlbnwxfHx8fDE3NjU2NDg2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwa2l0Y2hlbiUyMGNoZWZ8ZW58MXx8fHwxNzY1NzI0OTU3fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    coordinates: { lat: 40.7128, lng: -74.0060 },
    badges: ['Popular', 'Verificado'],
    priceRange: '$$$'
  },
  {
    id: 2,
    name: 'Café Moderne',
    category: 'Cafetería',
    image: 'https://images.unsplash.com/photo-1646681828239-843f5ed340de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb2ZmZWUlMjBzaG9wfGVufDF8fHx8MTc2NTcyMzUwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.6,
    reviewCount: 89,
    location: 'Zona Norte, Avenida 45',
    description: 'Café de especialidad con granos seleccionados y repostería artesanal.',
    hours: 'Lun-Vie: 7:00 - 20:00, Sáb-Dom: 8:00 - 21:00',
    phone: '+1 234 567 8902',
    email: 'info@cafemoderne.com',
    website: 'https://cafemoderne.com',
    messenger: 'cafemoderne',
    fullDescription: 'En Café Moderne nos especializamos en café de origen único, trabajando directamente con productores de diferentes regiones del mundo.',
    amenities: ['WiFi Gratis', 'Enchufes en Mesas', 'Comida Para Llevar', 'Opciones Veganas'],
    gallery: [
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY1Njk4MDg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1678449509379-a5afe8e85429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJpc3RhJTIwbWFraW5nJTIwY29mZmVlfGVufDF8fHx8MTc2NTYyNzAyOXww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    coordinates: { lat: 40.7489, lng: -73.9680 },
    badges: ['Nuevo'],
    priceRange: '$$'
  },
  {
    id: 3,
    name: 'Boutique Élégance',
    category: 'Tienda de Ropa',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMHN0b3JlfGVufDF8fHx8MTc2NTY3NzMxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    reviewCount: 156,
    location: 'Plaza Comercial, Local 12',
    description: 'Moda contemporánea y exclusiva con las últimas tendencias internacionales.',
    hours: 'Lun-Sáb: 10:00 - 21:00, Dom: 11:00 - 19:00',
    phone: '+1 234 567 8903',
    email: 'contacto@boutiqueelegance.com',
    fullDescription: 'Boutique Élégance ofrece una cuidadosa selección de prendas de diseñador y marcas emergentes.',
    amenities: ['Asesoría de Imagen', 'Probadores Privados', 'Alteraciones', 'Gift Cards'],
    gallery: [
      'https://images.unsplash.com/photo-1760287363707-851f4780b98c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYm91dGlxdWUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjU2NjQ5OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    coordinates: { lat: 40.7580, lng: -73.9855 },
    badges: ['Verificado', 'Popular'],
    priceRange: '$$$$'
  },
  {
    id: 4,
    name: 'Serenity Spa',
    category: 'Spa & Wellness',
    image: 'https://images.unsplash.com/photo-1761718210055-e83ca7e2c9ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcGElMjBzYWxvbnxlbnwxfHx8fDE3NjU3Mzc1Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5.0,
    reviewCount: 203,
    location: 'Torre Empresarial, Piso 15',
    description: 'Tratamientos de lujo y relajación en un ambiente de tranquilidad absoluta.',
    hours: 'Lun-Dom: 9:00 - 21:00',
    phone: '+1 234 567 8904',
    fullDescription: 'Serenity Spa es un oasis de paz en el corazón de la ciudad.',
    amenities: ['Sauna', 'Jacuzzi', 'Área de Relajación', 'Masajes'],
    gallery: [
      'https://images.unsplash.com/photo-1595871151608-bc7abd1caca3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBtYXNzYWdlJTIwcm9vbXxlbnwxfHx8fDE3NjU3NDEyMjR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    coordinates: { lat: 40.7614, lng: -73.9776 },
    badges: ['Popular'],
    priceRange: '$$$$'
  },
  {
    id: 5,
    name: 'FitLife Gym',
    category: 'Gimnasio',
    image: 'https://images.unsplash.com/photo-1761971975769-97e598bf526b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY1NzM3NTM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    reviewCount: 94,
    location: 'Zona Deportiva, Calle 78',
    description: 'Equipamiento de última generación y entrenadores certificados.',
    hours: 'Lun-Vie: 5:00 - 23:00, Sáb-Dom: 7:00 - 21:00',
    phone: '+1 234 567 8905',
    fullDescription: 'FitLife Gym es más que un gimnasio, es una comunidad dedicada a tu bienestar integral.',
    amenities: ['Entrenadores Personales', 'Clases Grupales', 'Vestuarios con Duchas'],
    gallery: [
      'https://images.unsplash.com/photo-1676109829011-a9f0f3e40f00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBlcXVpcG1lbnQlMjB3ZWlnaHRzfGVufDF8fHx8MTc2NTY0NTc0NHww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    coordinates: { lat: 40.7306, lng: -73.9352 },
    badges: ['Nuevo', 'Verificado'],
    priceRange: '$$'
  },
  {
    id: 6,
    name: 'Panadería Artesanal',
    category: 'Panadería',
    image: 'https://images.unsplash.com/photo-1696721497670-d57754966c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBwYXN0cmllc3xlbnwxfHx8fDE3NjU2Nzc4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    reviewCount: 178,
    location: 'Barrio Antiguo, Calle 15',
    description: 'Pan recién horneado todos los días con recetas tradicionales.',
    hours: 'Lun-Dom: 6:00 - 20:00',
    phone: '+1 234 567 8906',
    fullDescription: 'En Panadería Artesanal honramos las recetas tradicionales transmitidas de generación en generación.',
    amenities: ['Pan Fresco Diario', 'Pedidos Personalizados', 'Tortas de Cumpleaños'],
    gallery: [
      'https://images.unsplash.com/photo-1733714953921-dc38255ce866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBicmVhZCUyMGRpc3BsYXl8ZW58MXx8fHwxNzY1NzM2MTk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    coordinates: { lat: 40.7282, lng: -73.9942 },
    badges: ['Popular'],
    priceRange: '$'
  }
];

// Add open status to businesses
const mockBusinesses = mockBusinessesData.map(business => {
  const status = getBusinessStatus(business.hours);
  return {
    ...business,
    isOpen: status.isOpen,
    openStatus: status.status
  };
});

// Mock reviews with reactions
const mockReviews: { [key: number]: any[] } = {
  1: [
    { id: 101, userName: 'María García', userCity: 'Madrid', rating: 5.0, date: '15 Nov 2024', comment: 'Una experiencia culinaria inolvidable. El servicio es impecable y cada plato es una obra de arte.', likes: 12, dislikes: 0 },
    { id: 102, userName: 'Carlos Rodríguez', userCity: 'Barcelona', rating: 4.5, date: '8 Nov 2024', comment: 'Excelente restaurante con una atmósfera muy elegante.', likes: 8, dislikes: 1 },
  ],
  2: [
    { id: 201, userName: 'Laura Sánchez', userCity: 'Valencia', rating: 4.8, date: '12 Nov 2024', comment: 'El mejor café de la ciudad.', likes: 15, dislikes: 0 },
  ],
  3: [
    { id: 301, userName: 'Isabella Torres', rating: 5.0, date: '10 Nov 2024', comment: 'La mejor boutique de la ciudad.', likes: 10, dislikes: 0 },
  ],
  4: [
    { id: 401, userName: 'Elena Vargas', rating: 5.0, date: '14 Nov 2024', comment: 'Un verdadero paraíso de relajación.', likes: 20, dislikes: 0 },
  ],
  5: [
    { id: 501, userName: 'Diego Fernández', rating: 4.7, date: '11 Nov 2024', comment: 'Gimnasio muy completo.', likes: 6, dislikes: 0 },
  ],
  6: [
    { id: 601, userName: 'Carmen Ruiz', rating: 5.0, date: '13 Nov 2024', comment: 'El pan más delicioso que he probado.', likes: 18, dislikes: 1 },
  ]
};

// Recent reviews for homepage
const recentReviewsData = Object.entries(mockReviews).flatMap(([businessId, reviews]) => {
  const business = mockBusinesses.find(b => b.id === parseInt(businessId));
  return reviews.map(review => ({
    ...review,
    businessId: parseInt(businessId),
    businessName: business?.name || ''
  }));
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es');
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'contact' | 'detail'>('home');
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: 'all',
    minRating: 0,
    isOpenNow: false,
    sortBy: 'popular'
  });

  const t = translations[currentLanguage];

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedBusinessId]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleReviewClick = () => setLoginOpen(true);

  const handleViewDetails = (businessId: number) => {
    setSelectedBusinessId(businessId);
    setCurrentView('detail');
  };

  const handleBackToHome = () => {
    setSelectedBusinessId(null);
    setCurrentView('home');
  };

  const handleAboutClick = () => setCurrentView('about');
  const handleContactClick = () => setCurrentView('contact');

  const availableCategories = Array.from(new Set(mockBusinesses.map(b => b.category)));

  // Filter and sort businesses
  let filteredBusinesses = mockBusinesses.filter(business => {
    const matchesSearch = 
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      filters.categories.length === 0 || 
      filters.categories.includes(business.category);

    const matchesPrice = 
      filters.priceRange === 'all' || 
      business.priceRange === filters.priceRange;

    const matchesRating = business.rating >= filters.minRating;
    const matchesOpen = !filters.isOpenNow || business.isOpen;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesOpen;
  });

  filteredBusinesses = filteredBusinesses.sort((a, b) => {
    switch (filters.sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
        return b.id - a.id;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'popular':
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  const handleCategoryClick = (category: string) => {
    setFilters({ ...filters, categories: [category] });
  };

  const selectedBusiness = selectedBusinessId 
    ? mockBusinesses.find(b => b.id === selectedBusinessId) 
    : null;

  return (
    <>
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        onLoginClick={() => setLoginOpen(true)}
        onRegisterClick={() => setRegisterOpen(true)}
        onHomeClick={handleBackToHome}
        onAboutClick={handleAboutClick}
        onContactClick={handleContactClick}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        translations={t}
        isHomePage={currentView === 'home' && !selectedBusinessId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        locationQuery={locationQuery}
        onLocationChange={setLocationQuery}
        onCategoryClick={handleCategoryClick}
      />

      {currentView === 'about' ? (
        <AboutPage translations={t} />
      ) : currentView === 'contact' ? (
        <ContactPage translations={t} />
      ) : selectedBusiness && currentView === 'detail' ? (
        <BusinessDetail
          business={selectedBusiness}
          reviews={mockReviews[selectedBusiness.id] || []}
          onBack={handleBackToHome}
          onReviewClick={handleReviewClick}
          allBusinesses={mockBusinesses}
          onViewDetails={handleViewDetails}
        />
      ) : (
        <>
          {/* Hero Carousel Section - Full Screen */}
          <HeroCarousel
            slides={heroSlides.map(slide => ({
              ...slide,
              ctaAction: () => handleCategoryClick(slide.ctaCategory)
            }))}
          />

          {/* Categories Section */}
          <CategoriesSection onCategoryClick={handleCategoryClick} />

          {/* Featured Businesses */}
          <FeaturedBusinesses
            businesses={mockBusinesses}
            onViewDetails={handleViewDetails}
          />

          {/* Business Grid */}
          <section id="negocios" className="flex-1 py-8 md:py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-64 shrink-0">
                  <div className="lg:sticky lg:top-24">
                    <Filters
                      onFilterChange={setFilters}
                      availableCategories={availableCategories}
                    />
                  </div>
                </aside>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6 md:mb-10">
                    <h2 className="text-3xl md:text-4xl">Todos los Locales</h2>
                    <p className="text-[rgb(var(--muted-foreground))]">
                      {filteredBusinesses.length} {filteredBusinesses.length === 1 ? t.filters.result : t.filters.results}
                    </p>
                  </div>
                  
                  {filteredBusinesses.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-xl text-[rgb(var(--muted-foreground))]">
                        No se encontraron negocios
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilters({
                            categories: [],
                            priceRange: 'all',
                            minRating: 0,
                            isOpenNow: false,
                            sortBy: 'popular'
                          });
                        }}
                        className="mt-6 px-6 py-3 border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] transition-colors"
                      >
                        {t.filters.clearFilters}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                      {filteredBusinesses.map((business) => (
                        <BusinessCard
                          key={business.id}
                          business={business}
                          onReviewClick={handleReviewClick}
                          onViewDetails={() => handleViewDetails(business.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Recent Reviews */}
          <RecentReviews
            reviews={recentReviewsData}
            onBusinessClick={handleViewDetails}
          />
        </>
      )}

      <Footer />

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
}
