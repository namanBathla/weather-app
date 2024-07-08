const apiKey = "7b8677daddbea75f506a42ccbbbd0cd6";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
const forecastBaseUrl = "https://api.openweathermap.org/data/2.5/forecast?";

const arrowBtn = document.querySelector("#button-box");
const defaultTemp = document.querySelector('#default-temp');


// const egUrl = "https://api.openweathermap.org/data/2.5/weather?q={city}&appid={apiKey}&units=metric";

const searchMessage = document.querySelector('#search-msg');
searchMessage.style.display = 'block';

async function getDefaultTemperature(){
    const city = 'New Delhi';
    const url = baseUrl + `q=${city}` + `&appid=${apiKey}` + "&units=metric";

    const response = await fetch(url);
    let data = await response.json();
    defaultTemp.innerText = data.main.temp + "°C";
    
    // console.log(data);
    // console.log(data.main.temp);
    // getForecast(city);
}

arrowBtn.addEventListener('click', gotoWeatherTab);

function gotoWeatherTab(){
    window.location.href = "#weather-section";
    // window.location.replace("./weather.html");   // does not create a link between the two pages
}

// call to get the default temperature
getDefaultTemperature();


const cities = document.querySelectorAll('.city');
const temperatures = document.querySelectorAll('.temperature');
const humidity = document.querySelector('#humidity');
const windSpeed = document.querySelector('#wind-speed');
const getWeatherBtn = document.querySelector('#search-weather-btn');
const cityInputField = document.querySelector('#city-for-weather');
const weatherDetails = document.querySelector('#weather-details');
const date = document.querySelector('#current-date');


getWeatherBtn.addEventListener('click', () => {
    let c = cityInputField.value.trim();
    getTemperature(c);
    setCurrentDate();
    getForecast(c);
    weatherDetails.style.display = 'flex';
});

// getTemperature("New Delhi");
function getCurrentDate(){
    return (new Date().toLocaleDateString());
}

function setCurrentDate(){
    date.innerText = getCurrentDate();
}

async function getTemperature(inputCity){
    const url = baseUrl + `q=${inputCity}` + `&appid=${apiKey}` + "&units=metric";

    const response = await fetch(url);
    let data = await response.json();

    if(inputCity == "" || data.cod == 404){
        cities.forEach((city) => {
            city.innerText = "INVALID LOCATION";
        })
        temperatures.forEach((tem) => {
            tem.innerText = "- °C"
        });
        humidity.innerText = "- %";
        windSpeed.innerText = "- Km/h";
        alert("Please enter a valid location");
    }
    else{
        const country = data.sys.country;
        cities.forEach((city) => {
            city.innerText = capitalize(inputCity) + `,${country}`;
        });
        // city.innerText = capitalize(inputCity);
        temperatures.forEach((tem) => {
            tem.innerText = data.main.temp + "°C"
        });
        humidity.innerText = data.main.humidity + "%";
        windSpeed.innerText = data.wind.speed + " Km/h";
    }
}

function capitalize(input) {  
    var words = input.split(' ');  
    var capitalizedWords = [];  
    words.forEach(element => { 
        // converting to sentence case
        let temp = element[0].toUpperCase();
        element.slice(1, element.length).split().forEach((letter) => {
            temp += letter.toLowerCase();
        }) 
        capitalizedWords.push(temp);
    });  
    return capitalizedWords.join(' ');  
}  

// --------------------------- Navbar -----------------------------------------------
const toggleBtn = document.querySelector('#sidebar-toggle-btn');
const closeButton = document.querySelector('#close-sidebar-btn');
const sidebar = document.querySelector('#sidebar');

function showSidebar(){
    sidebar.style.left = '0';
    toggleBtn.style.visibility = 'hidden';
}

function hideSidebar(){
    sidebar.style.left = '-100%';
    toggleBtn.style.visibility = 'visible';
}

toggleBtn.addEventListener('click', showSidebar);
closeButton.addEventListener('click', hideSidebar);


// ------------------------------ FORECAST ----------------------------------------------------

