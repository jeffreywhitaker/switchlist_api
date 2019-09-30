const server = require('./server.js')

// start server on port
const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`server listening on http://${port}`);
  });