const img = document.getElementById("gifImage");
const iconElement = document.getElementById("weatherIcon");
const descIcon = document.getElementById("descIcon");
img.classList = "hidden";
iconElement.classList.add("hidden");
descIcon.classList.add("hidden");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const errorMessage = document.getElementById("errorMessage");
const loadingMessage = document.getElementById("loadingMessage");
const locationTitle = document.querySelector(".locationTitle");
const locationBtn = document.getElementById("locationBtn");
const iconText = document.getElementById("icon-text");
const warningInput = document.getElementById("warningInput");
const warningSearchBtn = document.querySelector(".warningSearch");

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
    return data;
  } catch (err) {
    console.error("Error:", err);
    showError(err.message);
    throw err;
  }
}

async function performWeatherSearch(location) {
  if (!location) {
    showError("Please enter a city!");
    return;
  }

  try {
    showLoading();
    const weatherData = await getWeather(location);
    const conditions = `${weatherData.currentConditions.icon} weather`;
    //const gifUrl = await loadGIF(conditions);

    displayWeatherIcon(weatherData);
    //displayGIF(gifUrl);
    addToLocationList(location);
    locationTitle.textContent = `${weatherData.address}`;
    iconText.textContent = `${weatherData.currentConditions.icon}`;

    const forecastDays = await get7DayForecast(location);
    display7DayForecast(forecastDays);

    const feelTemp = document.getElementById("feel");
    const highTemp = document.getElementById("high");
    const lowTemp = document.getElementById("low");
    const currentTemp = document.getElementById("current");

    const feelFahrenheit = parseInt(weatherData.currentConditions.feelslike);
    const highFahrenheit = parseInt(weatherData.currentConditions.tempmax);
    const lowFahrenheit = parseInt(weatherData.currentConditions.tempmin);
    const currentFahrenheit = parseInt(weatherData.currentConditions.temp);

    feelTemp.textContent += ` ${Math.floor(fahrenheitToCelsius(feelFahrenheit))}`;
    highTemp.textContent += ` ${Math.floor(fahrenheitToCelsius(highFahrenheit))}`;
    lowTemp.textContent += ` ${Math.floor(fahrenheitToCelsius(lowFahrenheit))}`;
    currentTemp.textContent += ` ${Math.floor(fahrenheitToCelsius(currentFahrenheit))}`;

    hideLoading();
  } catch (err) {
    console.error("Error", err);
    hideLoading();
  }
}
async function searchLocation() {
  const location = searchInput.value.trim();
  await performWeatherSearch(location);
}

