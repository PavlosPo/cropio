import React, { useState } from 'react';
import Loading from './Loading'; // Import the Loading component

const ImageEditor = ({ imageSrc, onReset }) => {
  const [xScale, setXScale] = useState(1);
  const [yScale, setYScale] = useState(1);
  const [scaledImageSrc, setScaledImageSrc] = useState(null);
  const [paddingColor, setPaddingColor] = useState('white');
  const [borderColor, setBorderColor] = useState('black');
  const [inBetweenBorderPercnt, setBorderThickness] = useState(3); // Default 3%
  // const [includeBorder, setIncludeBorder] = useState(false);
  const [extraPadding, setExtraPadding] = useState(30); // First stage padding in pixels
  const [includeExtraBorder, setIncludeExtraBorder] = useState(false); // Second stage border option
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const onReshapeScaling = () => {
    setIsLoading(true); // Show loading spinner
    const img = new Image();
    img.src = imageSrc;
  
    img.onload = () => {
      const originalWidth = img.width;
      const originalHeight = img.height;
  
      // Normalize the aspect ratio
      const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(xScale, yScale);
      const normalizedXScale = xScale / divisor;
      const normalizedYScale = yScale / divisor;
      const targetAspectRatio = normalizedXScale / normalizedYScale;
  
      // First stage: Add extra padding of specified pixels
      const borderedCanvas = document.createElement('canvas');
      const extraPaddingCanvasWidth = originalWidth + (2 * extraPadding);
      const extraPaddingCanvasHeight = originalHeight + (2 * extraPadding);
      borderedCanvas.width = extraPaddingCanvasWidth;
      borderedCanvas.height = extraPaddingCanvasHeight;
      const borderedCtx = borderedCanvas.getContext('2d');
  
      borderedCtx.fillStyle = borderColor;
      borderedCtx.fillRect(0, 0, extraPaddingCanvasWidth, extraPaddingCanvasHeight);
      borderedCtx.drawImage(img, extraPadding, extraPadding, originalWidth, originalHeight);
  
      // Second stage: Optionally add in-between border
      let canvasWithBorder = borderedCanvas;
      let borderThickness = 0;
      if (includeExtraBorder) {
        borderThickness = Math.round((extraPaddingCanvasWidth * inBetweenBorderPercnt) / 100);
        const borderCanvas = document.createElement('canvas');
        borderCanvas.width = canvasWithBorder.width + (2 * borderThickness);
        borderCanvas.height = canvasWithBorder.height + (2 * borderThickness);
        const borderCtx = borderCanvas.getContext('2d');
  
        borderCtx.fillStyle = paddingColor;
        borderCtx.fillRect(0, 0, borderCanvas.width, borderCanvas.height);
  
        borderCtx.drawImage(canvasWithBorder, borderThickness, borderThickness);
  
        canvasWithBorder = borderCanvas;
      }
  
      // Third stage: Adjust padding for aspect ratio and final scaling
      let finalWidth, finalHeight;
  
      // Adjust the dimensions based on the target aspect ratio
      const currentAspectRatio = canvasWithBorder.width / canvasWithBorder.height;
      if (currentAspectRatio > targetAspectRatio) {
        finalWidth = canvasWithBorder.width;
        finalHeight = finalWidth / targetAspectRatio;
      } else {
        finalHeight = canvasWithBorder.height;
        finalWidth = finalHeight * targetAspectRatio;
      }
  
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = finalWidth;
      finalCanvas.height = finalHeight;
      const finalCtx = finalCanvas.getContext('2d');
  
      finalCtx.fillStyle = paddingColor;
      finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
  
      const xOffset = (finalCanvas.width - canvasWithBorder.width) / 2;
      const yOffset = (finalCanvas.height - canvasWithBorder.height) / 2;
      finalCtx.drawImage(canvasWithBorder, xOffset, yOffset);
  
      // Save final image
      const quality = 0.8; // Adjust the quality parameter as needed (0.1 to 1.0)
      setScaledImageSrc(finalCanvas.toDataURL('image/jpeg', quality)); // Max quality for JPEG
      setIsLoading(false); // Hide loading spinner
    };
  };

  const onSave = () => {
    const link = document.createElement('a');
    link.href = scaledImageSrc || imageSrc;
    link.download = 'edited_image.jpg';
    link.click();
  };

  return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        {isLoading && <Loading />} {/* Show the loading spinner if isLoading is true */}
        <h2>Image Editor</h2>
        <div className='image-container'>
          <img
            src={scaledImageSrc || imageSrc}
            alt="To be edited"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>
        {/* Scale input */}
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

        {/* First stage padding input */}
        <div style={{ marginBottom: '20px' }}>
          <label>
            Extra Padding (px):
            <input
              type="number"
              value={extraPadding}
              onChange={(e) => setExtraPadding(Number(e.target.value))}
              style={{ margin: '0 10px', width: '60px' }}
              min="0"
            />
          </label>
        </div>

        {/* In-between border option */}
        <div style={{ marginBottom: '20px' }}>
          <label>
            Include In-between Border:
            <input
              type="checkbox"
              checked={includeExtraBorder}
              onChange={() => setIncludeExtraBorder(!includeExtraBorder)}
              style={{ margin: '0 10px' }}
            />
          </label>

          {includeExtraBorder && (
            <>
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
            </>
          )}
        </div>

        {/* Color selectors */}
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
          <label>
            Border Color (First stage):
            <select
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              style={{ margin: '0 10px' }}
            >
              <option value="white">White</option>
              <option value="black">Black</option>
            </select>
          </label>
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