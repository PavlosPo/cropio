import React, { useState } from 'react';

const ImageEditor = ({ imageSrc, onReset }) => {
  const [xScale, setXScale] = useState(1);
  const [yScale, setYScale] = useState(1);
  const [scaledImageSrc, setScaledImageSrc] = useState(null);
  const [paddingColor, setPaddingColor] = useState('white');
  const [borderColor, setBorderColor] = useState('black');
  const [inBetweenBorderPercnt, setBorderThickness] = useState(3); // Default 3%
  const [includeBorder, setIncludeBorder] = useState(false);

  const onReshapeScaling = () => {
    const img = new Image();
    img.src = imageSrc;
  
    img.onload = () => {
      const originalWidth = img.width;
      const originalHeight = img.height;
  
      // Maintain aspect ratio calculation
      const targetAspectRatio = xScale / yScale;
      const currentAspectRatio = originalWidth / originalHeight;
  
      // Border thickness calculation (percentage of image width)
      const borderThickness = Math.round(originalWidth * (inBetweenBorderPercnt / 100));
      const totalBorderThickness = includeBorder ? borderThickness : 0;
  
      // Create canvas for the image with the optional border
      const borderedCanvas = document.createElement('canvas');
      borderedCanvas.width = originalWidth + (2 * totalBorderThickness);
      borderedCanvas.height = originalHeight + (2 * totalBorderThickness);
      const borderedCtx = borderedCanvas.getContext('2d');
  
      // Draw border if included
      if (includeBorder) {
        borderedCtx.fillStyle = borderColor;
        borderedCtx.fillRect(0, 0, borderedCanvas.width, borderedCanvas.height);
      }
  
      // Draw the original image inside the bordered canvas
      borderedCtx.drawImage(
        img, 
        totalBorderThickness, 
        totalBorderThickness, 
        originalWidth, 
        originalHeight
      );
  
      // Adjust padding for aspect ratio
      let finalWidth = originalWidth * xScale;
      let finalHeight = originalHeight * yScale;
  
      // If the current aspect ratio doesn't match the target, adjust accordingly
      if (currentAspectRatio !== targetAspectRatio) {
        if (currentAspectRatio > targetAspectRatio) {
          // Image is wider, adjust height
          finalHeight = finalWidth / targetAspectRatio;
        } else {
          // Image is taller, adjust width
          finalWidth = finalHeight * targetAspectRatio;
        }
      }
  
      // Now, create the final canvas with padding and scaled dimensions
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = finalWidth + (2 * totalBorderThickness);
      finalCanvas.height = finalHeight + (2 * totalBorderThickness);
      const finalCtx = finalCanvas.getContext('2d');
  
      // Fill the background with padding color
      finalCtx.fillStyle = paddingColor;
      finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
  
      // Calculate position to center the bordered image within the final canvas
      const xOffset = (finalCanvas.width - borderedCanvas.width) / 2;
      const yOffset = (finalCanvas.height - borderedCanvas.height) / 2;
  
      // Draw the bordered image centered in the final canvas
      finalCtx.drawImage(
        borderedCanvas,
        xOffset,
        yOffset
      );
  
      // Set the new scaled image source
      setScaledImageSrc(finalCanvas.toDataURL());
    };
  };

  const onSave = () => {
    const link = document.createElement('a');
    link.href = scaledImageSrc || imageSrc;
    link.download = 'edited_image.png';
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Image Editor</h2>

      <div style={{ marginBottom: '20px', boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)', }}>
        <img src={scaledImageSrc || imageSrc} alt="To be edited" style={{ maxWidth: '100%', }} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          X Scale:
          <input
            type="number"
            value={xScale}
            onChange={(e) => setXScale(Number(e.target.value))}
            style={{ margin: '0 10px', width: '60px' }}
            min="0.1"
            step="0.1"
          />
        </label>
        <label>
          Y Scale:
          <input
            type="number"
            value={yScale}
            onChange={(e) => setYScale(Number(e.target.value))}
            style={{ margin: '0 10px', width: '60px' }}
            min="0.1"
            step="0.1"
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Padding Color:
          <select
            value={paddingColor}
            onChange={(e) => setPaddingColor(e.target.value)}
            style={{ margin: '0 10px' }}
          >
            <option value="white">White</option>
            <option value="black">Black</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Include Border:
          <input
            type="checkbox"
            checked={includeBorder}
            onChange={() => setIncludeBorder(!includeBorder)}
            style={{ margin: '0 10px' }}
          />
        </label>

        {includeBorder && (
          <>
            <label>
              Border Color:
              <select
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                style={{ margin: '0 10px' }}
              >
                <option value="white">White</option>
                <option value="black">Black</option>
              </select>
            </label>
            <label>
              Border Percentage (%):
              <input
                type="number"
                value={inBetweenBorderPercnt}
                onChange={(e) => setBorderThickness(Number(e.target.value))}
                style={{ margin: '0 10px', width: '60px' }}
                min="0"
                max="100"
              />
            </label>
            {/* <label>
              Fixed Border (px):
              <input
                type="number"
                value={fixedBorderPixels}
                onChange={(e) => setFixedBorderPixels(Number(e.target.value))}
                style={{ margin: '0 10px', width: '60px' }}
                min="0"
              />
            </label> */}
          </>
        )}
      </div>

      <div>
        <button onClick={onReshapeScaling} style={buttonStyle}>Reshape Scaling</button>
        <button onClick={onSave} style={buttonStyle}>Save Image</button>
        <button onClick={onReset} style={buttonStyle}>Reset</button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  margin: '10px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default ImageEditor;