# Weather App

A modern, responsive weather application built with vanilla JavaScript that provides real-time weather data, 7-day forecasts, and dynamic theme changes based on current weather conditions.

![Weather App](https://img.shields.io/badge/status-active-success.svg)
![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow.svg)
![CSS3](https://img.shields.io/badge/css-3-blue.svg)

## Features

### Core Functionality
- **Real-time Weather Data**: Current temperature, feels-like temperature, humidity, and wind speed
- **7-Day Forecast**: Extended weather predictions with high/low temperatures
- **Location Services**:
  - Automatic geolocation detection
  - Manual location search by city name or coordinates
  - Default fallback to Toronto, Ontario
- **Search History**: Tracks last 5 searched locations for quick access
- **Temperature Unit Toggle**: Switch between Celsius and Fahrenheit
- **Dynamic Themes**: Background and color scheme change based on weather conditions

### Weather Conditions Supported
- Clear (day/night)
- Partly cloudy (day/night)
- Cloudy
- Rain & showers
- Snow & snow showers
- Thunderstorms
- Fog, wind, hail
- Extreme conditions (tornado, hurricane)

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**:
  - [Visual Crossing Weather API](https://www.visualcrossing.com/) - Weather data
  - [Giphy API](https://developers.giphy.com/) - Weather-related GIFs
  - [OpenStreetMap Nominatim API](https://nominatim.org/) - Reverse geocoding
- **Design**: Custom CSS with glassmorphism effects, CSS Grid, Flexbox
- **Font**: Google Fonts (Prata)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

2. Open `index.html` in your browser:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Or simply open the file
open index.html
```

3. **Important**: Update API keys (see Security section below)

## Usage

### Search for Weather
1. Enter a city name, address, or coordinates in the search bar
2. Click the search button or press Enter
3. View current weather, 7-day forecast, and weather-based theme

### Use Current Location
1. Click "Use My Location" button
2. Allow browser location access when prompted
3. If declined, app defaults to Toronto, Ontario weather

### Toggle Temperature Units
- Click the "°C / °F" button in the header to switch between Celsius and Fahrenheit
- Affects all temperatures and wind speed (km/h vs mph)

### View Search History
- Previously searched locations appear in the sidebar
- Click any location to quickly reload its weather data

## Project Structure

```
weather-app/
├── index.html              # Main HTML structure
├── styles.css              # All styling (glassmorphism, responsive design)
├── script.js               # Weather logic, API calls, UI updates
├── Magnifying_glass_icon.svg.png  # Search icon
└── README.md               # This file
```

## Key Features Explained

### Dynamic Theming
The app changes its color scheme based on weather conditions:
- **Clear Day**: Bright sky blue gradient
- **Clear Night**: Deep navy to dark blue
- **Rain**: Dark blue-green gradient
- **Snow**: Light gray to white gradient
- **Thunderstorms**: Dark with yellow accents
- And 15+ other weather-specific themes

### Temperature Conversion
- Default: Celsius (°C) with km/h for wind speed
- Toggle to: Fahrenheit (°F) with mph for wind speed
- Conversions apply to current temp, feels-like, highs/lows, and 7-day forecast

### Responsive Design
- Desktop: Two-column grid layout (sidebar + main content)
- Mobile: Single column stacked layout
- Adaptive font sizes and component spacing

## API Integration

### Visual Crossing Weather API
```javascript
// Example API call
const weather_BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
const url = `${weather_BASE_URL}${location}?key=${API_KEY}`;
```

Returns:
- Current conditions (temp, humidity, wind, icon)
- Daily forecasts with min/max temps
- Weather icons and descriptions

### Giphy API
```javascript
// Fetches weather-appropriate GIFs
const gif_BASE_URL = `https://api.giphy.com/v1/gifs/translate?api_key=${API_KEY}&s=`;
```

### OpenStreetMap Nominatim
```javascript
// Reverse geocoding for coordinates to city name
const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
```

## Security Considerations

### ⚠️ IMPORTANT: API Key Security

**Current Issue**: API keys are exposed in client-side JavaScript ([script.js:20-23](script.js#L20-L23))

**For Production**:
1. Move API keys to a backend server
2. Create a proxy endpoint that handles API calls
3. Use environment variables

**Quick Fix for Learning/Portfolio**:
```javascript
// Example backend proxy (Node.js/Express)
app.get('/api/weather/:location', async (req, res) => {
  const { location } = req.params;
  const response = await fetch(
    `https://weather.visualcrossing.com/.../timeline/${location}?key=${process.env.WEATHER_API_KEY}`
  );
  const data = await response.json();
  res.json(data);
});
```

**Rate Limiting**: Be aware of API rate limits:
- Visual Crossing: 1000 requests/day (free tier)
- Giphy: 42 requests/hour (free tier)

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (requires user interaction for geolocation)
- Mobile browsers: ✅ Fully responsive

## Future Enhancements

Potential features to add:
- [ ] Hourly forecast view
- [ ] Weather alerts and warnings
- [ ] Save favorite locations
- [ ] Weather maps/radar
- [ ] Air quality index
- [ ] UV index display
- [ ] Unit testing (Jest)
- [ ] Backend API proxy for security
- [ ] Progressive Web App (PWA) capabilities
- [ ] Dark mode toggle (independent of weather)

## Learning Outcomes

This project demonstrates:
- **API Integration**: Multiple third-party APIs working together
- **Async JavaScript**: Promises, async/await, error handling
- **DOM Manipulation**: Dynamic content updates
- **CSS Techniques**: Glassmorphism, gradients, transitions, responsive design
- **Geolocation API**: Browser location services
- **State Management**: Tracking weather data, user preferences
- **Error Handling**: API failures, network issues, user permission denials

## Known Issues

1. **API Keys Exposed**: Client-side keys visible in source code (see Security section)
2. **No Offline Support**: Requires internet connection for all features
3. **Limited Error Messages**: Some API errors could be more descriptive
4. **Browser Confirm Dialog**: Location permission uses native confirm (not modern UI)

## Contributing

Suggestions for improvement:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Credits

- **Developer**: Teaghan Johnson
- **Weather Data**: Visual Crossing Weather API
- **Icons**: Visual Crossing Weather Icons
- **GIFs**: Giphy API
- **Geocoding**: OpenStreetMap Nominatim
- **Font**: Google Fonts (Prata)

## License

This project is open source and available for educational purposes.

## Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Portfolio: [your-website.com](https://your-website.com)

---

**Note**: This is a portfolio project created for learning purposes. API keys should be secured before deploying to production.
