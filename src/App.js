import React, { useState, useEffect } from 'react';
import ImageEditor from './ImageEditor'; // Import the new component
import ImageUploader from './ImageUploader'; // Import the new component
import AdsComponent from './AdsComponent';
import './App.css';

function App() {
  const [imageSrc, setImageSrc] = useState(null);

  // Retrieve the image from sessionStorage when the app loads
  useEffect(() => {
    const savedImage = sessionStorage.getItem('uploadedImage');
    if (savedImage) {
      setImageSrc(savedImage);
    }
  }, []);

  // Handle image upload
  const handleImageUpload = (uploadedImageUrl) => {
    setImageSrc(uploadedImageUrl);
  };

  const onReset = () => {
    setImageSrc(null); // Clear the state
    sessionStorage.removeItem('uploadedImage'); // Clear sessionStorage
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Hello Image Cropper</h1>
      <p>Start editing to see some magic happen :)</p>
      {/* If an image is uploaded, show the ImageEditor component */}
      <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
      {imageSrc ? (
        <div style={{ display: 'flex', width: '90%', height: '90%', position: 'relative', border: '1px solid black', boxSizing: 'border-box', justifyContent: 'center' }}>
          <ImageEditor imageSrc={imageSrc} onReset={onReset} />
        </div>
        
      ) : (
        <>
          <ImageUploader onImageUpload={handleImageUpload} />
        </>
      )}
      </div>

      <AdsComponent dataAdSlot="ca-pub-5898193160453953"/>

    </div>

    
  );
}

export default App;