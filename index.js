
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const logger = require('morgan');
const app = express();



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


let botstar_routes = require('./routes/botstar/botstar');
app.use('/botstar', botstar_routes);



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
            
            case 'ViewTestSchedule':
                {
                    res.status(200).send(await getTestSchedule(id));
                    break;
                }

            case 'ViewLiabilities':
                {
                    res.status(200).send(await getLiability(id));
                    break;
                }

            default:
                    res.status(200).send('Wrong the method name param.');
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
        if (student && student.length > 2)
        {
            student = JSON.parse(student);
            const mask_viewer = require('./mark_viewer');

            let response = await mask_viewer.getMarks(student.ViewMarks);
            if (Object.keys(response).length > 0)
            {
                response.SummaryTable.ID = student.ID;
                response.SummaryTable.FullName = student.FullName;
            }

            return response;
        }

        return {};
    }
    catch (err)
    {
        console.log(err);
        return err;
    }
}


async function getTestSchedule(id)
{
    try
    {
        let student = await getStudent(id);
        if (student && student.length > 2)
        {
            student = JSON.parse(student);
            const testSchedule_viewer = require('./testSchedule-viewer');


            let testSchedule = [];
            testSchedule.push({FullName: student.FullName, ID: student.ID});

            let response = await testSchedule_viewer.getTestSchedules(student.ViewTestSchedule);
            testSchedule[0].Term = response.Term;
            testSchedule.push(response.Schedule);

            return testSchedule;
        }

        return {};
    }
    catch (err)
    {
        console.log(err);
        return err;
    }
}

async function getLiability(id)
{
    try
    {
        let student = await getStudent(id);
        if (student && student.length > 2)
        {
            student = JSON.parse(student);
            const liability_viewer = require('./liability-viewer');


            let liability = [];
            liability.push({FullName: student.FullName, ID: student.ID});

            let response = await liability_viewer.getLiability(student.ViewLiabilities);
            liability[0].Term = response.Term;
            liability.push(response.Liability);


            return liability;
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
        console.log('\n\n\nGetting student: ', id);
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
                        console.log('Getted student:', body, `– Length: ${body.length}`);
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