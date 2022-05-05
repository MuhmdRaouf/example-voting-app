const async = require('async');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const http = require('http');
const methodOverride = require('method-override');
const { Pool } = require('pg')
const path = require('path');
const socket = require('socket.io')

const port = 80;
const app = express();
const server = http.Server(app);
const io = socket(server)
io.set('transports', ['polling']);

io.sockets.on('connection', function (socket) {

  socket.emit('message', { text: 'Welcome!' });

  socket.on('subscribe', function (data) {
    socket.join(data.channel);
  });
});

const pool = new Pool({ connectionString: 'postgres://postgres:password@db/postgres' });

async.retry(
  {times: 1000, interval: 1000},
  function (callback) {
    pool.connect(function (err, client) {
      if (err) {
        console.error("Waiting for db");
      }
      callback(err, client);
    });
  },
  function (err, client) {
    if (err) {
      return console.error("Giving up");
    }
    console.log("Connected to db");
    getVotes(client);
  }
);

function getVotes(client) {
  client.query('SELECT vote, COUNT(id) AS count FROM votes GROUP BY vote', [], function (err, result) {
    if (err) {
      console.error("Error performing query: " + err);
    } else {
      const votes = collectVotesFromResult(result);
      io.sockets.emit("scores", JSON.stringify(votes));
    }

    setTimeout(function () {
      getVotes(client)
    }, 1000);
  });
}

function collectVotesFromResult(result) {
  const votes = {a: 0, b: 0};

  result.rows.forEach(function (row) {
    votes[row.vote] = parseInt(row.count);
  });

  return votes;
}

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/views/index.html'));
});

server.listen(port, function () {
  const port = server.address().port;
  console.log('App running on port ' + port);
});
