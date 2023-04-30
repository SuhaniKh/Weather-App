const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const searchform = document.querySelector(".form-container");
const grantAccess = document.querySelector(".grant-location-container");
const weatherinfo = document.querySelector(".weather-info");
const loading = document.querySelector(".loading");
const grantAccessBtn = document.querySelector("[data-grant-access]");


//initially :

let currTab = userTab;
currTab.classList.add("current-tab");
const API_key = "baf14898417c272f8ab623663826be4b";
getfromsessionStorage();

//event listner on grantAccess button :

grantAccessBtn.addEventListener("click",getLocation);

//get location of the user :

function getLocation(){
    // console.log(navigator.getLocation.getCurrentPosition(showPosition));
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("no geolocation support");
    }
}

function showPosition(position){
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    sessionStorage.setItem("user-coordinate",JSON.stringify({lat,lon}));

    fetchWeatherInfo({lat,lon});
}

//render the weather data on the UI screen :

function renderWeatherInfo(data){
    const city = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDescription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");

    //fetch data from the API call JSON object 

    city.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °K`;
    windspeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity} %`;
    clouds.innerText =`${data?.clouds?.all} %`;
}   

//fetch weather information :

async function fetchWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    grantAccess.classList.remove("active");
    loading.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data = await response.json();
        loading.classList.remove("active");
        weatherinfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        console.log("error");
        loading.classList.remove("active");
    }
}

// from session storage :

function getfromsessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        grantAccess.classList.add("active");
    }

    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
}

//switching the tabs between your weather and search city weather

function switchTab(clickedTab){
    if(currTab==clickedTab) return;

    currTab.classList.remove("current-tab");
    currTab = clickedTab;
    currTab.classList.add("current-tab");

    if(!searchform.classList.contains("active")){
        //this means search weather tab was clicked :
        grantAccess.classList.remove("active");
        weatherinfo.classList.remove("active");
        searchform.classList.add("active");
    }

    else{
        weatherinfo.classList.remove("active");
        searchform.classList.remove("active");
        getfromsessionStorage();
    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

//fetch the weather details from the city name :

async function fetchSearchWeatherInfo(city){
    loading.classList.add("active");
    weatherinfo.classList.remove("active");
    grantAccess.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
        const data = await response.json();
        console.log(data);
        loading.classList.remove("active");
        renderWeatherInfo(data);
        weatherinfo.classList.add("active");
    }

    catch(err){
        console.log("error");
        loading.classList.remove("active");
    }
}

//Search Input Tab :

const searchInput = document.querySelector("[data-searchInput]");

searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    console.log(e);
    console.log(searchInput.value);
    let city = searchInput.value;

    if(city==="")   return;

    fetchSearchWeatherInfo(city);
})
