const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:8080');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Sequelize = require('sequelize');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);



// Connection opened
socket.addEventListener('open', (message) => {
    console.log('WebSocket client connected to server');
    socket.send(JSON.stringify({ message: 'Hello Server!' }));
});

// Connection closed
socket.addEventListener('close', (event) => {
    console.log('WebSocket client disconnected from server');
});

// Handle errors
socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
});

//message save database

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const sequelize = new Sequelize('new_schema', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
  });
  
  const Messages = sequelize.define('messages', {
    message: {
      type: Sequelize.STRING
    },
    sender: {
      type: Sequelize.STRING
    },
    clientId: {
      type:Sequelize.STRING
    },
    uniqueId: {
      type: Sequelize.STRING
    }
    
  });
  
  Messages.sync()
    .then(() => {
      console.log("Table synced successfully");
    })
    .catch((error) => {
      console.log("Error syncing table: ", error);
    });
  
  app.post('/messages', function (req, res) {
    return Messages.create({
      message: req.body.message,
      sender: req.body.sender,
      clientId: req.body.clientId,
      uniqueId:req.body.uniqueId
    }).then(function (message) {
      if (message) {
        res.status(200).send({ message: "Data inserted successfully" });
      } else {
        res.status(400).send({ error: "Error in insert new record" });
      }
    });
  });
  
  app.get('/messages', (req, res) => {
    Messages.findAll().then(messages => {
      res.status(200).send(messages);
    }).catch(error => {
      res.status(400).send({ error: "Error in fetching messages" });
    });
  });
  
  
  app.listen(5000, () => {
    console.log('Server listening on port 5000...');
  });
  