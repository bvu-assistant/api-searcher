const request = require('request');
const searcher = require('./seacher');
const mask_viewer = require('./viewers/mark_viewer');
const liability_viewer = require('./viewers/liability-viewer');
const testSchedule_viewer = require('./viewers/testSchedule-viewer');



class Student {

    constructor(id) {
        this.info = {};
        this.pages = {};


        return new Promise( async(resolve, reject) => {
            const searchPage = await searcher.getSearchingPage(id);

            if (searchPage) {
                this.info = searchPage.info;
                this.pages = searchPage.pages;
                console.log('\nStudent:', this);

                return resolve(this);
            }
            

            return resolve(undefined);
        });
    }



    async getInfo(method)
    {
        try
        {
            console.log(`\nRequired method: ${method}`);
            
            switch (method) {
                case '0': {
                    return this.getMarks();
                }

                case '1': {
                    return this.getLiability();
                }

                case '2': {
                    return this.getTestSchedule();
                }

                case '3': {
                    return this.getWeeklyLearningSchedule();
                }

                default: {
                    return 'Wrong method.'
                }
            }
        }
        catch (err)
        {
            return 'Có lỗi trong quá trình xử lý thông tin.';
        }
    }


    async getMarks()
    {
        try
        {
            console.log('Getting marks...');
            let response = await mask_viewer.getMarks(this.pages.ViewMarks);


            if (Object.keys(response).length > 0)
            {
                response.InFo = {};
                response.InFo.ID = this.info.ID;
                response.InFo.FullName = this.info.FullName;

            }

            return response;
        }
        catch (err)
        {
            console.log('\nError when getting marks:', err);
            return err;
        }
    }

    async getTestSchedule()
    {
        try
        {
            let testSchedule = [];
            testSchedule.push({FullName: this.info.FullName, ID: this.info.ID});

            let response = await testSchedule_viewer.getTestSchedules(this.pages.ViewTestSchedules);
            testSchedule[0].Term = response.Term;
            testSchedule.push(response.Schedule);

            return testSchedule;
        }
        catch (err)
        {
            console.log(err);
            return err;
        }
    }

    async getLiability()
    {
        try
        {
            let liability = [];
            liability.push({FullName: this.info.FullName, ID: this.info.ID});

            let response = await liability_viewer.getLiability(this.pages.ViewLiabilities);
            liability[0].Term = response.Term;
            liability.push(response.Liability);
            return liability;
        }
        catch (err)
        {
            console.log(err);
            return err;
        }
    }

    async getWeeklyLearningSchedule() {
        
    }

}



module.exports = Student;