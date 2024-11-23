import React, { useState, ChangeEvent, FormEvent } from 'react';
import './Weather.css';
import rain from './assets/images/rain.png';
import clear from './assets/images/clear.png';
import clouds from './assets/images/clouds.png';
import drizzle from './assets/images/drizzle.png';
import humidity from './assets/images/humidity.png';
import mist from './assets/images/mist.png';
import wind from './assets/images/wind.png';

const apiKey = 'a1fc8a98fc2cd3ed4a3a8f8b1a36d542';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
  }[];
  wind: {
    speed: number;
  };
}

const weatherIcons: Record<string, string> = {
  Thunderstorm: rain,
  Drizzle: drizzle,
  Rain: rain,
  Snow: 'assets/images/snow.png',
  Mist: mist,
  Clear: clear,
  Clouds: clouds,
};

function WeatherApp() {
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (e: FormEvent) => {
    e.preventDefault();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Could not fetch weather data');
      }
      const data: WeatherData = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  };

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const displayError = () => error && <div className="error-message">{error}</div>;

  const displayWeather = () =>
    weatherData && (
      <div className="weather-card">
        <div className="weather-main">
          <div className="weather-overview">
            <div className="weather-icon">
              <img
                src={weatherIcons[weatherData.weather[0].main] || 'assets/images/default.png'}
                alt="Weather icon"
              />
            </div>
            <div className="temperature">{(weatherData.main.temp - 273.15).toFixed(1)}°C</div>
            <div className="city-name">{weatherData.name}</div>
          </div>
        </div>
        <div className="weather-details">
          <div className="weather-humidity">
            <img src={humidity} alt="Humidity icon" />
            
            <div className="humidity-value">
              <br />
              {weatherData.main.humidity}%
            </div>
            Humidity
          </div>
          <div className="weather-wind">
            <img src={wind} alt="Wind icon" />
            <div className="wind-speed">
              <br />
              {weatherData.wind.speed} km/h <br />
            </div>
            Wind Speed
          </div>
        </div>
      </div>
    );

  return (
    <div className="weather-app">
      <div className="search-container">
        <input
          type="search"
          placeholder="Enter city name"
          spellCheck="false"
          className="city-input"
          value={city}
          onChange={handleCityChange}
        />
        <button type="submit" className="search-button" onClick={fetchWeatherData}>
          Search
        </button>
        {displayError()}
      </div>
      <br />
      <br />
      {displayWeather()}
    </div>
  );
}

export default WeatherApp;
