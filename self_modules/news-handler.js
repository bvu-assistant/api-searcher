module.exports = { scrapHeadlines, scrapStudentNews }

const request = require('request');
const cheerio = require('cheerio');



async function renderHeadlinesTemplate()
{
    try
    {
        const builder = new Builder();
        let items = Array.from(await scrapHeadlines());
        if (items.length === 0)
            return undefined;


        let generics = [];
        for (let i = 0; i < items.length && i < 10; ++i)
        {
            let currItem = items[i];

            let generic = builder.createGeneric({
                title: currItem.Title,
                subtitle: currItem.Date,
                image_url: 'https://i.imgur.com/okwgAyw.jpg',
                default_action: builder.createDefaultAction({
                    url: currItem.Link
                }),
                buttons: builder.createButton({
                    type: 'web_url',
                    url: currItem.Link,
                    title: 'Xem'
                })
            });

            generics.push(generic);
        }

        let template = builder.createGenericTemplate({elements: generics});
        console.log(template);
        return template;
    }
    catch(error)
    {
        console.log(error);
    }
}


async function renderStudentNewsTemplate()
{
    try
    {
        const builder = new Builder();
        let items = Array.from(await scrapStudentNews());
        if (items.length === 0)
            return undefined;


        let generics = [];
        for (let i = 0; i < items.length && i < 10; ++i)
        {
            let currItem = items[i];

            let generic = builder.createGeneric({
                title: currItem.Title,
                subtitle: currItem.Date,
                image_url: 'https://i.imgur.com/5VXoz0L.jpg',
                default_action: builder.createDefaultAction({
                    url: currItem.Link
                }),
                buttons: builder.createButton({
                    type: 'web_url',
                    url: currItem.Link,
                    title: 'Xem'
                })
            });

            generics.push(generic);
        }


        let template = builder.createGenericTemplate({elements: generics});
        console.log(template);
        return template;
    }
    catch(error)
    {
        console.log(error);
    }
}



//  Tin chính
async function scrapHeadlines()
{
    try
    {
        return new Promise((resolve, reject) =>
        {
            request({
                method: 'GET',
                strictSSL: false,
                url: 'https://sinhvien.bvu.edu.vn/'
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    return reject(err || body);
                }


				let items = [];
                let $ = cheerio.load(body, {decodeEntities: false});
                

				$('#main_container .col-left .mod').each((index, elem) =>
				{
					let headline = $(elem).find('.head >h3:contains("Tin chính")');
					if (headline !== null && headline.text() !== "")
					{
						$(elem).find('.item').each((index, elem) =>
						{
							let title = $(elem).find('.title >a');
							// console.log('\n\n' + title.text());

							let href = 'https://sinhvien.bvu.edu.vn/' + title.attr('href');
							// console.log(href);

							let date = $(elem).find('.title >.date');
							// console.log(date.text().split(': ')[1]);


							items.push({
								Title: title.text(),
								Link: href,
								Date: date.text().split(': ')[1]
							});
						});
					}
				});


				// console.log(items);
				return resolve(items);
            });
        });
    }
    catch(err)
    {
        console.log(err);
    }
}


//  Tin sinh viên
async function scrapStudentNews()
{
    try
    {
        return new Promise((resolve, reject) =>
        {
            request({
                method: 'GET',
                strictSSL: false,
                url: 'https://sinhvien.bvu.edu.vn/'
            },
            (err, res, body) =>
            {
                if (err || (res.statusCode !== 200))
                {
                    return reject(err || body);
                }


				let items = [];
                let $ = cheerio.load(body, {decodeEntities: false});
                

				$('#main_container .col-left .mod').each((index, elem) =>
				{
					let headline = $(elem).find('.head >h3:contains("Tin tức Sinh viên - Học viên")');
					if (headline !== null && headline.text() !== "")
					{
						$(elem).find('.item').each((index, elem) =>
						{
							let title = $(elem).find('.title >a');
							// console.log('\n\n' + title.text());

							let href = 'https://sinhvien.bvu.edu.vn/' + title.attr('href');
							// console.log(href);

							let date = $(elem).find('.title >.date');
							// console.log(date.text().split(': ')[1]);


							items.push({
								Title: title.text(),
								Link: href,
								Date: date.text().split(': ')[1]
							});
						});
					}
				});


				// console.log(items);
				return resolve(items);
            });
        });
    }
    catch(err)
    {
        console.log(err);
    }
}

