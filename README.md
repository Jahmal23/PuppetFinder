To Run: 

./scripts/run_massprop.sh Springfield MA

./scripts/run_refusa.sh Springfield MA

./scripts/run_fastpeople.sh Springfield MA

./scripts/run_tests.sh

./scripts/sanitycheck.sh

To See a Screenshot locally:

1. Remove await browser.close(); from the main runner js
2. docker cp puppetfinder_refusa_run_1:usr/node/app/lastScreen.png ~/OtherCodes/PuppetFinder/  -- [Your local directory]

To view the Results CSV locally:

1.  Remove await browser.close(); from the main runner js
2.  docker cp puppetfinder_refusa_run_1:usr/node/app/results.csv ~/OtherCodes/PuppetFinder/  -- [Your local directory]

Resources:

https://blog.risingstack.com/mastering-async-await-in-nodejs/

https://stackoverflow.com/questions/54527982/why-is-puppeteer-reporting-unhandledpromiserejectionwarning-error-navigation

https://www.aymen-loukil.com/en/blog-en/google-puppeteer-tutorial-with-examples/

https://medium.com/@e_mad_ehsan/getting-started-with-puppeteer-and-chrome-headless-for-web-scrapping-6bf5979dee3e

https://stackoverflow.com/questions/51535319/scraping-table-to-get-specific-data-using-puppeteer?noredirect=1&lq=1

https://stackoverflow.com/questions/49236981/want-to-scrape-table-using-puppeteer-js-how-can-i-get-all-rows-iterate-through
