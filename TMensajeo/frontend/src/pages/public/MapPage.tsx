import React from 'react';
import MapView from '../../components/map/MapView';

const MapPage: React.FC = () => {
  return (
    <div className="map-page">
      <h1>Mapa de negocios</h1>
      <MapView center={[0, 0]} />
    </div>
  );
};

export default MapPage;
