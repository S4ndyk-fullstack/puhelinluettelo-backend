require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')
const bodyparser = require('body-parser')
const morgan = require('morgan')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(bodyparser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.get('/api/persons', (req, res) => {
    console.log('Getting persons from mongdodb')
    Person.find({}).then(persons => {
      res.json(persons.map(person => person.toJSON()))
      console.log('Persons returned succesfully')
    })
})
app.get('/info', (req, res) => {
    const info = `<p>Phonebook has ${data.persons.length} people</br>${new Date(Date.now()).toUTCString()}</p>`
    res.send(info)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.findById(id)
      .then(person => {
        res.json(person)
        console.log('Person with id ', id, 'returned succesfully')
      }).catch(() => res.status(404).end())
})

app.post('/api/persons/', (req, res) => {
    const body = req.body

    if(!body.name || !body.number) {
        return res.status(400).send({error: 'name or number missing'}).end()
    }

    const person = new Person ({
      name: body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      res.json(savedPerson.toJSON()).status(204)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    data.persons = data.persons.filter(person => person.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})