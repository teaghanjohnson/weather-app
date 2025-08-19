const img = document.getElementById("gifImage");
const iconElement = document.getElementById("weatherIcon");
img.classList = "hidden";
iconElement.classList = "hidden";
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const errorMessage = document.getElementById("errorMessage");
const loadingMessage = document.getElementById("loadingMessage");
const locationTitle = document.querySelector(".locationTitle");

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
    console.log(locationContainer);
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
    const conditions = `${weatherData.currentConditions.icon} weather`;
    const gifUrl = await loadGIF(conditions);
    displayWeatherIcon(weatherData);
    displayGIF(gifUrl);
    locationTitle.textContent = `${weatherData.address}`;
  } catch (err) {
    console.error("Error", err);
  }
}

function displayGIF(gifUrl) {
  img.src = gifUrl;
  img.style.display = "block";
  img.classList = "active";
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
    const response = await fetch(url, { mode: "cors" });
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

const weatherIcons = {
  // Clear conditions
  "clear-day":
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/clear-day.png",
  "clear-night":
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/clear-night.png",

  // Cloudy conditions
  cloudy:
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/cloudy.png",
  "partly-cloudy-day":
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/partly-cloudy-day.png",
  "partly-cloudy-night":
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/partly-cloudy-night.png",

  // Precipitation
  rain: "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/rain.png",
  snow: "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/snow.png",
  sleet:
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/sleet.png",
  "showers-day":
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/showers-day.png",
  "showers-night":
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/showers-night.png",
  "snow-showers-day":
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/snow-showers-day.png",
  "snow-showers-night":
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/snow-showers-night.png",
  "thunder-rain":
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/thunder-rain.png",
  "thunder-showers-day":
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/thunder-showers-day.png",
  "thunder-showers-night":
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/thunder-showers-night.png",

  // Atmospheric conditions
  fog: "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/fog.png",
  wind: "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/wind.png",
  hail: "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/hail.png",

  // Additional conditions
  tornado:
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/tornado.png",
  hurricane:
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/hurricane.png",
  sunrise:
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/sunrise.png",
  sunset:
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/sunset.png",
};

function getWeatherIcon(iconName) {
  return weatherIcons[iconName] || weatherIcons["clear-day"]; //fallback
}

function displayWeatherIcon(weatherData) {
  const iconName = weatherData.currentConditions.icon;
  const iconUrl = getWeatherIcon(iconName);
  iconElement.classList = "active";
  iconElement.src = iconUrl;
  iconElement.style.display = "block";
}

function getCurrentLocation() {
  const statusElement = document.getElementById("locationStatus");

  // Check if geolocation is supported
  if (!navigator.geolocation) {
    showError("Geolocation is not supported on this browser");
    return;
  }

  // Show loading message
  statusElement.textContent = "Getting your location ...";
  showLoading();

  navigator.geolocation.getCurrentPosition(
    // Success callback
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      statusElement.textContent = "Location found! Getting weather...";

      try {
        // Use coordinates to get weather
        await loadWeatherByCoordinates(lat, lon);
        statusElement.textContent = "";
        hideLoading();

        setTimeout(() => {
          statusElement.textContent = "";
        }, 3000);
      } catch (error) {
        console.error("Weather loading error: ", error);
        showError("Failed to get weather for your location.");
        statusElement.textContent = "";
        hideLoading();
      }
    },
    (error) => {
      let errorMessage = "";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access denied. Please enable location";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out.";
        default:
          errorMessage = "An unknown error occured while gettin location.";
          break;
      }
      showError(errorMessage);
      statusElement.textContent = "";
      hideLoading();
    },
  );
}

async function loadWeatherByCoordinates(lat, lon) {
  try {
    // process coordinates in lat,lon format
    const location = `${lat}, ${lon}`;
    const weatherData = await getWeather(location);

    // Display weather data same as the manual search
    const conditions = `${weatherData.currentConditions.icon} weather`;
    const gifUrl = await loadGIF(conditions);
    displayWeatherIcon(weatherData);
    displayGIF(gifUrl);

    // update UI to show resolved location name
    updateLocationDisplay(weatherData.address);

    return weatherData;
  } catch (error) {
    console.error("Error loadding weather by coordinates:", error);
    throw error;
  }
}

// function to displat current location
function updateLocationDisplay(locationName) {
  const locationDisplay = document.getElementById("currentLocation");
  if (locationDisplay) {
    locationDisplay.textContent = `Current location: ${locationName}`;
  }
}

function autoDetectLocation() {
  const autoDetect = confirm(
    "Would you like to the weather for your current location",
  );
  if (autoDetect) {
    getCurrentLocation();
  }
}

autoDetectLocation();
