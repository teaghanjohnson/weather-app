const img = document.getElementById("gifImage");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const errorMessage = document.getElementById("errorMessage");
const loadingMessage = document.getElementById("loadingMessage");

const gif_API_KEY = "5QIQupLO1PzZFkXg5t2tev9MBKy2FyeY";
const gif_BASE_URL = "https://api.giphy.com/v1/gifs";

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

async function loadWeather() {
  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Toronto,ON/?key=${weather_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Network error: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
    console.log(data.address);
    console.log(data.description);
    console.log(data.currentConditions);
  } catch (err) {
    console.error("Error:", err);
  }
}
loadWeather();