async function searchLocationTwo() {
  const location = warningInput.value.trim();
  await performWeatherSearch(location);
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

const locationHistory = [];
function addToLocationList(locationName) {
  const placesList = document.getElementById("places");

  if (!placesList) {
    console.error("List element not found");
    return;
  }

  if (locationHistory.includes(locationName)) {
    console.log("Location already in history");
    return;
  }

  locationHistory.push(locationName);

  const listItem = document.createElement("li");
  listItem.textContent = locationName;
  listItem.classList.add("location-item");
  listItem.style.cursor = "pointer";
  listItem.style = "flex";

  listItem.addEventListener("click", async () => {
    try {
      const weatherData = await getWeather(listItem.textContent);
      const conditions = `${weatherData.currentConditions.icon} weather`;
      const gifUrl = await loadGIF(conditions);

      displayWeatherIcon(weatherData);
      displayGIF(gifUrl);

      locationTitle.textContent = listItem.textContent;
      hideLoading();
    } catch (error) {
      console.error("Weather loading error: ", error);
      showError("Failed to get weather for your location.");
      statusElement.textContent = "";
      hideLoading();
    }
  });

  placesList.appendChild(listItem);

  // Limit history to last 10 locations
  if (locationHistory.length > 5) {
    locationHistory.shift();
    placesList.removeChild(placesList.firstChild);
  }
}
function getDates() {
  //User chooses dates on a calendar they would like weather(lenght subject to API)
}

function fahrenheitToCelsius(fahrenheit) {
  const celsius = Math.floor(((fahrenheit - 32) * 5) / 9);
  return celsius;
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
  descIcon.classList = "active";
  descIcon.src = iconUrl;
  descIcon.style.display = "block";
}

async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "YourWeatherApp/1.0",
      },
    });
    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.status}`);
    }

    const data = await response.json();

    const address = data.address;
    let cityName = "";

    if (address) {
      const city =
        address.city || address.town || address.village || address.hamlet;
      const state = address.state || address.province;
      const country = address.country;

      if (city && state) {
        cityName = `${city}, ${state}`;
      } else if (city && country) {
        cityName = `${city}, ${country}`;
      } else {
        (cityName = data.display_name.split(",")).slice(0, 2).join(", ");
      }
    }
    console.log(cityName);
    return cityName || "Unknown Location";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Location Not Found";
  }
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
        statusElement.textContent = "Finding your city...";
        const cityName = await reverseGeocode(lat, lon);
        if (locationTitle) {
          locationTitle.textContent = cityName;
        }
        console.log(locationTitle);

        //await loadWeatherByCoordinates(lat, lon);

        statusElement.textContent = "";
        hideLoading();

        setTimeout(() => {
          statusElement.textContent = "";
        }, 3000);

        const weatherData = await getWeather(cityName);
        const conditions = `${weatherData.currentConditions.icon} weather`;
        const gifUrl = await loadGIF(conditions);
        const forecastDays = await get7DayForecast(cityName);

        displayWeatherIcon(weatherData);
        displayGIF(gifUrl);
        addToLocationList(cityName);
        display7DayForecast(forecastDays);

        // After your existing weatherData fetch, add this:
        const todaysData = weatherData.days[0]; // Get just the first day

        // Then use it for your temperature elements:
        const highFahrenheit = parseInt(todaysData.tempmax);
        const lowFahrenheit = parseInt(todaysData.tempmin);

        /*
        const feelTemp = document.getElementById("feel");
        const highTemp = document.getElementById("high");
        const lowTemp = document.getElementById("low");
        const currentTemp = document.getElementById("current");
    
        feelTemp.textContent = `${Math.floor(fahrenheitToCelsius(weatherData.days.feelslike))}`;
        highTemp.textContent = `${Math.floor(fahrenheitToCelsius(weatherData.days.tempmax))}`;
        lowTemp.textContent = `${Math.floor(fahrenheitToCelsius(weatherData.days.tempmin))}`;
        currentTemp.textContent = `${Math.floor(fahrenheitToCelsius(weatherData.days.temp))}`;
        */
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

/*async function loadWeatherByCoordinates(lat, lon) {
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
  */

function autoDetectLocation() {
  const autoDetect = confirm(
    "Would you like to the weather for your current location",
  );
  if (autoDetect) {
    getCurrentLocation();
  } else {
  }
}

locationBtn.addEventListener("click", () => {
  autoDetectLocation();
});

// get next 7 day forecast not including today
async function get7DayForecast(location) {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // start from tomorrow

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // get next 7 days

    const startDateStr = tomorrow.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    console.log("Forecast date range:", startDateStr, "to", endDateStr); // Debug log

    const url = `${weather_BASE_URL}${location}/${startDateStr}/${endDateStr}?key=${weather_API_KEY}`;
    console.log("Forecast URL:", url); // Debug log

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Network error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    return data.days.slice(0, 7);
  } catch (error) {
    console.error("Error getting 7-day forecast:", error);
    throw error;
  }
}

function getDayName(dateString) {
  const date = new Date(dateString);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

function display7DayForecast(forecastDays) {
  console.log("Displaying forecast for days:", forecastDays);
  const forecastContainer = document.getElementById("sevenDayForecast");

  if (!forecastContainer) {
    console.error("7-day forecast container not found");
    return;
  }
  forecastContainer.innerHTML = "";

  forecastDays.forEach((day, index) => {
    const dayElement = document.createElement("div");
    dayElement.classList.add("forecast-day");

    const dayName = getDayName(day.datetime);
    const highTemp = Math.floor(day.tempmax);
    const lowTemp = Math.floor(day.tempmin);
    const icon = day.icon;
    const condition = day.conditions;

    console.log(`${dayName}: ${highTemp}°/${lowTemp}°, ${condition}`); // Debug log

    dayElement.innerHTML = `
      <div class="forecast-item">
        <div class="day-icon">
          <img src="${getWeatherIcon(icon)}" alt="${condition}" class="forecast-icon">
        </div>
        <div class="day-name">${dayName}</div>
        <div class="day-temps">
          <span class="high-temp"> H: ${fahrenheitToCelsius(highTemp)}°</span>
          <span class="low-temp"> L: ${fahrenheitToCelsius(lowTemp)}°</span>
        </div>
      </div>
    `;

    forecastContainer.appendChild(dayElement);
  });
}

function getNext7DayNames() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const next7Days = [];

  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    next7Days.push(days[date.getDay()]);
  }
  return next7Days;
}

autoDetectLocation();
