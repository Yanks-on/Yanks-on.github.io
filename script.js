// Clé OpenWeatherMap (remplace-la si besoin)
const API_KEY = '11bbb6ce48a41c696c72557cc6dbd26f';
const ville = 'Henin-Beaumont,FR';
const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&units=metric&lang=fr&appid=${API_KEY}`;

// Créer la carte météo
function createMeteoCard(data) {
  const card = document.createElement('section');
  card.className = 'card';
  card.id = 'meteo';

  card.innerHTML = `
    <h2>Météo</h2>
    <p><strong>Ville :</strong> ${ville.split(',')[0]}</p>
    <p><strong>Température :</strong> ${data.main.temp} °C</p>
    <p><strong>Conditions :</strong> ${data.weather[0].description}</p>
  `;
  return card;
}

// Affiche une erreur si la météo échoue
function createMeteoError() {
  const card = document.createElement('section');
  card.className = 'card';
  card.id = 'meteo';
  card.innerHTML = `
    <h2>Météo</h2>
    <p>❌ Impossible de récupérer la météo.</p>
  `;
  return card;
}

// Au chargement, récupère et affiche la météo
window.onload = () => {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const meteoCard = createMeteoCard(data);
      document.getElementById('dashboard').appendChild(meteoCard);
    })
    .catch(() => {
      const meteoErrorCard = createMeteoError();
      document.getElementById('dashboard').appendChild(meteoErrorCard);
    });
};
