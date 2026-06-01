import './styles/style.css';

// DOM Elements
const imageContainerList = document.getElementById('image-container-list');
const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

// Unsplash API
const apiKey = import.meta.env.VITE_UNSPLASH_KEY;
const apiBaseUrl = 'https://api.unsplash.com/photos/random';

// Global Variables
let selectedImageContainer = imageContainer;
let isInitialLoad = true;
let photosArray = [];
let imagesLoaded = 0;
let totalImages = 0;
let ready = false;

// Helper function
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Replicate image container to fill all the screen as possible
function fillImageContainerList() {
  let replicateCount =
    Math.floor(imageContainerList.clientWidth / imageContainer.clientWidth) - 1;

  while (replicateCount > 0) {
    const imageContainer = document.createElement('li');
    imageContainer.className = 'image-container';

    imageContainerList.insertAdjacentElement('beforeend', imageContainer);

    replicateCount--;
  }
}

// Check loaded images
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// Create HTML anchor elements for each photo and add them to the Image Container
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;

  photosArray.forEach((photo) => {
    // Anchor element
    const anchor = document.createElement('a');
    setAttributes(anchor, {
      href: photo.links.html,
      target: '_blank',
    });

    // Image element
    const image = document.createElement('img');

    setAttributes(image, {
      src: `${photo.urls.raw}&w=${selectedImageContainer.clientWidth}&auto=format&auto=compress`,
      alt: photo.alt_description,
      title: photo.alt_description,
      width: selectedImageContainer.clientWidth,
      height: Math.round(
        (selectedImageContainer.clientWidth / photo.width) * photo.height,
      ),
      fetchpriority: 'high',
    });

    image.addEventListener('load', imageLoaded);

    // Insert into the DOM
    anchor.insertAdjacentElement('beforeend', image);
    selectedImageContainer.insertAdjacentElement('beforeend', anchor);

    // Set the smallest image container to append the next photo
    for (const child of imageContainerList.children) {
      if (child.clientHeight < selectedImageContainer.clientHeight) {
        selectedImageContainer = child;
      }
    }
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(
      `${apiBaseUrl}?client_id=${apiKey}&count=${isInitialLoad ? 15 : 30}`,
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    photosArray = await response.json();

    displayPhotos();

    isInitialLoad = false;
  } catch (error) {
    alert(
      'Unable to load images. The service may be temporarily unavailable or due to API rate limits.\n' +
        `Please check back after ${(new Date().getHours() + 1).toString().padStart(2, '0')}:00.`,
    );
    console.log(error);
  }
}

// Event Listeners
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

// On load
fillImageContainerList();
getPhotos();
