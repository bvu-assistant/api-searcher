module.exports = { getStudent }


const request = require('request');




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