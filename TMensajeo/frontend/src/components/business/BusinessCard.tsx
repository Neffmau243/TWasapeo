import React from 'react';
import { Link } from 'react-router-dom';

interface BusinessCardProps {
  business: any;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  return (
    <Link 
      to={`/business/${business.slug}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        {business.images && business.images.length > 0 ? (
          <img
            src={business.images[0].url}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">🏪</span>
          </div>
        )}
        {business.featured && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">
            ⭐ Destacado
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {business.name}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          {business.category && (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              {business.category.name}
            </span>
          )}
          {business.averageRating && (
            <span className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-medium">{business.averageRating.toFixed(1)}</span>
              <span className="text-gray-400">({business.reviewCount || 0})</span>
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
          {business.description}
        </p>
        
        {business.address && (
          <p className="text-gray-500 text-sm">
            📍 {business.address}
          </p>
        )}
      </div>
    </Link>
  );
};

export default BusinessCard;
