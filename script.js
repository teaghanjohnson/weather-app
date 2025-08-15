const img = document.getElementById("gifImage");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const errorMessage = document.getElementById("errorMessage");
const loadingMessage = document.getElementById("loadingMessage");

const gif_API_KEY = "5QIQupLO1PzZFkXg5t2tev9MBKy2FyeY";
const gif_BASE_URL = `https://api.giphy.com/v1/gifs/translate?api_key=${gif_API_KEY}&s=`;

const weather_API_KEY = "RV5LNK9D9X9BSX9CMXDVS4NVH";
const weather_BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

function showLoading() {
  loadingMessage.style.display = "block";
  hideError();
}

function hideLoading() {
  loadingMessage.style.display = "none";
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

function hideError() {
  errorMessage.style.display = "none";
}

function showImage(url) {
  img.src = url;
  img.style.display = "block";
}

const locationContainer = [];
async function getWeather(location) {
  try {
    const url = `${weather_BASE_URL}${location}?key=${weather_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Network error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    if (!data || data.address == 0) {
      throw new Error(`Location Not Found: ${location}`);
    }

    console.log(data);
    console.log(data.address);
    console.log(data.description);
    const fahrenheit = parseInt(data.currentConditions.temp);
    const celsius = fahrenheitToCelsius(fahrenheit);
    console.log(celsius);
    locationContainer.push(data.address);
    //*** FUTURE ADDITION***
    /*const highest = fahrenheitToCelsius(
      parseInt(data.currentConditions.tempmax),
    );
    const lowest = fahrenheitToCelsius(
      parseInt(data.currentConditions.tempmin),
    );
    console.log(
      `the highest will be ${highest} and the lowest will ${lowest}.`,
    );
    */
    return data;
  } catch (err) {
    console.error("Error:", err);
    showError(err.message);
    throw err;
  }
}

async function searchLocation() {
  const location = searchInput.value.trim();
  if (!location) {
    showError("Please enter a city!");
    return;
  }

  try {
    const weatherData = await getWeather(location);
    const conditions = weatherData.currentConditions.icon;
    const gifUrl = await loadGIF(conditions);
    displayGIF(gifUrl);
  } catch (err) {
    console.error("Error", err);
  }
}

function displayGIF(gifUrl) {
  img.src = gifUrl;
  img.style.dispaly = "block";
}

searchBtn.addEventListener("click", () => {
  searchLocation();
  searchInput.value = "";
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchLocation();
    searchInput.value = "";
  }
});

function getDates() {
  //User chooses dates on a calendar they would like weather(lenght subject to API)
}

function fahrenheitToCelsius(fahrenheit) {
  const celsius = Math.floor(((fahrenheit - 32) * 5) / 9);
  return `The temperature is ${celsius}.`;
}

async function loadGIF(weatherConditions) {
  try {
    const url = `${gif_BASE_URL}${weatherConditions}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Network error: ${response.status} ${response.statusText}`,
      );
    }
    const gifData = await response.json();
    if (!gifData || !gifData.data) {
      throw new Error(`GIF not found: ${weatherConditions}`);
    }
    return gifData.data.images.original.url;
  } catch (err) {
    console.error("Error:", err);
    showError(err.message);
    throw err;
  }
}
