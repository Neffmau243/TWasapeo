import React from 'react';

interface BusinessDetailProps {
  business: any;
}

const BusinessDetail: React.FC<BusinessDetailProps> = ({ business }) => {
  return (
    <div className="business-detail">
      <h1>{business?.name}</h1>
      <p>{business?.description}</p>
    </div>
  );
};

export default BusinessDetail;
