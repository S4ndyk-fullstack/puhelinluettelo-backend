const data = {
  "persons": [
    {
      "name": "Dan Abramov",
      "number": "456-123123",
      "id": 1
    },
    {
      "name": "Alan Turing",
      "number": "123-556677",
      "id": 2
    },
    {
      "name": "John von Neumann",
      "number": "123-990077",
      "id": 3
    }
  ]
}

app.use(express.static('build'))
const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const morgan = require('morgan')
const app = express()

app.use(cors())
app.use(bodyparser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.get('/api/persons', (req, res) => {
    res.json(data.persons)
})
app.get('/info', (req, res) => {
    const info = `<p>Phonebook has ${data.persons.length} people</br>${new Date(Date.now()).toUTCString()}</p>`
    res.send(info)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = data.persons.find(person => person.id === id)
    if(person === undefined) res.status(404).end()
    else res.json(person)
})

app.post('/api/persons/', (req, res) => {
    let person = req.body
    if(data.persons.find(nextPerson => nextPerson.name === person.name)) {
        res.status(400).send({error: 'name must be unique'}).end()
        return
    }

    if(!person.name || !person.number) {
        res.status(400).send({error: 'name or number missing'}).end()
        return
    }

    person = {
        ...person,
        id: Math.ceil(Math.random() * 10000)
    }
    data.persons = data.persons.concat(person)
    res.json(person).status(204)
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