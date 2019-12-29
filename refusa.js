const puppeteer = require('puppeteer');
const login = require('./ref_usa/login');

const BASE_URL = "http://lalibcon.state.lib.la.us/redirect.php?illcode=s1no&database=refusa"


console.log("Starting Ref USA Puppet run");

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(BASE_URL); //performLogin(page)//login.performLogin(page);

    console.log("Ref USA base page loaded. Preparing to login");

    console.log("Ref USA Puppet run complete");
    await browser.close();
})();

function performLogin(page) {
      page.goto(BASE_URL);
}