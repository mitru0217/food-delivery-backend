require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userModels = require('./models/user-model');
const adminModels = require('./models/admin-model');
const sequelize = require('./db');
const errorHandler = require('./middleware/errorHandlingMiddleware');
const router = require('./routes/index');
const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api', router);
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
