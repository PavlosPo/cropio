onmessage = async (e) => {
  const { arrayBuffer, type } = e.data;
  
  // Create a Blob from the received ArrayBuffer
  const blob = new Blob([arrayBuffer], { type });
  
  // Use createImageBitmap, which is available in workers, to handle images
  const imgBitmap = await createImageBitmap(blob);

  // Create an OffscreenCanvas to manipulate the image
  const canvas = new OffscreenCanvas(imgBitmap.width, imgBitmap.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgBitmap, 0, 0);

  // Rescale or manipulate the image
  const maxDimension = 2000; // Example resizing logic
  const newWidth = imgBitmap.width > imgBitmap.height ? maxDimension : (imgBitmap.width * maxDimension) / imgBitmap.height;
  const newHeight = imgBitmap.height > imgBitmap.width ? maxDimension : (imgBitmap.height * maxDimension) / imgBitmap.width;

  const targetCanvas = new OffscreenCanvas(newWidth, newHeight);
  const targetCtx = targetCanvas.getContext('2d');
  targetCtx.drawImage(imgBitmap, 0, 0, newWidth, newHeight);

  // Convert the canvas to a Blob and send it back to the main thread as a Data URL
  const resizedBlob = await targetCanvas.convertToBlob();
  
  const reader = new FileReader();
  reader.onloadend = () => {
    postMessage({ resizedImage: reader.result });
  };

  reader.readAsDataURL(resizedBlob); // Convert Blob to Data URL
};