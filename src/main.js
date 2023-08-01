const x = document.getElementById('main');
// const api_url = 'http://api.weatherapi.com/v1/forecast.json?key=63d73608c67941668ae115410233107&q=&days=5';


// getWeather(api_url);



async function getLocalWeather(position) {
  const geoWeather = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=63d73608c67941668ae115410233107&q=${position.coords.latitude},${position.coords.longitude}&days=3`, { mode: 'cors' });
  const data = await geoWeather.json();
  console.log(data);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getLocalWeather);
  } else {
    x.innerHTML = 'Geolocation is not supported by this browser';
  }
}

getLocation();

/* Main variable for the functions */
async function getWeather(url) {
  const response = await fetch(url, {mode: 'cors'});
  const data = await response.json();
  console.log(data);
}

// mainWeatherLocation.innerText=response.main.temp
