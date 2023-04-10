const express = require("express");
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

// ws.on('message', (message) => {
//   console.log(`Received message => ${message}`);
//   try {
//     const parsedMessage = JSON.parse(message);
//     console.log(parsedMessage.message);
//   } catch (error) {
//     console.error('Error parsing message:', error);
//   }
// });

server.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    let data = JSON.parse(message);

 server.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ username: data.username, message: data.message }));
      }
    });
  });
});

////datbase

////database

app.use(cors())

app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));

server.on("connection", (socket) => {
  console.log("WebSocket connected:", socket);

  // socket.on("message", (message) => {
  //   console.log("Message received:", message);
  //   server.clients.forEach((client) => {
  //     if (client !== socket && client.readyState === WebSocket.OPEN) {
  //       client.send(message);
  //     }
  //   });
  // });

  socket.on("close", (event) => {
    console.log("WebSocket closed:", event);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
const Sequelize = require("sequelize");
const sequelize = new Sequelize("new_schema", "root", "root", {
  host: "localhost",
  dialect: "mysql"
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });
  const Messages = sequelize.define('messages', {
    message: {
      type: Sequelize.STRING
    },
    sender: {
      type: Sequelize.STRING
    },
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
        message: req.body.msg,
        sender: req.body.username,
        
      }).then(function (message) {
        if (message) {
          res.status(200).send({ message: "Data inserted successfully" });
        } else {
          res.status(400).send({ error: "Error in insert new record" });
        }
      });
    });
    
  



  
  const User = sequelize.define("User", {
    srNo: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password:{
      type:Sequelize.STRING,
      allowNull:false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    mobile: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  app.post("/login", (req, res) => {
    const { username, password } = req.body;
    User.findOne({
      where: {
        username: username
      }
    })
      .then(user => {
        if (!user) {
          res.status(401).send("User not found");
        } else {
          if (user.password === password) {
            //res.status(200).send(status:1,msg:"User authenticated");
            var resp = { status: 1, msg: "User Authenticated" };
            var json = JSON.stringify({ 
              response_status: 200, 
              data: resp, 
              
            });
           // response.end(json);
            res.status(200).send(json);
          } else {
            res.status(401).send("Incorrect password");
            
          }
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
  

  app.post("/users", (req, res) => {
    User.create({
      srNo: req.body.srNo,
      username: req.body.username,
      password:req.body.password,
      status: req.body.status,
      email: req.body.email,
      mobile: req.body.mobile,
      role: req.body.role
    })
      .then(user => {
        res.json(user);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
   
app.get("/users", (req, res) => {
    User.findAll()
      .then(users => {
        res.json(users);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
   
  
  
  app.delete("/users/:id", (req, res) => {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(() => {
        res.status(200).send("User deleted successfully");
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });

  
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    return res.redirect('/login');
  }
};

app.get('/', (req, res) => {
  res.send('Welcome to the home page');
});

app.get('/restricted', isAuthenticated, (req, res) => {
  res.send('Welcome to the restricted page');
});

app.get('/login', (req, res) => {
  req.session.user = { username: req.body.username };
  res.send('Login successful');
});

app.listen(3002, () => {
  console.log('Server running on port 3002');
});


sequelize.sync();
