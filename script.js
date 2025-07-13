// === Landing Page Navigation ===
if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
  function startChat() {
    window.location.href = "chat.html";
  }
}

// === Chat Page Logic ===
if (window.location.pathname.includes("chat.html")) {
  let chatHistory = [
    { role: "system", content: "You are Orbix AI, a helpful and intelligent assistant." }
  ];

  function appendMessage(sender, text) {
    const chatWindow = document.getElementById("chat-window");
    const message = document.createElement("div");
    message.innerHTML = `<strong style="color:${sender === 'Orbix' ? 'cyan' : 'white'};">${sender}:</strong> ${text}`;
    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // 👇 This function is now globally accessible
  window.sendMessage = async function () {
    const input = document.getElementById("userInput");
    const userText = input.value.trim();
    if (!userText) return;

    appendMessage("You", userText);
    chatHistory.push({ role: "user", content: userText });

    input.value = "Thinking...";
    input.disabled = true;

    try {
      const res = await fetch("https://2513644b-e012-4fdf-9d2e-117d1865b418-00-ekxfoqi5xtja.pike.replit.dev/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: chatHistory,
          temperature: 0.7
        })
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "⚠️ No valid response from AI.";
      chatHistory.push({ role: "assistant", content: reply });
      appendMessage("Orbix", reply);

    } catch (error) {
      appendMessage("Orbix", `❌ Error: ${error.message}`);
      console.error(error);
    }

    input.value = "";
    input.disabled = false;
    input.focus();
  };
}
