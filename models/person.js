const mongoose = require('mongoose')
require('dotenv').config()
// def the url,type of query and connection
const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

console.log('connecting to',url)

mongoose.connect(url).then(res => {
  console.log('Succesful connection')
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message)
  process.exit(1)
})

// define the schema for db
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: String
})
// create a model for backend
// const Person = mongoose.model('Person',personSchema);

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})



module.exports = mongoose.model('Person', personSchema)




// if(numArgs == 5){
// const person = new Person({
//     name: personName,
//     number: personNumber
// })
// person.save().then(result =>{
//     console.log(result.name + " is saved with number " + result.number)
//     mongoose.connection.close()
// })
// }else if(numArgs == 3){
// Person.find({}).then(result =>{
//     result.forEach(person =>{
//         console.log(person)
//     })
//     mongoose.connection.close()
// })
// }