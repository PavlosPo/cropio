import React from 'react';
import './Loading.css'; // Import CSS for basic styling

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;