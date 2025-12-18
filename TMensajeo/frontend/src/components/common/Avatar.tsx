import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Avatar', size = 'md' }) => {
  return (
    <div className={`avatar avatar-${size}`}>
      {src ? <img src={src} alt={alt} /> : <div className="avatar-placeholder">{alt[0]}</div>}
    </div>
  );
};

export default Avatar;
