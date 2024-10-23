const weatherApiKey = "f087b2681752c069ba10f97ff64c5cf5";
const geminiApiKey = "AIzaSyAoGFfLVeicF97WSEbi4cmtoOb8lq4vOYg";

const chatbotInput = document.getElementById("chatbot-input");
const chatbotWindow = document.getElementById("chatbot-window");
const sendBtn = document.getElementById("chatbot-send");

sendBtn.addEventListener("click", () => {
  const userMessage = chatbotInput.value;
  if (userMessage.trim()) {
    appendMessage("User", userMessage);
    handleUserQuery(userMessage);
    chatbotInput.value = "";
  }
});

function appendMessage(sender, message) {
  const messageElem = document.createElement("div");
  messageElem.classList.add(sender === "User" ? "user-message" : "bot-message");
  messageElem.textContent = `${sender}: ${message}`;
  chatbotWindow.appendChild(messageElem);
  chatbotWindow.scrollTop = chatbotWindow.scrollHeight;
}

function handleUserQuery(query) {
  if (query.toLowerCase().includes("weather")) {
    const city = query.split(" ").slice(-1)[0];
    fetchWeatherData(city);
  } else {
    fetchGeminiResponse(query);
  }
}

// Function to fetch weather data
function fetchWeatherData(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        const weatherMessage = `Weather in ${data.name}: ${data.main.temp}°C, ${data.weather[0].description}. Humidity: ${data.main.humidity}%, Wind Speed: ${data.wind.speed} m/s.`;
        appendMessage("Bot", weatherMessage);
      } else {
        appendMessage("Bot", `Sorry, I couldn't find the weather for ${city}.`);
      }
    })
    .catch((error) => {
      console.error("Error fetching weather:", error);
      appendMessage(
        "Bot",
        "Sorry, something went wrong while fetching the weather."
      );
    });
}

function fetchGeminiResponse(query) {
  fetch("https://api.ai.google.dev/chatbot-endpoint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${geminiApiKey}`,
    },
    body: JSON.stringify({
      prompt: query,
      max_tokens: 100,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const botMessage = data.response
        ? data.response
        : "Sorry, I don't have an answer for that.";
      appendMessage("Bot", botMessage);
    })
    .catch((error) => {
      console.error("Error with Gemini API:", error);
      appendMessage("Bot", "Sorry, something went wrong with my response.");
    });
}
