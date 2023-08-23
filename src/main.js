const apiUrl = 'http://api.weatherapi.com/v1/forecast.json?';
// eslint-disable-next-line no-undef
const url = config.MY_Key;

// This is for the DOM elements.
const weekday = document.getElementById('day-of-week');
const dateDisplay = document.getElementById('date');
const displayTime = document.getElementById('time');

function getTime() {
  const getCurrentTime = new Date();
  const currentTime = getCurrentTime.toLocaleTimeString('default', {
    hour: 'numeric', minute: '2-digit', hour12: 'true',
  });
  displayTime.innerText = currentTime;
}

const getCurrentDate = new Date();
const longDate = getCurrentDate.toLocaleString('default', { month: 'long', day: '2-digit', year: 'numeric' });
const longDay = getCurrentDate.toLocaleDateString('default', { weekday: 'long' });
weekday.innerText = longDay;
dateDisplay.innerText = longDate;

function updateTimeAndDate() {
  setInterval(getTime, 1000);
}

updateTimeAndDate();

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(localWeather);
    
  } else {
    // x.innerHTML = 'Geolocation is not supported by this browser';
  }
}

function populateCityName(param) {
  const cityName = document.getElementById('location-name');
  const countryName = document.getElementById('country-name');
  cityName.innerText = `${param.location.name}, ${param.location.region}`;
  countryName.innerText = param.location.country;
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

function displayCurrentDetails() {
  const display = document.getElementById('details');
  for (let i = 0; i < 3; i += 1) {
    const createCards = document.createElement('div');
    display.append(createCards);
    createCards.classList.add('card');
    createCards.setAttribute('id', i);
  }
}

displayCurrentDetails();

// This is for the card that displays the high and low temps. //
const highestTemp = document.createElement('p');
const lowestTemp = document.createElement('p');

function addTempDetails(param) {
  const temps = document.getElementById('0');
  temps.append(highestTemp, lowestTemp);
  highestTemp.innerHTML = `High: ${Math.floor(param.forecast.forecastday[0].day.maxtemp_c)}<span>&deg;</span>c`;
  lowestTemp.innerHTML = `Low: ${Math.floor(param.forecast.forecastday[0].day.mintemp_c)}<span>&deg;</span>c`;
}

// This is for the wind details card //
const windNormal = document.createElement('p');
const windGust = document.createElement('p');
const windDirection = document.createElement('p');

function addWindDetails(param) {
  const wind = document.getElementById('1');
  wind.append(windNormal, windDirection, windGust);
  windNormal.innerText = `Wind: ${Math.floor(param.current.wind_kph)} kph`;
  windDirection.innerText = param.current.wind_dir;
  windGust.innerText = `Gusting: ${Math.floor(param.current.gust_kph)} kph`;
}

// This is for the card that displays further details, such as humidity, visibility, and UV scale.
const ultraViolet = document.createElement('p');
const visibility = document.createElement('p');
const humidity = document.createElement('p');

function addFurtherDetails(param) {
  const detailsDisplay = document.getElementById('2');
  detailsDisplay.append(ultraViolet, visibility, humidity);
  ultraViolet.innerText = `UV Index: ${param.current.uv}`;
  visibility.innerText = `Visibility: ${param.current.vis_km} km`;
  humidity.innerText = `Humidity: ${param.current.humidity}`;
}

function addCurrentDetails(param) {
  currentConditions(param);
  addFurtherDetails(param);
  addTempDetails(param);
  addWindDetails(param);
}

// This is for the hourly weather creation //

const hourlyWeather = document.getElementById('hourly-weather');
const timeReference = getCurrentDate.getHours();
const hours = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];
let hourlyWeatherHours;
let nextDayHourlyWeather;

function addHourlyWeather(param) {
  const hourlyWeatherUpdates = param.forecast.forecastday[0].hour;
  if (timeReference <= hourlyWeatherUpdates.length && timeReference <= hours.length) {
    const matchedWeatherHours = hourlyWeatherUpdates.slice(timeReference);
    const hoursShort = hours.slice(timeReference);
    for (let i = 0; i < matchedWeatherHours.length; i += 1) {
      hourlyWeatherHours = document.createElement('li');
      hourlyWeatherHours.innerHTML = `${hoursShort[i]}: ${Math.floor(matchedWeatherHours[i].temp_c)}<span>&deg;</span>c`;
      hourlyWeather.append(hourlyWeatherHours);
    }
  }
  for (let o = 0; hours.length > o; o += 1) {
    nextDayHourlyWeather = document.createElement('li');
    nextDayHourlyWeather.innerHTML = `${hours[o]}: ${Math.floor(param.forecast.forecastday[1].hour[o].temp_c)}<span>&deg;</span>c`;
    hourlyWeather.append(nextDayHourlyWeather);
  }
}

