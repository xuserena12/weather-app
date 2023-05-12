let apiKey = "660f24be76db5d928d110e857fd0fd6b";
let celcius = true;
const searchButton = document.querySelector('.search-button');
const switchUnit = document.querySelector('#unit-toggle');
const searchBar = document.querySelector('#search-bar');
let clicks = 0;
let currData;

function clearInput(){
  var getValue= document.getElementById("search-bar");
    if (getValue.value !="") {
        getValue.value = "";
    }
}


searchButton.addEventListener("click", function(event) {
  event.preventDefault();
  let city = document.getElementById("search-bar").value;
  console.log(city);
  getData(city);
  clearInput();
})

switchUnit.addEventListener("click",() => {
  if (clicks % 2 == 0) {
    switchUnit.innerHTML = "Change to °C";
    celcius = false;
    displayData(currData);
    clicks++;
  } else {
    switchUnit.innerHTML = "Change to °F";
    celcius = true;
    displayData(currData);
    clicks++;

  }
})

function getData(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`,
    { mode: "cors" }
  )
    .then((response) => response.json()) // convert data to json
    .then((data) => {
      if (data.cod === "404") {
        alert("City not found. Please enter a valid city!");
      } else {
        data = processData(data);
        currData = data;
        console.log(data);
        displayData(data);
      }
    });
}

function kelvinToCelcius(temp) {
  return Math.round(temp - 273.15);
}

function kelvinToFarenheight(temp) {
  return Math.round((kelvinToCelcius(temp) * 9) / 5 + 32);
}

// parse through data and return object with the info we want
function processData(data) {
  const reducedData = {
    city: data.name,
    country: data.sys.country,
    celciustemp: kelvinToCelcius(data.main.temp),
    farenheighttemp: kelvinToFarenheight(data.main.temp),
    celciusfeelslike: kelvinToCelcius(data.main.feels_like),
    farenheightfeelslike: kelvinToFarenheight(data.main.feels_like),
    humidity: data.main.humidity,
    windspeed: data.wind.speed,
    description: `${data.weather[0].description}`, 
  };
  return reducedData;
}

function displayData(data) {
  const temp = document.querySelector(".temperature");
  const desc = document.querySelector(".description");
  const location = document.querySelector(".location");
  const feelsLike = document.querySelector("#feels-like");
  const humidity = document.querySelector("#humidity");
  const windSpeed = document.querySelector("#windspeed");

  location.innerHTML = `<i class="bi bi-geo-alt"></i> ${data.city}, ${data.country}`;

  if (celcius) {
    temp.innerHTML = `${data.celciustemp} °C`;
    feelsLike.innerHTML = `<i class="bi bi-thermometer"></i>Feels like  ${data.celciusfeelslike} °C`;
  } else {
    temp.innerHTML = `${data.farenheighttemp} °F`;
    feelsLike.innerHTML = `<i class="bi bi-thermometer"></i> Feels like  ${data.farenheightfeelslike} °F`;
  }
  desc.innerHTML = data.description;
  windSpeed.innerHTML = `<i class="bi bi-wind"></i> Wind speed ${data.windspeed}`;
  humidity.innerHTML = `<i class="bi bi-droplet"></i> Humidity ${data.humidity}%`;
}

getData("Waterloo");