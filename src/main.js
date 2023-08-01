const x = document.getElementById('main');
const apiUrl = 'http://api.weatherapi.com/v1/forecast.json?key=63d73608c67941668ae115410233107&';

async function localWeather(position) {
  const geoWeather = await fetch(`${apiUrl}q=${position.coords.latitude},${position.coords.longitude}&days=3`, { mode: 'cors' });
  const data = await geoWeather.json();
  console.log(data);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(localWeather);
  } else {
    x.innerHTML = 'Geolocation is not supported by this browser';
  }
}

getLocation();
