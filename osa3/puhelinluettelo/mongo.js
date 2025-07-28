const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster.o7bvnuy.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=cluster`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', numberSchema)

if (process.argv.length === 3) {
  Person.find({})
    .then(people => {
      if (people.length) {
        console.log('Phonebook:')
        people.forEach(person => {
          console.log(`${person.name} ${person.number}`)
          mongoose.connection.close()
        })
      } else {
        console.log('The phonebook is empty :(')
        mongoose.connection.close()
      }
    })
}

else if (process.argv.length === 5) {
  const number = new Person({
    id: Math.floor(Math.random() * (1000000 - 1) + 1).toString(),
    name: process.argv[3],
    number: process.argv[4],
  })

  number.save()
    .then(() => {
      console.log(`Added ${number.name} number ${number.number} to phonebook.`)
      mongoose.connection.close()
    })
}

else { console.log('Please include name and number.') }