async function getForecast(cityName){

    const url = forecastBaseUrl + `q=${cityName}` + `&appid=${apiKey}` +  '&units=metric';
    // const URL = "https://api.openweathermap.org/data/2.5/forecast?q=new%20delhi&appid=7b8677daddbea75f506a42ccbbbd0cd6&units=metric"
    let response = await fetch(url);
    let data = await response.json();

    // data.list.dt_txt --> convert to date using new Date() --> include in Days if not included
    // days array to store next 5 dates if not already stored
    let Days = [];
    let forecastObjects = data.list;

    const forecastDetailsBox = document.querySelector('#forecast-details');

    // removing previously added forecast details
    while (forecastDetailsBox.firstChild) {
        forecastDetailsBox.removeChild(forecastDetailsBox.lastChild);
      }

      // the first date in object at midnight is previous date
    const firstDateInObject = forecastObjects[0].dt_txt;
    const d = new Date(firstDateInObject);
    console.log(d.toLocaleDateString());
    forecastObjects.forEach((obj) => {
        const tempDate = new Date(obj.dt_txt).toLocaleDateString();

        // if date is not included, and not the first date in object include it and create a forecast object corresponding to that date
        if(!Days.includes(tempDate) && tempDate !== d.toLocaleDateString()){
            Days.push(tempDate);

            // SYNTAX --> createForecastItem(date, temp, weather desc, weather icon)
            createForecastItem(tempDate, obj.main.temp, obj.weather[0].main, obj.weather[0].icon.slice(0,2) + 'd');
            // converted weather icon from n (night) to d (day)
        }
    });
    // console.log(Days);
}


function getImageURL(code){
    // get openWeatherMap weather icon using url
    const imageBaseUrl = "https://openweathermap.org/img/wn/";
    
    // const EGimageBaseUrl = "https://openweathermap.org/img/wn/10d@2x.png"
    const imageUrl = imageBaseUrl + code + "@2x.png";
    return imageUrl;
}

function createForecastItem(date, temp, desc, imgCode){
    // creating elements for date, temp, icon and desc

    // this is main forecast container
    
    const forecastDetailsBox = document.querySelector('#forecast-details');
    const forecastItem = document.createElement('div');
    const forecastDate = document.createElement('div');
    const forecastTemperature = document.createElement('div');
    const weatherConditionIcon = document.createElement('img');
    const forecastDescription = document.createElement('div');

    // change display from none to flex
    forecastDetailsBox.style.display = 'flex';
    forecastItem.setAttribute('class', 'forecast-item blur');
    forecastDate.innerText = date;
    forecastTemperature.innerText = temp + '°C';
    weatherConditionIcon.setAttribute('src', getImageURL(imgCode));
    forecastDescription.innerText = desc;

    forecastItem.appendChild(forecastDate);
    forecastItem.appendChild(forecastTemperature);
    forecastItem.appendChild(weatherConditionIcon);
    forecastItem.appendChild(forecastDescription);

    forecastDetailsBox.appendChild(forecastItem);

    searchMessage.style.display = 'none';
}

function createTempItem(date, time, temp, imgCode){
    const parentDiv = document.createElement('div');
    const dateDiv = document.createElement('div');
    const timeDiv = document.createElement('div');
    const tempDiv = document.createElement('div');
    const conditionImg = document.createElement('img');

    tempDiv.innerText = temp;
    dateDiv.innerText = date;
    timeDiv.innerText = time;
    conditionImg.setAttribute('src', getImageURL(imgCode));

    parentDiv.appendChild(tempDiv);
    parentDiv.appendChild(tempDiv);
    parentDiv.appendChild(tempDiv);
    parentDiv.appendChild(tempDiv);
}


// EmailJS setup
const contactForm = document.querySelector('#contact-form');
const SendBtn = document.querySelector('#send-btn');
const nameInput = document.querySelector('#user-name');
const emailInput = document.querySelector('#user-email');
const messageInput = document.querySelector('#user-message');

const emailPublicKey = "RftnEOIC0hdvbemP8";
const emailServiceId = "service_1kzw2fh";
const emailTemplateId = "template_1nzds9s";

emailjs.init(emailPublicKey);

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const contactFormValues = {
        from_name: nameInput.value,
        from_email: emailInput.value,
        message: messageInput.value,
    }

    emailjs.send(emailServiceId, emailTemplateId, contactFormValues)
    .then(() => {
        // clear all input fields
        nameInput.value = "";
        emailInput.value = "";
        messageInput.value = "";
        alert("Message sent succesfully...");
        console.log("Message sent succesfully...")
        console.log(contactFormValues);
    }, (error) => {
        console.log("Failed...", error);
    })
});

