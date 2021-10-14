const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const HttpStatus = require('http-status-codes');
const Swagger = require('./configuration/initSwagger');
const Routes = require('./configuration/initRoutes');
const Server = require('./configuration/initServer');
const Events = require('./configuration/initEvents');
const xssFilter = require('x-xss-protection');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const MySQLConnection = require('./src/config/connection/mysql.connection');

const app = express();

app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(xssFilter());
app.use(helmet());
app.use(hpp());
app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000 // limit each IP to 2000 requests per windowMs
});

//  apply to all requests
app.use(limiter);
app.set('db', require('./src/models'));


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    res.header('Cache-Control', 'public, max-age=86400');
    if (req.method === 'OPTIONS') {
        return res.send(HttpStatus.OK);
    } else {
        return next();
    }
});

console.log(`-> Start with environment: [${process.env.NODE_ENV}]`);

console.log('-> Step: Init swagger');
Swagger.initSwagger(app);

console.log('-> Step: Init routes');
Routes.initRoutes(app);

console.log('-> Step: Connection database');
MySQLConnection.getSequelizeInstance().getConnectStatus();

console.log('-> Step: Init events');
Events.initEvents();

console.log('-> Step: Start server');
Server.create(app);


