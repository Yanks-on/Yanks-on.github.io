const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'fr-FR';
recognition.interimResults = false;

const btn = document.getElementById('btnParler');
const chat = document.getElementById('chatReponses');

btn.addEventListener('click', () => {
  chat.style.display = 'block';
  chat.innerHTML += `<p class="user"><em>Écoute...</em></p>`;
  recognition.start();
});

recognition.onresult = async (event) => {
  const texte = event.results[0][0].transcript;
  chat.innerHTML += `<p class="user"><strong>Vous :</strong> ${texte}</p>`;
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: texte })
  });
  const data = await response.json();
  const reponse = data.reponse || 'Erreur';
  chat.innerHTML += `<p class="gpt"><strong>ChatGPT :</strong> ${reponse}</p>`;
  const voix = new SpeechSynthesisUtterance(reponse);
  voix.lang = 'fr-FR';
  speechSynthesis.speak(voix);
};

recognition.onerror = (e) => {
  chat.innerHTML += `<p><em>Erreur reconnaissance vocale : ${e.error}</em></p>`;
};
