var express = require('express');
var http = require('http');
var arr = require('./compilers');
var sandBox = require('./DockerSandbox');
var bodyParser = require('body-parser');
var app = express();
var server = http.createServer(app);
var port=3000;
var fs  = require('fs');
var result;

var ExpressBrute = require('express-brute');
var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store,{
    freeRetries: 50,
    lifetime: 3600
});

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', function(req, res, next) 
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

function random(size) {
    //returns a crypto-safe random
    return require("crypto").randomBytes(size).toString('hex');
}


app.post('/compile',bruteforce.prevent,function(req, res) 
{

    var language = req.body.language;
  var code = req.body.code;
  var stdin = req.body.stdin;
 
  if(language==0){
    //create a cpp file
    fs.writeFile("code.cpp",  code, function(err){
      if(err){
        console.log(err);
      } else{
        console.log("The file is saved!");
      }
    })

    //executing the code
  var spawn = require('child_process').spawn,
  cmd  = spawn('g++', ["./code.cpp"]);

  cmd.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
    result=data.toString();
  });

  cmd.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
    result=data.toString();
  });

  cmd.on('exit', function (code) {
    console.log('child process exited with code ' + code.toString());

  });

    console.log(result);
  res.send({output:result, langid: language,code:code});

 }
 else{
  fs.writeFile("code.py",  code, function(err){
    if(err){
      console.log(err);
    } else{
      console.log("The file is saved!");
    }
  })

  //executing the code
  var spawn = require('child_process').spawn,
  cmd  = spawn('python', ["./code.py", stdin]);

  cmd.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
    result=data.toString();
  });

  cmd.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
    result=data.toString();
  });

  cmd.on('exit', function (code) {
    console.log('child process exited with code ' + code.toString());
  });

  console.log(result);
  res.send({output:result, langid: language,code:code});
 }

   
});


app.get('/', function(req, res) 
{
    res.sendfile(`${__dirname}/views/index.html`);
});

console.log("Listening at "+port)
server.listen(port);

module.exports=app;