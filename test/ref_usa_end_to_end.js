var expect = require('chai').expect;
const puppeteer = require('puppeteer');

const login = require('../ref_usa/login');
const termsConditions = require('../ref_usa/terms_conditions');
const search = require('../ref_usa/search');
const helpers = require('../helpers/persons');
const scrape = require('../ref_usa/scrape');

describe('#Ref Usa End to End', function() {
    it('should run', async function() {

        this.timeout(120000); //end to end tests take some time

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
            
                    await login.performLogin(page);
            
                    await termsConditions.accept(page);
        
                    let currName = "Silva";
        
                    console.log(`About to search ${currName} in ${city}, ${state}`);
            
                    let sp = new helpers.SearchPerson("", currName, city, state);
            
                    await search.perform(page, sp);
            
                    await scrape.perform(page, sp, foundPersons);
                
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