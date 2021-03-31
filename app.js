const express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const News = require('./Models/News');


// create application/json parser
var jsonParser = bodyParser.json()

const app = express();

const dbURI = "mongodb://root:example@localhost:27017/newsDatabase?authSource=admin";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
      app.listen(8080);
      console.log("Connected to the Database")
    })
  .catch(err => console.log(err));


app.get('/', async (req, res) => {
  
  try {
    const {page,limit} = req.query;
    const options = {
      page: parseInt(page,10)|1,
      limit: parseInt(limit,10)|10
    }

    var news = await News.paginate({},options);
    res.status(200).send(news);
  } 
  catch (error) 
  {
    if (error.name === "ValidationError") {
      let errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.status(400).send(errors);
    }
    res.status(500).send(error);
    console.log(error)
  }

});

// Need this to show self recover
app.get('/fail', (req, res) => {
  process.exit(1)
})

app.post('/create-news',jsonParser, async (req, res) => {
  
  try {
    var user = new News(req.body);
    await user.save();
    res.status(200).send(user);
  } 
  catch (error) 
  {
    if (error.name === "ValidationError") {
      let errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.status(400).send(errors);
    }
    res.status(500).send(error);
    console.log(error)
  }

})