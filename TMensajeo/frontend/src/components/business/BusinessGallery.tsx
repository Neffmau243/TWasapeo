import React from 'react';

interface BusinessGalleryProps {
  images: string[];
}

const BusinessGallery: React.FC<BusinessGalleryProps> = ({ images }) => {
  return (
    <div className="business-gallery">
      {images.map((image, index) => (
        <img key={index} src={image} alt={`Gallery ${index}`} />
      ))}
    </div>
  );
};

export default BusinessGallery;
