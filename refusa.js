const puppeteer = require('puppeteer');
const login = require('./ref_usa/login');

console.log("Starting Ref USA Puppet run");

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    login.performLogin(browser);

    console.log("Ref USA Puppet run complete");
    await browser.close();
})();