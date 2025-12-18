import React from 'react';
import BusinessCard from './BusinessCard';

interface BusinessGridProps {
  businesses: any[];
}

const BusinessGrid: React.FC<BusinessGridProps> = ({ businesses }) => {
  return (
    <div className="business-grid">
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
};

export default BusinessGrid;
