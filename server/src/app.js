// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cluster = require('cluster');
const os = require('os');
const cors = require('cors');
const httpStatus = require('http-status');
const userRouter = require('./routes/user.routes');
const db = require('./utils/db');

// Initialize PORT variable from environment
const PORT = process.env.APPPORT || 3001;

// Function to create and start the Express app
const createApp = () => {
  const app = express();

  // Use Morgan to send API traffic logging to the logger
  // ...

  // Initialize body-parser to use JSON
  app.use(bodyParser.json());

  app.use(cors());

  app.use('/api', userRouter);

  app.use((req, res) => {
    res.status(httpStatus.NOT_FOUND).json({
      statusCode: httpStatus.NOT_FOUND,
      msg: 'Endpoint not found',
    });
  });

  return app;
};

// Function to create and start the server
const startServer = () => {
  // Start the Express app
  const app = createApp();

  // Start the server
  app.listen(PORT, () =>
    console.info(`Server is running at 0.0.0.0:${PORT}`)
  );
};

// Check if the current process is the master process
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers equal to the number of CPU cores
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }

  // Handle worker process exits
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Worker processes execute this block
  startServer();
}

// Export app for testing purposes
module.exports = createApp();
