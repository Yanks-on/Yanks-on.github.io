const API_KEY = '11bbb6ce48a41c696c72557cc6dbd26f'; // Ta clé OpenWeatherMap
const ville = 'Henin-Beaumont,FR';

const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&units=metric&lang=fr&appid=${API_KEY}`;

function createMeteoCard(data) {
  const card = document.createElement('section');
  card.className = 'card';

  card.innerHTML = `
    <h2>Météo</h2>
    <p>Ville : ${ville.split(',')[0]}</p>
    <p>Température : ${data.main.temp} °C</p>
    <p>Conditions : ${data.weather[0].description}</p>
  `;

  return card;
}

function createErrorCard() {
  const card = document.createElement('section');
  card.className = 'card';

  card.innerHTML = `
    <h2>Météo</h2>
    <p>Impossible de récupérer la météo.</p>
  `;

  return card;
}

// Charger météo à l’ouverture
window.onload = () => {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const card = createMeteoCard(data);
      document.getElementById('dashboard').appendChild(card);
    })
    .catch(() => {
      const card = createErrorCard();
      document.getElementById('dashboard').appendChild(card);
    });
};
