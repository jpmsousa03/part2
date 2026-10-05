import { useEffect, useState } from 'react'
import server from './countries'


const Filter = (props) => {
  return <div>
    find countries: <input value={props.newQuery} onChange={props.handleSetQuery} />
  </div>
}

const Country = (props) => {
  return <div>
    <h1>{props.country.name.common}</h1>
    <p>Capital: {props.country.capital}</p>
    <p>Area: {props.country.area}</p>
    <h2>Languages</h2>
    <ul>
      {console.log(props.country.languages)}
      {Object.values(props.country.languages).map((language) => { return <li key={language}>{language}</li> })}
    </ul>
    <img src={props.country.flags.png}></img>

    {props.weather ? (
      <div>
        <h2>Weather in {props.country.capital}</h2>
        <p>Temperature {props.weather.main.temp}</p>
        <img src={`https://openweathermap.org/img/wn/${props.weather.weather[0].icon}@2x.png`}></img>;
        <p>Wind {props.weather.wind.speed}</p>
      </div>) : null}
  </div>
}

const Countries = (props) => {
  if (props.query == "") {
    return
  }
  if (props.filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  if (props.filteredCountries.length == 1) {
    return <Country country={props.filteredCountries[0]} weather={props.weather}></Country>
  }
  return <div>
    {props.filteredCountries.map((country) => {

      return <div key={country.name.common}>
        <p> {country.name.common}<button onClick={() => props.showCountry(country.name.common)}>Show</button></p>
        {props.showCountriesList.includes(country.name.common) ? <Country country={country}></Country>: null}
      </div>
    })}
  </div>
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [newQuery, setNewQuery] = useState('')
  const [weather, setWeather] = useState(null)
  const [showCountries, setShowCountries] = useState([])
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(newQuery.toLowerCase().trim())
  )

  useEffect(() => {
    const eventHandler = response => {
      setCountries(response.data)
    }
    server.seeAll().then(eventHandler)
  }, [])

  useEffect(() => {
    if (filteredCountries.length === 1) {
      server
        .getWeather(filteredCountries[0].capital)
        .then((response) => {
          setWeather(response.data)
        })
    } else {
      setWeather(null)
    }
  }, [filteredCountries])


  function showCountry(name) {
    if (showCountries.includes(name)) {
      setShowCountries(showCountries.filter((n) => n != name))
    }
    else {
      setShowCountries([...showCountries, name])
    }

  }

  function handleSetQuery(event) {
    setNewQuery(event.target.value)
    if (event.target.value == ""){
      setShowCountries([])
    }
  }

  return (
    <div>
      <Filter newQuery={newQuery} handleSetQuery={handleSetQuery}></Filter>
      <Countries filteredCountries={filteredCountries} query={newQuery} showCountry={showCountry} showCountriesList={showCountries} weather={weather}></Countries>
    </div>
  )
}

export default App