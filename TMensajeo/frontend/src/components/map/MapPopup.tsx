import React from 'react';

interface MapPopupProps {
  children: React.ReactNode;
}

const MapPopup: React.FC<MapPopupProps> = ({ children }) => {
  return (
    <div className="map-popup">
      {children}
    </div>
  );
};

export default MapPopup;
