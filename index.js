/* eslint-disable no-unused-vars */
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

const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    return res.status(400).json({ error: error.message })
}

app.get('/api/persons', (req, res, next) => {
    console.log('Getting persons from mongdodb')
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
        console.log('Persons returned succesfully')
    }).catch(err => next(err))
})
app.get('/info', (req, res) => {
    Person.countDocuments((err, count) => {
        const info = `<p>Phonebook has ${count} people</br>${new Date(Date.now()).toUTCString()}</p>`
        res.send(info)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id).then(person => res.json(person))
        .catch(error => next(error))
})

app.post('/api/persons/', (req, res, next) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON()).status(204)
    })
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(deletedPerson => {
            res.json(deletedPerson.toJSON()).status(204)
        })
        .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(err => next(err))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})