const data = require("./data");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const port = process.env.PORT || 5000;
const server = express();

server.use(cors());
server.use(bodyParser.json());

let gameId = data.games.length;
let userId = data.users.length;
let token = "dummytoken";

// authenticator function

function authenticator(req, res, next) {
  const { authorization } = req.headers;
  if (authorization === token) {
    next();
  } else {
    res
      .status(403)
      .json({ error: "You must be logged in to access this section." });
  }
}

// login API

server.post("/login", (req, res) => {
  const { username, password, email } = req.body;

  if (!username) {
    return res.status(400).send("Please provide a username");
  }
  const findByUsername = data.users.find(user => {
    return user.name === username;
  });

  const findByEmail = data.users.find(user => {
    return user.email === email;
  });

  if (!findByUsername && !findByEmail) {
    return res.status(400).send("Unable to find user in userlist.");
  }

  const matchingUser = findByUsername || findByEmail;

  if (matchingUser.password === password) {
    res.status(200).json({
      token: token
    });
  } else {
    res.status(403).json({ error: "Incorrect password." });
  }
});

// games API

server.get("/gamelist", (req, res) => {
  res.status(200).json(data.games);
});

// get list of publishers
server.get("/publishers", (req, res) => {
  res.status(200).json(data.publishers);
});

// users API

// signup logic
server.post("/users", (req, res) => {
  if (!req.body.username) {
    return res.status(400).send("There needs to be a name in the name field.");
  }
  if (
    data.users.find(user => {
      return user.name === req.body.username;
    })
  ) {
    return res
      .status(400)
      .send("There is already a user with this name. Please use another name.");
  }
  if (!req.body.password || req.body.password !== req.body.confirmPassword) {
    return res.status(400).send("Two matching passwords required.");
  }
  const newUser = req.body;
  newUser.id = userId;
  data.users.push(newUser);
  ++userId;
  res.status(201).json(token);
});

// update user logic
server.put("/users/:id", authenticator, (req, res) => {
  // add in authorization later
  if (!req.params.id)
    return res.status(400).send("Your request is missing the user id.");
  if (!req.body.username || !req.body.password) {
    return res
      .status(422)
      .send("Make sure your request body has all the fields it needs.");
  }
  data.users = data.users.map(user => {
    if (user.id === parseInt(req.params.id)) {
      return req.body;
    }
    return user;
  });
  res.status(200).send(req.body);
});

// delete user logic
server.delete("/users/:id", authenticator, (req, res) => {
  // add in authorization later
  if (!req.params.id)
    res.status(400).send("Your request is missing the user id");
  data.users = data.users.filter(user => `${user.id}` !== req.params.id);
  res.status(202).send("User has been deleted.");
});

// server port

server.listen(port, () => {
  console.log(`server listening on http://${port}`);
});
