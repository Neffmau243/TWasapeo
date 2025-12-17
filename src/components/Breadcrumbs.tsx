import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-[rgb(var(--muted-foreground))]">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="hover:text-[rgb(var(--foreground))] transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className={index === items.length - 1 ? 'text-[rgb(var(--foreground))]' : ''}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
