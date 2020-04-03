
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const logger = require('morgan');
const app = express();



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));




//  Mở cổng
app.listen(process.env.PORT, () =>
{
    console.log(`Seacher server listening on port: ${process.env.PORT}.\n`);
});


//  Xử lý khi truy cập vào trang gốc
app.get('/', async (req, res) =>
{
    let method = req.query.method;
    let id = req.query.id;


    if (method && id)
    {
        switch (method)
        {
            case 'ViewMarks':
                {
                    res.status(200).send(await getMarks(id));
                    break;
                }
        }
    }
    else
    {
        res.status(200).send("Seacher server chạy ngon lành.");
    }
});



async function getMarks(id)
{
    try
    {
        let student = await getStudent(id);
        if (student && student.length)
        {
            student = JSON.parse(student);
            const mask_viewer = require('./mark_viewer');
            return await mask_viewer.getMarks(student.ViewMarks);
        }

        return {};
    }
    catch (err)
    {
        console.log(err);
        return err;
    }
}



async function getStudent(id)
{
    try
    {
        let stream = await new Promise((resolve, reject) =>
        {
            request
            (
                {
                    method: 'GET',
                    url: `${process.env.INFO_HOST}`,
                    qs: { studentID: id }
                },
                (err, res, body) =>
                {
                    if (err || (res.statusCode !== 200))
                    {
                        reject(err);
                    }
                    else
                    {
                        resolve(body);
                    }
                }
            );
        });


        return stream;
    }
    catch (err)
    {
        console.log(err);
        return err;
    }
}