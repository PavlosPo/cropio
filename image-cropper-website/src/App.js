// import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import ImageEditor from './ImageEditor'; // Import the new component
import './App.css';


function App() {
  const [imageSrc, setImageSrc] = useState(null);

  // Retrieve the image from localStorage when the app loads
  useEffect(() => {
    const savedImage = localStorage.getItem('uploadedImage');
    if (savedImage) {
      setImageSrc(savedImage);
    }
  }, []);

  const ImageCropper = ({ imageSrc }) => {
    return imageSrc ? <img src={imageSrc} alt="To be cropped" /> : null;
  };

  const onUpload = () => {
    console.log('onUpload');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target.result;
          setImageSrc(imageData); // Store image data in the state
          localStorage.setItem('uploadedImage', imageData); // Save image in localStorage
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const onReset = () => {
    setImageSrc(null); // Clear the state
    localStorage.removeItem('uploadedImage'); // Clear localStorage
  };

  return (
    <>
      <h1>Hello Image Cropper</h1>
      <p>Start editing to see some magic happen :)</p>
      {/* If an image is uploaded, show the ImageEditor component */}
      {imageSrc ? (
        <ImageEditor imageSrc={imageSrc} onReset={onReset} />
      ) : (
        <>
          <button onClick={onUpload}>Upload</button>
        </>
      )}
    </>
  );
}

export default App;
