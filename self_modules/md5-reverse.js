module.exports = { getMD5_Reversed }


var request = require('request');



async function getMD5_Reversed(md5)
{
    try
    {
        console.log('[md5-reverse.js:12] — Decoding md5: ' + md5);
        let stream = await new Promise((resolve, reject) =>
        {
            request
            (
                {
                    method: 'GET',
                    url: `https://md5.gromweb.com/?md5=${md5}`,
                    headers:
                    {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0'
                    }
                },
                (err, res, body) =>
                {
                    if (err)
                    {
                        console.log(`[md5-reverse.js:29] — Error:`, err);
                        reject(err);
                    }
                    else
                    {
                        let regex = new RegExp('<\s*em class="long-content string"[^>]*>(.*?)<\s*/\s*em>');
                        let matched = body.match(regex);
    
                        if (matched != null && matched.length > 1)
                        {
                            var decodedValue = matched[1];
                            console.log(`[md5-reverse.js:40] — Decoded: ${decodedValue}`);
                            resolve(decodedValue);
                        }
                        else
                        {
                            reject('[md5-reverse.js:44] — Can\'t decode the MD5. ', body);
                        }
                    }
                }
            );
        });
        
    
        return stream;
        
    }
    catch (err)
    {
        console.log(`[md5-reverse.js:29] — Error:`, err);
    }
}



// (async function()
// {
//     const confirmer = require("./confirm-image");
    

//     let confirmIMG = await confirmer.getConfirmImage();
//     let segments = confirmIMG.split(',');
//     let imgLink = segments[0].split('\"').join('').split('[').join('');
//     let md5 = segments[1].split('\"').join('');
//     let md5Coded = await getMD5_Reversed(md5);


//     console.log("Decoded: " + md5Coded);
// })();