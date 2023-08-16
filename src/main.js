const apiUrl = 'http://api.weatherapi.com/v1/forecast.json?';
// eslint-disable-next-line no-undef
const url = config.MY_Key;

// This is for the DOM elements.
const weekday = document.getElementById('day-of-week');
const date = document.getElementById('date');
const displayTime = document.getElementById('time');

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
  temp.innerHTML = `${roundedTemp}<span class='degree'>&deg;c</span>`;
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

function displayCurrentDetails() {
  const display = document.getElementById('details-forecast');
  for (let i = 0; i < 3; i += 1) {
    const createCards = document.createElement('div');
    display.append(createCards);
    createCards.classList.add('card');
    createCards.setAttribute('id', i);
  }
}

function addTempDetails(param) {
  const highestTemp = document.createElement('p');
  const lowestTemp = document.createElement('p');
  const temps = document.getElementById('0');
  temps.append(highestTemp, lowestTemp);
  highestTemp.innerHTML = `<p>High</p> ${Math.floor(param.forecast.forecastday[0].day.maxtemp_c)}<span>&deg;</span>c`;
  lowestTemp.innerHTML = `<p>Low</p> ${Math.floor(param.forecast.forecastday[0].day.mintemp_c)}<span>&deg;</span>c`;
}

function addWindDetails(param) {
  const windNormal = document.createElement('p');
  const windGust = document.createElement('p');
  const windDirection = document.createElement('p');
  const wind = document.getElementById('1');
  wind.append(windNormal, windDirection, windGust);
  windNormal.innerText = `Wind: ${Math.floor(param.current.wind_kph)} kph`;
  windDirection.innerText = param.current.wind_dir;
  windGust.innerText = `Gusting: ${Math.floor(param.current.gust_kph)} kph`;
}

function addFurtherDetails(param) {
  const detailsDisplay = document.getElementById('2');
  const ultraViolet = document.createElement('p');
  const visibility = document.createElement('p');
  const humidity = document.createElement('p');
  detailsDisplay.append(ultraViolet, visibility, humidity);
  ultraViolet.innerText = `UV Index: ${param.current.uv}`;
  visibility.innerText = `Visibility: ${param.current.vis_km}`;
  humidity.innerText = `Humidity: ${param.current.humidity}`;
}

function addCurrentDetails(param) {
  currentConditions(param);
  addFurtherDetails(param);
  addTempDetails(param);
  addWindDetails(param);
}

async function localWeather(position) {
  const geoWeather = await fetch(`${apiUrl}&key=${url}q=${position.coords.latitude},${position.coords.longitude}&days=3`, { mode: 'cors' });
  const data = await geoWeather.json();
  console.log(data);
  displayCurrentDetails();
  populateCityName(data);
  addCurrentDetails(data);
  addHourlyWeather(data);
}

const currentDisplay = document.getElementById('current-details');
currentDisplay.addEventListener('click', addCurrentDetails());

function addHourlyWeather(param) {
  const hourlyWeather = document.getElementById('hourly-weather');
  const timeReference = new Date().getHours();
  const hours = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];
  const hourlyWeatherUpdates = param.forecast.forecastday[0].hour;
  if (timeReference <= hourlyWeatherUpdates.length && timeReference <= hours.length) {
    const matchedWeatherHours = hourlyWeatherUpdates.slice(timeReference);
    const hoursShort = hours.slice(timeReference);
    for (let i = 0; i < matchedWeatherHours.length; i += 1) {
      const weatherHours = document.createElement('li');
      weatherHours.innerHTML = `${hoursShort[i]}: ${Math.floor(matchedWeatherHours[i].temp_c)}<span>&deg;</span>c`;
      hourlyWeather.append(weatherHours);
    }
  }
}

// This is for building the cards for displaying the forecasted weather
// function forecastCards() {
//   const displayCards = document.getElementById('details-forecast');

// }