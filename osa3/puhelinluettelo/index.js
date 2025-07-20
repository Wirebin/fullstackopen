require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())

morgan.token('postbody', function(req) { 
	return JSON.stringify(req.body) 
})
app.use((request, response, next) => {
	request.method === 'POST'
		? morgan(':method :url :status :res[content-length] - :response-time ms :postbody')(request, response, next)
		: morgan('tiny')(request, response, next)
})

app.get('/api/persons', (request, response, next) => {
	Person.find()
		.then(people => response.json(people))
		.catch(err => next(err))
})

app.get('/api/persons/:id', (request, response, next) => {
	const id = request.params.id

	Person.findById(id)
		.then(person => {
			console.log(`${person}`)
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch(err => next(err))
})

app.get('/info', (request, response, next) => {
	const date = new Date()
	Person.countDocuments()
		.then(count => {
			response.send(`
			<p>
				Phonebook has info for ${count} people
			</p>
			<p>
				${date}
			</p>`)
		})
		.catch(err => next(err))
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	Person.findOne({ name: body.name })
		.then(person => {
			if (person) {
				return response.status(204).end()
			}
	
			const newPerson = new Person({
				name: body.name,
				number: body.number
			})

			newPerson.save()
				.then(savedPerson => response.json(savedPerson))
				.catch(err => next(err))
		})
		.catch(err => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
	const id = request.params.id
	const body = request.body
	
	Person.findById(id)
	.then(person => {
		if (!person) {
			return response.status(404).end()
		}

		person.name = body.name
		person.number = body.number

		return person.save().then((updatedPerson => {
			response.json(updatedPerson)
		}))
	})
	.catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
	const id = request.params.id

	Person.findByIdAndDelete(id)
		.then(() => {
			console.log(`${id} deleted.`)
			response.status(204).end()
		})
		.catch(err => next(err))
})

// Error Handling
const errorHandler = (error, request, response, next) => {
	console.error(`${error.message}`)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		errors = {}
		for (const err in error.errors) {
			errors[err] = error.errors[err].message
		}
		return response.status(400).json({ errors })
	}

	next(error)
}
app.use(errorHandler)

// Listening
const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
