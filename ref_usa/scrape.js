const helpers = require('../helpers/persons');

HOME_URL = "http://www.referenceusa.com/Home/Home"
BASE_URL = "http://www.referenceusa.com/UsWhitePages/Result/";
PAGE_COUNT_SELECTOR = '#searchResults > div:nth-child(1) > div > div.pageBar > div.text > span.data-page-max';

exports.perform = async (page, searchPerson) => {

    if (!page.url().includes(BASE_URL)) {
        console.log(`Unexpected starting url ${BASE_URL} for result page`);
        return;
    }

    console.log("On results page, attempting to compile results ");

    const pageCount = await getPageCount(page);

    console.log("Here comes the page count");
    console.log(pageCount);

    await scrapeCurrentPage(page, searchPerson);

    console.log(`Scrape complete for ${searchPerson.lastname}.  Returning to homepage`);

    await page.goto(HOME_URL);
};

async function scrapeCurrentPage(page, searchPerson, pageNum = 1) {

    console.log("About to try and dump the Ref Usa results table");
    const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('#tblResults tr td')); //todo why do I have to hardcode this?
        return tds.map(td => td.innerHTML);
    });

    console.log(buildFoundPersons(data, searchPerson));
}

function buildFoundPersons(tblData, searchPerson) {

    let persons = [];

    //The first 3 entries in the data are a checkbox and name hyperlinks.  Address starts at position 4
    const addressStartIndex = 3;

    //Each address has 4 positions
    const addressSetLength = 7;

    const telephonePosition = 3;

    for(let i = addressStartIndex; i + telephonePosition < tblData.length; i+= addressSetLength) {

        let fh = new helpers.FoundPerson( searchPerson.lastname, tblData[i], tblData[ i + telephonePosition ] );
        persons.push(fh);
    }

    return persons;
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




