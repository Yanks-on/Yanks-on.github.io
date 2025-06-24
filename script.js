const API_KEY = '11bbb6ce48a41c696c72557cc6dbd26f'; // Clé OpenWeatherMap
const ville = 'Henin-Beaumont,FR';
const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&units=metric&lang=fr&appid=${API_KEY}`;

// Génère une carte météo
function createMeteoCard(data) {
  const card = document.createElement('section');
  card.className = 'card';

  card.innerHTML = `
    <h2><strong>Météo actuelle</strong> ${ville.split(',')[0]}</h2>
    <p><strong>Ville :</strong> ${ville.split(',')[0]}</p>
    <p><strong>Température :</strong> ${data.main.temp} °C</p>
    <p><strong>Ressenti :</strong> ${data.main.feels_like} °C</p>
    <p><strong>Conditions :</strong> ${data.weather[0].description}</p>
    <p><strong>Vent :</strong> ${data.wind.speed} m/s</p>
  `;
  return card;
}

// En cas d'erreur
function createMeteoError() {
  const card = document.createElement('section');
  card.className = 'card';
  card.innerHTML = `
    <h2>Météo</h2>
    <p>❌ Erreur : impossible de récupérer la météo.</p>
  `;
  return card;
}

// Initialisation
window.onload = () => {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const meteoCard = createMeteoCard(data);
      document.getElementById('dashboard').appendChild(meteoCard);
    })
    .catch(() => {
      const errorCard = createMeteoError();
      document.getElementById('dashboard').appendChild(errorCard);
    });
};