// This is for displaying the date in the forecast cards //
const futureDate = new Date(getCurrentDate);

function futureDates(date, num) {
  const daysToAdd = num;
  date.setDate(date.getDate() + daysToAdd);
  return date.toLocaleDateString('default', { month: 'long', day: 'numeric' });
}

const oneDay = futureDates(futureDate, 1);
const twoDay = futureDates(futureDate, 1);

// This is for building the cards for displaying the forecasted weather //
const displayCards = document.getElementById('forecast');
for (let i = 0; i <= 1; i += 1) {
  const cards = document.createElement('div');
  const forecastDate = document.createElement('p');
  const highLowTemp = document.createElement('p');
  forecastDate.setAttribute('id', `dates-${i}`);
  highLowTemp.setAttribute('id', `temps-${i}`);
  cards.classList.add('card');
  cards.setAttribute('id', `box-${i}`);
  cards.append(forecastDate, highLowTemp);
  displayCards.append(cards);
}

const forecastDateOne = document.getElementById('dates-0');
const forecastDateTwo = document.getElementById('dates-1');

forecastDateOne.innerText = oneDay;
forecastDateTwo.innerText = twoDay;

function displayForecast(param) {
  const forecastOne = document.getElementById('box-0');
  const forecastTwo = document.getElementById('box-1');
  const highForecastTemp = [];
  const lowForecastTemp = [];
  const tempsOne = document.getElementById('temps-0');
  const tempsTwo = document.getElementById('temps-1');
  for (let i = 1; i <= 2; i += 1) {
    const highTemp = Math.floor(param.forecast.forecastday[i].day.maxtemp_c);
    const lowTemp = Math.floor(param.forecast.forecastday[i].day.mintemp_c);
    highForecastTemp.push(highTemp);
    lowForecastTemp.push(lowTemp);
  }
  tempsOne.innerHTML = `High: ${highForecastTemp[0]}<span>&deg;</span>c Low: ${lowForecastTemp[0]}<span>&deg;</span>c`;
  tempsTwo.innerHTML = `High: ${highForecastTemp[1]}<span>&deg;</span>c Low: ${lowForecastTemp[1]}<span>&deg;</span>c`;
  forecastOne.appendChild(tempsOne);
  forecastTwo.appendChild(tempsTwo);
}

async function localWeather(position) {
  const geoWeather = await fetch(`${apiUrl}&key=${url}q=${position.coords.latitude},${position.coords.longitude}&days=4`, { mode: 'cors' });
  const data = await geoWeather.json();
  console.log(data);
  populateCityName(data);
  addCurrentDetails(data);
  addHourlyWeather(data);
  displayForecast(data);
}

// TO DO TOMORROW AUGUST 21 ST
// Fix bug with duping displaying data. Hourly and details weather are duplicating.

const locationSearch = document.getElementById('location-search');

async function locationLookUp() {
  const location = locationSearch.value;
  const geoWeather = await fetch(`${apiUrl}&key=${url}q=${location}&days=3`, { mode: 'cors' });
  const data = await geoWeather.json();
  console.log(data);
  clearElements();
  populateCityName(data);
  addCurrentDetails(data);
  newLocationHourlyWeather(data);
  displayForecast(data);
}

locationSearch.addEventListener('keydown', (e) => {
  if (e.code === 'Enter') {
    locationLookUp();
  }
});

function clearElements() {
  hourlyWeather.innerHTML = '';
}

function newLocationHourlyWeather(param) {
  const hourlyWeatherUpdates = param.forecast.forecastday[0].hour;
  if (timeReference <= hourlyWeatherUpdates.length && timeReference <= hours.length) {
    const matchedWeatherHours = hourlyWeatherUpdates.slice(timeReference);
    const hoursShort = hours.slice(timeReference);
    for (let i = 0; i < matchedWeatherHours.length; i += 1) {
      hourlyWeatherHours = document.createElement('li');
      hourlyWeatherHours.innerHTML = `${hoursShort[i]}: ${Math.floor(matchedWeatherHours[i].temp_c)}<span>&deg;</span>c`;
      hourlyWeather.append(hourlyWeatherHours);
    }
  }
  for (let o = 0; hours.length > o; o += 1) {
    nextDayHourlyWeather = document.createElement('li');
    nextDayHourlyWeather.innerHTML = `${hours[o]}: ${Math.floor(param.forecast.forecastday[1].hour[o].temp_c)}<span>&deg;</span>c`;
    hourlyWeather.append(nextDayHourlyWeather);
  }
}
