const puppeteer = require('puppeteer');
const search = require('./fast_people_search/search');
const helpers = require('./helpers/persons');
const scrape = require('./fast_people_search/scrape');
const searchPersons = require('./helpers/test_names.json'); //require('./helpers/portuguese.json');
const mailer = require('./helpers/mailer');
const process_args = require('./helpers/process_args');
const sgMail = require('@sendgrid/mail');
const santizer = require('./helpers/sanitize');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const csvWriter = require('./helpers/csv_writer');
const fs = require("fs");

console.log("Starting Fast People Search run");

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    const city = process_args.city() ? process_args.city() : "Ludlow";
    const state = process_args.state() ? process_args.state() : "MA";

    let foundPersons = [];

    for(let i = 0; i < 1; i++){ //for(let i = 0; i < searchPersons.length; i++){

        try {
            let currName = searchPersons[i];

            console.log(`About to search ${currName} in ${city}, ${state}`);
    
            let sp = new helpers.SearchPerson("", currName, city, state);
    
            await search.perform(page, sp);
    
            await scrape.perform(page, sp, foundPersons);
        
            await page.screenshot({path: `${__dirname}/lastScreen.png`});
            
            console.log("Pausing to let the site breathe");

            await page.waitFor(5*1000);  //let the site breathe before continuing

        } catch (error) {
            console.log(error);
            console.log("Moving to the next name");
        }
    }

    console.log("Sanitizing the results");
    
    // let filtered = await sanitize(foundPersons);

    // publishResults(city, filtered);

    console.log("Fast People Puppet run complete");

       //await browser.close();

})().catch(error => { console.log('FATAL ERROR -- ', error.message); });


async function sanitize(foundPersons) {
    return await santizer.removeDuplicates(foundPersons);
}

async function publishResults(city, foundPersons) {

   let csvExists =  await csvWriter.writeCSV([
        {id: 'lastname', title: 'LastName'},
        {id: 'address', title: 'Address'},
        {id: 'telephone', title: 'Telephone'}], `${__dirname}/results.csv`, foundPersons);

    
    if (!csvExists) {
        console.log("No results to send, skipping.")
        return;
    }
        
    fs.readFile(`${__dirname}/results.csv`, (err, data) => {
        
        if (err) {
            console.error(err);
            return;
          }
          
        let args = {to: process.env.RESULTS_DESTINATION,
            from: "PuppetFinder@test.com", 
            subject: `PuppetFinder: Fast People USA Search Result - ${city}`, 
            text: "Please find the results attached.",
            attachmentName: "results.csv",
            attachmentData:  data.toString("base64")};

        mailer.send(args, sgMail);
      })

    console.log("Results published");
}