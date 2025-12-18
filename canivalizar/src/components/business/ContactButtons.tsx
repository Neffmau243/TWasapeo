import { MessageCircle, Send, Phone } from 'lucide-react';

interface ContactButtonsProps {
  phone?: string;
  whatsapp?: string;
  messenger?: string;
}

export function ContactButtons({ phone, whatsapp, messenger }: ContactButtonsProps) {
  const buttons = [];

  if (whatsapp) {
    buttons.push({
      icon: <MessageCircle className="w-6 h-6" />,
      label: 'WhatsApp',
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}`, '_blank')
    });
  }

  if (messenger) {
    buttons.push({
      icon: <Send className="w-6 h-6" />,
      label: 'Messenger',
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => window.open(`https://m.me/${messenger}`, '_blank')
    });
  }

  if (phone) {
    buttons.push({
      icon: <Phone className="w-6 h-6" />,
      label: 'Llamar',
      color: 'bg-[rgb(var(--foreground))] hover:opacity-90',
      onClick: () => window.open(`tel:${phone}`, '_blank')
    });
  }

  if (buttons.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 md:right-8 bottom-4 md:bottom-8 z-40 flex flex-col gap-3">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          className={`
            w-14 h-14 ${button.color} text-white shadow-lg 
            flex items-center justify-center transition-all
            hover:scale-110 group relative
          `}
          aria-label={button.label}
        >
          {button.icon}
          
          {/* Tooltip */}
          <span className="
            absolute right-full mr-3 px-3 py-2 bg-[rgb(var(--foreground))] text-[rgb(var(--background))]
            whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
            text-sm
          ">
            {button.label}
          </span>
        </button>
      ))}
    </div>
  );
}
