const express = require('express');
const app = express();
const port = 3000
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');

dotenv.config();//for congfiguring env file

mongoose.connect('mongodb://127.0.0.1/Social')
    .then(() => { console.log("Database is connected") })
    .catch((err) => { console.log('could not connected to mongodb', err) })


// middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use('/api/users', userRouter);

app.use('/api/auth', authRouter);

app.listen(port, () => {
    console.log(`Backend Server is running on port  ${port}`);
})
