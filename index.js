
const logger = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
require('dotenv').config();



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));




//  Mở cổng
app.listen(process.env.PORT, () =>
{
    console.log(`Server listening on port: ${process.env.PORT}.\n`);
});


//  Xử lý khi truy cập vào trang gốc
app.get('/', (req, res) => { res.status(200).send("Server chạy ngon lành."); });
