javascript
// DOM Elements
const cityNameElement = document.getElementById('city-name');
const currentTempElement = document.getElementById('current-temp');
const weatherIconElement = document.getElementById('weather-icon');
const weatherDescElement = document.getElementById('weather-desc');
const hourlyForecastContainer = document.getElementById('hourly-forecast');
const dailyForecastContainer = document.getElementById('daily-forecast');
const transportStatusContainer = document.getElementById('transport-status');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const loadingIndicator = document.getElementById('loading');

// Sample data - in a real app, you'd fetch this from APIs
const sampleWeatherData = {
  city: "New York",
  currentTemp: 72,
  condition: "Partly Cloudy",
  icon: "cloud-sun",
  hourly: [
    { time: "Now", temp: 72, icon: "cloud-sun" },
    { time: "1PM", temp: 74, icon: "sun" },
    { time: "2PM", temp: 75, icon: "sun" },
    { time: "3PM", temp: 76, icon: "sun" },
    { time: "4PM", temp: 75, icon: "cloud-sun" },
    { time: "5PM", temp: 73, icon: "cloud" }
  ],
  daily: [
    { day: "Mon", high: 76, low: 68, icon: "sun" },
    { day: "Tue", high: 80, low: 70, icon: "sun" },
    { day: "Wed", high: 82, low: 72, icon: "sun" },
    { day: "Thu", high: 78, low: 71, icon: "cloud-sun" },
    { day: "Fri", high: 75, low: 69, icon: "cloud-rain" }
  ]
};

const sampleTransportData = [
  { line: "Subway A", status: "on-time", delay: "0 min" },
  { line: "Subway B", status: "delayed", delay: "15 min" },
  { line: "Bus 42", status: "on-time", delay: "0 min" },
  { line: "Bus 125", status: "cancelled", delay: "N/A" }
];

// Initialize the app
function initApp() {
  showLoading(true);
  
  // Simulate API fetch with timeout
  setTimeout(() => {
    updateWeatherUI(sampleWeatherData);
    updateTransportUI(sampleTransportData);
    showLoading(false);
    
    // Add animation classes after load
    document.querySelectorAll('.weather-card, .transport-card').forEach((card, index) => {
      card.classList.add('animate-fade-in');
      card.style.animationDelay = `${index * 100}ms`;
    });
  }, 1500);
}

// Update weather UI with data
function updateWeatherUI(data) {
  cityNameElement.textContent = data.city;
  currentTempElement.textContent = data.currentTemp;
  weatherDescElement.textContent = data.condition;
  weatherIconElement.className = `fas fa-${data.icon} text-4xl`;
  
  // Update hourly forecast
  hourlyForecastContainer.innerHTML = data.hourly.map(item => `
    <div class="hourly-forecast-item text-center p-4">
      <p class="font-medium">${item.time}</p>
      <i class="fas fa-${item.icon} text-xl my-2"></i>
      <p class="font-bold">${item.temp}°</p>
    </div>
  `).join('');
  
  // Update daily forecast
  dailyForecastContainer.innerHTML = data.daily.map(item => `
    <div class="daily-item flex justify-between items-center p-3 border-b border-gray-100">
      <span class="font-medium">${item.day}</span>
      <div class="flex items-center">
        <i class="fas fa-${item.icon} mx-2"></i>
        <span class="font-bold">${item.high}°</span>
        <span class="text-gray-500 ml-1">${item.low}°</span>
      </div>
    </div>
  `).join('');
}

// Update transport UI with data
function updateTransportUI(data) {
  transportStatusContainer.innerHTML = data.map(item => {
    const statusClass = {
      'on-time': 'bg-green-500',
      'delayed': 'bg-yellow-500',
      'cancelled': 'bg-red-500'
    }[item.status];
    
    return `
      <div class="transport-card p-4 rounded-lg shadow mb-3">
        <div class="flex justify-between items-center">
          <h3 class="font-bold">${item.line}</h3>
          <span class="status-badge ${statusClass} text-white text-xs px-2 py-1 rounded-full">
            ${item.status.toUpperCase()}
          </span>
        </div>
        <p class="text-sm mt-1">Delay: ${item.delay}</p>
      </div>
    `;
  }).join('');
}

// Search functionality
function handleSearch() {
  const query = searchInput.value.trim();
  if (query) {
    showLoading(true);
    // In a real app, you would fetch new data based on the query
    setTimeout(() => {
      sampleWeatherData.city = query;
      updateWeatherUI(sampleWeatherData);
      showLoading(false);
    }, 1000);
  }
}

// Loading state
function showLoading(show) {
  if (show) {
    loadingIndicator.classList.remove('hidden');
    loadingIndicator.innerHTML = `
      <div class="loading-spinner h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p class="mt-2">Loading data...</p>
    `;
  } else {
    loadingIndicator.classList.add('hidden');
  }
}

// Event Listeners
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSearch();
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
