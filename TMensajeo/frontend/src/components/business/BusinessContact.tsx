import React from 'react';

interface BusinessContactProps {
  phone?: string;
  email?: string;
  website?: string;
}

const BusinessContact: React.FC<BusinessContactProps> = ({ phone, email, website }) => {
  return (
    <div className="business-contact">
      {phone && <a href={`tel:${phone}`}>Llamar</a>}
      {email && <a href={`mailto:${email}`}>Email</a>}
      {website && <a href={website} target="_blank" rel="noopener noreferrer">Sitio web</a>}
    </div>
  );
};

export default BusinessContact;
