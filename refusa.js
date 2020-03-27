const puppeteer = require('puppeteer');
const login = require('./ref_usa/login');
const termsConditions = require('./ref_usa/terms_conditions');
const search = require('./ref_usa/search');
const helpers = require('./helpers/persons');
const scrape = require('./ref_usa/scrape');
const searchPersons = require('./helpers/test_names.json'); //require('./helpers/portuguese.json');
const mailer = require('./helpers/mailer');
const csvWriter = require('./helpers/csv_writer');
const fs = require("fs");

console.log("Starting Ref USA Puppet run");

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    const city = "Ludlow";
    const state = "MA"

    await login.performLogin(page);
    
    await termsConditions.accept(page);

    let foundPersons = [];

    for(let i = 0; i < searchPersons.length; i++){

        try {
            currName = searchPersons[i];

            console.log(`About to search ${currName} in ${city}, ${state}`);
    
            let sp = new helpers.SearchPerson("", currName, city, state);
    
            await search.perform(page, sp);
    
            foundPersons = await scrape.perform(page, sp, foundPersons);
        
            await page.screenshot({path: `${__dirname}/lastScreen.png`});

            await page.waitFor(15*1000);  //let the site breath before continuing

        } catch (error) {
            console.log(error);
            console.log("Moving to the next name");
        }
    }

    publishResults(city, foundPersons);

    console.log("Ref USA Puppet run complete");

       //await browser.close();

})().catch(error => { console.log('FATAL ERROR -- ', error.message); });

async function publishResults(city, foundPersons) {

    await csvWriter.writeCSV([
        {id: 'lastname', title: 'LastName'},
        {id: 'address', title: 'Address'},
        {id: 'telephone', title: 'Telephone'}], `${__dirname}/results.csv`, foundPersons);
        
    fs.readFile(`${__dirname}/results.csv`, (err, data) => {
        
        if (err) {
            console.error(err);
            return;
          }
          
        let args = {to: process.env.RESULTS_DESTINATION,
            from: "PuppetFinder@test.com", 
            subject: `PuppetFinder: Reference USA Search Result - ${city}`, 
            text: "Please find the results attached.",
            attachmentName: "results.csv",
            attachmentData:  data.toString("base64")};

        mailer.send(args);
      })

    console.log("Results published");
}