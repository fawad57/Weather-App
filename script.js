const apiKey = "f087b2681752c069ba10f97ff64c5cf5";
const cityInput = document.getElementById("city-input");
const getWeatherBtn = document.getElementById("get-weather-btn");
const geolocationBtn = document.getElementById("geolocation-btn");
const unitToggle = document.getElementById("unit-toggle");
const spinner = document.getElementById("loading-spinner");
const errorMessage = document.getElementById("error-message");
const unitLabel = document.getElementById("unit-label");
const ctxBar = document.getElementById("tempBarChart").getContext("2d");
const ctxDoughnut = document
  .getElementById("weatherDoughnutChart")
  .getContext("2d");
const ctxLine = document.getElementById("tempLineChart").getContext("2d");

let unit = "metric";

window.addEventListener("load", () => {
  if (!localStorage.getItem("firstLoad")) {
    localStorage.clear();
    localStorage.setItem("firstLoad", "true");
  }
});

function checkElementExists(element, elementName) {
  if (!element) {
    console.error(`${elementName} element not found.`);
  }
}

checkElementExists(cityInput, "City Input");
checkElementExists(getWeatherBtn, "Get Weather Button");
checkElementExists(geolocationBtn, "Geolocation Button");
checkElementExists(unitToggle, "Unit Toggle");
checkElementExists(spinner, "Loading Spinner");
checkElementExists(errorMessage, "Error Message");
checkElementExists(ctxBar, "Bar Chart Context");
checkElementExists(ctxDoughnut, "Doughnut Chart Context");
checkElementExists(ctxLine, "Line Chart Context");

const tempBarChart = new Chart(ctxBar, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: "#333" } },
      y: { ticks: { color: "#333" }, beginAtZero: true },
    },
    animation: {
      onComplete: () => {},
      delay: function (context) {
        let delay = 0;
        if (
          context.type === "data" &&
          context.mode === "default" &&
          context.dataIndex !== undefined
        ) {
          delay = context.dataIndex * 300;
        }
        return delay;
      },
    },
  },
});

const weatherDoughnutChart = new Chart(ctxDoughnut, {
  type: "doughnut",
  data: {
    labels: ["Sunny", "Rainy", "Cloudy"],
    datasets: [
      {
        label: "Weather Distribution",
        data: [0, 0, 0],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#333",
          font: { size: 14 },
        },
      },
    },
    animation: {
      onComplete: () => {},
      delay: function (context) {
        let delay = 0;
        if (
          context.type === "data" &&
          context.mode === "default" &&
          context.dataIndex !== undefined
        ) {
          delay = context.dataIndex * 300;
        }
        return delay;
      },
    },
  },
});

const tempLineChart = new Chart(ctxLine, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: "#333" } },
      y: { ticks: { color: "#333" }, beginAtZero: true },
    },
  },
});

unitToggle.addEventListener("change", () => {
  unit = unitToggle.checked ? "imperial" : "metric";
  unitLabel.textContent = unitToggle.checked ? "°F" : "°C";
  if (cityInput.value) {
    fetchWeatherData(cityInput.value);
    updateChartLabels();
  }
});

function updateChartLabels() {
  const unitSymbol = unit === "metric" ? "°C" : "°F";

  tempBarChart.data.datasets[0].label = `Temperature (${unitSymbol})`;
  tempBarChart.update();

  tempLineChart.data.datasets[0].label = `Temperature (${unitSymbol})`;
  tempLineChart.update();
}

getWeatherBtn.addEventListener("click", () => {
  if (cityInput.value) {
    fetchWeatherData(cityInput.value);
  }
});

geolocationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherDataByCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        errorMessage.textContent = "Unable to retrieve your location.";
        errorMessage.classList.remove("hidden");
      }
    );
  } else {
    errorMessage.textContent = "Geolocation is not supported by your browser.";
    errorMessage.classList.remove("hidden");
  }
});

function fetchWeatherData(city) {
  spinner.classList.remove("hidden");
  errorMessage.classList.add("hidden");
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        displayWeatherData(data);
        fetchFiveDayForecast(city);
        let searchedCities =
          JSON.parse(localStorage.getItem("searchedCities")) || [];
        if (!searchedCities.includes(city)) {
          searchedCities.push(city);
          localStorage.setItem(
            "searchedCities",
            JSON.stringify(searchedCities)
          );
        }
        updateChartLabels();
      } else {
        throw new Error(data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      errorMessage.textContent = "City not found or API error.";
      errorMessage.classList.remove("hidden");
      clearWeatherWidget();
      resetCharts();
      resetForecast();
    })
    .finally(() => spinner.classList.add("hidden"));
}

function clearWeatherWidget() {
  document.getElementById("city-name").textContent = "";
  document.getElementById("weather-description").textContent = "";
  document.getElementById("temperature").textContent = "";
  document.getElementById("humidity").textContent = "";
  document.getElementById("wind-speed").textContent = "";
  document.getElementById("weather-icon").src = "";
}

function resetCharts() {
  tempBarChart.data.labels = [];
  tempBarChart.data.datasets[0].data = [];
  tempBarChart.update();

  weatherDoughnutChart.data.datasets[0].data = [0, 0, 0];
  weatherDoughnutChart.update();

  tempLineChart.data.labels = [];
  tempLineChart.data.datasets[0].data = [];
  tempLineChart.update();
}

function resetForecast() {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";
}

