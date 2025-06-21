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

// Assure-toi de remplacer 'TON_API_KEY_OPENAI' par ta vraie clé OpenAI
const openaiApiKey = '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';

// Initialisation reconnaissance vocale
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'fr-FR';
recognition.interimResults = false;

const btnParler = document.getElementById('btnParler');
const divReponses = document.getElementById('reponses');

btnParler.onclick = () => {
  divReponses.innerHTML += `<p><em>Écoute...</em></p>`;
  recognition.start();
};

recognition.onresult = async (event) => {
  const texte = event.results[0][0].transcript;
  divReponses.innerHTML += `<p><strong>Vous :</strong> ${texte}</p>`;

  // Appel à OpenAI
  const reponse = await appelerChatGPT(texte);
  
  divReponses.innerHTML += `<p><strong>ChatGPT :</strong> ${reponse}</p>`;
  divReponses.scrollTop = divReponses.scrollHeight;

  // Synthèse vocale
  const utterance = new SpeechSynthesisUtterance(reponse);
  utterance.lang = 'fr-FR';
  speechSynthesis.speak(utterance);
};

recognition.onerror = (event) => {
  divReponses.innerHTML += `<p><em>Erreur reconnaissance vocale : ${event.error}</em></p>`;
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
