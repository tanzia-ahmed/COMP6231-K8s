/*
* 1. Push the image to the dockerhub.
* 2.The objective is to test the fault tolerance of the system.
* */

const express = require('express')
const dotenv = require('dotenv')
const app = new express()

const port = process.env.PORT || 8080
dotenv.config()

app.get('/', (req, res) => {
    res.json(data)
})
app.post('/', (req,res) => {
    data.push({ id: '4', name: 'monica', img: 'monica.png' })
    res.json(data)
})
app.patch()
app.put()
app.delete()
/** 
 * This would exit the system but let's check if k8s can back this up or not 
 * if not then may be we can make case of unhandled execptions in the system.
 * */

app.get('/fail', (req, res) => {
    process.exit(1)
})


app.listen(port, () =>
    console.log(`Server is listening on default port ${port}`))

const data = [
    { id: '1', name: 'rachel', img: 'rachel.png' },
    { id: '2', name: 'ross', img: 'ross.png' },
    { id: '3', name: 'phoeboe', img: 'phoeboe.png' }]

