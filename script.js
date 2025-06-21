const API_KEY = '11bbb6ce48a41c696c72557cc6dbd26f'; // ✅ Ta clé API

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

function allumerPrise() {
  // Remplace l'URL par celle de ton webhook IFTTT "on"
  fetch('https://maker.ifttt.com/trigger/allumer_prise/with/key/VOTRE_CLE_IFTTT')
    .then(() => {
      document.getElementById('etat-prise').textContent = 'État : Allumée';
    })
    .catch(() => {
      document.getElementById('etat-prise').textContent = 'Erreur lors de l’activation.';
    });
}

function eteindrePrise() {
  // Remplace l'URL par celle de ton webhook IFTTT "off"
  fetch('https://maker.ifttt.com/trigger/eteindre_prise/with/key/VOTRE_CLE_IFTTT')
    .then(() => {
      document.getElementById('etat-prise').textContent = 'État : Éteinte';
    })
    .catch(() => {
      document.getElementById('etat-prise').textContent = 'Erreur lors de la désactivation.';
    });
}
