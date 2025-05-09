import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  const [city, setCity] = useState("Ahmedabad");
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("selected city",city)
  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${"47fb5b12cfd83085b9bc6fd3f0f6f7fb"}&units=${unit}`
      );
      setWeather(res.data);
      console.log(res)
    } catch (err) {
      setError("City not found or unable to fetch weather data.");
    }
    setLoading(false);
  };

  const handleUnitToggle = (val) => {
    setUnit(val);
    if (city) fetchWeather();
  };

  const getWeatherClass = () => {
    if (!weather) return "weather-default";

    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes("clear")) return "weather-clear";
    if (condition.includes("cloud")) return "weather-clouds";
    if (condition.includes("rain") || condition.includes("drizzle"))
      return "weather-rain";
    if (condition.includes("snow")) return "weather-snow";
    if (condition.includes("thunderstorm")) return "weather-thunder";
    return "weather-default";
  };

  const unitSymbol = unit === "metric" ? "°C" : "°F";

  return (
    <div className={`weather-container ${getWeatherClass()}`}>
      <Container className="py-4">
        <h1 className="text-center mb-4 text-white">Current Weather</h1>

        {/* City Input + Get Weather */}
        <Row className="justify-content-center mb-3">
          <Col xs={12} md={5} lg={4}>
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Col>
          <Col xs={12} md={3} lg={2} className="mt-2 mt-md-0">
            <Button variant="light" onClick={fetchWeather} className="w-100">
              Get Weather
            </Button>
          </Col>
        </Row>

        {/* Toggle for Celsius/Fahrenheit */}
        <Row className="justify-content-center mb-4">
          <Col xs="auto">
            <ToggleButtonGroup
              type="radio"
              name="units"
              value={unit}
              onChange={handleUnitToggle}
            >
              <ToggleButton id="celsius" variant="outline-light" value="metric">
                Celsius (°C)
              </ToggleButton>
              <ToggleButton
                id="fahrenheit"
                variant="outline-light"
                value="imperial"
              >
                Fahrenheit (°F)
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>

        {/* Spinner */}
        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="light" />
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Row className="justify-content-center">
            <Col xs={12} md={6}>
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Weather Info */}
        {weather && (
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card className="shadow-sm text-center p-3">
                <Card.Body>
                  <Card.Title as="h3">{weather.name}</Card.Title>
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                    alt={weather.weather[0].description}
                  />
                  <Card.Text>
                    <strong>Condition:</strong> {weather.weather[0].description}
                  </Card.Text>
                  <Card.Text>
                    🌡 <strong>Temperature:</strong> {weather.main.temp}
                    {unitSymbol}
                  </Card.Text>
                  <Card.Text>
                    💧 <strong>Humidity:</strong> {weather.main.humidity}%
                  </Card.Text>
                  <Card.Text>
                    🌬 <strong>Wind Speed:</strong> {weather.wind.speed} m/s
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default App;

