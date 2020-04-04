
module.exports = 
{
    getTestSchedules
}


require('dotenv').config();
const request = require('request');
const cheerio = require('cheerio');



async function getTestSchedules(url)
{
    try
    {
        let stream = await new Promise(async (resolve, reject) =>
        {
            //  Gọi POST request để lấy html body 
            let body = await getTestScheduleHTML(url);
            let $ = cheerio.load(body, {decodeEntities: false});


            let schedule = [];
            let currIndex = -1;
            $('#detailTbl >tbody >tr:not(:first-child)').each((trIndex, tr) =>
            {
                schedule.push({});  //  Thêm môn mới
                currIndex++;


                $(tr).find('>td').each(function(tdIndex, td)
                {
                    let content = $(this).children().text().trim();
                    switch (tdIndex)
                    {
                        case 1:
                        {
                            schedule[currIndex].Class = content;
                            break;
                        }
                        case 2:
                        {
                            schedule[currIndex].Subject = content;
                            break;
                        }
                        case 3:
                        {
                            schedule[currIndex].Group = content;
                            break;
                        }
                        case 4:
                        {
                            schedule[currIndex].FromOrdinal = content;
                            break;
                        }
                        case 5:
                        {
                            schedule[currIndex].Date = content;
                            break;
                        }
                        case 6:
                        {
                            schedule[currIndex].Period = content;
                            break;
                        }
                        case 7:
                        {
                            schedule[currIndex].Room = content;
                            break;
                        }
                        case 8:
                        {
                            schedule[currIndex].TestType = content;
                            break;
                        }
                        case 9:
                        {
                            schedule[currIndex].Notes = content;
                            break;
                        }
                    }
                });
            });

            //  Xoá các kí tự Tabs và xuống dòng bị thừa
            let removed = JSON.stringify(schedule).replace(/(\\n[ \t]{2,})/gm, '');
            resolve(JSON.parse(removed));
        });

        return stream;
    }
    catch (err)
    {
        console.log(`[testSchedule-viewer.js] — Error:`, err);
    }
}



async function getTestScheduleHTML(url)
{
    try
    {
        if (url === undefined)
        {
            console.log('URL is undefined.');
            return {};
        }


        console.log('Getting test schedules - url: ' + url);
        let stream = await new Promise((resolve, reject) =>
        {
            request
            (
                {
                    method: 'POST',
                    strictSSL: false,
                    url: url,
                    form:
                    {
                        '__VIEWSTATE': process.env.VIEWSTATE,
                        'ctl00$DdListMenu': "-1",
                        'ctl00$ContentPlaceHolder$SearchType': "radSinhVien",
                        'ctl00$ContentPlaceHolder$cboHocKy3': "30",
                        'ctl00$ContentPlaceHolder$TestType': "radAllTest",
                        'ctl00$ContentPlaceHolder$btnSearch': "Xem+lịch+thi"
                    }
                },
                (err, res, body) =>
                {
                    if (err || (res.statusCode !== 200))
                    {
                        console.log(`[testSchedule-viewer.js:93] — Error:`, err);
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
        console.log(`[testSchedule-viewer.js] — Error:`, err);
    }
}



// (async function ()
// {
//     let val = await getTestSchedules('https://sinhvien.bvu.edu.vn/XemLichThi.aspx?k=8RGLKMSmcQfk3ZW7wev0sg');
//     console.log(val);
// })();