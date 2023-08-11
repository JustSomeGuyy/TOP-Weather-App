const apiUrl = 'http://api.weatherapi.com/v1/forecast.json?';
const url = config.MY_Key;

// This is for theD DOM elements.
const weekday = document.getElementById('day-of-week');
const date = document.getElementById('date');

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
  const displayTime = document.getElementById('time');
  const hours = getCurrentTime.getHours();
  const minutes = getCurrentTime.getMinutes();
  let minute;
  let hour;
  let amOrPm;
  if (hours === 0 && hours < 1) {
    amOrPm = 'AM';
    hour = hours + 12;
  } else if (hours > 12 && hours > 0) {
    amOrPm = 'AM';
    hour = hours;
  } else {
    amOrPm = 'PM';
    hour = hours - 12;
  };
  if (minutes < 10) {
    minute = `0${minutes}`;
  } else {
    minute = minutes;
  };
  displayTime.innerText = `${hour} : ${minute} ${amOrPm}`;
}

function updateTimeAndDate() {
  setInterval(getTime, 1000);
}
updateTimeAndDate();
