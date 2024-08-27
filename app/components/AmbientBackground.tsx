import React from 'react';

const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 opacity-50"></div>
      <div className="absolute inset-0 bg-[url('/images/ambient-texture.png')] opacity-5"></div>
      {/* Add more ambient elements here */}
    </div>
  );
};

export default AmbientBackground;