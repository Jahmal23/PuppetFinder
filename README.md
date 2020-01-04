To Run: 

docker-compose up  --build --remove-orphans --force-recreate sanity_check_run

docker-compose up  --build --remove-orphans --force-recreate refusa_run


To See a Screenshot locally:

1. Remove await browser.close(); from the main runner js, add 
   await page.screenshot({path: 'current.png'});
    
2. Run docker cp puppetfinder_refusa_run_1:current.png ~/OtherCodes/PuppetFinder/  -- [Your local directory]

Resources:

https://blog.risingstack.com/mastering-async-await-in-nodejs/

https://stackoverflow.com/questions/54527982/why-is-puppeteer-reporting-unhandledpromiserejectionwarning-error-navigation

https://www.aymen-loukil.com/en/blog-en/google-puppeteer-tutorial-with-examples/

https://medium.com/@e_mad_ehsan/getting-started-with-puppeteer-and-chrome-headless-for-web-scrapping-6bf5979dee3e
