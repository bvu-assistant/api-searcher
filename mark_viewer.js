module.exports = 
{
    getMarks
}


const request = require('request');
const cheerio = require('cheerio');




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
                        let tables = {};


                        $('.tblKetQuaHocTap').each(function(index, elem)
                        {
                            if (index === 0)
                            {
                                tables.ActualTable = getActualTable(elem);
                            }
                            else
                                if (index === 1)
                                {
                                    tables.SummaryTable = getSummaryTable($(this));
                                }
                        });


                        resolve(tables);
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



//  Return JSON
function getActualTable(table)
{
    try
    {
        let $ = cheerio.load(table, {decodeEntities: false});
        let currTermIndex = -1;
        let elems = [];


        $(table).find('>tbody >tr').each(function(index, elem)
        {
            //  Là học kì mới
            if ($(this).hasClass('quater') === true)
            {
                //  Gán tên học kì
                let termName = $(this).find('>td');
                elems.push({Term: termName.text(), Subjects: []});
                currTermIndex++;
            }
            else    //  Là môn học
            {
                if ($(this).hasClass('markRow') === true)
                {
                    elems[currTermIndex].Subjects.push(getSubjectInfo(elem));
                }
            }
        });
        

        return elems;
    }
    catch (err)
    {
        console.log(err);
    }
}


function getSubjectInfo(tr)
{
    try
    {
        let subject = {};
        let $ = cheerio.load(tr);


        // console.log('Subject: ', tr, $(tr));

        $(tr).find('>td').each(function(index, elem)
        {
            switch (index)
            {
                case 1: //  Tên môn học
                    {
                        subject.Name = $(this).text();
                        break;
                    }
                case 2: //  Mã lớp
                    {
                        subject.Class = $(this).text();
                        break;
                    }
                case 3: //  Số tín chỉ
                    {
                        subject.Credits = $(this).text();
                        break;
                    }
                case 4: //  Điểm chuyên cần
                    {
                        subject.DiligencePoint = $(this).text();
                        break;
                    }
                case 5: //  Điểm giữa kỳ
                    {
                        subject.MidTermPoint = $(this).text();
                        break;
                    }
                case 6: //  Điểm cuối kỳ
                    {
                        subject.FinalPoint = $(this).text();
                        break;
                    }
                case 7: //  Điểm trung bình
                    {
                        subject.AveragePoint = $(this).text();
                        break;
                    }
                case 8: //  Xếp loại
                    {
                        subject.Ranked = $(this).text();
                        break;
                    }
                case 9: //  Ghi chú
                    {
                        subject.Notes = $(this).text();
                        break;
                    }
            }
        });


        return subject;
    }
    catch (err)
    {
        console.log(err);
    }
}


//  Return JSON
function getSummaryTable(table)
{
    try
    { 
        let $ = cheerio.load(table);
        let elems = {};



        //  Tổng tín chỉ
        let totalCredits = $(table).find('span#ctl00_ContentPlaceHolder_ucThongTinTotNghiepTinChi1_lblTongTinChi');
        elems.TotalCredits = totalCredits.text();


        //  Trung bình chung tích luỹ
        let averageMark = $(table).find('span#ctl00_ContentPlaceHolder_ucThongTinTotNghiepTinChi1_lblTBCTL');
        elems.AverageMark = averageMark.text();


        //  Số tín chỉ nợ
        let borrowedCredits = $(table).find('span#ctl00_ContentPlaceHolder_ucThongTinTotNghiepTinChi1_lblSoTCNo');
        elems.BorrowedCredits = borrowedCredits.text();

        
        //  Xếp loại tốt ngiệp
        let graduatingRank = $(table).find('span#ctl00_ContentPlaceHolder_ucThongTinTotNghiepTinChi1_lblXepLoaiTotNghiep');
        elems.GraduatingRank = graduatingRank.text();
        

        //  Ghi chú
        let notes = $(table).find('span#ctl00_ContentPlaceHolder_ucThongTinTotNghiepTinChi1_lblGhiChu');
        elems.Notes = notes.text().split('Ghi chú: ').join('');
        

        return elems;
    }
    catch (err)
    {
        console.log(err);
    }
}