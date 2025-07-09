import axios from "axios";
const baseURL = 'http://localhost:3001/api/persons'

const getAll = () => {
    return axios.get(baseURL)
}

const create = newObject => {
    return axios.post(baseURL, newObject)
}

const update = (id, newObject) => {
    return axios.put(`${baseURL}/${id}`, newObject)
}

const erase = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
        return axios.delete(`${baseURL}/${person.id}`)
    }
}

export default {
    getAll: getAll,
    create: create,
    update: update,
    erase: erase
}
