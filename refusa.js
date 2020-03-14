const puppeteer = require('puppeteer');
const login = require('./ref_usa/login');
const termsConditions = require('./ref_usa/terms_conditions');
const search = require('./ref_usa/search');
const helpers = require('./helpers/persons');
const scrape = require('./ref_usa/scrape');
const searchPersons = require('./helpers/portuguese.json');
const mailer = require('./helpers/mailer');

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

    console.log("Ref USA Puppet run complete");
    
    await mailer.send("PuppetFinder: Reference USA Search Results", JSON.stringify(foundPersons));

    console.log("Results Published");

    //await browser.close();

})().catch(error => { console.log('MAJOR FAIL -- ', error.message); });

