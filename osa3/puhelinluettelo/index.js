const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('postbody', function(req) { 
	return JSON.stringify(req.body) 
})
app.use((request, response, next) => {
	request.method === 'POST'
		? morgan(':method :url :status :res[content-length] - :response-time ms :postbody')(request, response, next)
		: morgan('tiny')(request, response, next)
})

let numbers = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456"
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523"
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345"
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122"
	}
]

app.get('/api/persons', (request, response) => {
	response.json(numbers)
})

app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id
	const number = numbers.find(number => number.id === id)

	if (number) {
		response.json(number)
	} else {
		response.status(404).end()
	}
})

app.get('/info', (request, response) => {
	const date = new Date()
	response.send(`
		<p>
			Phonebook has info for ${numbers.length} people
		</p>
		<p>
			${date}
		</p>`)
})

app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.name) {
		return response.status(400).json({
			error: 'name missing'
		})
	}
	if (!body.number) {
		return response.status(400).json({
			error: 'number missing'
		})
	}
	if (numbers.find(person => person.name === body.name)) {
		return response.status(400).json({
			error: 'name must be unique'
		})
	}

	const number = {
		id: Math.floor(Math.random() * (1000000 - 1) + 1).toString(),
		name: body.name,
		number: body.number
	}
	
	numbers = numbers.concat(number)
	response.json(number)
})

app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id
	numbers = numbers.filter(number => number.id !== id)
	console.log(numbers)
	response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})