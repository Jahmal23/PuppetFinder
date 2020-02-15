const helpers = require('../helpers/foundPerson');

BASE_URL = "http://www.referenceusa.com/UsWhitePages/Result/"

exports.perform = async (page, searchPerson) => {

    if (!page.url().includes(BASE_URL)) {
        console.log(`Unexpected starting url ${BASE_URL} for result page`);
        return;
    }

    console.log("On results page, attempting to compile results ");

    await scrapeCurrentPage(page, searchPerson);
};

async function scrapeCurrentPage(page, searchPerson, pageNum = 1) {

    console.log("About to try and dump the Ref Usa results table");
    const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('#tblResults tr td')); //todo why do I have to hardcode this?
        return tds.map(td => td.innerHTML);
    });

   console.log(buildFoundPerson(data, searchPerson));
}


function buildFoundPerson(tblData, searchPerson) {
     let fh = helpers.FoundPerson;

     fh.lastName = searchPerson.lastname;
     fh.address = tblData[3];
     fh.telephone = tblData[6];

     return fh;
}







