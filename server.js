const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const News = require('./Models/News');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
// create application/json parser
const jsonParser = bodyParser.json()
const { v4: uuidv4 } = require('uuid');

const app = express();

app.set('view engine','ejs');
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));


const dbURI = "mongodb://mongo-0.mongo-service.default.svc.cluster.local,mongo-1.mongo-service.default.svc.cluster.local,mongo-2.mongo-service.default.svc.cluster.local:27017/News?replicaSet=rs0";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
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


app.get('/create/', async (req, res) => {
  
  try {
    res.status(200).render('create');
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

app.post("/create/",async(req,res)=>{
  let news = new News(req.body);
  news.uuid = uuidv4(); 
  news.published = Date.now();
  news.save();
  res.status(201).redirect('/search');
})

app.get('/edit/:uuid?/', async (req, res) => {
  
  try {
    let l_uuid = req.params.uuid;
 
    let news = await News.find({ uuid: l_uuid }).exec();
    res.status(200).render('edit',{"news":JSON.stringify(news[0])});

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


app.post("/update/",async(req,res)=>{
  let news = new News(req.body);
  let PastNews = await News.updateOne({ text:req.body.text,title:req.body.title,url:req.body.url,author:req.body.author,language:req.body.language}).exec();
  news.save();
  res.status(201).redirect('/search');
})