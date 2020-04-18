const SEARCH_URL = "http://gisprpxy.itd.state.ma.us/ParcelAccessibility2/MassPropertyInfo.aspx";
const CITY_SELECTOR = "#cmbCity";
const STREET_SELECTOR = "#cmbStreet";
const ADDRESS_SELECTOR = "#cmbAddressNumber";

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

    const streets = await getAllStreets(page);

    for(let i = 0; i < streets.length; i++) {
    
        currStreet = streets[i];

        console.log(`Clicking on street ${currStreet}`);

        await Promise.all([
            page.waitForNavigation({waitUntil: 'networkidle0'}),
            await page.select(STREET_SELECTOR, currStreet) //this is an aspx postback
        ]);

        
        await page.waitFor(1*1000);

        const houses = await getAllHouseNumbers(page);

        console.log(houses);
        
        await page.waitFor(1*1000);

        for(let i = 0; i < houses.length; i++) {

            currHouse = houses[i];
            console.log(`Clicking on house ${currHouse}`);

            await Promise.all([
                page.waitForNavigation({waitUntil: 'networkidle0'}),
                await page.select(ADDRESS_SELECTOR, currHouse) //this is an aspx postback
            ]);

            await page.waitFor(1*1000);

        }        
        
    }
};

async function walkAllStreets(page, streets) {

    for(let i = 0; i < streets.length; i++) {
    
        currStreet = streets[i];

        console.log(`Clicking on street ${currStreet}`);

        await Promise.all([
            page.waitForNavigation({waitUntil: 'networkidle0'}),
            await page.select(STREET_SELECTOR, currStreet) //this is an aspx postback
        ]);

        
        await page.waitFor(1*1000);

        const houses = await getAllHouseNumbers(page);

        console.log(houses);
        
        await page.waitFor(1*1000);

        for(let i = 0; i < houses.length; i++) {

            currHouse = houses[i];
            console.log(`Clicking on house ${currHouse}`);

            await Promise.all([
                page.waitForNavigation({waitUntil: 'networkidle0'}),
                await page.select(ADDRESS_SELECTOR, currHouse) //this is an aspx postback
            ]);

            await page.waitFor(1*1000);

        }        
        
    }

}

async function knockOnAllHouses(page, houses) {

    for(let i = 0; i < houses.length; i++) {

        currHouse = houses[i];
        console.log(`Clicking on house ${currHouse}`);

        await Promise.all([
            page.waitForNavigation({waitUntil: 'networkidle0'}),
            await page.select(ADDRESS_SELECTOR, currHouse) //this is an aspx postback
        ]);

        await page.waitFor(1*1000);

    }     
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
