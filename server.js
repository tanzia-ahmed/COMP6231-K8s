const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const fs = require('fs')

const app = new express()

const port = process.env.PORT || 8080
dotenv.config()



app.get('/', (req, res) => {
    res.json({
        'from': process.env.PS || null,
        'name': {
            'firstname': 'Vinayak',
            'lastname': 'Sareen',
            'middlename': null
        }
    })
})

app.get('/fail', (req, res) => {
    process.exit(1)
})


async function databaseConnection() {
    try {
        const url = "mongodb://mongo-0.mongo-service.default.svc.cluster.local,mongo-1.mongo-service.default.svc.cluster.local,mongo-2.mongo-service.default.svc.cluster.local:27017/db_name?replicaSet=rs0"
        const options =  { useNewUrlParser: true, dbName: 'myDb', db: {
            readPreference: "secondaryPreferred",
        }} 
        await mongoose.createConnection(url, options)
        return true
    } catch (error) {
        throw new Error(error)
    }
}

process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
      console.log("Moongoose disconnecting the database"); 
      process.exit(0); 
    }); 
  }); 

app.listen(port, () => "Server is listening on default port")
