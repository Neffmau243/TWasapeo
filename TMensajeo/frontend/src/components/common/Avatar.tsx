import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Avatar', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 text-2xl',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-semibold`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {alt?.[0]?.toUpperCase() || 'U'}
        </div>
      )}
    </div>
  );
};

export default Avatar;
