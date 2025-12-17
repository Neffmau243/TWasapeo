import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--border))] bg-[rgb(var(--background))] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h2 className="text-2xl mb-4">LOCALES</h2>
            <p className="text-[rgb(var(--muted-foreground))]">
              Descubre los mejores negocios y locales de tu ciudad.
            </p>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h3 className="text-lg mb-4">Navegación</h3>
            <ul className="space-y-2 text-[rgb(var(--muted-foreground))]">
              <li>
                <a href="#" className="hover:text-[rgb(var(--foreground))] transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[rgb(var(--foreground))] transition-colors">
                  Negocios
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[rgb(var(--foreground))] transition-colors">
                  Categorías
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[rgb(var(--foreground))] transition-colors">
                  Sobre Nosotros
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg mb-4">Contacto</h3>
            <ul className="space-y-3 text-[rgb(var(--muted-foreground))]">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@locales.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Ciudad, País</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-1">
            <h3 className="text-lg mb-4">Síguenos</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgb(var(--border))] mt-8 pt-8 text-center text-[rgb(var(--muted-foreground))]">
          <p>&copy; 2025 Locales. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
