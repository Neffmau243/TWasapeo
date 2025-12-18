import React from 'react';

interface BusinessMapProps {
  latitude: number;
  longitude: number;
}

const BusinessMap: React.FC<BusinessMapProps> = ({ latitude, longitude }) => {
  return (
    <div className="business-map">
      <p>Map placeholder - Lat: {latitude}, Lng: {longitude}</p>
    </div>
  );
};

export default BusinessMap;
