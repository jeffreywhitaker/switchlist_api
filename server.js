const express = require("express");
const graphqlHTTP = require("express-graphql");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const schema = require("./schema/schema");
const bodyParser = require("body-parser");
const passport = require("passport");
const authRoutes = require("./routes/auth-routes");
const socialAuthRoutes = require("./routes/social-auth-routes");
const rateLimit = require("express-rate-limit");

const server = express();

// basic middleware
server.use(cors());
server.use(helmet());
server.use(morgan("combined"));
server.use(
  bodyParser.urlencoded({
    extended: false
  })
);
server.use(bodyParser.json());

// passport middleware
server.use(passport.initialize());
require("./config/passport-config.js")(passport);

// rate limits for the routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

const backendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 1000,
  message: "Too many attempts, please try again after an hour"
});

// routes
server.use("/auth", authLimiter, [localAuthRoutes, socialAuthRoutes]);
server.use(
  "/backend",
  backendLimiter,
  passport.authenticate("jwt", { session: false }),
  graphqlHTTP({
    schema
  })
);

// const data = require("./data");
// const cors = require("cors");
// const express = require("express");
// const server = express();

// const GamesRouter = require("./games/games-router.js");

// server.use(cors());
// server.use(express.json());

// server.use("/api/", GamesRouter);

// authenticator function

// function authenticator(req, res, next) {
//   const { authorization } = req.headers;
//   if (authorization === token) {
//     next();
//   } else {
//     res
//       .status(403)
//       .json({ error: "You must be logged in to access this section." });
//   }
// }

// // login API

// server.post("/login", (req, res) => {
//   const { username, password, email } = req.body;

//   if (!username) {
//     return res.status(400).send("Please provide a username");
//   }
//   const findByUsername = data.users.find(user => {
//     return user.username === username;
//   });

//   const findByEmail = data.users.find(user => {
//     return user.email === email;
//   });

//   if (!findByUsername && !findByEmail) {
//     return res.status(400).send("Unable to find user in userlist.");
//   }

//   const matchingUser = findByUsername || findByEmail;

//   if (matchingUser.password === password) {
//     res.status(200).json({
//       token: token
//     });
//   } else {
//     res.status(403).json({ error: "Incorrect password." });
//   }
// });

// // get list of publishers
// server.get("/publishers", (req, res) => {
//   res.status(200).json(data.publishers);
// });

// // users API

// // signup logic
// server.post("/users", (req, res) => {
//   if (!req.body.username) {
//     return res.status(400).send("There needs to be a name in the name field.");
//   }
//   if (
//     data.users.find(user => {
//       return user.username === req.body.username;
//     })
//   ) {
//     return res
//       .status(400)
//       .send("There is already a user with this name. Please use another name.");
//   }
//   if (!req.body.password || req.body.password !== req.body.confirmPassword) {
//     return res.status(400).send("Two matching passwords required.");
//   }
//   const newUser = req.body;
//   newUser.id = userId;
//   data.users.push(newUser);
//   ++userId;
//   res.status(201).json(token);
// });

// // update user logic
// server.put("/users/:id", authenticator, (req, res) => {
//   // add in authorization later
//   if (!req.params.id)
//     return res.status(400).send("Your request is missing the user id.");
//   if (!req.body.username || !req.body.password) {
//     return res
//       .status(422)
//       .send("Make sure your request body has all the fields it needs.");
//   }
//   data.users = data.users.map(user => {
//     if (user.id === parseInt(req.params.id)) {
//       return req.body;
//     }
//     return user;
//   });
//   res.status(200).send(req.body);
// });

// // delete user logic
// server.delete("/users/:id", authenticator, (req, res) => {
//   // add in authorization later
//   if (!req.params.id)
//     res.status(400).send("Your request is missing the user id");
//   data.users = data.users.filter(user => `${user.id}` !== req.params.id);
//   res.status(202).send("User has been deleted.");
// });

module.exports = server;
