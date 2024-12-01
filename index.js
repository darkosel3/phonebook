const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get('/api/persons',(request,response)=>{
    response.json(persons)
})
app.get('/info',(request,response)=>{
    const now = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people <br/> ${now} </p>`)
})
app.get('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT,() => {
    console.log("yo we are listening at port "+PORT)
})

app.delete('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    persons = persons.filter(person => person.id != id)
    response.status(204).end()
})

app.post('/api/persons',(request,response)=>{ // proveri da li radi kada se vratis
    let id = Math.floor(1+ Math.random()* 1000000).toString()
    if (!request.body.name || !request.body.number){
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }else if(persons.some(person => person.name == request.body.name)){
        return response.status(400).json({
            error: `${request.body.name} already exists`
        })
    }
    let person = {
        id: id,
        name: request.body.name,
        numer: request.body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  app.use(unknownEndpoint)