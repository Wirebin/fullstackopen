const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log(`Connecting to ${url}`)
mongoose.connect(url)
	.then(() => {
		console.log('Connected to MongoDB')
	})
	.catch(error => {
		console.log(`Failed to connect to MongoDB, ${error.message}`)
	})

const personSchema = new mongoose.Schema({
	id: String,
	name: String,
	number: String,
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)

// const Person = mongoose.model('Person', personSchema)

// if (process.argv.length === 3) {
// 	Person.find({})
// 		.then(people => {
// 			if (people.length) {
// 				console.log('Phonebook:')
// 				people.forEach(person => {
// 					console.log(`${person.name} ${person.number}`)
// 					mongoose.connection.close()
// 				})
// 			} else {
// 				console.log('The phonebook is empty :(')
// 				mongoose.connection.close()
// 			}
// 		})
// }

// else if (process.argv.length === 5) {
// 	const number = new Person({
// 		id: Math.floor(Math.random() * (1000000 - 1) + 1).toString(),
// 		name: process.argv[3],
// 		number: process.argv[4],
// 	})

// 	number.save()
// 		.then(() => {
// 			console.log(`Added ${number.name} number ${number.number} to phonebook.`)
// 			mongoose.connection.close()
// 		})
// }

// else { console.log("Please include name and number.") }
