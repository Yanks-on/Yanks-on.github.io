const API_KEY = "TA_CLE_API_OPENAI"; // ← remplace ici

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
