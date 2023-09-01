/* eslint-disable no-use-before-define */
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
    navigator.geolocation.getCurrentPosition(localWeather, () => {
      noLocation(selectedCity)});
  } else {
    noLocation(selectedCity);
  }
}

function populateCityName(param) {
  const cityName = document.getElementById('location-name');
  const countryName = document.getElementById('country-name');
  cityName.innerText = `${param.location.name}, ${param.location.region}`;
  countryName.innerText = param.location.country;
}

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

// For a function when the user declines location.

const popularCities = [
  'Paris',
  'New York City',
  'Tokyo',
  'London',
  'Rome',
  'Istanbul',
  'Dubai',
  'Sydney',
  'Rio de Janeiro',
  'Hong Kong',
];

const randomCity = Math.floor(Math.random() * popularCities.length);
const selectedCity = popularCities[randomCity];
console.log(selectedCity);

async function noLocation(param) {
  try{
    const city = await fetch(`${apiUrl}&key=${url}q=${param}&days=3`, { mode: 'cors' });
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

const hourlyWeather = document.getElementById('hourly-weather');
const timeReference = getCurrentDate.getHours();
const hours = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];
let hourlyWeatherHours;
let nextDayHourlyWeather;

function addHourlyWeather(param) {
  const hourlyWeatherUpdates = param.forecast.forecastday[0].hour;
  if (timeReference <= hourlyWeatherUpdates.length && timeReference <= hours.length) {
    const matchedWeatherHours = hourlyWeatherUpdates.slice(timeReference);
    console.log(matchedWeatherHours);
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
  const icon = document.createElement('img');
  forecastDate.setAttribute('id', `dates-${i}`);
  highLowTemp.setAttribute('id', `temps-${i}`);
  icon.setAttribute('id', `weather-icon-${i}`);
  icon.classList.add('icon');
  cards.classList.add('card');
  cards.setAttribute('id', `box-${i}`);
  cards.append(forecastDate, icon, highLowTemp);
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
  const geoWeather = await fetch(`${apiUrl}&key=${url}q=${position.coords.latitude},${position.coords.longitude}&days=3`, { mode: 'cors' });
  const data = await geoWeather.json();
  populateCityName(data);
  addCurrentDetails(data);
  addHourlyWeather(data);
  displayForecast(data);
  forecastIcons(data);
}

const locationSearch = document.getElementById('location-search');

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

async function locationLookUp() {
  const location = locationSearch.value;
  const geoWeather = await fetch(`${apiUrl}&key=${url}q=${location}&days=3`, { mode: 'cors' });
  const data = await geoWeather.json();
  clearElements();
  populateCityName(data);
  addCurrentDetails(data);
  newLocationHourlyWeather(data);
  displayForecast(data);
  forecastIcons(data);
}

locationSearch.addEventListener('keydown', (e) => {
  if (e.code === 'Enter') {
    locationLookUp();
  }
});

function forecastIcons(param) {
  const weatherIconTomorrow = document.getElementById('weather-icon-0');
  const weatherIconTwoDays = document.getElementById('weather-icon-1');
  const futureConditionOne = param.forecast.forecastday[0].day.condition.text;
  const futureConditionTwo = param.forecast.forecastday[1].day.condition.text;
  switch (futureConditionOne) {
    case 'Sunny':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/113.png';
      break;
    case 'Partly cloudy':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/116.png';
      break;
    case 'Cloudy':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/119.png';
      break;
    case 'Overcast':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/122.png';
      break;
    case 'Mist':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/143.png';
      break;
    case 'Patchy rain possible':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/143.png';
      break;
    case 'Patchy snow possible':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/179.png';
      break;
    case 'Patchy sleet possible':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/182.png';
      break;
    case 'Patchy freezing drizzle possible':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/185.png';
      break;
    case 'Thundery outbreaks possible':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/200.png';
      break;
    case 'Blowing snow':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/227.png';
      break;
    case 'Blizzard':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/230.png';
      break;
    case 'Fog':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/248.png';
      break;
    case 'Freezing fog':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/260.png';
      break;
    case 'Patchy light drizzle':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/263.png';
      break;
    case 'Light drizzle':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/266.png';
      break;
    case 'Freezing drizzle':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/281.png';
      break;
    case 'Heavy freezing drizzle':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/284.png';
      break;
    case 'Patchy light rain':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/293.png';
      break;
    case 'Light rain':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/296.png';
      break;
    case 'Moderate rain at times':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/299.png';
      break;
    case 'Moderate rain':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/302.png';
      break;
    case 'Heavy rain at times':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/305.png';
      break;
    case 'Heavy rain':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/308.png';
      break;
    case 'Light freezing rain':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/311.png';
      break;
    case 'Moderate or heavy freezing rain':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/314.png';
      break;
    case 'Light sleet':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/317.png';
      break;
    case 'Moderate or heavy sleet':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/320.png';
      break;
    case 'Patchy light snow':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/323.png';
      break;
    case 'Light snow':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/326.png';
      break;
    case 'Patchy moderate snow':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/329.png';
      break;
    case 'Moderate snow':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/332.png';
      break;
    case 'Patchy heavy snow':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/335.png';
      break;
    case 'Heavy snow':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/338.png';
      break;
    case 'Ice pellets':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/350.png';
      break;
    case 'Light rain shower':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/353.png';
      break;
    case 'Moderate or heavy rain shower':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/356.png';
      break;
    case 'Torrential rain shower':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/359.png';
      break;
    case 'Light sleet showers':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/362.png';
      break;
    case 'Moderate or heavy sleet showers ':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/365.png';
      break;
    case 'Light snow showers':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/368.png';
      break;
    case 'Moderate or heavy snow showers':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/371.png';
      break;
    case 'Light showers with ice pellets':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/374.png';
      break;
    case 'Moderate or heavy showers of ice pellets':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/377.png';
      break;
    case 'Patchy light rain with thunder':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/386.png';
      break;
    case 'Moderate of heavy rain with thunder':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/389.png';
      break;
    case 'Patchy light snow with thunder':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/392.png';
      break;
    case 'Moderate or heavy snow with thunder':
      weatherIconTomorrow.src = 'imgs/weather_icons/day/395.png';
      break;
    default:
      alert.error('Forecast icon for tomorrow is unavailable! :(');
  }
  switch (futureConditionTwo) {
    case 'Sunny':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/113.png';
      break;
    case 'Partly cloudy':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/116.png';
      break;
    case 'Cloudy':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/119.png';
      break;
    case 'Overcast':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/122.png';
      break;
    case 'Mist':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/143.png';
      break;
    case 'Patchy rain possible':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/143.png';
      break;
    case 'Patchy snow possible':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/179.png';
      break;
    case 'Patchy sleet possible':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/182.png';
      break;
    case 'Patchy freezing drizzle possible':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/185.png';
      break;
    case 'Thundery outbreaks possible':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/200.png';
      break;
    case 'Blowing snow':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/227.png';
      break;
    case 'Blizzard':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/230.png';
      break;
    case 'Fog':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/248.png';
      break;
    case 'Freezing fog':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/260.png';
      break;
    case 'Patchy light drizzle':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/263.png';
      break;
    case 'Light drizzle':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/266.png';
      break;
    case 'Freezing drizzle':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/281.png';
      break;
    case 'Heavy freezing drizzle':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/284.png';
      break;
    case 'Patchy light rain':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/293.png';
      break;
    case 'Light rain':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/296.png';
      break;
    case 'Moderate rain at times':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/299.png';
      break;
    case 'Moderate rain':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/302.png';
      break;
    case 'Heavy rain at times':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/305.png';
      break;
    case 'Heavy rain':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/308.png';
      break;
    case 'Light freezing rain':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/311.png';
      break;
    case 'Moderate or heavy freezing rain':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/314.png';
      break;
    case 'Light sleet':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/317.png';
      break;
    case 'Moderate or heavy sleet':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/320.png';
      break;
    case 'Patchy light snow':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/323.png';
      break;
    case 'Light snow':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/326.png';
      break;
    case 'Patchy moderate snow':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/329.png';
      break;
    case 'Moderate snow':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/332.png';
      break;
    case 'Patchy heavy snow':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/335.png';
      break;
    case 'Heavy snow':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/338.png';
      break;
    case 'Ice pellets':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/350.png';
      break;
    case 'Light rain shower':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/353.png';
      break;
    case 'Moderate or heavy rain shower':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/356.png';
      break;
    case 'Torrential rain shower':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/359.png';
      break;
    case 'Light sleet showers':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/362.png';
      break;
    case 'Moderate or heavy sleet showers ':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/365.png';
      break;
    case 'Light snow showers':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/368.png';
      break;
    case 'Moderate or heavy snow showers':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/371.png';
      break;
    case 'Light showers with ice pellets':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/374.png';
      break;
    case 'Moderate or heavy showers of ice pellets':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/377.png';
      break;
    case 'Patchy light rain with thunder':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/386.png';
      break;
    case 'Moderate of heavy rain with thunder':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/389.png';
      break;
    case 'Patchy light snow with thunder':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/392.png';
      break;
    case 'Moderate or heavy snow with thunder':
      weatherIconTwoDays.src = 'imgs/weather_icons/day/395.png';
      break;
    default:
      alert.error('Forecast icon for two days from now is unavailable! :(');
  }
}

// This is for the buttons that will change between the current details and the forecast.
const detailsDisplay = document.getElementById('details');
const forecastDisplay = document.getElementById('forecast');

function showCurrentDetails() {
  detailsDisplay.style.display = 'flex';
  forecastDisplay.style.display = 'none';
}

function showForecast() {
  detailsDisplay.style.display = 'none';
  forecastDisplay.style.display = 'flex';
}

getLocation();
