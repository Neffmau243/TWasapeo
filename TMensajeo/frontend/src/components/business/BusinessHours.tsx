import React from 'react';

interface BusinessHoursProps {
  hours: any;
}

const BusinessHours: React.FC<BusinessHoursProps> = ({ hours }) => {
  return (
    <div className="business-hours">
      <h3>Horarios</h3>
      {/* Display hours here */}
    </div>
  );
};

export default BusinessHours;
