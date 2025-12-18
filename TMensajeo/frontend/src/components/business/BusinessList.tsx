import React from 'react';

interface BusinessListProps {
  businesses: any[];
}

const BusinessList: React.FC<BusinessListProps> = ({ businesses }) => {
  return (
    <div className="business-list">
      {businesses.map((business) => (
        <div key={business.id} className="business-list-item">
          <h3>{business.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default BusinessList;
