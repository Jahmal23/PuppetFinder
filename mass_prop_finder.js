const puppeteer = require('puppeteer');
const search = require('./mass_prop_finder/search');
const mailer = require('./helpers/mailer');
const csvWriter = require('./helpers/csv_writer');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fs = require("fs");


console.log("Starting Mass Property Info Puppet run");


(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    const city = "Shelburne";
    const state = "MA";

    let foundPersons = [];

    try {

        console.log(`About to search ${city},${state} on the Massachusetts property finder site`);

        foundPersons = await search.perform(page, city);

        await page.screenshot({path: `${__dirname}/lastScreen.png`});
         
         console.log("Pausing to let the site breathe");

    } catch (error) {
         console.log(error);
         console.log("Moving to the next name");
    }
       
    publishResults(city, foundPersons);

    console.log("Mass Property Info run complete");

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
            subject: `PuppetFinder: Massachusetts Property Information Search Result - ${city}`, 
            text: "Please find the results attached.",
            attachmentName: "results.csv",
            attachmentData:  data.toString("base64")};

        mailer.send(args, sgMail);
      })

    console.log("Results published");
}
