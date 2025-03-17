/* eslint-disable no-use-before-define */
const apiUrl = "https://api.weatherapi.com/v1/forecast.json?";
// eslint-disable-next-line no-undef
const url = config.MY_Key;

// This is for the DOM elements.
const dateDisplay = document.getElementById("date");
const displayTime = document.getElementById("time");

function getTime() {
  const getCurrentTime = new Date();
  const currentTime = getCurrentTime.toLocaleTimeString("default", {
    hour: "numeric",
    minute: "2-digit",
    hour12: "true",
  });
  displayTime.innerText = currentTime;
}

// For making a message based on the time of day.
const displayMessage = document.getElementById("message");
const now = new Date();
const currentHour = now.getHours(); // Gets the hour (0-23)

if (currentHour >= 0 && currentHour < 12) {
  displayMessage.innerText = "Good Morning!";
} else if (currentHour >= 12 && currentHour < 18) {
  displayMessage.innerText = "Good Afternoon!";
} else {
  displayMessage.innerText = "Good Evening!";
}


const getCurrentDate = new Date();
const longDate = getCurrentDate.toLocaleString("default", {
  month: "long",
  day: "2-digit",
  year: "numeric",
});
const longDay = getCurrentDate.toLocaleDateString("default", {
  weekday: "long",
});
dateDisplay.innerText = longDate;

function updateTimeAndDate() {
  setInterval(getTime, 1000);
}

updateTimeAndDate();

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(localWeather, () => {
      noLocation(selectedCity);
    });
  } else {
    noLocation(selectedCity);
  }
}

function populateCityName(param) {
  const cityName = document.getElementById("location-name");
  cityName.innerText = `${param.location.name}`;
}

// This function is for displaying the current temperature

function currentConditions(param) {
  const temp = document.getElementById("current-weather");
  const conditions = document.getElementById("weather-conds");
  const currentTemp = param.current.temp_c;
  const roundedTemp = Math.floor(currentTemp);
  temp.innerHTML = `${roundedTemp}<span class='degree'>&deg;</span>`;
  conditions.innerText = param.current.condition.text;
}

function displayCurrentDetails() {
  const display = document.getElementById("details");
  for (let i = 0; i < 1; i += 1) {
    const createCards = document.createElement("div");
    display.append(createCards);
    createCards.classList.add("card");
    createCards.setAttribute("id", i);
  }
}

displayCurrentDetails();

// This is for the card that displays the high and low temps. //
const highestTemp = document.createElement("p");
const lowestTemp = document.createElement("p");
const humidity = document.getElementById("humidity");

function addTempDetails(param) {
  const temps = document.getElementById("0");
  temps.append(highestTemp, lowestTemp);
  highestTemp.innerHTML = `High: ${Math.floor(param.forecast.forecastday[0].day.maxtemp_c)}<span>&deg;</span>c`;
  lowestTemp.innerHTML = `Low: ${Math.floor(param.forecast.forecastday[0].day.mintemp_c)}<span>&deg;</span>c`;
  humidity.innerText = `${param.current.humidity}%`;
}

// This is for the wind details //
const wind = document.getElementById("wind");

function addWindDetails(param) {
  wind.innerText = `${Math.floor(param.current.wind_kph)} kph`;
}

// This is for the feels like temperature //
const feelsLike = document.getElementById("feelsLike");

function addFeelsLike(param) {
  feelsLike.innerHTML = `Feels like: ${Math.floor(param.current.feelslike_c)}<span>&deg;</span>c`;
}

// This function calls for the the information to be displayed on the page.
function addCurrentDetails(param) {
  currentConditions(param);
  addTempDetails(param);
  addFeelsLike(param);
  addWindDetails(param);
}

// For a function when the user declines location.

const popularCities = [
  "Paris",
  "New York City",
  "Tokyo",
  "London",
  "Rome",
  "Istanbul",
  "Dubai",
  "Sydney",
  "Rio de Janeiro",
  "Hong Kong",
];

const randomCity = Math.floor(Math.random() * popularCities.length);
const selectedCity = popularCities[randomCity];

async function noLocation(param) {
  try {
    const city = await fetch(`${apiUrl}&key=${url}q=${param}&days=3`, {
      mode: "cors",
    });
    const data = await city.json();
    console.log(data);
    populateCityName(data);
    addCurrentDetails(data);
    addHourlyWeather(data);
    displayForecast(data);
    forecastIcons(data);
  } catch (error) {
    // eslint-disable-next-line no-alert
    alert(error);
  }
}

