const puppeteer = require('puppeteer');
const login = require('./ref_usa/login');
const termsConditions = require('./ref_usa/terms_conditions');
const search = require('./ref_usa/search');
const person = require('./helpers/persons');
const scrape = require('./ref_usa/scrape');

console.log("Starting Ref USA Puppet run");

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    await login.performLogin(page);
    await termsConditions.accept(page);

    let sp = person.SearchPerson;

    sp.firstname = "Maria";
    sp.lastname = "Silva";
    sp.city = "Ludlow";
    sp.state = "MA";

    await search.perform(page, sp);

    await page.screenshot({path: 'lastScreen.png'});

    await scrape.perform(page, sp);

    console.log("Ref USA Puppet run complete");

    //await browser.close();
})().catch(error => { console.log('CAUGHT ERROR', error.message); });

