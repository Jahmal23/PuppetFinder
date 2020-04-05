const helpers = require('../helpers/persons');

HOME_URL = "http://www.referenceusa.com/Home/Home";
BASE_URL = "http://www.referenceusa.com/UsWhitePages/Result/";
PAGE_COUNT_SELECTOR = '#searchResults > div:nth-child(1) > div > div.pageBar > div.text > span.data-page-max';
PAGE_ADVANCE_SELECTOR = '#searchResults > div:nth-child(1) > div > div.pageBar > div.pager > div.next.button.mousedown-enterkey';

exports.perform = async (page, searchPerson, foundPersons) => {

    if (!page.url().includes(BASE_URL)) {

        console.log(`Unexpected starting url ${BASE_URL} for result page`);
        console.log(`Likely no results found, Returning to homepage \n`);

        await Promise.all([
            page.waitForNavigation({waitUntil: 'networkidle0'}),
            await page.goto(HOME_URL)
        ]);

        return foundPersons;
    }

    console.log("On results page, attempting to compile results ");

    const pageCount = await getPageCount(page);

    for(let i = 1; i <= pageCount; i++){

        console.log(`Scraping page ${i}`);

         await scrapeCurrentPage(page, searchPerson, foundPersons, i);
         await advanceToPage(page);
    }

    console.log(`Scrape complete for ${searchPerson.lastname}.  Returning to homepage \n`);

    await Promise.all([
        page.waitForNavigation({waitUntil: 'networkidle0'}), // The promise resolves after navigation has finished
        await page.goto(HOME_URL)
    ]);

    return foundPersons; 
};

async function advanceToPage(page) {

    await page.click(PAGE_ADVANCE_SELECTOR);

    //clicking doesn't cause a page navigation event so we wait the old fashioned way.
    await page.waitFor(1.5*1000);
}

async function scrapeCurrentPage(page, searchPerson, foundPersons, pageNum = 1) {
    const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('#tblResults tr td')); //todo why do I have to hardcode this?
        return tds.map(td => td.innerHTML);
    });

    return buildFoundPersons(data, searchPerson, foundPersons);
}

function buildFoundPersons(tblData, searchPerson, foundPersons) {

    //The first 3 entries in the data are a checkbox and name hyperlinks.  Address starts at position 4
    const addressStartIndex = 3;

    //Each address has 4 positions
    const addressSetLength = 7;

    const telephonePosition = 3;

    for(let i = addressStartIndex; i + telephonePosition < tblData.length; i+= addressSetLength) {

        let fh = new helpers.FoundPerson( searchPerson.lastname, tblData[i], tblData[ i + telephonePosition ] );
        foundPersons.push(fh);
    }

    return foundPersons;
}

async function getPageCount(page) {

    const innerHTML = await page.evaluate(() => {
        const pcs = Array.from(document.querySelectorAll('#searchResults > div:nth-child(1) > div > div.pageBar > div.text > span.data-page-max')); //todo why do I have to hardcode this?

        // There may be many page counters, but just grab the first since they will obviously all have the same value.
        return pcs.map(pc => pc.innerHTML)[0];
    });

    const count = innerHTML ? Math.trunc(innerHTML) : 1;

    return count;
}




