const buttons = document.getElementsByClassName("titles");
const menuArr = [];
const titleIDs = [
  {
    paraID: "CurrentConditions",
    displayID: "details",
  },
  {
    paraID: "HourlyTemperatures",
    displayID: "hourly-weather",
  },
  {
    paraID: "FutureForecast",
    displayID: "forecast",
  },
];

for (const child of buttons[0].children) {
  menuArr.push(child);
}

for (let i = 0; i < menuArr.length; i += 1) {
  menuArr[i].setAttribute("id", titleIDs[i].paraID);
}

const hourly = document.getElementById("hourly-weather");
const forecastDisplay = document.getElementById("forecast");
const cC = document.getElementById("details");

function changeDisplay(div) {
  cC.style.display = "flex";
  switch (div) {
    case hourly:
      hourly.style.display = "flex";
      forecastDisplay.style.display = "none";
      cC.style.display = "none";
      break;
    case forecastDisplay:
      hourly.style.display = "none";
      forecastDisplay.style.display = "flex";
      cC.style.display = "none";
      break;
    case cC:
      hourly.style.display = "none";
      forecastDisplay.style.display = "none";
      cC.style.display = "flex";
      break;
    default:
      cC.style.display = "flex";
  }
}

const conditionsButton = document.getElementById("CurrentConditions");
const hourlyButton = document.getElementById("HourlyTemperatures");
const forecastButton = document.getElementById("FutureForecast");

conditionsButton.onclick = () => changeDisplay(cC);
hourlyButton.onclick = () => changeDisplay(hourly);
forecastButton.onclick = () => changeDisplay(forecastDisplay);

console.log(menuArr);
// console.log(notThisVar);
