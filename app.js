const express = require('express');
require('dotenv').config();

const bodyParser = require('body-parser');


const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');

const PORT = process.env.PORT || 8080;
const MONGODB_URI =
  "mongodb+srv://clumpiness:r1fbR7A327xczldH@cluster0.qcwuzp2.mongodb.net/quizzer?retryWrites=true&w=majority&appName=Cluster0";



const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*", 'http://localhost:3000');
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(bodyParser.json());

app.use('/auth', authRoutes);

app.use('/quiz', quizRoutes);

// err  handler
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(PORT, () => console.log(`server started at ${PORT}`));
  })
  .catch((err) => console.log(err));