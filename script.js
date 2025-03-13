async function getCoordinates(city) {
    try {
        let geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        let geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found! ❌");
        }

        let { latitude: lat, longitude: lon } = geoData.results[0];  // Extract latitude & longitude
        console.log(`📍 Coordinates for ${city}: ${lat}, ${lon}`);
        
        return { lat, lon };  // Pass data to the next function
    } catch (error) {
        document.getElementById("errorMessage").innerText = error.message;
        console.error("Error fetching coordinates:", error);
    }
}

async function getWeather(lat, lon) {
    try {
        let weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        let weatherData = await weatherResponse.json();

        if (!weatherData.current_weather) {
            throw new Error("Weather data not found! ❌");
        }

        // Display data in UI
        document.getElementById("temperature").innerText = `${weatherData.current_weather.temperature}°C`;
        document.getElementById("wind-speed").innerText = `${weatherData.current_weather.windspeed} km/h`;
        document.getElementById("errorMessage").innerText = ""; // Clear errors

    } catch (error) {
        document.getElementById("errorMessage").innerText = error.message;
        console.error("Error fetching weather:", error);
    }
}

async function fetchWeatherForCity(city) {
    let coordinates = await getCoordinates(city);
    if (coordinates) {
        document.getElementById("city-name").innerText = city; // Update city name
        await getWeather(coordinates.lat, coordinates.lon);  // Pass values to the next API call
    }
}

// Event Listener for Button Click
document.getElementById("getWeatherBtn").addEventListener("click", () => {
    let city = document.getElementById("cityInput").value.trim();
    if (city) {
        fetchWeatherForCity(city);
    } else {
        document.getElementById("errorMessage").innerText = "Please enter a city name!";
    }
});
