import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

const seeAll = () => {
  return axios.get(baseUrl+"/all")
}

const getWeather = (city) => {
  return axios.get(
    `${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`
  )
}

export default { 
  seeAll: seeAll,
  getWeather: getWeather
}