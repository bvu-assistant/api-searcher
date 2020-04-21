module.exports = { getLiability }


require('dotenv').config();
const request = require('request');
const cheerio = require('cheerio');




async function getLiability(url)
{
    try
    {
        console.log('Getting liabilities - url: ' + url);
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
                        '__VIEWSTATE': '/wEPDwULLTE2NzAxODA4MjMPFgIeE1ZhbGlkYXRlUmVxdWVzdE1vZGUCARYCZg9kFgICAQ9kFggCAQ9kFgRmDxBkZBYBAgFkAgEPDxYCHgdWaXNpYmxlaGRkAgMPZBYEZg8QZGQWAQIBZAIBDw8WAh8BaGRkAgcPEGQQFQsKVOG6pXQgY+G6oxpRdXkgxJDhu4tuaCAtIEJp4buDdSBt4bqrdRotLS1RdXkgxJDhu4tuaCDEkMOgbyB04bqhbxwtLS1RdXkgxJDhu4tuaCBDw7RuZyB0w6FjIFNWEi0tLUJp4buDdSBt4bqrdSBTVhYtLS1Dw6FjIEjGsOG7m25nIEThuqtuHUjhu41jIGLhu5VuZyAtIEtoZW4gdGjGsOG7n25nEUhv4bqhdCDEkeG7mW5nIFNWEFNhdSDEkOG6oWkgaOG7jWMKVGluIGNow61uaCJUaW4gdOG7qWMgU2luaCB2acOqbiAtIEjhu41jIHZpw6puFQsCLTEDNDIyAzQyMwM0MjQDMzQ4AzQyNQMzNDYDNDIxAzM3NQMzNzEDMzUxFCsDC2dnZ2dnZ2dnZ2dnZGQCCQ9kFgQCBA8QDxYGHg1EYXRhVGV4dEZpZWxkBQZUZW5Eb3QeDkRhdGFWYWx1ZUZpZWxkBQJJZB4LXyFEYXRhQm91bmRnZBAVBxotLVThuqV0IGPhuqMgY8OhYyDEkeG7o3QtLRhI4buNYyBr4buzIDMgWzIwMTktMjAyMF0YSOG7jWMga+G7syAyIFsyMDE5LTIwMjBdGEjhu41jIGvhu7MgMSBbMjAxOS0yMDIwXRhI4buNYyBr4buzIDMgWzIwMTgtMjAxOV0YSOG7jWMga+G7syAyIFsyMDE4LTIwMTldGEjhu41jIGvhu7MgMSBbMjAxOC0yMDE5XRUHAi0xAjMxAjMwAjI5AjI4AjI3AjI2FCsDB2dnZ2dnZ2dkZAIGD2QWAmYPEGRkFgBkZM9el+7euDNQ+A8TXZgKnEdROjWEj6fgCy0yv/27yw41',
                        'ctl00$DdListMenu':	"-1",
                        'ctl00$ContentPlaceHolder$cboHocKy':	"-1"
                    }
                },
                (err, res, body) =>
                {
                    if (err || (res.statusCode !== 200))
                    {
                        console.log(`liability-viewer.js] — Error:`, err);
                        return reject(undefined);
                    }


                    // console.log(body);
                    let theLiability = '';
                    let $ = cheerio.load(body, {decodeEntities:false});
                    $('td[colspan=10] >p >span:nth-child(2)').each(function(index, elem)
                    {
                        theLiability += $(elem).html();
                    });
                            

                    //  Lấy học kỳ đang chọn
                    let term = $('select[id="ctl00_ContentPlaceHolder_cboHocKy"] option:selected').text().split('--').join('');
                    console.log('\nSelected term: ', term);


                    if (theLiability.indexOf('VNĐ') === -1)
                    {
                        console.log(`liability-viewer.js] — Can\'t get the liability. Maybe the student ID was wrong.`);
                        return reject(undefined);
                    }
                            
                    let response = {};
                    response.Term = term;
                    response.Liability = 'Tổng công nợ: ' + theLiability.replace(/[ \n]*/gm, '').split('VNĐ').join('').concat(' VNĐ.');

                    return resolve(response);
                }
            );
        });

        return stream;
    }
    catch (err)
    {
        console.log(`liability-viewer.js] — Error:`, err);
    }
}



// (async function()
// {
//     let liabilities = await getLiability('https://sinhvien.bvu.edu.vn/CongNoSinhVien.aspx?k=2Acfv_V--X5PkSuoMT-neA');
//     console.log(liabilities.replace(/[ \n]*/gm, ''));

//     // const fs = require('fs');
//     // fs.writeFileSync('table.txt', liabilities);
// })();