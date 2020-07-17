const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const homelessRouter = require('./routes/homelessRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

var corsOptions = {
	origin: 'http://localhost:8081'
};

app.use(cors(corsOptions));

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// ROUTERS

// app.get('/', (req, res) => {
// 	res.status(200).json({
// 		status: 200,
// 		message: 'Welcome to the server'
// 	});
// });

app.use('/api/v1/homeless', homelessRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
