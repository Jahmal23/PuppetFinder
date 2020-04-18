const puppeteer = require('puppeteer');
const search = require('./mass_prop_finder/search');
const helpers = require('./helpers/persons');
const mailer = require('./helpers/mailer');
const csvWriter = require('./helpers/csv_writer');
const fs = require("fs");


console.log("Starting Mass Property Info Puppet run");


(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    const city = "Ludlow";
    const state = "MA";

    let foundPersons = [];

    try {

        console.log(`About to search ${city},${state} on the Massachusetts property finder site`);

        await search.perform(page, city);

        await page.screenshot({path: `${__dirname}/lastScreen.png`});
         
         console.log("Pausing to let the site breathe");

    } catch (error) {
         console.log(error);
         console.log("Moving to the next name");
    }
       
    //console.log("Sanitizing the results");
    
    //let filtered = await sanitize(foundPersons);

    //publishResults(city, filtered);

    console.log("Mass Property Info run complete");

       //await browser.close();

})().catch(error => { console.log('FATAL ERROR -- ', error.message); });