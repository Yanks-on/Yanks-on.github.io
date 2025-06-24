const API_KEY = '11bbb6ce48a41c696c72557cc6dbd26f';
const ville = 'Henin-Beaumont,FR';
const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&units=metric&lang=fr&appid=${API_KEY}`;

// Création carte météo simple
function createMeteoCard(data) {
  const card = document.createElement('section');
  card.className = 'card meteo';
  card.innerHTML = `
    <h2><strong>Météo actuelle à </strong> ${ville.split(',')[0]}</h2>
    <p><strong>Température :</strong> ${data.main.temp} °C</p>
    <p><strong>Ressenti :</strong> ${data.main.feels_like} °C</p>
    <p><strong>Conditions :</strong> ${data.weather[0].description}</p>
    <p><strong>Vent :</strong> ${data.wind.speed} m/s</p>
  `;
  return card;
}

// Carte pour prévision d’un jour
function createForecastCard(date, tempMin, tempMax, description) {
  const card = document.createElement('section');
  card.className = 'card';
  card.innerHTML = `
    <h2>Prévision du ${date}</h2>
    <p><strong>Température min :</strong> ${tempMin.toFixed(1)} °C</p>
    <p><strong>Température max :</strong> ${tempMax.toFixed(1)} °C</p>
    <p><strong>Conditions :</strong> ${description}</p>
  `;
  return card;
}

function createMeteoError() {
  const card = document.createElement('section');
  card.className = 'card';
  card.innerHTML = `
    <h2>Météo</h2>
    <p>❌ Erreur : impossible de récupérer la météo.</p>
  `;
  return card;
}

// Fonction pour formater la date en français
function formatDate(dateStr) {
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', options);
}

// Regroupe les données par jour et calcule min/max et description la plus fréquente
function processForecastData(list) {
  const dailyData = {};

  list.forEach(item => {
    const date = item.dt_txt.split(' ')[0]; // yyyy-mm-dd
    if (!dailyData[date]) {
      dailyData[date] = {
        tempsMin: item.main.temp_min,
        tempsMax: item.main.temp_max,
        descriptions: {},
      };
    } else {
      dailyData[date].tempsMin = Math.min(dailyData[date].tempsMin, item.main.temp_min);
      dailyData[date].tempsMax = Math.max(dailyData[date].tempsMax, item.main.temp_max);
    }
    const desc = item.weather[0].description;
    dailyData[date].descriptions[desc] = (dailyData[date].descriptions[desc] || 0) + 1;
  });

  // Choisir la description la plus fréquente
  for (const date in dailyData) {
    const descs = dailyData[date].descriptions;
    let maxCount = 0;
    let mostFrequentDesc = '';
    for (const desc in descs) {
      if (descs[desc] > maxCount) {
        maxCount = descs[desc];
        mostFrequentDesc = desc;
      }
    }
    dailyData[date].description = mostFrequentDesc;
    delete dailyData[date].descriptions;
  }

  return dailyData;
}

// Chargement des données
window.onload = () => {
  // D’abord afficher la météo actuelle (optionnel, depuis le même endpoint, ou appeler une autre API)
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&units=metric&lang=fr&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const meteoCard = createMeteoCard(data);
      document.getElementById('dashboard').appendChild(meteoCard);
    })
    .catch(() => {
      const errorCard = createMeteoError();
      document.getElementById('dashboard').appendChild(errorCard);
    });

  // Puis afficher la prévision
  fetch(urlForecast)
    .then(res => res.json())
    .then(data => {
      const dailyData = processForecastData(data.list);

      // Afficher chaque jour (limite à 5 jours)
      let count = 0;
      for (const date in dailyData) {
        if (count >= 5) break;
        const day = formatDate(date);
        const card = createForecastCard(day, dailyData[date].tempsMin, dailyData[date].tempsMax, dailyData[date].description);
        document.getElementById('dashboard').appendChild(card);
        count++;
      }
    })
    .catch(() => {
      const errorCard = createMeteoError();
      document.getElementById('dashboard').appendChild(errorCard);
    });
};
