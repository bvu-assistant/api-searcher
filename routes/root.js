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
            res.status(404).send('Unknow error.');
        }
    }
    else
    {
        res.status(200).send("Seacher server chạy ngon lành.");
    }
});



router.get('/news', async (req, res) => {
    const newsType = req.query.type;


    if (newsType) {
        if (newsType === 'main' || newsType === 'student') {

            const newsHandler = require('../self_modules/news-handler');
            let response;


            switch(newsType) {
                case 'main': {
                    response = await newsHandler.scrapHeadlines();
                    res.status(200).send(response);
                    break;
                }

                case 'student': {
                    response = await newsHandler.scrapStudentNews();
                    res.status(200).send(response);
                    break;
                }
            }

            
            return;
        }    
    }

    res.status(404).send('Wrong param.');
});
