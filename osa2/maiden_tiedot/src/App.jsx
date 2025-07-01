import { useState } from 'react'
import { useEffect } from 'react'
import countryService from './services/countries'

const CountryInfo = (props) => {
  const country = props.country[0]
  const weather = props.weather

  useEffect(() => {
    countryService.getWeather(country)
      .then(data => {
        props.setWeather(data)
      })
  }, [])

  if (weather.length != 0) {
    return (
      <>
        <h1>{country.name.common}</h1>
        <div>Capital: {country.capital}</div>
        <div>Area: {country.area}</div>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(language => 
            <li key={language}>
              {language}
            </li>
          )}
        </ul>
        <img src={country.flags.png} />
        <h2>Weather in {country.name.common}</h2>
        <span>{weather.current.condition.text}</span><br />
        <span>Temperature: {weather.current.temp_c} Celcius</span><br />
        <span>Humidity: {weather.current.humidity}%</span><br />
        <span>Wind: {weather.current.wind_kph} km/h | {Math.round((weather.current.wind_kph*(5/18)) * 10) / 10} m/s</span>
      </>
    )
  }
  return (
    <div>Loading weather...</div>
  )
}

const SearchResults = (props) => {
  const search = props.search
  const setSearch = props.setSearch
  const searchResults = props.searchResults

  const onShowCountry = (country) => {
    setSearch(country.name.common)
  }

  if (search.length === 0) return null

  if (searchResults.length === 0) return <div>No results...</div>

  if (searchResults.length > 10) return <div>Too many matches, specify another filter</div> 

  if (searchResults.length > 1) {
    return searchResults.map(country => (
      <div key={country.cca2}>
        {`${country.name.common} `}
        <button onClick={() => onShowCountry(country)}>Show</button>
      </div>
    ))
  }

  return (
    <CountryInfo country={searchResults} weather={props.weather} setWeather={props.setWeather} />
  )
}

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState([])

  const handleSearchChange = event => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    countryService
      .getAll()
      .then(response => {
        setCountries(response)
      })
  }, [])

  const filteredCountries = countries.filter(country => country.name.common?.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <span>find countries </span>
      <input placeholder='Search for a country...' value={search} onChange={handleSearchChange} />
      <SearchResults search={search} setSearch={setSearch} searchResults={filteredCountries} weather={weather} setWeather={setWeather} />
    </>
  )
}

export default App
