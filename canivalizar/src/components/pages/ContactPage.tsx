import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState } from 'react';

interface ContactPageProps {
  translations: any;
}

export function ContactPage({ translations }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit
    alert('Mensaje enviado con éxito! (Demo)');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-[rgb(var(--border))] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl mb-6">{translations.contact.title}</h1>
          <p className="text-xl text-[rgb(var(--muted-foreground))]">
            {translations.contact.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="border border-[rgb(var(--border))] p-8">
              <h2 className="text-3xl mb-8">Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm uppercase tracking-wider">
                    {translations.contact.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm uppercase tracking-wider">
                    {translations.contact.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))]"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 text-sm uppercase tracking-wider">
                    {translations.contact.message}
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] hover:opacity-90 transition-opacity"
                >
                  {translations.contact.send}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl mb-8">{translations.contact.info}</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[rgb(var(--muted))] flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl mb-1">Dirección</h3>
                      <p className="text-[rgb(var(--muted-foreground))]">
                        Calle Principal 123<br />
                        Ciudad, País 12345
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[rgb(var(--muted))] flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl mb-1">Teléfono</h3>
                      <p className="text-[rgb(var(--muted-foreground))]">
                        +1 (234) 567-8900
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[rgb(var(--muted))] flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl mb-1">Email</h3>
                      <p className="text-[rgb(var(--muted-foreground))]">
                        contacto@empresa.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[rgb(var(--muted))] flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl mb-1">Horario de Atención</h3>
                      <p className="text-[rgb(var(--muted-foreground))]">
                        Lunes - Viernes: 9:00 - 18:00<br />
                        Sábado: 10:00 - 14:00<br />
                        Domingo: Cerrado
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="aspect-video bg-[rgb(var(--muted))] border border-[rgb(var(--border))] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-[rgb(var(--muted-foreground))]" />
                    <p className="text-[rgb(var(--muted-foreground))]">Mapa de Ubicación</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
