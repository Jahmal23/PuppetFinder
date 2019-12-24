const puppeteer = require('puppeteer');

console.log("Starting Puppet run");

(async () => {
  const browser = await puppeteer.launch({
   headless: true,
   args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  
  await page.pdf({path: 'foo.pdf', format: 'A4'});

  console.log("Puppet run complete");
  await browser.close();
})();

