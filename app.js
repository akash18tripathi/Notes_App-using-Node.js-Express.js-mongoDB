var express= require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var List = require('./list_items.js');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/List";

//Local promise to global promise
mongoose.Promise = global.Promise;
//Database connection establishing
mongoose.connect('mongodb://localhost/List',{useNewUrlParser: true});
mongoose.connection.once('open',()=>{
  console.log("Connection Succesful!");
}).on('error',(error)=>{
  console.log("Your error : "+ error);
});

var urlencodedParser = bodyParser.urlencoded({extended: false});

//setting view engine
app.set('view engine','ejs');

//getting the link and passing a page to that link
app.get('/',function(req,res){
  console.log(req.url);
  res.sendFile(__dirname+'/index.html');
});
app.listen(3000);


//Post request
app.post('/list',urlencodedParser,function(req,res){
    console.log(req.body);
    items = req.body;

//Saving to database
    const newitem =  new List(items); //items is according to Schema
    newitem.save().then(()=>{
        console.log("Value entered in database");

//Mongoclient connects with db again before CRUD operations!
        MongoClient.connect(url,{useNewUrlParser:true}, function(err, db) {
            if (err) throw err;
              var dbo = db.db("List");

        //finding after saving the new item to db
            dbo.collection("items").find({}).toArray(function(err, result) {
                if (err) throw err;

                  console.log("Fetched properly!!");
                  //passing to new webpage the items of database
                  res.render('list',{q:{s:result}});

                  db.close();
            });
        });

  });


});
