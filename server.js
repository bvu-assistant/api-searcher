require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const app = express();



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



//  redirecting to root page
const rootRoutes = require('./routes/root');
app.use('/', rootRoutes);



//  Mở cổng
app.listen(process.env.PORT, () =>
{
    console.log(`Seacher server listening on port: ${process.env.PORT}.\n`);
});