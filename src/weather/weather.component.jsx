import { useState } from "react";
import "./weather.css";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [condition, setCondition] = useState("default"); // holds CSS class

  // Function to map weather codes → CSS class
  function getCondition(code) {
    if (code === 0) return "sunny";
    if ([1, 2, 3].includes(code)) return "cloudy";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "rainy";
    if ([71, 73, 75, 77].includes(code)) return "snowy";
    if ([95, 96, 99].includes(code)) return "stormy";
    return "default";
  }

  async function getWeather() {
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&country=IN`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        alert("City not found!");
        return;
      }

      const { latitude, longitude } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather(weatherData.current_weather);

      // set background class
      const condClass = getCondition(weatherData.current_weather.weathercode);
      setCondition(condClass);
    } catch (err) {
      console.error(err);
      alert("Error fetching weather data");
    }
  }

  return (
    <div className={`weather-container ${condition}`}>
      <h1>🌤 Weather Now</h1>

      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="weather-input"
      />
      <button onClick={getWeather} className="weather-btn">
        Get Weather
      </button>

      {weather && (
        <div className="weather-result">
          <h2>Temperature: {weather.temperature}°C</h2>
          <p>Wind Speed: {weather.windspeed} km/h</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
