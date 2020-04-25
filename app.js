var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var app = express();
var server = http.createServer(app);
var port = 3000;
var fs  = require('fs');
const Promise = require('bluebird');
const cmd = require('node-cmd');
const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd })

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', function(_, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

app.post('/compile', async (req, res) => {

  let { language, code, stdin } = req.body;
  let cmd, cleanCmd, output = "", error = "";

  if (language == 0) {
    // C++
    fs.writeFile("submission_dir/code.cpp", code, (err) => {
      if (err) {
        console.log(err);
      }
    });

    cmd = 'g++ ./submission_dir/code.cpp && ./a.out';
    cleanCmd = 'rm a.out submission_dir/code.cpp';
  } else {
    // Python
    fs.writeFile("submission_dir/code.py", code, (err) => {
      if (err) {
        console.log(err);
      }
    });

    cmd = 'python ./submission_dir/code.py';
    cleanCmd = 'rm submission_dir/code.py';
  }

  try {
    let execErr;
    [output, execErr] = await getAsync(cmd);
    output += "\n" + execErr;
  } catch (err) {
    error = err.toString();
  }

  res.send({
    output,
    error
  });

  // Remove the created files once finished executing
  try {
    await getAsync(cleanCmd);
  } catch (err) {
    console.log(err);
  }
});

app.get('/', function(_, res) {
  res.sendfile(`${__dirname}/views/index.html`);
});

console.log("Listening at " + port);
server.listen(port);

module.exports = app;
