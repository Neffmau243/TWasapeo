import React from 'react';

interface BusinessInfoProps {
  business: any;
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({ business }) => {
  return (
    <div className="business-info">
      <p>{business?.address}</p>
      <p>{business?.phone}</p>
      <p>{business?.email}</p>
    </div>
  );
};

export default BusinessInfo;
