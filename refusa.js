const puppeteer = require('puppeteer');
const login = require('./ref_usa/login');

console.log("Starting Ref USA Puppet run");

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await login.performLogin(page);

    console.log("Ref USA base page loaded. Preparing to login");

    console.log("Ref USA Puppet run complete");
    await browser.close();
})();

