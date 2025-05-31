javascript
// config.js - Configuration file (should be separate in production)
const config = {
    city: "Lyon",
    transportNetwork: "TCL",
    updateInterval: 300000, // 5 minutes in milliseconds (for demo purposes)
    weatherApiKey: "YOUR_WEATHER_API_KEY", // Replace with actual API key
    transportApiKey: "YOUR_TRANSPORT_API_KEY" // Replace with actual API key
};

// app.js - Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        cityName: document.getElementById('city-name'),
        currentTemp: document.getElementById('current-temp'),
        weatherIcon: document.getElementById('current-weather-icon'),
        weatherDesc: document.getElementById('weather-desc'),
        windSpeed: document.getElementById('wind-speed'),
        humidity: document.getElementById('humidity'),
        currentDate: document.getElementById('current-date'),
        lastUpdate: document.getElementById('last-update'),
        nextUpdate: document.getElementById('next-update'),
        transportUpdateTime: document.getElementById('transport-update-time'),
        hourlyForecast: document.getElementById('hourly-forecast'),
        dailyForecast: document.getElementById('daily-forecast'),
        transportStatus: document.getElementById('transport-status'),
        transportAlerts: document.getElementById('transport-alerts'),
        feelsLike: document.getElementById('feels-like'),
        uvIndex: document.getElementById('uv-index'),
        comfortIcon: document.getElementById('comfort-icon'),
        cityFooter: document.getElementById('city-footer'),
        loading: document.getElementById('loading')
    };

    // Weather icons mapping
    const weatherIcons = {
        '01d': 'sun',           // clear sky (day)
        '01n': 'moon',          // clear sky (night)
        '02d': 'cloud-sun',     // few clouds (day)
        '02n': 'cloud-moon',    // few clouds (night)
        '03d': 'cloud',         // scattered clouds
        '03n': 'cloud',
        '04d': 'cloud',         // broken clouds
        '04n': 'cloud',
        '09d': 'cloud-rain',    // shower rain
        '09n': 'cloud-rain',
        '10d': 'cloud-sun-rain',// rain (day)
        '10n': 'cloud-moon-rain',// rain (night)
        '11d': 'bolt',          // thunderstorm
        '11n': 'bolt',
        '13d': 'snowflake',     // snow
        '13n': 'snowflake',
        '50d': 'smog',          // mist/fog
        '50n': 'smog'
    };

    // UV index levels
    const uvIndexLevels = [
        { max: 2, level: "Faible", color: "green" },
        { max: 5, level: "Modéré", color: "yellow" },
        { max: 7, level: "Élevé", color: "orange" },
        { max: 10, level: "Très élevé", color: "red" },
        { max: Infinity, level: "Extrême", color: "purple" }
    ];

    // Transport line colors
    const lineColors = {
        'metro': {
            'A': 'bg-red-600',
            'B': 'bg-blue-600',
            'C': 'bg-orange-500',
            'D': 'bg-green-600'
        },
        'tram': {
            'T1': 'bg-blue-400',
            'T2': 'bg-red-400',
            'T3': 'bg-green-400',
            'T4': 'bg-yellow-400',
            'T5': 'bg-purple-400'
        },
        'bus': 'bg-gray-600'
    };

    // Initialize the app
    async function initApp() {
        showLoading(true);
        
        try {
            // Set current date
            updateCurrentDate();
            
            // Update city name in footer
            elements.cityFooter.textContent = config.city;
            elements.cityName.textContent = `Météo & Transports - ${config.city}`;
            
            // Fetch weather data
            const weatherData = await fetchWeatherData(config.city);
            updateWeatherUI(weatherData);
            
            // Fetch transport data
            const transportData = await fetchTransportData();
            updateTransportUI(transportData);
            
            // Set up automatic refresh
            setInterval(async () => {
                console.log("Automatic data refresh...");
                const newWeatherData = await fetchWeatherData(config.city);
                updateWeatherUI(newWeatherData);
                
                const newTransportData = await fetchTransportData();
                updateTransportUI(newTransportData);
            }, config.updateInterval);
            
            // Update next update countdown
            updateNextUpdateCountdown();
            
        } catch (error) {
            console.error("Error loading data:", error);
            showError("An error occurred while loading data. Please try again.");
        } finally {
            showLoading(false);
        }
    }

    // Simulate weather API fetch
    async function fetchWeatherData(city) {
        // In a real app, this would be an actual API call:
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${config.weatherApiKey}`);
        // const data = await response.json();
        
        // Simulated response with more realistic data
        return new Promise(resolve => {
            setTimeout(() => {
                const now = new Date();
                const hours = now.getHours();
                const isDayTime = hours > 6 && hours < 20;
                
                // Generate random weather conditions based on time of day and season
                let weatherCondition, iconCode;
                const rand = Math.random();
                const month = now.getMonth();
                
                // Summer months (June-August) have higher chance of sun
                if (month >= 5 && month <= 7) {
                    if (rand < 0.7) {
                        weatherCondition = isDayTime ? "Ensoleillé" : "Dégagé";
                        iconCode = isDayTime ? "01d" : "01n";
                    } else if (rand < 0.9) {
                        weatherCondition = isDayTime ? "Partiellement nuageux" : "Nuageux";
                        iconCode = isDayTime ? "02d" : "02n";
                    } else {
                        weatherCondition = "Orageux";
                        iconCode = "11d";
                    }
                } 
                // Winter months (December-February) have higher chance of clouds/snow
                else if (month === 11 || month <= 1) {
                    if (rand < 0.3) {
                        weatherCondition = "Ensoleillé";
                        iconCode = "01d";
                    } else if (rand < 0.7) {
                        weatherCondition = "Nuageux";
                        iconCode = "03d";
                    } else if (rand < 0.9) {
                        weatherCondition = "Neige";
                        iconCode = "13d";
                    } else {
                        weatherCondition = "Brouillard";
                        iconCode = "50d";
                    }
                }
                // Spring/Autumn have mixed conditions
                else {
                    if (rand < 0.5) {
                        weatherCondition = isDayTime ? "Partiellement nuageux" : "Nuageux";
                        iconCode = isDayTime ? "02d" : "02n";
                    } else if (rand < 0.8) {
                        weatherCondition = "Pluie modérée";
                        iconCode = "10d";
                    } else {
                        weatherCondition = "Couvert";
                        iconCode = "04d";
                    }
                }

                // Generate temperature based on season and time
                let baseTemp;
                if (month >= 5 && month <= 7) { // Summer
                    baseTemp = 22 + (hours - 12) * 0.5;
                } else if (month >= 11 || month <= 1) { // Winter
                    baseTemp = 5 + (hours - 12) * 0.3;
                } else { // Spring/Autumn
                    baseTemp = 15 + (hours - 12) * 0.4;
                }
                
                // Add some randomness
                const temp = Math.round(baseTemp + (Math.random() * 6 - 3));
                const feelsLike = Math.round(temp + (Math.random() * 4 - 2));
                
                // Generate other weather metrics
                const windSpeed = Math.round(5 + Math.random() * 20);
                const humidity = Math.round(50 + Math.random() * 50);
                const uvIndex = Math.round(Math.random() * 11);
                
                // Generate hourly forecast (next 12 hours)
                const hourlyForecast = [];
                for (let i = 0; i < 12; i++) {
                    const forecastHour = new Date(now.getTime() + i * 3600000);
                    const hourTemp = Math.round(baseTemp + (Math.random() * 4 - 2) + (i - 6) * 0.5);
                    
                    hourlyForecast.push({
                        time: forecastHour.getHours() + "h",
                        temp: hourTemp,
                        icon: i % 3 === 0 ? "10d" : (i % 2 === 0 ? "02d" : "01d")
                    });
                }
                
                // Generate daily forecast (next 5 days)
                const dailyForecast = [];
                const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
                for (let i = 0; i < 5; i++) {
                    const forecastDate = new Date(now.getTime() + i * 86400000);
                    const dayTemp = Math.round(baseTemp + (Math.random() * 8 - 4) + i * 0.5);
                    const nightTemp = Math.round(dayTemp - 5 - Math.random() * 5);
                    
                    dailyForecast.push({
                        day: days[forecastDate.getDay()],
                        date: forecastDate.getDate() + "/" + (forecastDate.getMonth() + 1),
                        icon: i % 4 === 0 ? "10d" : (i % 3 === 0 ? "02d" : "01d"),
                        max: dayTemp,
                        min: nightTemp
                    });
                }
                
                resolve({
                    city: city,
                    temp: temp,
                    feels_like: feelsLike,
                    condition: weatherCondition,
                    icon: iconCode,
                    wind: windSpeed,
                    humidity: humidity,
                    uv: uvIndex,
                    hourly: hourlyForecast,
                    daily: dailyForecast,
                    timestamp: now.toISOString()
                });
            }, 800); // Simulate network delay
        });
    }

    // Simulate transport API fetch
    async function fetchTransportData() {
        // In a real app, this would be an actual API call
        return new Promise(resolve => {
            setTimeout(() => {
                const now = new Date();
                const lines = [];
                
                // Metro lines
                lines.push({
                    type: "metro",
                    line: "A",
                    status: "normal",
                    message: "Trafic normal"
                });
                
                lines.push({
                    type: "metro",
                    line: "B",
                    status: Math.random() > 0.8 ? "disruption" : "normal",
                    message: Math.random() > 0.8 ? "Retards de 5 à 10 min" : "Trafic normal"
                });
                
                lines.push({
                    type: "metro",
                    line: "C",
                    status: "normal",
                    message: "Trafic normal"
                });
                
                lines.push({
                    type: "metro",
                    line: "D",
                    status: Math.random() > 0.9 ? "disruption" : "normal",
                    message: Math.random() > 0.9 ? "Perturbations signalées" : "Trafic normal"
                });
                
                // Tram lines
                for (let i = 1; i <= 5; i++) {
                    lines.push({
                        type: "tram",
                        line: `T${i}`,
                        status: Math.random() > 0.85 ? "disruption" : "normal",
                        message: Math.random() > 0.85 ? 
                            (i === 2 ? "Travaux jusqu'au 15/11" : "Retards possibles") : 
                            "Trafic normal"
                    });
                }
                
                // Bus lines (sample)
                const busLines = ["C1", "C3", "C6", "12", "27", "38", "47"];
                busLines.forEach(bus => {
                    lines.push({
                        type: "bus",
                        line: bus,
                        status: Math.random() > 0.9 ? "disruption" : "normal",
                        message: Math.random() > 0.9 ? "Déviation en cours" : "Trafic normal"
                    });
                });
                
                // Generate alerts (1-3 random alerts)
                const alerts = [];
                const alertTypes = [
                    "Grève partielle demain de 6h à 10h",
                    "Travaux sur la ligne B ce week-end",
                    "Station République fermée pour travaux",
                    "Renforcement des fréquences en heure de pointe",
                    "Nouvelle ligne de bus à partir du 1er décembre"
                ];
                
                const numAlerts = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < numAlerts; i++) {
                    const randomIndex = Math.floor(Math.random() * alertTypes.length);
                    alerts.push({
                        type: i === 0 ? "alert" : "info",
                        message: alertTypes[randomIndex]
                    });
                }
                
                resolve({
                    network: config.transportNetwork,
                    lines: lines,
                    alerts: alerts,
                    timestamp: now.toISOString()
                });
            }, 1000); // Simulate network delay
        });
    }

    // Update weather UI with data
    function updateWeatherUI(data) {
        // Current weather
        elements.currentTemp.textContent = `${data.temp}°C`;
        elements.weatherDesc.textContent = data.condition;
        elements.windSpeed.textContent = `${data.wind} km/h`;
        elements.humidity.textContent = `${data.humidity}%`;
        elements.feelsLike.textContent = `Ressenti: ${data.feels_like}°C`;
        
        // Weather icon
        elements.weatherIcon.innerHTML = `<i class="fas fa-${weatherIcons[data.icon]}"></i>`;
        
        // UV index
        const uvLevel = uvIndexLevels.find(level => data.uv <= level.max);
        elements.uvIndex.textContent = `UV: ${data.uv} (${uvLevel.level})`;
        elements.uvIndex.className = `text-sm text-${uvLevel.color}-600`;
        
        // Comfort icon
        let comfortIcon;
        if (data.temp > 30) {
            comfortIcon = "temperature-high";
        } else if (data.temp < 5) {
            comfortIcon = "temperature-low";
        } else if (data.humidity > 80) {
            comfortIcon = "water";
        } else {
            comfortIcon = "thermometer-half";
        }
        elements.comfortIcon.innerHTML = `<i class="fas fa-${comfortIcon}"></i>`;
        
        // Hourly forecast
        elements.hourlyForecast.innerHTML = data.hourly.slice(0, 8).map(hour => `
            <div class="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
                <span class="text-sm font-medium">${hour.time}</span>
                <i class="fas fa-${weatherIcons[hour.icon]} text-xl my-1 text-blue-600"></i>
                <span class="text-sm font-semibold">${hour.temp}°</span>
            </div>
        `).join('');
        
        // Daily forecast
        elements.dailyForecast.innerHTML = data.daily.map(day => `
            <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div class="flex items-center">
                    <span class="font-medium w-12">${day.day} ${day.date}</span>
                    <i class="fas fa-${weatherIcons[day.icon]} text-xl mx-3 text-blue-500"></i>
                </div>
                <div class="flex items-center">
                    <span class="font-semibold text-gray-800 mr-3">${day.max}°</span>
                    <span class="text-gray-500">${day.min}°</span>
                </div>
            </div>
        `).join('');
        
        // Update timestamp
        const updateTime = new Date(data.timestamp);
        elements.lastUpdate.textContent = `Dernière mise à jour: ${formatTime(updateTime)}`;
    }

    // Update transport UI with data
    function updateTransportUI(data) {
        // Transport lines status
        elements.transportStatus.innerHTML = data.lines.slice(0, 8).map(line => {
            const bgColor = line.type === 'bus' ? 
                lineColors.bus : 
                lineColors[line.type][line.line];
            
            const statusColor = line.status === 'normal' ? 'text-green-600' : 'text-red-600';
            const statusIcon = line.status === 'normal' ? 'check-circle' : 'exclamation-circle';
            
            return `
                <div class="transport-card bg-white rounded-xl shadow p-4 border-l-4 ${line.status === 'normal' ? 'border-green-500' : 'border-red-500'}">
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-white font-bold mr-3">
                            ${line.line}
                        </div>
                        <div class="flex-1">
                            <h3 class="font-medium">Ligne ${line.line}</h3>
                            <p class="text-sm ${line.status === 'normal' ? 'text-gray-600' : 'text-red-600'}">${line.message}</p>
                        </div>
                        <i class="fas fa-${statusIcon} ${statusColor}"></i>
                    </div>
                </div>
            `;
        }).join('');
        
        // Transport alerts
        elements.transportAlerts.innerHTML = data.alerts.map(alert => {
            const alertClass = alert.type === 'alert' ? 
                'bg-yellow-50 border-yellow-500 text-yellow-700' : 
                'bg-blue-50 border-blue-500 text-blue-700';
            const alertIcon = alert.type === 'alert' ? 
                'exclamation-triangle' : 'info-circle';
            
            return `
                <div class="border-l-4 p-3 rounded-r ${alertClass}">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <i class="fas fa-${alertIcon}"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm">${alert.message}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // If no alerts, show a message
        if (data.alerts.length === 0) {
            elements.transportAlerts.innerHTML = `
                <div class="bg-green-50 border-l-4 border-green-500 p-3 rounded-r text-green-700">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm">Aucune alerte en cours sur le réseau</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Update timestamp
        const updateTime = new Date(data.timestamp);
        elements.transportUpdateTime.textContent = formatTime(updateTime);
    }

    // Helper function to format time
    function formatTime(date) {
        return date.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
    }

    // Update current date display
    function updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long',
            year: 'numeric'
        };
        elements.currentDate.textContent = now.toLocaleDateString('fr-FR', options);
    }

    // Update next update countdown
    function updateNextUpdateCountdown() {
        const updateInMinutes = config.updateInterval / 60000;
        elements.nextUpdate.textContent = `${updateInMinutes} min`;
    }

    // Show loading indicator
    function showLoading(show) {
        elements.loading.style.display = show ? 'flex' : 'none';
    }

    // Show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
                document.body.appendChild(errorDiv);
            }
        
        });
        
       