// This is for the hourly weather creation //

const hourlyWeather = document.getElementById("hourly-weather");
const timeReference = getCurrentDate.getHours();
const hours = [
  "12 AM",
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
];
let hourlyWeatherHours;

function addHourlyWeather(param) {
  const hourlyWeatherUpdates = param.forecast.forecastday[0].hour;
  if (
    timeReference <= hourlyWeatherUpdates.length &&
    timeReference <= hours.length
  ) {
    const matchedWeatherHours = hourlyWeatherUpdates.slice(timeReference);
    const hoursShort = hours.slice(timeReference);
    for (let i = 0; i < 6; i += 1) {
      hourlyWeatherHours = document.createElement("p");
      hourlyWeatherHours.classList.add("borderedCard");
      hourlyWeatherHours.innerHTML = `<p class="hourlyTime">${hoursShort[i]}</p><p class="hourlyTemp">${Math.floor(matchedWeatherHours[i].temp_c)}&deg;c</p><p class="hourly-conditions">${matchedWeatherHours[i].condition.text}</p>`;
      hourlyWeather.append(hourlyWeatherHours);
    }
  }
}

// This is for displaying the date in the forecast cards //
const futureDate = new Date(getCurrentDate);

function futureDates(date, num) {
  const daysToAdd = num;
  date.setDate(date.getDate() + daysToAdd);
  return date.toLocaleDateString("default", { month: "long", day: "numeric" });
}

const oneDay = futureDates(futureDate, 1);
const twoDay = futureDates(futureDate, 1);

// This is for building the cards for displaying the forecasted weather //
const displayCards = document.getElementById("forecast");

for (let i = 0; i <= 1; i += 1) {
  const cards = document.getElementsByClassName("forecastedWeather");
  const highLowTemp = document.createElement("p");
  highLowTemp.setAttribute("id", `temps-${i}`);
  const futureConditions = document.createElement("p");
  futureConditions.setAttribute("id", `weather-conds-${i}`);
  cards[i].append(highLowTemp, futureConditions );
}

const forecastDateOne = document.getElementById("tomorrow");
const forecastDateTwo = document.getElementById("theDayAfter");

forecastDateOne.innerText = oneDay;
forecastDateTwo.innerText = twoDay;

const forecastOne = document.getElementById("box-0");
const forecastTwo = document.getElementById("box-1");
const highForecastTemp = [];
const tempsOne = document.getElementById("temps-0");
const tempsTwo = document.getElementById("temps-1");
const forecastOneCondition = document.getElementById("weather-conds-0");
const forecastTwoCondition = document.getElementById("weather-conds-1");

// For the 2 day forecast cards //
function displayForecast(param) {
  for (let i = 1; i <= 2; i += 1) {
    const highTemp = Math.floor(param.forecast.forecastday[i].day.maxtemp_c);
    highForecastTemp.push(highTemp);
  }

  tempsOne.innerHTML = `
    ${highForecastTemp[0]}&deg;c`;

  tempsTwo.innerHTML = `${highForecastTemp[1]}&deg;c `;

  forecastOneCondition.innerText = param.forecast.forecastday[1].day.condition.text;
  forecastTwoCondition.innerText = param.forecast.forecastday[2].day.condition.text;
}

async function localWeather(position) {
  const geoWeather = await fetch(
    `${apiUrl}&key=${url}q=${position.coords.latitude},${position.coords.longitude}&days=3`,
    { mode: "cors" },
  );
  const data = await geoWeather.json();
  populateCityName(data);
  addCurrentDetails(data);
  addHourlyWeather(data);
  displayForecast(data);
}

const locationSearch = document.getElementById("location-search");

function clearElements() {
  hourlyWeather.innerHTML = "";
}

async function locationLookUp() {
  const location = locationSearch.value;
  const geoWeather = await fetch(`${apiUrl}&key=${url}q=${location}&days=3`, {
    mode: "cors",
  });
  const data = await geoWeather.json();
  clearElements();
  populateCityName(data);
  addCurrentDetails(data);
  addHourlyWeather(data);
  displayForecast(data);
}

locationSearch.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    locationLookUp();
  }
});



// This function will be for toggling between the current conditions, hourly weather, and future forecast.

getLocation();
