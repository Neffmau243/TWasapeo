import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

interface EventsSliderProps {
  events: Event[];
}

export function EventsSlider({ events }: EventsSliderProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!events || events.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  return (
    <div className="border-t border-[rgb(var(--border))] pt-8">
      <h2 className="text-3xl mb-6">Eventos y Actualizaciones</h2>

      <div className="relative">
        {/* Slider */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {events.map((event) => (
              <div
                key={event.id}
                className="w-full flex-shrink-0 px-2"
              >
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="w-full border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] transition-colors group text-left"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-[rgb(var(--muted-foreground))] mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <h3 className="text-xl mb-2">{event.title}</h3>
                    <p className="text-[rgb(var(--muted-foreground))] line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {events.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-[rgb(var(--background))] border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] transition-colors flex items-center justify-center"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-[rgb(var(--background))] border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] transition-colors flex items-center justify-center"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {events.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`
                  w-2 h-2 transition-all
                  ${index === currentIndex ? 'bg-[rgb(var(--foreground))] w-6' : 'bg-[rgb(var(--border))]'}
                `}
                aria-label={`Ir a evento ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-[rgb(var(--background))] border border-[rgb(var(--border))] max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 bg-[rgb(var(--background))] border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] transition-colors z-10"
                aria-label="Cerrar"
              >
                <X className="w-6 h-6" />
              </button>

              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full aspect-video object-cover"
              />

              <div className="p-8">
                <div className="flex items-center gap-2 text-[rgb(var(--muted-foreground))] mb-4">
                  <Calendar className="w-5 h-5" />
                  <span>{selectedEvent.date}</span>
                </div>
                <h2 className="text-4xl mb-6">{selectedEvent.title}</h2>
                <p className="text-lg text-[rgb(var(--muted-foreground))] leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
