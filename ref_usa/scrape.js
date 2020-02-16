const helpers = require('../helpers/persons');

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

   console.log(buildFoundPersons(data, searchPerson));
}

function buildFoundPersons(tblData, searchPerson) {

    let persons = [];

    //The first 3 entries in the data are a checkbox and name hyperlinks.  Address starts at position 4
    const addressStartIndex = 3;

    //Each address has 4 positions
    const addressSetLength = 7;

    const telephonePosition = 3;

    for(let i = addressStartIndex; i + telephonePosition < tblData.length; i+= addressSetLength){
        let fh = helpers.FoundPerson;

        fh.lastName = searchPerson.lastname;
        fh.address = tblData[i];
        fh.telephone = tblData[i + telephonePosition ];

        persons.push(fh);
    }
     return persons;
}







