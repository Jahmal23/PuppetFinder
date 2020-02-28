const puppeteer = require('puppeteer');
const login = require('./ref_usa/login');
const termsConditions = require('./ref_usa/terms_conditions');
const search = require('./ref_usa/search');
const helpers = require('./helpers/persons');
const scrape = require('./ref_usa/scrape');

console.log("Starting Ref USA Puppet run");

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    let sp = new helpers.SearchPerson("", "Silva", "Ludlow", "MA");

    await login.performLogin(page);

    await termsConditions.accept(page);

    await search.perform(page, sp);

    await scrape.perform(page, sp);

    await page.screenshot({path: 'lastScreen.png'});

    console.log("Ref USA Puppet run complete");

    //await browser.close();
})().catch(error => { console.log('CAUGHT ERROR', error.message); });

