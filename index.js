const date = document.getElementById('date');
const city = document.getElementById('city');
const temp = document.getElementById('temp');
const tempImg = document.getElementById('tempImg');
const description = document.getElementById('description');
const tempMax = document.getElementById('tempMax');
const tempMin = document.getElementById('tempMin');


const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const dateObj = new Date()

const month = months[dateObj.getUTCMonth()];
const day = dateObj.getUTCDay()-1;
const year = dateObj.getUTCFullYear()

date.innerHTML = `${month} ${day}, ${year}`

const app = document.getElementById('app');

const getWeather = async ()=>{
    const apiKey ="82c8b287d4cb4fc951a1e0878bcbc828"
    const cityName = document.getElementById('searchBarInput').value || "London";

    try {
        const  weatherDataFetch = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`,{
            headerrs:{
                Accept: "application/json"
            }
        });
     const weatherData=  await weatherDataFetch.json();

     console.log(weatherData)

     city.innerHTML = `${weatherData.name}`;
     description.innerHTML = `${weatherData.weather[0].main}`;
    tempImg.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" />`
    temp.innerHTML= `<h2>${Math.round(weatherData.main.temp)}°C </h2>`;
    tempMax.innerHTML= `${weatherData.main.temp_max}°C`;
    tempMin.innerHTML= `${weatherData.main.temp_min}°C`;
    
    } catch (error) {
        console.log(error);
        
    }

}

getWeather()