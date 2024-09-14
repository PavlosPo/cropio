onmessage = async (e) => {
  const { arrayBuffer, type, maxDimension = 2000 } = e.data;

  try {
    // Create a Blob from the received ArrayBuffer
    const blob = new Blob([arrayBuffer], { type });

    // Use createImageBitmap, which is available in workers, to handle images
    const imgBitmap = await createImageBitmap(blob);

    // Determine scaling factors
    const scaleUpFactor = Math.max(
      maxDimension / imgBitmap.width,
      maxDimension / imgBitmap.height,
      1 // Ensure it scales up if smaller than maxDimension
    );

    const newWidth = Math.floor(imgBitmap.width * scaleUpFactor);
    const newHeight = Math.floor(imgBitmap.height * scaleUpFactor);

    // Create an OffscreenCanvas to manipulate the image
    const targetCanvas = new OffscreenCanvas(newWidth, newHeight);
    const targetCtx = targetCanvas.getContext('2d');
    targetCtx.drawImage(imgBitmap, 0, 0, newWidth, newHeight);

    // Convert the canvas to a Blob and send it back to the main thread as a Blob URL
    const resizedBlob = await targetCanvas.convertToBlob();
    
    // Create a blob URL and send it back to the main thread
    const blobUrl = URL.createObjectURL(resizedBlob);
    postMessage({ resizedImageUrl: blobUrl });
  } catch (error) {
    // Send an error message back to the main thread if something goes wrong
    postMessage({ error: error.message });
  }
};