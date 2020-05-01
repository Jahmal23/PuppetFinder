const searchPersons = require('../helpers/portuguese.json'); //require('./helpers/portuguese.json');
const helpers = require('../helpers/persons');
const cheerio = require('cheerio');

const SEARCH_URL = "http://gisprpxy.itd.state.ma.us/ParcelAccessibility2/MassPropertyInfo.aspx";
const CITY_SELECTOR = "#cmbCity";
const STREET_SELECTOR = "#cmbStreet";
const ADDRESS_SELECTOR = "#cmbAddressNumber";
const GET_INFO_SELECTOR = "#btnGetInfo";
const PROP_INFO_TABLE_SELCTOR = "#FormView1";


exports.perform = async (page, city) => {

    console.log("Heading directly to search page");

    await Promise.all([
        page.waitForNavigation({waitUntil: 'networkidle0'}),
        await page.goto(SEARCH_URL)
    ]);

    await Promise.all([
        page.waitForNavigation({waitUntil: 'networkidle0'}),
        await page.select(CITY_SELECTOR, city.toUpperCase()) //this is an aspx postback, they love uppercase on this site!
    ]);

    console.log("Retrieving street list from dropdown");

    let foundPersons = [];

    await searchAllStreets(page, foundPersons);

    return foundPersons;
};

async function searchAllStreets(page, foundPersons) {
    
    const streets = await getAllStreets(page);

    for(let i = 0; i < streets.length; i++) {
    
        currStreet = streets[i];

        console.log(`Clicking on street ${currStreet}`);

        await Promise.all([
            page.waitForNavigation({waitUntil: 'networkidle0'}),
            await page.select(STREET_SELECTOR, currStreet) //this is an aspx postback
        ]);

       // await page.waitFor(1*1000);

        await knockOnAllHouses(page, currStreet, foundPersons);
    }
}

async function knockOnAllHouses(page, street, foundPersons) {

    const houses = await getAllHouseNumbers(page);

    console.log(houses);

    for(let i = 0; i < houses.length; i++) {

        currHouse = houses[i];

        if (!currHouse) {
            console.log("Empty house number.  Skipping");
            continue;
        }

        console.log(`Clicking on house ${currHouse}`);

        await Promise.all([
            page.waitForNavigation({waitUntil: 'networkidle0'}),
            await page.select(ADDRESS_SELECTOR, currHouse) //this is an aspx postback
        ]);

        try {

            await Promise.all([
                page.waitForNavigation({waitUntil: 'networkidle0'}),
                await page.click(GET_INFO_SELECTOR) //this is an aspx postback
            ]);

            console.log("Clicked property info button.  About to scrape!");
            await scrapePropertyInfo(page, street, currHouse, foundPersons);

        } catch (e) {
            console.log("Uh oh! Couldn't click the get info button.  Perhaps no houses??");
            console.log(e);
        }
    }     
}

async function scrapePropertyInfo(page, street, house, foundPersons) {

    const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('#FormView1 tr td')); //todo why do I have to hardcode this?
        return tds.map(td => td.innerHTML);
    });

    for(let i = 0; i < searchPersons.length; i++){ 
        currName = searchPersons[i];
        
        let embeddedResultsTable = data[0];

        if (await isPortugueseOwner(embeddedResultsTable, currName)) {
            console.log(`Yes! Found a match for ${currName}`);

            let fh = new helpers.FoundPerson( currName,`${house} ${street}`, "" );
            foundPersons.push(fh);
        }
    }
}

async function isPortugueseOwner(resultTable, portugueseName) {

    if (!resultTable) {
        console.log("Empty Property Info table, skipping isPortugueseOwner");
    }

    const $ = cheerio.load(resultTable);
    let isPort = false;
    
    $('tr').each(function(i, elem) {    
        if (i == 1) { //second row is the property owner             

             if (isLastNameMatch($(this).text(), portugueseName.toUpperCase())) //everything is uppercase on this site!
             {
                isPort = true;
             }
        }
      });

      return isPort;
}

 function isLastNameMatch(text, lastname){
    let names = text.replace(',', '').trim().split(" ");
    
    for(let i = 0; i < names.length; i++) {
        if (names[i] == lastname)
        {
            return true;
        }

    }
    return false;
}

async function getAllStreets(page) {
    const states = await page.evaluate(() => {
        const options = Array.from(document.querySelector('#cmbStreet').options); //todo why do I have to hardcode this?
        return options.map(o => o.value);
    });

    states.shift(); //the first element is "Select a street"

    return states;
}

async function getAllHouseNumbers(page) {
    const houses = await page.evaluate(() => {
        const options = Array.from(document.querySelector('#cmbAddressNumber').options); //todo why do I have to hardcode this?
        return options.map(o => o.value);
    });

    houses.shift(); //the first element is "Select an address"

    return houses;
}
