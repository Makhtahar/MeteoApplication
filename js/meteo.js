document.addEventListener('DOMContentLoaded', async () => {
  // On lit la configuration depuis conf.json
  const conf = await fetch("conf.json").then(res => res.json());

  const city = conf.defaults.city;
  const key = conf.api.weather.key;
  const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&lang=fr`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    // On met à jour l’interface
    document.getElementById("city-name").textContent = `Météo & Transports - ${data.location.name}`;
    document.getElementById("current-temp").textContent = `${Math.round(data.current.temp_c)}°C`;
    document.getElementById("weather-desc").textContent = data.current.condition.text;
    document.getElementById("wind-speed").textContent = `${data.current.wind_kph} km/h`;
    document.getElementById("humidity").textContent = `${data.current.humidity}%`;
    document.getElementById("feels-like").textContent = `Ressenti: ${Math.round(data.current.feelslike_c)}°C`;
    document.getElementById("uv-index").textContent = `UV: ${data.current.uv}`;
    document.getElementById("last-update").textContent = `Dernière mise à jour: ${new Date().toLocaleTimeString('fr-FR')}`;

    // On affiche une icône simple
    document.getElementById("current-weather-icon").innerHTML = `<i class="fas fa-sun text-yellow-400"></i>`;
  } catch (error) {
    console.error("Erreur lors de la récupération des données météo :", error);
  }
});
