const API_KEY = "TA_CLE_API_OPENAI"; // remplace par ta vraie clé OpenAI

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'fr-FR';

document.getElementById("start-voice").addEventListener("click", () => {
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
      messages: [
        { role: "user", content: texte }
      ]
    })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Erreur HTTP : " + res.status);
    }
    return res.json();
  })
  .then(data => {
    const reponse = data.choices[0].message.content;
    console.log("GPT répond :", reponse);
    parlerAvecVoix(reponse);
  })
  .catch(error => {
    console.error("Erreur API :", error);
    parlerAvecVoix("Désolé, une erreur est survenue.");
  });
};

function parlerAvecVoix(message) {
  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'fr-FR';
    synth.speak(utterance);
  } else {
    alert("La synthèse vocale n’est pas supportée par ce navigateur.");
  }
}
