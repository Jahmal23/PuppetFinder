const puppeteer = require('puppeteer');
const login = require('./ref_usa/login');
const termsConditions = require('./ref_usa/terms_conditions');

console.log("Starting Ref USA Puppet run");

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    await login.performLogin(page);
    await termsConditions.accept(page)

    await page.screenshot({path: 'lastScreen.png'});

    console.log("Ref USA Puppet run complete");

    //await browser.close();
})();
