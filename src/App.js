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

  // Handle the file upload and image processing using a Web Worker
  const onUpload = () => {
    console.log('onUpload');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (event) => {
      const file = event.target.files[0];
      
      if (file) {
        const worker = new Worker(new URL('./imageWorker.js', import.meta.url));
        
        // Read the image as an ArrayBuffer and send it to the worker
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          worker.postMessage({ arrayBuffer, type: file.type });
          
          worker.onmessage = (event) => {
            const { resizedImage } = event.data;
            setImageSrc(resizedImage); // Set the processed image
            localStorage.setItem('uploadedImage', resizedImage); // Save image in localStorage
          };
        };
        
        reader.readAsArrayBuffer(file);
      }
    };
    
    input.click();
  };

  const onReset = () => {
    setImageSrc(null); // Clear the state
    localStorage.removeItem('uploadedImage'); // Clear localStorage
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Hello Image Cropper</h1>
      <p>Start editing to see some magic happen :)</p>
      {/* If an image is uploaded, show the ImageEditor component */}
      <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
      {imageSrc ? (
        <div style={{ display: 'flex', width: '70%', height: '70%', position: 'relative', border: '1px solid black', boxSizing: 'border-box' , justifyContent: 'center' }}>
          <ImageEditor imageSrc={imageSrc} onReset={onReset} />
        </div>
        
      ) : (
        <>
          <button onClick={onUpload}>Upload</button>
        </>
      )}
      </div>
    </div>
  );
}

export default App;