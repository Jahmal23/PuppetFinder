const cheerio = require('cheerio');

const BASE_URL = "https://www.fastpeoplesearch.com/name/";
const SEARCH_URL = "https://www.fastpeoplesearch.com/";
const PEOPLE_LIST_SELECTOR = "#site-content > div > div.col-sm-12.col-md-9.col-lg-6.break-word.order-2 > div.people-list"
//grab all div class = card


exports.perform = async (page, searchPerson, foundPersons) => {

    if (!page.url().includes(BASE_URL)) {

        console.log(`Unexpected starting url ${BASE_URL} for result page`);
    
        await Promise.all([
            page.waitForNavigation({waitUntil: 'networkidle0'}),
            await page.goto(SEARCH_URL)
        ]);

        return foundPersons;
    }
     
    const data = await page.evaluate(() => {
        return Array.from(document.getElementsByClassName("card"));
    });

    console.log(data.length);

}