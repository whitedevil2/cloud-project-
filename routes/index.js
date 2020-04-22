var express = require('express');
var router = express.Router();
var sandBox = require('./DockerSandbox');
var http = require('http');
var arr = require('./compilers');
var result;

router.all('*', function(req, res, next) 
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

//crypto safe random
function random(size) {
  //returns a crypto-safe random
  return require("crypto").randomBytes(size).toString('hex');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile("./views/index.html");
});


//Upon request from user
router.post('/compiler', function(req,res){

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
  cmd  = spawn('g++',[stdin]);

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
    
  res.send({output:result, langid: language,code:code, errors:err, time:exec_time});

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
  cmd  = spawn('python code.py');

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
  res.send({output:result, langid: language,code:code, errors:err, time:exec_time});
 }

});

console.log("Listening at port:3000");

module.exports = router;
