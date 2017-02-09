var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var mysql = require("mysql");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "root",
});

connection.connect(function(error){
  if(error){
    // throw error
    console.log("error while connecting to database");
  }else{
    console.log("succesfull connected to database");
  }
});

connection.query("use " + "db1");

app.post("/posted", urlencodedParser, function(request,response) {
  // response.write(request.body.fileUpload);
  console.log(request.body.fileUpload);

  // response.end();
  connection.query("insert into fileupload (upload) value('"+request.body.fileUpload+"')",function(error,result,fields){
  // connection.query("select * from fileupload ",function(error,result,fields){
    if(error){
      console.log("error while executing query");
      throw error
    }else {
      response.send("file uploaded successfully");
      console.log("file uploaded successfully");
    }
  })

 
})

app.post("/show",urlencodedParser,function(request,response){
    connection.query("select * from fileupload",function(error,result,fields){
  // connection.query("select * from fileupload ",function(error,result,fields){
    if(error){
      console.log("error while executing query");
      throw error
    }else {
      for(i in result){
        var output = result[i];
        upload = output.upload;
        response.send(upload);
        id= output.id;
        console.log(upload);
      }
      // response.send("file uploaded successfully");
      // console.log("file uploaded successfully");
    }
  });
})

app.listen(3000)

module.exports = app;
