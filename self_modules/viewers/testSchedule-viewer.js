
module.exports = 
{
    renderMessage, getTestSchedules
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


            //  Lấy học kỳ đang chọn
            let term = $('select[id="ctl00_ContentPlaceHolder_cboHocKy3"] option:selected').text();
            console.log('Selected term: ', term);


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

            let response = {};
            response.Term = term;
            response.Schedule = JSON.parse(removed);

            resolve(response);
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


        console.log('\n\nGetting test schedules - url: ' + url);
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
                        '__VIEWSTATE': process.env.__VIEWSTATE,
                        'ctl00$DdListMenu': "-1",
                        'ctl00$ContentPlaceHolder$SearchType': "radSinhVien",
                        'ctl00$ContentPlaceHolder$cboHocKy3': process.env.TERM_INDEX,
                        'ctl00$ContentPlaceHolder$TestType': "radAllTest",
                        'ctl00$ContentPlaceHolder$btnSearch': "Xem+lịch+thi"
                    }
                },
                (err, res, body) =>
                {
                    if (err || (res.statusCode !== 200))
                    {
                        console.log(`[testSchedule-viewer.js:93] — Error:`, err);
                        return reject(err);
                    }
                    else
                    {
                        // console.log(body);
                        return resolve(body);
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


async function renderMessage(fullname, url)
{
    try
    {
        let scheduleObject = await getTestSchedules(url);
        console.log('Successfully get schedule.');
        console.log('Rendering message fot BotStar ...');


        // console.log(scheduleObject);
        let term = scheduleObject.Term;
        let schedules = scheduleObject.Schedule;


        let stream = await new Promise((resolve, reject) =>
        {
            let textCollection = [];
            textCollection.push({text: `${fullname} — ${term}`});


            for (let i = 0; i < schedules.length; ++i)
            {
                let currSchedule  = '';
                currSchedule += `- Lớp học phần: ${schedules[i].Class}.\n`;
                currSchedule += `- Môn: ${schedules[i].Subject}.\n`;
                currSchedule += `- Nhóm: ${schedules[i].Group || "Không"}.\n`;
                currSchedule += `- Từ sĩ số: ${schedules[i].FromOrdinal || "Không"}.\n`;
                currSchedule += `- Ngày: ${schedules[i].Date}.\n`;
                currSchedule += `- Ca: ${schedules[i].Period}.\n`;
                currSchedule += `- Phòng: ${schedules[i].Room || "Không"}.\n`;
                currSchedule += `- Loại thi: ${schedules[i].TestType || "Không"}.\n`;
                currSchedule += `- Ghi chú: ${schedules[i].Notes || "Không"}.\n`;

                textCollection.push(
                {
                    text: currSchedule
                });
            }


            //  For BotStar
            let renderedMessage = {
                "messages": textCollection
            }
            

            // console.log(textTemplates);
            return resolve(renderedMessage);
        });

        return stream;
    }
    catch (err)
    {
        console.log(err);
    }
}



// (async function ()
// {
//     let val = await getTestSchedules('https://sinhvien.bvu.edu.vn/XemLichThi.aspx?k=8RGLKMSmcQfk3ZW7wev0sg');
//     console.log(val);
// })();