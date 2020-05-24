
module.exports = 
{
    getConfirmImage
}


require('dotenv').config();
const request = require('request');




async function getConfirmImage()
{
    try
    {
        console.log(`[confirm-image.js:18] — Getting confirm image ...`);
        let stream = await new Promise((resolve, reject) =>
        {
            request
            (
                {
                    method: 'POST',
                    strictSSL: false,
                    url: 'https://sinhvien.bvu.edu.vn/ajaxpro/AjaxConfirmImage,PMT.Web.PhongDaoTao.ashx',
                    headers:
                    {
						'X-AjaxPro-Method': 'CreateConfirmImage',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0'
                    }
                },
                (err, res, body) =>
                {
                    if (err)
                    {
                        console.log(`[confirm-image.js] — Error:`, err);
                        return reject(err);
                    }
                    else
                    {
                        // console.log(res.rawHeaders);
                        let rawHeaders = res.rawHeaders;
                        let ASPNET_SessionId = rawHeaders.find(function (elem)
                        {
                            return elem.indexOf('NET_SessionId') !== -1;
                        });


                        if (ASPNET_SessionId && ASPNET_SessionId.length > 0)
                        {
                            ASPNET_SessionId = ASPNET_SessionId.split(';')[0].split('=')[1];
                        }


                        //  Bóc tách các thành phần và gom thành Object
                        let segments = body.split(',');
                        let imgLink = segments[0].split('\"').join('').split('[').join('');
                        let md5 = segments[1].split('\"').join('');
                        let obj = { MD5: md5,  SessionId: ASPNET_SessionId, ImageLink: imgLink};


                        console.log(`[confirm-image.js:63] — SessionId: ${obj.SessionId}`);
                        console.log(`[confirm-image.js:64] — Raw MD5: ${obj.MD5}`);
                        // console.log(`[confirm-image.js:65] — Secutiry image link: https://sinhvien.bvu.edu.vn${obj.ImageLink}`);
                        return resolve(obj);
                    }
                }
            );
        });
        
    
        return stream;
    }
    catch (err)
    {
        console.log(`[confirm-image.js:76] — Error: `, err);
    }
}



// (async function()
// {
//     let value = await getConfirmImage();
//     console.log(value);
// })();