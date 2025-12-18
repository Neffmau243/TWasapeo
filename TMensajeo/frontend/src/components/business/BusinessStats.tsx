import React from 'react';

interface BusinessStatsProps {
  stats: any;
}

const BusinessStats: React.FC<BusinessStatsProps> = ({ stats }) => {
  return (
    <div className="business-stats">
      <p>Views: {stats?.views}</p>
      <p>Reviews: {stats?.reviewCount}</p>
    </div>
  );
};

export default BusinessStats;
