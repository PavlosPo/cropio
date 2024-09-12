import Cropper from 'cropperjs';

const image = document.getElementById('image');
const fileInput = document.getElementById('fileInput');
const cropButton = document.getElementById('cropButton');
let cropper;

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    image.src = event.target.result;
    image.style.display = 'block';
    cropper = new Cropper(image, {
      aspectRatio: 16 / 9, // Or any ratio
      viewMode: 1,
      background: false,
    });
  };
  reader.readAsDataURL(file);
});

cropButton.addEventListener('click', () => {
  const croppedImage = cropper.getCroppedCanvas().toDataURL();
  console.log(croppedImage); // You can now send this to the server or download it
});

