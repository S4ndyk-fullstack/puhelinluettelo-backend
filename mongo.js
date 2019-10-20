const mongoose = require('mongoose')

const arglen = process.argv.length

if (arglen < 3) {
    console.log('give password')
    process.exit(1)
}

if (arglen > 5) {
    console.log('too many arguments')
    process.exit(1)
}

const passwd = process.argv[2]

const url = `mongodb+srv://Kalttis:${passwd}@persons-fwede.mongodb.net/app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log('error: ', err))

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const name = process.argv[3]
const number = process.argv[4]
if (name && number) {
    const person = new Person({
        name: name,
        number: number
    })
    person.save()
        .then(res => {
            console.log(`Added ${name}, ${number} succesfully`)
            mongoose.connection.close()
        })
} else {
    Person.find({})
        .then(persons => {
            console.log('phonebook: ')
            persons.forEach(next => {
                console.log(`${next.name}, ${next.number}`)
            })
            mongoose.connection.close()
        })
}


