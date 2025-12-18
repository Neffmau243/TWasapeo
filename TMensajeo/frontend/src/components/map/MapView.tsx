import React from 'react';

interface MapViewProps {
  center: [number, number];
  zoom?: number;
}

const MapView: React.FC<MapViewProps> = ({ center, zoom = 13 }) => {
  return (
    <div className="map-view">
      <p>Map component placeholder</p>
      <p>Center: {center[0]}, {center[1]} - Zoom: {zoom}</p>
    </div>
  );
};

export default MapView;
