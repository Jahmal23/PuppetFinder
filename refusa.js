const puppeteer = require('puppeteer');
const login = require('./ref_usa/login');
const termsConditions = require('./ref_usa/terms_conditions');
const search = require('./ref_usa/search');
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

    let searchPerson = {
        firstname:"Maria",
        lastname:"Silva",
        city: "Ludlow",
        state: "MA"
    };

    await search.perform(page, searchPerson);

    await page.screenshot({path: 'lastScreen.png'});

    await scrape.perform(page, searchPerson);

    console.log("Ref USA Puppet run complete");

    //await browser.close();
})();

