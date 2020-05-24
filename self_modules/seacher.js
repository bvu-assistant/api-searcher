module.exports = 
{
    getSearchingPage
}



const cheerio = require('cheerio');
const request = require('request');
const md5Reverse = require('./md5-reverse');
const confirm_img = require('./confirm-image');



async function getSearchingPage(studentID)
{
    try
    {
        //  Lấy object ảnh xác minh đăng nhập (returns: MD5, SessionId, ImageLink)
        let img = await confirm_img.getConfirmImage();


        //  Giải mã xác minh (Từ MD5 sang mã ban đầu)
        let md5Encoded = await md5Reverse.getMD5_Reversed(img.MD5);
    
    

        let stream = await new Promise((resolve, reject) =>
        {
            console.log(`[searcher.js:30] — Logining ...`);
            request
            (
                {
                    method: 'POST',
                    strictSSL: false,
                    url: `https://sinhvien.bvu.edu.vn/TraCuuThongTin.aspx?MenuID=410`,
                    headers:
                    {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0',
                        'Cookie': `ASP.NET_SessionId=${img.SessionId}`
                    },
                    form:
                    {
                        __VIEWSTATE: '/wEPDwUKMTIxMTk4NTEyOQ8WAh4TVmFsaWRhdGVSZXF1ZXN0TW9kZQIBZGRY8uCt/o7D5OiT6JwF2OVbuYXs8kp0sLXTZskciG04rQ==',
                        ctl00$ContentPlaceHolder$txtMaSoSV: studentID,
                        ctl00$ContentPlaceHolder$txtMaLop: 	"",
                        ctl00$ContentPlaceHolder$txtHoDem: 	"",
                        ctl00$ContentPlaceHolder$txtHoTen:	"",
                        ctl00$ContentPlaceHolder$objNgaySinh:	"",
                        ctl00$ContentPlaceHolder$txtSercurityCode1:	md5Encoded,
                        ctl00$ContentPlaceHolder$btnTraCuuThongTin:	"Tra+cứu"
                    }
                },
                (err, res, body) =>
                {
                    if (err || res.statusCode !== 200)
                    {
                        console.log(`[searcher.js:59] — Error`, err);
                        return reject(undefined);
                    }
                    else
                    {
                        let $ = cheerio.load(body, {decodeEntities: false});
                        let elems = {};
                        let pages = {};
                        let info = {};
                        elems.info = info;
                        elems.pages = pages;
    

                        //  Kiểm tra nếu không tìm được
                        let table = $('b:contains(\'Không tìm thấy dữ liệu!\')');
                        if (table.html() !== null)
                        {
                            console.log('[searcher.js:72] — Can\'t fetch infomation. Maybe the student ID was wrong.');
                            return resolve(undefined);
                        }
                
                        
                        $('#TblDanhSachSinhVien > tbody > tr > td').each(function(index, elem)
                        {
                            let content = $(elem).html();
                            // console.log(content);
    
    
                            switch (index)
                            {
                                case 1:
                                    {
                                        info.ID = content;
                                        break;
                                    }
    
                                case 2:
                                    {
                                        info.FullName = content;
                                        break;
                                    }
    
                                
                                default:
                                    {
                                        if (content.indexOf('XemDiem') != -1)
                                        {
                                            let viewmark = content.split(' ')[2].split('>')[0].split('\"')[1];;
                                            pages.ViewMarks = `https://sinhvien.bvu.edu.vn/${viewmark}`;
                                        }
                                        else if (content.indexOf('XemLichHoc') != -1)
                                        {
                                            let learningSchedule = content.split(' ')[2].split('>')[0].split('\"')[1];;
                                            pages.ViewLearningSchedules = `https://sinhvien.bvu.edu.vn/${learningSchedule}`;
                                        }
                                        else if (content.indexOf('XemLichThi') != -1)
                                        {
                                            let testSchedule = content.split(' ')[2].split('>')[0].split('\"')[1];;
                                            pages.ViewTestSchedules = `https://sinhvien.bvu.edu.vn/${testSchedule}`;
                                        }
                                        else if (content.indexOf('CongNoSinhVien') != -1)
                                        {
                                            let liabilities = content.split(' ')[2].split('>')[0].split('\"')[1];;
                                            pages.ViewLiabilities = `https://sinhvien.bvu.edu.vn/${liabilities}`;
                                        }
                                    }
                            }
                        });
    
    
    
                        if (Object.keys(pages).length > 0)
                        {
                            info.SessionId = img.SessionId;
                            info.SecurityMD5 = img.MD5;
                            info.SecurityCode = md5Encoded;
                            return resolve(elems);
                        }
                        else
                        {
                            console.log('[searcher.js:135] — Can\'t fetch infomation. Maybe the student ID was wrong.');
                            return resolve(undefined);
                        }
                    }
                }
            );
        });

        return stream;
    }
    catch (err)
    {
        console.log(`[searcher.js:145] — Error:`, err);
    }
}



// (async function()
// {
//     let student = await getSearchingPage('18033280');
//     console.log(`[searcher.js] — Student:`, student);
// })();