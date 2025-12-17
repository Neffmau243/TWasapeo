import { Target, Eye, Award } from 'lucide-react';

interface AboutPageProps {
  translations: any;
}

export function AboutPage({ translations }: AboutPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-[rgb(var(--border))] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl mb-6">{translations.about.title}</h1>
          <p className="text-xl text-[rgb(var(--muted-foreground))] max-w-2xl mx-auto">
            Conectamos a las personas con los mejores negocios locales a través de reseñas auténticas y experiencias compartidas.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="border border-[rgb(var(--border))] p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-[rgb(var(--muted))] flex items-center justify-center">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-4">{translations.about.mission}</h3>
              <p className="text-[rgb(var(--muted-foreground))]">
                Facilitar el descubrimiento de negocios excepcionales y fomentar una comunidad de confianza donde las experiencias auténticas guíen las decisiones.
              </p>
            </div>

            {/* Vision */}
            <div className="border border-[rgb(var(--border))] p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-[rgb(var(--muted))] flex items-center justify-center">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-4">{translations.about.vision}</h3>
              <p className="text-[rgb(var(--muted-foreground))]">
                Ser la plataforma líder que conecta comunidades locales con negocios de calidad, creando un ecosistema de confianza y transparencia.
              </p>
            </div>

            {/* Values */}
            <div className="border border-[rgb(var(--border))] p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-[rgb(var(--muted))] flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-4">{translations.about.values}</h3>
              <p className="text-[rgb(var(--muted-foreground))]">
                Autenticidad, transparencia y comunidad. Creemos en el poder de las experiencias reales y en apoyar a los negocios locales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="border-t border-[rgb(var(--border))] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl mb-8 text-center">Nuestra Historia</h2>
          <div className="space-y-6 text-lg text-[rgb(var(--muted-foreground))]">
            <p>
              Fundada con la visión de transformar la manera en que las personas descubren y eligen negocios locales, nuestra plataforma nació de una necesidad simple: encontrar información confiable sobre establecimientos en nuestra comunidad.
            </p>
            <p>
              Comenzamos como un pequeño proyecto enfocado en restaurantes locales, y rápidamente nos dimos cuenta del valor que podíamos aportar al conectar a las personas con todo tipo de negocios excepcionales. Hoy, somos una comunidad vibrante de usuarios que comparten sus experiencias y ayudan a otros a tomar decisiones informadas.
            </p>
            <p>
              Nuestro compromiso es mantener la autenticidad de las reseñas y proporcionar una plataforma donde tanto usuarios como empresas puedan beneficiarse mutuamente. Cada reseña cuenta una historia, y juntos estamos construyendo un ecosistema de confianza.
            </p>
          </div>
        </div>
      </section>

      {/* Team/Images Section */}
      <section className="border-t border-[rgb(var(--border))] py-16 px-4 bg-[rgb(var(--muted))]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl mb-12 text-center">Nuestro Equipo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="aspect-3/4 bg-[rgb(var(--background))] border border-[rgb(var(--border))]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NTc0MTIyNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Team Member"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-3/4 bg-[rgb(var(--background))] border border-[rgb(var(--border))]">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjU3NDEyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Team Member"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-3/4 bg-[rgb(var(--background))] border border-[rgb(var(--border))]">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzY1NzQxMjI3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Team Member"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-[rgb(var(--border))] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl mb-2">1000+</div>
              <p className="text-[rgb(var(--muted-foreground))]">Negocios Registrados</p>
            </div>
            <div>
              <div className="text-5xl mb-2">5000+</div>
              <p className="text-[rgb(var(--muted-foreground))]">Reseñas Publicadas</p>
            </div>
            <div>
              <div className="text-5xl mb-2">15000+</div>
              <p className="text-[rgb(var(--muted-foreground))]">Usuarios Activos</p>
            </div>
            <div>
              <div className="text-5xl mb-2">4.8</div>
              <p className="text-[rgb(var(--muted-foreground))]">Calificación Promedio</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