function fetchWeatherDataByCoords(lat, lon) {
  spinner.classList.remove("hidden");
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        cityInput.value = data.name;

        displayWeatherData(data);
        fetchFiveDayForecast(data.name);

        let searchedCities =
          JSON.parse(localStorage.getItem("searchedCities")) || [];
        if (!searchedCities.includes(data.name)) {
          searchedCities.push(data.name);
          localStorage.setItem(
            "searchedCities",
            JSON.stringify(searchedCities)
          );
        }

        updateChartLabels();
      } else {
        throw new Error(data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      errorMessage.textContent =
        "Unable to fetch weather data for your location.";
      errorMessage.classList.remove("hidden");
    })
    .finally(() => spinner.classList.add("hidden"));
}

function displayWeatherData(data) {
  const weatherWidget = document.getElementById("weather-widget");
  const cityName = document.getElementById("city-name");
  const weatherDescription = document.getElementById("weather-description");
  const temperature = document.getElementById("temperature");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("wind-speed");
  const weatherIcon = document.getElementById("weather-icon");

  checkElementExists(cityName, "City Name");
  checkElementExists(weatherDescription, "Weather Description");
  checkElementExists(temperature, "Temperature");
  checkElementExists(humidity, "Humidity");
  checkElementExists(windSpeed, "Wind Speed");
  checkElementExists(weatherIcon, "Weather Icon");

  cityName.textContent = data.name;
  weatherDescription.textContent = data.weather[0].description;
  temperature.textContent = `${data.main.temp}°${
    unit === "metric" ? "C" : "F"
  }`;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} ${
    unit === "metric" ? "m/s" : "mph"
  }`;
  weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  const weatherCondition = data.weather[0].main.toLowerCase();
  switch (weatherCondition) {
    case "clear":
      weatherWidget.style.background =
        "linear-gradient(to right, #f7b733, #fc4a1a)";
      break;
    case "clouds":
      weatherWidget.style.background =
        "linear-gradient(to right, #bdc3c7, #2c3e50)";
      break;
    case "rain":
      weatherWidget.style.background =
        "linear-gradient(to right, #00c6ff, #0072ff)";
      break;
    case "snow":
      weatherWidget.style.background =
        "linear-gradient(to right, #e6f7ff, #cceeff)";
      break;
    case "thunderstorm":
      weatherWidget.style.background =
        "linear-gradient(to right, #373b44, #4286f4)";
      break;
    default:
      weatherWidget.style.background =
        "linear-gradient(to right, #70e1f5, #ffd194)";
  }
}

function fetchFiveDayForecast(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayFiveDayForecast(data.list);
      updateCharts(data.list);
    })
    .catch((error) => console.error("Error fetching forecast:", error));
}

function displayFiveDayForecast(forecastData) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";
  const dailyData = forecastData.filter((entry) =>
    entry.dt_txt.includes("12:00:00")
  );

  dailyData.forEach((day, index) => {
    const forecastElement = document.createElement("div");
    forecastElement.classList.add("forecast-item");
    forecastElement.style.animationDelay = `${index * 0.2}s`;

    const weatherDescription = day.weather[0].main.toLowerCase();
    let backgroundColor;

    switch (weatherDescription) {
      case "clear":
        backgroundColor = "linear-gradient(to right, #f7b733, #fc4a1a)";
        break;
      case "clouds":
        backgroundColor = "linear-gradient(to right, #bdc3c7, #2c3e50)";
        break;
      case "rain":
        backgroundColor = "linear-gradient(to right, #00c6ff, #0072ff)";
        break;
      case "snow":
        backgroundColor = "linear-gradient(to right, #e6f7ff, #cceeff)";
        break;
      case "thunderstorm":
        backgroundColor = "linear-gradient(to right, #373b44, #4286f4)";
        break;
      default:
        backgroundColor = "linear-gradient(to right, #70e1f5, #ffd194)";
        break;
    }

    forecastElement.style.background = backgroundColor;

    forecastElement.innerHTML = `
      <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
      <p>Temp: ${day.main.temp}°${unit === "metric" ? "C" : "F"}</p>
      <p>${day.weather[0].description}</p>
      <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
    `;
    forecastContainer.appendChild(forecastElement);
  });
}

function updateCharts(forecastData) {
  const dailyData = forecastData.filter((entry) =>
    entry.dt_txt.includes("12:00:00")
  );

  const labels = dailyData.map((day) =>
    new Date(day.dt_txt).toLocaleDateString()
  );
  const temperatures = dailyData.map((day) => day.main.temp);

  weatherDoughnutChart.data.datasets[0].data = [0, 0, 0];

  tempBarChart.data.labels = labels;
  tempBarChart.data.datasets[0].data = temperatures;
  tempBarChart.update();

  dailyData.forEach((entry) => {
    const weatherDescription = entry.weather[0].main;
    if (weatherDescription === "Clear") {
      weatherDoughnutChart.data.datasets[0].data[0]++;
    } else if (weatherDescription === "Rain") {
      weatherDoughnutChart.data.datasets[0].data[1]++;
    } else if (weatherDescription === "Clouds") {
      weatherDoughnutChart.data.datasets[0].data[2]++;
    }
  });

  weatherDoughnutChart.update();

  tempLineChart.data.labels = labels;
  tempLineChart.data.datasets[0].data = temperatures;
  tempLineChart.update();
}
