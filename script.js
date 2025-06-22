// Météo
const API_KEY = '11bbb6ce48a41c696c72557cc6dbd26f'; // Ta clé OpenWeatherMap
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

// ChatGPT vocal
const API_KEY = "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"; // ← remplace ici

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'fr-FR';

document.getElementById("start-voice").addEventListener("click", () => {
  document.getElementById("reponse").textContent = "Écoute...";
  recognition.start();
});

recognition.onresult = (event) => {
  const texte = event.results[0][0].transcript;
  console.log("Tu as dit :", texte);

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: texte }]
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Réponse non OK");
    return res.json();
  })
  .then(data => {
    const reponse = data.choices[0].message.content;
    document.getElementById("reponse").textContent = reponse;
    parlerAvecVoix(reponse);
  })
  .catch(error => {
    console.error("Erreur API :", error);
    document.getElementById("reponse").textContent = "Erreur lors de l'appel à ChatGPT.";
    parlerAvecVoix("Désolé, une erreur est survenue.");
  });
};

function parlerAvecVoix(message) {
  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'fr-FR';
    utterance.onerror = function (e) {
      console.error("Erreur synthèse vocale :", e.error);
    };
    synth.speak(utterance);
  } else {
    alert("La synthèse vocale n’est pas supportée.");
  }
}
