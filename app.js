var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var app = express();
var server = http.createServer(app);
var port = 3000;
var fs  = require('fs');
var spawn = require('child_process').spawn;

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', function(_, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

app.post('/compile', (req, res) => {

  let { language, code, stdin } = req.body;
  let cmd, stdout = "", stderr = "";

  if (language == 0) {

    // Create a C++ file with the code
    fs.writeFile("submission_dir/code.cpp", code, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("The file is saved!");
      }
    });

    cmd = spawn('g++', ["./submission_dir/code.cpp"]);
 } else {

    // Create a Python file with the code
    fs.writeFile("submission_dir/code.py", code, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("The file is saved!");
      }
    });

    cmd  = spawn('python', ["./submission_dir/code.py", stdin]);
  }

  cmd.stdout.on('data', (data) => {
    console.log('stdout: ' + data.toString());
    stdout = data.toString();
  });

  cmd.stderr.on('data', (data) => {
    console.log('stderr: ' + data.toString());
    stderr = data.toString();
  });

  cmd.on('exit', function (code) {
    console.log('child process exited with code ' + code.toString());
  });

  let result = (stderr === "") ? stdout : stderr;

  res.send({
    output: result,
    langid: language,
    code: code
  });
});

app.get('/', function(_, res) {
  res.sendfile(`${__dirname}/views/index.html`);
});

console.log("Listening at " + port);
server.listen(port);

module.exports = app;
