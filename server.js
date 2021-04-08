
/*
* 1. Push the image to the dockerhub.
* 2.The objective is to test the fault tolerance of the system.
* */

const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
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

/** 
 * This would exist the system but let's check if k8s can back this up or not 
 * if not then may be we can make case of unhandled execptions in the system.
 * */

app.get('/fail', (req, res) => {
    process.exit(1)
})




/*
 Db connection testing and stuff.
* */

async function dbConnection() {
    try {
        const url = "mongodb://mongo-0.mongo-service.default.svc.cluster.local,mongo-1.mongo-service.default.svc.cluster.local,mongo-2.mongo-service.default.svc.cluster.local:27017/db_name?replicaSet=rs0"
        await mongoose.createConnection(url,  {
            useNewUrlParser: true,
            dbName: 'myDb' // Specify the database here
          }          
        )
        console.log("Connected to database")
        return true
    } catch (error) {
        console.log(error)
        console.log("It was fail")
        throw new Error(error)
    }
}

app.get('/db-details', async (req, res) => {
    try {
        const result = await dbConnection();
        res.send({"result": result})
    }catch (error) {
        console.log(error)
        res.send({"Message": "Connection error ", error})
    }
})

process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
      console.log("Moongoose disconnecting the database"); 
      process.exit(0); 
    }); 
  }); 

app.listen(port, () => "Server is listening on default port")
