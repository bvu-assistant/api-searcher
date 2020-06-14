const router = require('express').Router();
const Student = require('../self_modules/student');
module.exports = router;



router.get('/', async (req, res) =>
{
    let method = req.query.method;
    let id = req.query.id;


    if (method && id)
    {
        try
        {
            //  Get the student searching pages via the id
            let student = await new Student(id);


            if (student !== undefined) {
                const response = await student.getInfo(method);
                res.status(200).send(response);
                return;
            }


            res.status(404).send('Student not found.');
        }
        catch (err)
        {
            console.log(err);
            res.status(404).send('Unknown error.');
        }
    }
    else
    {
        res.status(200).send("Searcher server chạy ngon lành.");
    }
});
