import { MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

interface Question {
  id: number;
  userName: string;
  question: string;
  answer?: string;
  date: string;
}

interface FAQSectionProps {
  questions: Question[];
  onAskQuestion: () => void;
}

export function FAQSection({ questions, onAskQuestion }: FAQSectionProps) {
  const [newQuestion, setNewQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally trigger login modal
    onAskQuestion();
    setNewQuestion('');
  };

  return (
    <div className="border-t border-[rgb(var(--border))] pt-8">
      <h2 className="text-3xl mb-6">Preguntas Frecuentes</h2>

      {/* Ask Question Form */}
      <div className="border border-[rgb(var(--border))] p-6 mb-6">
        <h3 className="text-xl mb-4">Hacer una Pregunta</h3>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            className="flex-1 px-4 py-3 border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))]"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>
        <p className="text-sm text-[rgb(var(--muted-foreground))] mt-2">
          Debes iniciar sesión para hacer preguntas
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-12 border border-[rgb(var(--border))]">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-[rgb(var(--muted-foreground))]" />
            <p className="text-[rgb(var(--muted-foreground))]">
              No hay preguntas aún. ¡Sé el primero en preguntar!
            </p>
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="border border-[rgb(var(--border))] p-6">
              {/* Question */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-lg">{q.userName}</p>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">{q.date}</p>
                </div>
                <p className="text-[rgb(var(--muted-foreground))]">{q.question}</p>
              </div>

              {/* Answer */}
              {q.answer && (
                <div className="border-l-4 border-[rgb(var(--border))] pl-6 bg-[rgb(var(--muted))] p-4">
                  <p className="text-sm mb-2">
                    <strong>Respuesta del Negocio:</strong>
                  </p>
                  <p className="text-[rgb(var(--muted-foreground))]">{q.answer}</p>
                </div>
              )}

              {!q.answer && (
                <p className="text-sm text-[rgb(var(--muted-foreground))] italic">
                  Esperando respuesta...
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
