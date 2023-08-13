const apiUrl = 'http://api.weatherapi.com/v1/forecast.json?';
const url = config.MY_Key;

// This is for the DOM elements.
const weekday = document.getElementById('day-of-week');
const date = document.getElementById('date');
const displayTime = document.getElementById('time');

async function localWeather(position) {
  const geoWeather = await fetch(`${apiUrl}&key=${url}q=${position.coords.latitude},${position.coords.longitude}&days=3`, { mode: 'cors' });
  const data = await geoWeather.json();
  console.log(data);
  populateCityName(data);
  currentConditions(data);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(localWeather);
  } else {
    // x.innerHTML = 'Geolocation is not supported by this browser';
  }
}

function populateCityName(obj) {
  const cityName = document.getElementById('location-name');
  const countryName = document.getElementById('country-name');
  cityName.innerText = `${obj.location.name}, ${obj.location.region}`;
  countryName.innerText = obj.location.country;
}

getLocation();

function currentConditions(param) {
  const temp = document.getElementById('current-weather');
  const conditions = document.getElementById('weather-conds');
  const currentTemp = param.current.temp_c;
  const roundedTemp = Math.floor(currentTemp);
  temp.innerHTML = `${roundedTemp}<span class='degree'>&deg;</span>`;
  conditions.innerText = param.current.condition.text;
}

function getTime() {
  const getCurrentTime = new Date();
  const currentTime = getCurrentTime.toLocaleTimeString('default', {
    hour: 'numeric', minute: '2-digit', hour12: 'true',
  });
  displayTime.innerText = currentTime;
}

function displayDate() {
  const getCurrentDate = new Date();
  const longDate = getCurrentDate.toLocaleString('default', { month: 'long', day: '2-digit', year: 'numeric' });
  const longDay = getCurrentDate.toLocaleDateString('default', { weekday: 'long' });
  weekday.innerText = longDay;
  date.innerText = longDate;
}

function updateTimeAndDate() {
  setInterval(getTime, 1000);
}

displayDate();
updateTimeAndDate();
