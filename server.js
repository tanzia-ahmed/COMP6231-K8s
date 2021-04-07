
/*
* 1. Push the image to the dockerhub.
* 2.The objective is to test the fault tolerance of the system.
* */

const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;
const app = new express()

const port = process.env.PORT || 8080
dotenv.config()

app.get('/db-2', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) { return res.send(err) }
        res.send("Database created!")
        db.close();
    });
})


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


const url = "mongodb://mongo-0.mongo.mongo.svc.cluster.local:27017,mongo-1.mongo.mongo.svc.cluster.local:27017,mongo-2.mongo.mongo.svc.cluster.local:27017/dbname_?replicaSet=rs0`


/*
 Db connection testing and stuff.
* */

async function dbConnection() {
    try {
        // test this connection.
        await mongoose.createConnection(url, {
            useNewUrlParser: true,
            db: {native_parser: true},
            replset: {
                auto_reconnect: false,
                poolSize: 10,
                readPreference: "secondary",
                socketOptions: {
                    keepAlive: 1000,
                    connectWithNoPrimary: true,
                    connectTimeoutMS: 30000
                },
                server: {
                    poolSize: 5,
                    socketOptions: {
                      keepAlive: 1000,
                      connectTimeoutMS: 30000
                    }
                }
            }
        })
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

app.listen(port, () => "Server is listening on default port")
