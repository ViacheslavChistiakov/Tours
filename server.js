const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const port = process.env.port || 3000;
mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});

app.listen(port, () => {
  console.log(`Server is running on the ${port}`);
});
