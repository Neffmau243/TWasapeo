export interface HeroSlide {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaCategory: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    category: 'Restaurantes',
    title: 'Descubre Sabores Únicos',
    subtitle: 'Explora los mejores restaurantes de tu ciudad con experiencias culinarias excepcionales',
    backgroundImage: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    ctaText: 'Explorar Restaurantes',
    ctaCategory: 'Restaurante'
  },
  {
    id: 2,
    category: 'Cafeterías',
    title: 'Tu Momento de Café Perfecto',
    subtitle: 'Encuentra cafeterías de especialidad con los mejores granos y ambiente acogedor',
    backgroundImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    ctaText: 'Ver Cafeterías',
    ctaCategory: 'Cafetería'
  },
  {
    id: 3,
    category: 'Tiendas',
    title: 'Moda y Estilo a tu Alcance',
    subtitle: 'Descubre boutiques exclusivas con las últimas tendencias y diseños únicos',
    backgroundImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    ctaText: 'Explorar Tiendas',
    ctaCategory: 'Tienda de Ropa'
  },
  {
    id: 4,
    category: 'Bienestar',
    title: 'Cuida de Ti Mismo',
    subtitle: 'Spas, gimnasios y centros de bienestar para tu salud física y mental',
    backgroundImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    ctaText: 'Descubrir Bienestar',
    ctaCategory: 'Spa & Wellness'
  },
  {
    id: 5,
    category: 'Panaderías',
    title: 'Pan Recién Horneado',
    subtitle: 'Panaderías artesanales con recetas tradicionales y productos frescos cada día',
    backgroundImage: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    ctaText: 'Ver Panaderías',
    ctaCategory: 'Panadería'
  }
];
