const express = require('express');
let router = express.Router();
let student = require('../../student');
let testScheduler = require('../../testSchedule-viewer');



router.get('/test-schedule', async (req, res) =>
{
    let studentId = req.query.id;


    let studentInfo = await student.getStudent(studentId);
    if (studentInfo && studentInfo.length > 2)
    {
        studentInfo = JSON.parse(studentInfo);
        let testScheduleLink = studentInfo.ViewTestSchedule;
        let responseMessage = await testScheduler.renderMessage(studentInfo.FullName, testScheduleLink);

        console.log(responseMessage);
        res.status(200).send(responseMessage);
        return;
    }


    res.status(200).send({'messages':[{'text': 'Không tìm được lịch thi. Thử lại sau.'}]});
});




module.exports = router;