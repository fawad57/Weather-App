const apiKey = "f087b2681752c069ba10f97ff64c5cf5";
const tableBody = document.getElementById("table-body");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");
const forecastDataSection = document.getElementById("forecast-data");
const forecastCityElement = document.getElementById("forecast-city");
const forecastBody = document.getElementById("forecast-body");
const unitToggle = document.getElementById("unit-toggle");
const unitLabel = document.getElementById("unit-label");

let searchedCities = [];
let currentPage = 1;
const rowsPerPage = 10;
let activeCity = null;
let unit = "metric";

function loadSearchedCities() {
  searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];
  searchedCities.reverse();
  displaySearchedCities(currentPage);
  updatePaginationInfo();
}

unitToggle.addEventListener("change", () => {
  unit = unitToggle.checked ? "imperial" : "metric";
  unitLabel.textContent = unitToggle.checked ? "°F" : "°C";
  displaySearchedCities(currentPage);
  if (activeCity) {
    fetchFiveDayForecast(activeCity);
  }
});

function displaySearchedCities(page) {
  tableBody.innerHTML = "";
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedCities = searchedCities.slice(start, end);

  paginatedCities.forEach((city) => {
    fetchCurrentWeather(city);
  });
}

function fetchCurrentWeather(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        displayCityWeatherInTable(city, data);
      }
    })
    .catch((error) => {
      console.error("Error fetching current weather:", error);
    });
}

function displayCityWeatherInTable(city, data) {
  const row = document.createElement("tr");

  const cityCell = document.createElement("td");
  cityCell.textContent = city;
  row.appendChild(cityCell);

  const tempCell = document.createElement("td");
  tempCell.textContent = `${data.main.temp}°${unit === "metric" ? "C" : "F"}`;
  row.appendChild(tempCell);

  const descriptionCell = document.createElement("td");
  descriptionCell.textContent = data.weather[0].description;
  row.appendChild(descriptionCell);

  const humidityCell = document.createElement("td");
  humidityCell.textContent = `${data.main.humidity}%`;
  row.appendChild(humidityCell);

  const windSpeedCell = document.createElement("td");
  windSpeedCell.textContent = `${data.wind.speed} ${
    unit === "metric" ? "m/s" : "mph"
  }`;
  row.appendChild(windSpeedCell);

  row.addEventListener("click", () => {
    if (city === activeCity) {
      activeCity = null;
      forecastDataSection.style.display = "none";
    } else {
      activeCity = city;
      fetchFiveDayForecast(city);
    }
  });

  tableBody.appendChild(row);
}

function fetchFiveDayForecast(city, callback = displayForecastData) {
  forecastBody.innerHTML = "";
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === "200") {
        const forecastData = data.list.filter((entry) =>
          entry.dt_txt.includes("12:00:00")
        );
        callback(forecastData);
      }
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
    });
}

function displayForecastData(forecastData) {
  forecastCityElement.textContent = activeCity;
  forecastBody.innerHTML = "";

  forecastData.forEach((item) => {
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = new Date(item.dt_txt).toLocaleDateString();
    row.appendChild(dateCell);

    const tempCell = document.createElement("td");
    tempCell.textContent = `${item.main.temp}°${unit === "metric" ? "C" : "F"}`;
    row.appendChild(tempCell);

    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = item.weather[0].description;
    row.appendChild(descriptionCell);

    const humidityCell = document.createElement("td");
    humidityCell.textContent = `${item.main.humidity}%`;
    row.appendChild(humidityCell);

    const windSpeedCell = document.createElement("td");
    windSpeedCell.textContent = `${item.wind.speed} ${
      unit === "metric" ? "m/s" : "mph"
    }`;
    row.appendChild(windSpeedCell);

    forecastBody.appendChild(row);
  });

  forecastDataSection.style.display = "block";
}

const sortAscBtn = document.getElementById("sort-asc-btn");
const sortDescBtn = document.getElementById("sort-desc-btn");
const filterRainBtn = document.getElementById("filter-rain-btn");
const maxTempBtn = document.getElementById("max-temp-btn");

function sortTemperaturesAsc(forecastData) {
  const sortedData = forecastData.sort((a, b) => a.main.temp - b.main.temp);
  displayForecastData(sortedData);
}

function sortTemperaturesDesc(forecastData) {
  const sortedData = forecastData.sort((a, b) => b.main.temp - a.main.temp);
  displayForecastData(sortedData);
}

function filterRainyDays(forecastData) {
  const rainyDays = forecastData.filter((item) =>
    item.weather[0].description.toLowerCase().includes("rain")
  );
  displayForecastData(rainyDays);
}

function showMaxTempDay(forecastData) {
  const maxTempDay = forecastData.reduce((max, day) =>
    day.main.temp > max.main.temp ? day : max
  );
  displayForecastData([maxTempDay]);
}

sortAscBtn.addEventListener("click", () => {
  if (activeCity) {
    fetchFiveDayForecast(activeCity, sortTemperaturesAsc);
  }
});

sortDescBtn.addEventListener("click", () => {
  if (activeCity) {
    fetchFiveDayForecast(activeCity, sortTemperaturesDesc);
  }
});

filterRainBtn.addEventListener("click", () => {
  if (activeCity) {
    fetchFiveDayForecast(activeCity, filterRainyDays);
  }
});

maxTempBtn.addEventListener("click", () => {
  if (activeCity) {
    fetchFiveDayForecast(activeCity, showMaxTempDay);
  }
});

// Pagination functions
function updatePaginationInfo() {
  const totalPages = Math.ceil(searchedCities.length / rowsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displaySearchedCities(currentPage);
    updatePaginationInfo();
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(searchedCities.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displaySearchedCities(currentPage);
    updatePaginationInfo();
  }
});

document.addEventListener("DOMContentLoaded", loadSearchedCities);
