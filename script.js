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
const openaiApiKey = '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'; // Remplace par ta clé OpenAI valide

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (!recognition) {
  alert('Reconnaissance vocale non supportée par votre navigateur');
}

recognition.lang = 'fr-FR';
recognition.interimResults = false;

const btnParler = document.getElementById('btnParler');
const chatBox = document.getElementById('chatReponses');

btnParler.addEventListener('click', () => {
  if (chatBox.style.display === 'flex') {
    chatBox.style.display = 'none';
  } else {
    chatBox.style.display = 'flex';
    startRecognition();
  }
});

function startRecognition() {
  if (!recognition) return;
  chatBox.innerHTML += `<p class="user"><em>Écoute...</em></p>`;
  recognition.start();
}

recognition.onresult = async (event) => {
  const texte = event.results[0][0].transcript;
  chatBox.innerHTML += `<p class="user"><strong>Vous :</strong> ${texte}</p>`;

  const reponse = await appelerChatGPT(texte);
  chatBox.innerHTML += `<p class="gpt"><strong>ChatGPT :</strong> ${reponse}</p>`;

  chatBox.scrollTop = chatBox.scrollHeight;

  const utterance = new SpeechSynthesisUtterance(reponse);
  utterance.lang = 'fr-FR';
  speechSynthesis.speak(utterance);
};

recognition.onerror = (event) => {
  chatBox.innerHTML += `<p><em>Erreur reconnaissance vocale : ${event.error}</em></p>`;
};

async function appelerChatGPT(question) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: question }]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erreur API OpenAI:', error);
    return "Désolé, une erreur est survenue.";
  }
}

// Init
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

function parlerAvecVoix(message) {
  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'fr-FR';
    utterance.onerror = function (e) {
      console.error("Erreur de synthèse vocale :", e.error);
    };
    synth.speak(utterance);
  } else {
    console.error("Synthèse vocale non supportée par ce navigateur.");
  }
}

