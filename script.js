const API_KEY = '5c6623a73ef8a00b332500654eced9db'; // ✅ Ta clé API

const ville = 'Henin-Beaumont,FR';
const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&units=metric&lang=fr&appid=${API_KEY}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    document.getElementById('temperature').textContent = `Température : ${data.main.temp} °C`;
    document.getElementById('description').textContent = `Conditions : ${data.weather[0].description}`;
  })
  .catch(error => {
    console.error('Erreur météo :', error);
    document.getElementById('description').textContent = 'Impossible de récupérer la météo.';
  });
