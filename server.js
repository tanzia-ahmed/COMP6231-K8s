
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
        const {username, password, dbUrl} = process.env
        const url = `mongodb://${username}:${password}@${dbUrl}`
        console.log(url)
        const result = await mongoose.connect(url)
        console.log("The result result was " + result)
        return {username, password, dbUrl}
    } catch (error) {
        console.log("It was fail")
        throw new Error(error)
    }
}

app.get('/db-details', async (req, res) => {
    try {
        const result = await dbConnection();
        res.send({result})
    }catch (error) {
        const {username, password, dbUrl} = process.env
        res.send({error, username, password, dbUrl})
    }
})

app.listen(port, () => "Server is listening on default port")
