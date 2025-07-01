import axios from "axios";
const baseURL = 'https://studies.cs.helsinki.fi/restcountries/'
const api_key = import.meta.env.VITE_API

const getAll = () => {
    return axios
        .get(`${baseURL}/api/all`)
        .then(response => response.data)
}

const getWeather = country => {
    return axios
        .get(`http://api.weatherapi.com/v1/current.json?q=${country.capital}&key=${api_key}`)
        .then(response => response.data)
}

export default {
    getAll: getAll,
    getWeather: getWeather
}
