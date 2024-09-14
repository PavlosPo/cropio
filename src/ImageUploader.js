// ImageUploader.js
import React, { useState } from 'react';
import Loading from './Loading'; // Import the Loading component

const ImageUploader = ({ onImageUpload }) => {
  const [isUploading, setIsUploading] = useState(false);

  // Handle the file upload and image processing using a Web Worker
  const onUpload = () => {
    setIsUploading(true); // Show loading spinner
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
                    const { resizedImageUrl } = event.data;
                    onImageUpload(resizedImageUrl); // Pass the processed image to App.js
                    sessionStorage.setItem('uploadedImage', resizedImageUrl); // Save image in sessionStorage
                    setIsUploading(false); // Hide loading spinner
                };
            };
            
            reader.readAsArrayBuffer(file);
        }
      };
    
      input.click();
  };

  return (
    <div>
      {isUploading && <Loading />} {/* Show the loading spinner if isUploading is true */}
      <button onClick={onUpload}>Upload</button>
    </div>
  );
};

export default ImageUploader;