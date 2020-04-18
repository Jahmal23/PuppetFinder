const SEARCH_URL = "http://gisprpxy.itd.state.ma.us/ParcelAccessibility2/MassPropertyInfo.aspx";
const CITY_SELECTOR = "#cmbCity";
const STREET_SELECTOR = "#cmbStreet";
const ADDRESS_SELECTOR = "#cmbAddressNumber";
const GET_INFO_SELECTOR = "#btnGetInfo";
const PROP_INFO_TABLE_SELCTOR = "#FormView1";


exports.perform = async (page, searchPerson) => {

    console.log("Heading directly to search page");

    await Promise.all([
        page.waitForNavigation({waitUntil: 'networkidle0'}),
        await page.goto(SEARCH_URL)
    ]);

    await Promise.all([
        page.waitForNavigation({waitUntil: 'networkidle0'}),
        await page.select(CITY_SELECTOR, searchPerson.city.toUpperCase()) //this is an aspx postback
    ]);

    console.log("Retrieving street list from dropdown");

    await walkAllStreets(page);
};

async function walkAllStreets(page) {
    
    const streets = await getAllStreets(page);

    for(let i = 0; i < streets.length; i++) {
    
        currStreet = streets[i];

        console.log(`Clicking on street ${currStreet}`);

        await Promise.all([
            page.waitForNavigation({waitUntil: 'networkidle0'}),
            await page.select(STREET_SELECTOR, currStreet) //this is an aspx postback
        ]);

        await page.waitFor(1*1000);

        await knockOnAllHouses(page);
    }
}

async function knockOnAllHouses(page) {

    const houses = await getAllHouseNumbers(page);

    console.log(houses);

    for(let i = 0; i < houses.length; i++) {

        currHouse = houses[i];
        console.log(`Clicking on house ${currHouse}`);

        await Promise.all([
            page.waitForNavigation({waitUntil: 'networkidle0'}),
            await page.select(ADDRESS_SELECTOR, currHouse) //this is an aspx postback
        ]);

        await page.waitFor(1*1000);

        try {

            await Promise.all([
                page.waitForNavigation({waitUntil: 'networkidle0'}),
                await page.click(GET_INFO_SELECTOR) //this is an aspx postback
            ]);

            await page.waitFor(1*1000);

            await scrapePropertyInfo(page);

        } catch (e) {
            console.log("Uh oh! Couldn't click the get info button.  Perhaps no houses??");
            console.log(e);
        }

    }     
}

async function scrapePropertyInfo(page) {

    const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('#FormView1 tr td')); //todo why do I have to hardcode this?
        return tds.map(td => td.innerHTML);
    });
}

async function isPortugueseOwner(resultTable, portugueseName) {

    //todo - convert to dom elemement would be more efficient?
    return resultTable && resultTable.includes(portugueseName);

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
