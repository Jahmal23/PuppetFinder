var expect = require('chai').expect;
const puppeteer = require('puppeteer');

const search = require('../mass_prop_finder/search');
const helpers = require('../helpers/persons');

describe('#Mass Property Search End to End', function() {
    it('should run', async function() {

        this.timeout(60000); //end to end tests take some time

        let success =  await (async () => {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox']
            });
        
            try {
                    const page = await browser.newPage();

                    const city = "Ludlow";
                    const state = "MA";
            
                    let foundPersons = [];

                    console.log(`About to search ${city},${state} on the Massachusetts property finder site`);
            
                    let streetlimit = 1;
                    foundPersons = await search.perform(page, city, streetlimit);
                
                await browser.close();

                    return foundPersons.length > 0;
        
                } catch (error) {
                    console.log(error);
                    return false;
                }              
        })()
        expect(success).to.equal(true);
    });
});