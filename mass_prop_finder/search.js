const SEARCH_URL = "http://gisprpxy.itd.state.ma.us/ParcelAccessibility2/MassPropertyInfo.aspx";
const CITY_SELECTOR = "#cmbCity";
const STREET_SELECTOR = "#cmbStreet"

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
    console.log(await getAllStreets(page));

};

async function getAllStreets(page) {
    const states = await page.evaluate(() => {
        const options = Array.from(document.querySelector('#cmbStreet').options); //todo why do I have to hardcode this?
        return options.map(o => o.value);
    });

    return states;
}
