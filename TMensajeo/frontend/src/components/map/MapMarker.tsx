import React from 'react';

interface MapMarkerProps {
  position: [number, number];
  title: string;
}

const MapMarker: React.FC<MapMarkerProps> = ({ position, title }) => {
  return (
    <div className="map-marker" data-position={`${position[0]},${position[1]}`}>
      {title}
    </div>
  );
};

export default MapMarker;
