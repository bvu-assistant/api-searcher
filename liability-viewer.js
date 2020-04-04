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
                    method: 'GET',
                    strictSSL: false,
                    uri: url
                },
                (err, res, body) =>
                {
                    if (err || (res.statusCode !== 200))
                    {
                        console.log(`liability-viewer.js] — Error:`, err);
                        return reject(undefined);
                    }


                    let theLiability = '';
                    let $ = cheerio.load(body, {decodeEntities:false});
                    $('td[colspan=10] >p >span:nth-child(2)').each(function(index, elem)
                    {
                        theLiability += $(elem).html();
                    });
                    


                    if (theLiability.indexOf('VNĐ') === -1)
                    {
                        console.log(`liability-viewer.js] — Can\'t get the liability. Maybe the student ID was wrong.`);
                        return reject(undefined);
                    }

                    return resolve(theLiability);
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