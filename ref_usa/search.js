const SEARCH_URL = "http://www.referenceusa.com/UsWhitePages/Search/Quick/";

const FIRSTNAME_SELECTOR = "#firstName";
const LASTNAME_SELECTOR = "#lastName";
const CITY_SELECTOR = "#city";
const STATE_SELECTOR = "#stateProvince";

const VIEW_RESULTS_BUTTON_SELECTOR = "#quickSearch > form > fieldset > div.submitButton > a";

exports.perform = async (page, searchPerson) => {
    
    console.log("Heading directly to search page");

    await Promise.all([
         page.waitForNavigation({waitUntil: 'networkidle0'}), // The promise resolves after navigation has finished
         await page.goto(SEARCH_URL)
     ]);


    console.log(`Filling in information to search ${searchPerson.toString()}`);

    await page.click(FIRSTNAME_SELECTOR);
    await page.keyboard.type(searchPerson.firstname);

    await page.click(LASTNAME_SELECTOR);
    await page.keyboard.type(searchPerson.lastname);


    await page.click(CITY_SELECTOR);
    await page.keyboard.type(searchPerson.city);

    await page.select(STATE_SELECTOR, searchPerson.state);

    console.log("Info filled in. Clicking View Results button");

    await Promise.all([
        page.waitForNavigation({waitUntil: 'networkidle0', timeout: 5000}), // The promise resolves after navigation has finished
        page.click(VIEW_RESULTS_BUTTON_SELECTOR), // Clicking the link will indirectly cause a navigation
    ]).catch(function(err) {
        console.log(`Appears that no results were found for ${searchPerson.toString()}`);
    });
};