const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT uncaughtException: Shutting down..');
  process.exit(1);
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const port = process.env.port || 3000;
mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});

const server = app.listen(port, () => {
  console.log(`Server is running on the ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHADLING REJECTION: Shutting down..');
  server.close(() => {
    process.exit(1);
  });
});
