import React from 'react';

interface DistanceFilterProps {
  onChange: (distance: number) => void;
}

const DistanceFilter: React.FC<DistanceFilterProps> = ({ onChange }) => {
  return (
    <div className="distance-filter">
      <label>Distancia (km):</label>
      <input type="range" min="1" max="50" onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
};

export default DistanceFilter;
