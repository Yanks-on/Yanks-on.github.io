// Clé API OpenWeatherMap
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
    <p>Ville : ${ville.split(',')[0]}</p>
    <p>Température : ${data.main.temp} °C</p>
    <p>Conditions : ${data.weather[0].description}</p>
  `;
  return card;
}

// Affiche erreur météo
function createMeteoError() {
  const card = document.createElement('section');
  card.className = 'card';
  card.id = 'meteo';
  card.innerHTML = `
    <h2>Météo</h2>
    <p>Impossible de récupérer la météo.</p>
  `;
  return card;
}

// Fonction d'initialisation
window.onload = () => {
  console.log('Chargement du dashboard...');

  fetch(url)
    .then(res => {
      console.log('Réponse météo:', res.status);
      return res.json();
    })
    .then(data => {
      console.log('Données météo:', data);
      const meteoCard = createMeteoCard(data);
      const dashboard = document.getElementById('dashboard');
      dashboard.appendChild(meteoCard);
    })
    .catch(error => {
      console.error('Erreur lors du fetch météo:', error);
      const dashboard = document.getElementById('dashboard');
      dashboard.appendChild(createMeteoError());
    });
};
