    
        const dateElement = document.getElementById('date');
        const cityElement = document.getElementById('city');
        const countryElement = document.getElementById('country');
        const tempElement = document.getElementById('temp');
        const tempImgElement = document.getElementById('tempImg');
        const descriptionElement = document.getElementById('description');
        const tempMaxElement = document.getElementById('tempMax');
        const tempMinElement = document.getElementById('tempMin');
        const feelsLikeElement = document.getElementById('feelsLike');
        const windSpeedElement = document.getElementById('windSpeed');
        const humidityElement = document.getElementById('humidity');
        const hourlyContainer = document.getElementById('hourlyContainer');
        const errorMessage = document.getElementById('errorMessage');
        const loadingIndicator = document.getElementById('loadingIndicator');

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const days = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
            'Thursday', 'Friday', 'Saturday'
        ];

        function updateDate() {
            const dateObj = new Date();
            const dayName = days[dateObj.getDay()];
            const month = months[dateObj.getMonth()];
            const day = dateObj.getDate();
            const year = dateObj.getFullYear();
            
            dateElement.innerHTML = `${dayName}, ${month} ${day}, ${year}`;
        }

        updateDate();

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                getWeather();
            }
        }

        const getWeather = async () => {
            const apiKey = "82c8b287d4cb4fc951a1e0878bcbc828";
            const cityName = document.getElementById('searchBarInput').value || "London";
            
            // Show loading indicator
            loadingIndicator.style.display = 'block';
            errorMessage.style.display = 'none';
            
            try {
                // Fetch current weather
                const weatherDataFetch = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
                );
                
                if (!weatherDataFetch.ok) {
                    throw new Error('City not found');
                }
                
                const weatherData = await weatherDataFetch.json();
                
                // Update UI with current weather data
                cityElement.innerHTML = weatherData.name;
                countryElement.innerHTML = weatherData.sys.country;
                descriptionElement.innerHTML = weatherData.weather[0].description;
                tempImgElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="${weatherData.weather[0].description}">`;
                tempElement.innerHTML = `${Math.round(weatherData.main.temp)}°C`;
                tempMaxElement.innerHTML = `${Math.round(weatherData.main.temp_max)}°C`;
                tempMinElement.innerHTML = `${Math.round(weatherData.main.temp_min)}°C`;
                feelsLikeElement.innerHTML = `Feels like ${Math.round(weatherData.main.feels_like)}°C`;
                windSpeedElement.innerHTML = `${weatherData.wind.speed} m/s`;
                humidityElement.innerHTML = `${weatherData.main.humidity}%`;
                
                // Fetch 5-day forecast for hourly data
                const forecastResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
                );
                
                if (!forecastResponse.ok) {
                    throw new Error('Forecast data not available');
                }
                
                const forecastData = await forecastResponse.json();
                
                // Display hourly forecast for the next 24 hours
                displayHourlyForecast(forecastData.list);
                
            } catch (error) {
                console.error(error);
                errorMessage.innerHTML = error.message || 'Failed to fetch weather data';
                errorMessage.style.display = 'block';
            } finally {
                loadingIndicator.style.display = 'none';
            }
        }

        function displayHourlyForecast(forecastList) {
            hourlyContainer.innerHTML = '';
            
            // Get next 8 periods (24 hours, as each period is 3 hours)
            const next24Hours = forecastList.slice(0, 8);
            
            next24Hours.forEach(period => {
                const date = new Date(period.dt * 1000);
                const hour = date.getHours();
                const temp = Math.round(period.main.temp);
                const icon = period.weather[0].icon;
                
                const hourItem = document.createElement('div');
                hourItem.className = 'hour-item';
                hourItem.innerHTML = `
                    <p>${hour}:00</p>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${period.weather[0].description}">
                    <p class="hour-temp">${temp}°C</p>
                `;
                
                hourlyContainer.appendChild(hourItem);
            });
        }

        // Load weather for default city on page load
        window.onload = getWeather;
