document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('send-btn');
  const userInput = document.getElementById('user-input');
  const responseBox = document.getElementById('response');

  sendBtn.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (!message) return;

    responseBox.textContent = "⏳ Envoi en cours...";

    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      responseBox.textContent = data.message || "❌ Pas de réponse.";
    } catch (error) {
      console.error(error);
      responseBox.textContent = "❌ Erreur de communication avec le serveur.";
    }
  });
});
