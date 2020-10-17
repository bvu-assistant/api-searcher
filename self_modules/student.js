const request = require('request');
const searcher = require('./seacher');
const mask_viewer = require('./viewers/mark_viewer');
const liability_viewer = require('./viewers/liability-viewer');
const testSchedule_viewer = require('./viewers/testSchedule-viewer');
const thisweekSchedule_viewer = require('./viewers/thisweekSchedule-viewer');


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
            let response = {
                details: await mask_viewer.getMarks(this.pages.viewMarks)
            };

            if (Object.keys(response.details).length > 0)
            {
                response.info = this.info;
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
            let testSchedule = {
                info: this.info
            };

            let response = await testSchedule_viewer.getTestSchedules(this.pages.viewTestSchedules);
            testSchedule.info['term'] = response.Term;
            testSchedule['details'] = response.Schedule;

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
            let liability = {
                info: this.info
            };

            let response = await liability_viewer.getLiability(this.pages.viewLiabilities);
            liability.info.term = response.Term;
            liability['details'] = response.Liability;

            return liability;
        }
        catch (err)
        {
            console.log(err);
            return err;
        }
    }

    async getWeeklyLearningSchedule() {
        try
        {
            let thisweekSchedules = {
                info: this.info
            };

            let response = await thisweekSchedule_viewer.getThisWeekSchedules(this.pages.viewLearningSchedules);
            thisweekSchedules.info.term = response.term;
            thisweekSchedules['details'] = response.schedule;

            return thisweekSchedules;
        }
        catch (err)
        {
            console.log(err);
            return err;
        }
    }

}



module.exports = Student;