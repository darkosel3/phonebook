const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person.js')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('dist'))

// let persons = Person
app.get('/api/persons',(request,response) => {
  Person.find({}).then(persons => {
    console.log(persons.length)
    response.json(persons)
  })
})
app.get('/info',(request,response) => {
  const now = new Date()
  let len
  Person.find({}).then(persons => { len = persons.length})
  response.send(`<p>Phonebook has info for ${len} people <br/> ${now} </p>`)
})

app.get('/api/persons/:id',(request,response,next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    response.json(person)
  }).catch(err => next(err))

})

const PORT = process.env.PORT || 3001
app.listen(PORT,() => {
  console.log('yo we are listening at port '+PORT)
})

app.delete('/api/persons/:id',(request,response,next) => {
  const id = request.params.id
  console.log(typeof id)
  Person.findByIdAndDelete(id).then(res => console.log(res)).catch(err => next(err))
  // persons = persons.filter(person => person.id != id)
  response.status(204).end()
})

app.post('/api/persons', async (request,response) => {
  const { name, number } = request.body

  if (!name || !number){
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const existingPerson = await Person.findOne({ name })
  if (existingPerson) {
    return response.status(400).json({ error: `${name} number changed`, })
  }else{
    let person = new Person({ name,number })
    person.save()
      .then(person => response.json(person))
      .catch(error => {
        console.error('Error occurred:', error.errors.name.message)
        response.status(500).json({ error: error.errors.name.message })
      })
  };
})

app.put('/api/persons/:id', (request,response,next) => {
  // console.log( request.body)
  const _id = request.params.id
  Person.findByIdAndUpdate(
    _id,
    request.body,
    { new: true, runValidators: true, context:'query' }
  ).then(person => response.status(200).send(person))
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (error,request,response,next) => {

  if(error.name === 'CastError'){
    return response.status(400).send({ error:'malformated id' })
  }else if(error.name === 'ValidationError'){
    console.log('typeErr')
    return response.status(400).json({ error: error.message })
  }

  next(error) // delegates to the next middleware
}
app.use(unknownEndpoint)
app.use(errorHandler)