require('dotenv').config()
const DB = require('./config/db-config.js')
const server = require('./server.js')

// start server on port
const port = process.env.PORT || 5000
DB.connectDB().then(() => {
  server.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`)
  })
})
