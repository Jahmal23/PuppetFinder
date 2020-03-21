const puppeteer = require('puppeteer');
const login = require('./ref_usa/login');
const termsConditions = require('./ref_usa/terms_conditions');
const search = require('./ref_usa/search');
const helpers = require('./helpers/persons');
const scrape = require('./ref_usa/scrape');
const searchPersons = require('./helpers/test_names.json'); //require('./helpers/portuguese.json');
const mailer = require('./helpers/mailer');
const csvWriter = require('./helpers/csv_writer')

console.log("Starting Ref USA Puppet run");

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    const city = "Springfield";
    const state = "MA"

    await login.performLogin(page);
    
    await termsConditions.accept(page);

    let foundPersons = [];

    for(let i = 0; i < searchPersons.length; i++){

        currName = searchPersons[i];

        console.log(`About to search ${currName} in ${city}, ${state}`);

        let sp = new helpers.SearchPerson("", currName, city, state);

        await search.perform(page, sp);

        foundPersons = await scrape.perform(page, sp, foundPersons);
    
        await page.screenshot({path: 'lastScreen.png'});  
    }

    publishResults(foundPersons);
    
    console.log("Ref USA Puppet run complete");

       //await browser.close();

})().catch(error => { console.log('FATAL ERROR -- ', error.message); });

async function publishResults(foundPersons) {

    await csvWriter.writeCSV([
        {id: 'lastname', title: 'LastName'},
        {id: 'address', title: 'Address'},
        {id: 'telephone', title: 'Telephone'}], 'results.csv', foundPersons);
    
        
    await mailer.send("PuppetFinder: Reference USA Search Results", JSON.stringify(foundPersons));

    console.log("Results published");

}