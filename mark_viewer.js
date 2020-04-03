module.exports = 
{
    getMarks
}


const request = require('request');
const cheerio = require('cheerio');
const searcher = require('./seacher');





async function getMarks(url)
{
    try
    {
        let stream = await new Promise((resolve, reject) =>
        {
            request
            (
                {
                    method: 'GET',
                    strictSSL: false,
                    url: url
                },
                (err, res, body) =>
                {
                    if (err)
                    {
                        reject(err);
                    }
                    else
                    {
                        let $ = cheerio.load(body, {decodeEntities: false});

                        let tables = [];
                        let marksTable = $('.tblKetQuaHocTap').each(function(index)
                        {
                            tables.push($(this).html());
                        });


                        resolve(getFormatted_MarksTable(tables));
                    }
                }
            );
        });


        return stream;
    }
    catch (err)
    {
        console.log(err);
    }
}



function getFormatted_MarksTable(table)
{
    return table;
}