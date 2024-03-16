document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'f94e65847cf5b0e74d05c8291e548599';
    const locationInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');

    const locationElement = document.getElementById('location');
    const temperatureElement = document.getElementById('temperature');
    const descriptionElement = document.getElementById('description');
    const weatherIconElement = document.getElementById('weatherIcon');
    const sloganElement = document.getElementById('slogan'); // Weather Slogan element
    const forecastElement = document.getElementById('forecast');

    const fetchWeatherData = (city) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        // Fetch current weather data
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const location = data.name;
                const temperature = data.main.temp;
                const description = data.weather[0].description;
                const weatherIcon = data.weather[0].icon; // Icon code received from the API

                locationElement.textContent = `Location: ${location}`;
                temperatureElement.textContent = `Temperature: ${temperature}°C`;
                descriptionElement.textContent = `Description: ${description}`;

                // Set weather icon dynamically
                weatherIconElement.src = `http://openweathermap.org/img/wn/${weatherIcon}.png`; // Update image source
                weatherIconElement.alt = description; // Optional: Set alt text for accessibility

                // Set foreground based on weather description
                setWeatherForeground(description);

                // Set weather slogan based on weather description and temperature
                setWeatherSlogan(description, temperature);
            })
            .catch(error => {
                console.error('Error fetching current weather data:', error);
                locationElement.textContent = 'Failed to fetch weather data';
                temperatureElement.textContent = '';
                descriptionElement.textContent = '';
                sloganElement.textContent = ''; // Clear slogan if error occurs
            });

        // Fetch weather forecast data
        fetch(forecastApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero for accurate comparison

                // Filter forecast data for unique days
                const uniqueDaysForecast = [];
                data.list.forEach(forecastData => {
                    // Get the date of the forecast data
                    const forecastDate = new Date(forecastData.dt * 1000);
                    forecastDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero for accurate comparison

                    // Check if the forecast date is after today and not already in uniqueDaysForecast
                    if (forecastDate > today && !uniqueDaysForecast.some(item => item.getTime() === forecastDate.getTime())) {
                        uniqueDaysForecast.push(forecastDate);
                    }
                });

                // Clear previous forecast data
                forecastElement.innerHTML = '';

                // Display forecast for unique days
                uniqueDaysForecast.forEach(forecastDate => {
                    const forecastItem = document.createElement('div');
                    forecastItem.classList.add('forecast-item');
                    forecastItem.innerHTML = `
                        <p>Date: ${forecastDate.toDateString()}</p>
                        <p>Temperature: ${getForecastTemperature(forecastDate, data.list)}°C</p>
                        <p>Description: ${getForecastDescription(forecastDate, data.list)}</p>
                    `;
                    forecastElement.appendChild(forecastItem);
                });
            })
            .catch(error => {
                console.error('Error fetching weather forecast data:', error);
                forecastElement.textContent = 'Failed to fetch forecast data';
            });
    };

    // Function to get forecast temperature for a specific day
    const getForecastTemperature = (date, forecastData) => {
        const forecast = forecastData.find(item => {
            const forecastDate = new Date(item.dt * 1000);
            forecastDate.setHours(0, 0, 0, 0);
            return forecastDate.getTime() === date.getTime();
        });
        return forecast ? forecast.main.temp : 'N/A';
    };

    // Function to get forecast description for a specific day
    const getForecastDescription = (date, forecastData) => {
        const forecast = forecastData.find(item => {
            const forecastDate = new Date(item.dt * 1000);
            forecastDate.setHours(0, 0, 0, 0);
            return forecastDate.getTime() === date.getTime();
        });
        return forecast ? forecast.weather[0].description : 'N/A';
    };

    // Function to set foreground based on weather description
    const setWeatherForeground = (description) => {
        const container = document.querySelector('.container');
        if (description.includes('clear')) {
            container.style.backgroundImage = "url('https://trailnavigator.s3.ap-southeast-2.amazonaws.com/walks/324/1713.jpg')";
        } else if (description.includes('rain')) {
            container.style.backgroundImage = "url('https://trailnavigator.s3.ap-southeast-2.amazonaws.com/walks/324/1713.jpg')";
        } else if (description.includes('cloud')) {
            container.style.backgroundImage = "url('https://images.unsplash.com/photo-1609072376030-3251761ace39?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNsb3VkeSUyMHNreXxlbnwwfHwwfHx8MA%3D%3D')";
        } else if (description.includes('thunderstorm')) {
            container.style.backgroundImage = "url('https://media.cnn.com/api/v1/images/stellar/prod/220820141904-lightning-strike-how-to-survive.jpg?c=original')";
        } else if (description.includes('snow')) {
            container.style.backgroundImage = "url('https://www.weathertoski.co.uk/s/cc_images/teaserbox_2488156535.jpg?t=1674035987')";
        } 
        
    };

    // Function to set weather slogan based on weather description and temperature
    const setWeatherSlogan = (description, temperature) => {
        let slogan = '';

        // Weather-specific slogans
        const weatherSlogans = {
            'clear': "It's a beautiful day!",
            'rain': "Don't forget your umbrella!",
            'cloud': "It's a bit cloudy today.",
            'thunderstorm': "Stay indoors, it's stormy outside!",
            'snow': "Ice and snow, Take it slow !",

        };

        // Temperature-specific slogans
        if (temperature <= 0) {
            slogan = "Bundle up, it's freezing cold !";
        } else if (temperature > 0 && temperature < 10) {
            slogan = "Chilly weather ahead !";
        } else if (temperature >= 10 && temperature < 20) {
            slogan = "Cool weather, perfect for a stroll.";
        } else if (temperature >= 20 && temperature < 30) {
            slogan = "Warm and pleasant day !";
        } else {
            slogan = "Hot day ahead, stay hydrated !";
        }

        // If weather-specific slogan is available, use it, otherwise use temperature-specific slogan
        if (weatherSlogans[description.toLowerCase()]) {
            slogan = weatherSlogans[description.toLowerCase()];
        }

        sloganElement.textContent = ` ${slogan}`;
    };

    searchBtn.addEventListener('click', () => {
        const city = locationInput.value.trim();
        if (city !== '') {
            fetchWeatherData(city);
            locationInput.value = ''; // Clear input after search
        }
    });

});
