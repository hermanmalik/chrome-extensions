
// Set 'real' or 'ai' depending on what type of art you want
const AI_OR_REAL = 'test';
const DEFAULT_PROMPT = 'generate an image of a potato in the style of Escher';


const GPT_URL = 'https://api.openai.com/v1/images/generations'; // DALL-E API endpoint
const GPT_KEY = "";
const MODEL = 'dall-e-3'; // 0.08 (standard) or 0.12 (hd) per image
const SIZE = '1792x1024'; // The size of the generated images. Must be one of 256x256, 512x512, or 1024x1024 for dall-e-2. Must be one of 1024x1024, 1792x1024, or 1024x1792 for dall-e-3 models.
const STYLE = 'vivid'; // must be 'vivid' or 'natural', dall-e-3 only param
const QUALITY = 'standard' // 'hd' or 'standard', dall-e-3 only param
const IMAGES_TO_KEEP = 7;
const debug = true;


document.addEventListener('DOMContentLoaded', async () => {
  const imgElement = document.getElementById('artwork');
  const prompt = localStorage.getItem('prompt') || DEFAULT_PROMPT;

  // first check local storage for today and tomorrow's images
  // if they are not present, generate them
  updateLocalStorage(prompt);
  imgElement.src = await getTodaysArt(AI_OR_REAL);

  // event listeners for buttons
  document.getElementById('regenerate').addEventListener('click', async () => {
    const newImage = await getAIImageJSON(prompt);
    const newImageData = `data:image/png;base64,${newImage}`;
    localStorage.setItem(`image-${new Date().toISOString().split('T')[0]}`, newImageData); // change for today
    imgElement.src = newImageData;
  });

  document.getElementById('save').addEventListener('click', () => {
    saveFavoriteImage(imgElement.src);
  });

  document.getElementById('customizePrompt').addEventListener('click', () => {
    const newPrompt = prompt('Enter a new prompt:', prompt);
    if (newPrompt) {
      localStorage.setItem('prompt', newPrompt);
      window.location.reload();
    }
  });
  
});

// Queries local storage for today and tomorrow's AI art. If either is missing, it generates it.
async function updateLocalStorage(prompt) {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
  
  const todayImage = localStorage.getItem(`image-${today}`);
  const tomorrowImage = localStorage.getItem(`image-${tomorrow}`);
  
  if (!todayImage) {
    if (debug) console.log("generated today's image");
    const base64JSON = await getAIImageJSON(prompt);
    const imageData = `data:image/png;base64,${base64JSON}`;
    localStorage.setItem(`image-${today}`, imageData);
  }
  
  if (!tomorrowImage) {
    if (debug) console.log("generated tomorrow's image");
    const base64JSON = await getAIImageJSON(prompt);
    const imageData = `data:image/png;base64,${base64JSON}`;
    localStorage.setItem(`image-${tomorrow}`, imageData);
  }
  
  // Cleanup old images
  cleanupOldImages();
}

// Cleanup old images
function cleanupOldImages() {
  const today = new Date();
  const cutoffDate = new Date(today.setDate(today.getDate() - IMAGES_TO_KEEP)).toISOString().split('T')[0];
  
  for (const key in localStorage) {
    if (key.startsWith('image-')) {
      const dateStr = key.split('-')[1];
      if (new Date(dateStr) < new Date(cutoffDate)) {
        if (debug) console.log("removed images");
        localStorage.removeItem(key);
      }
    }
  }
}

// Checks if AI or real image is requested. If real, get real art; if AI, get today's AI art.
// If the AI art is missing, fallback to real art.
async function getTodaysArt(ai_or_real) {
  if (ai_or_real === 'test') return 'example.png'; // Placeholder image for testing
  if (ai_or_real === 'real') return await getRealImageURL();
  if (ai_or_real === 'ai') {
    const today = new Date().toISOString().split('T')[0];
    const imageData = localStorage.getItem(`image-${today}`);
    if (imageData) return imageData;
    return await getRealImageURL(); // Fallback if AI art is missing
  }
}

// get URL of art
async function getRealImageURL() {
  // TODO
  return 'example.png' // for testing
}

// get base64JSON of generated image from OpenAI
async function getAIImageJSON(prompt) {

    // Define the API request body
    const requestBody = {
        model: MODEL,
        prompt: prompt,
        n: 1, // dall-e-3 only supports n=1
        size: SIZE,
        quality: QUALITY,
        response_format: 'b64_json', // the request will return the image URL
        style: STYLE
    };
    
    if (debug) console.log(requestBody);

    try {
        // Make the API request
        const response = await fetch(GPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPT_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        if (debug) console.log(data);

        return data.data[0].b64_json;
       
    } catch (error) {
        console.error('Error generating image:', error);
        return;
    }
}

// Save image to favorites
function saveFavoriteImage(url) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.includes(url)) {
    favorites.push(url);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Image saved to favorites!');
  } else {
    alert('Image is already in favorites.');
  }
}
