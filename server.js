const express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const News = require('./Models/News');
const morgan = require('morgan');
const cors = require('cors');
var session = require('express-session');
// create application/json parser
var jsonParser = bodyParser.json()

const app = express();

app.set('view engine','ejs');
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));



const dbURI = "mongodb://mongo-0.mongo-service.default.svc.cluster.local,mongo-1.mongo-service.default.svc.cluster.local,mongo-2.mongo-service.default.svc.cluster.local:27017/News?replicaSet=rs0";
const options =  { useNewUrlParser: true, dbName: 'News', useUnifiedTopology: true, db: {
            readPreference: "secondaryPreferred",
    }} 
mongoose.connect(dbURI, options)
  .then(result => {
      app.listen(8080);
      console.log("Connected to the Database");
      console.log("Listening on port 8080");
    })
  .catch(err => console.log(err));


app.get('/', async (req, res) => {
  
  try {
    const {page,limit} = req.query;
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit)|| 10
    };
    var news = await News.paginate({},options);
    console.log(news);
    res.status(200).render('index',{"news":news});
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
    res.status(201).send(user);
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

app.get('/search/', async (req, res) => {
  
  try {
    res.status(200).render('search',{"news":null,"keyword":null});
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

app.get('/search/:value?/', async (req, res) => {
  
  try {
    let value = req.params.value;
    const {page,limit} = req.query;
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit)|| 10
    };
    console.log(options);
    let news = await News.paginate({$or: [{ title: value}, { author: value }, { text: { "$regex": value } }]},options);
    console.log(news)
    res.status(200).render('search',{"news":news,"keyword":value});

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

app.get('/news/:uuid?/', async (req, res) => {
  
  try {
    let l_uuid = req.params.uuid;
 
    let news = await News.find({ uuid: l_uuid }).exec();
   
    res.status(200).render('single_news',{"news":news[0]});
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


app.get('/delete/:uuid?/', async (req, res) => {
  
  try {
    let l_uuid = req.params.uuid;
 
    let news = await News.deleteOne({ uuid: l_uuid }).exec();
    res.status(200).redirect('/search');

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