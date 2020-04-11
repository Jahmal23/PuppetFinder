const puppeteer = require('puppeteer');
const search = require('./mass_prop_finder/search');
const helpers = require('./helpers/persons');
//const scrape = require('./ref_usa/scrape');
const searchPersons = require('./helpers/test_names.json'); //require('./helpers/portuguese.json');
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

    const city = "Hatfield";
    const state = "MA";

    let foundPersons = [];

    for(let i = 0; i < 1; i++){ //for(let i = 0; i < searchPersons.length; i++){

       try {
           currName = searchPersons[i];

           console.log(`About to search ${currName} in ${city}, ${state}`);
    
            let sp = new helpers.SearchPerson("", currName, city, state);
    
            await search.perform(page, sp);
    
           // await scrape.perform(page, sp, foundPersons);
        
            await page.screenshot({path: `${__dirname}/lastScreen.png`});
            
            console.log("Pausing to let the site breathe");

            await page.waitFor(5*1000);  //let the site breathe before continuing

       } catch (error) {
            console.log(error);
            console.log("Moving to the next name");
       }
   }

    //console.log("Sanitizing the results");
    
    //let filtered = await sanitize(foundPersons);

    //publishResults(city, filtered);

    console.log("Mass Property Info run complete");

       //await browser.close();

})().catch(error => { console.log('FATAL ERROR -- ', error.message); });