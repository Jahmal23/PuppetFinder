const SEARCH_URL = "https://www.fastpeoplesearch.com/";

const NAME_SELECTOR = "#search-name-name";
const CITY_STATE_SELECTOR = "#search-name-address"

const FREE_SEARCH_BUTTON_SELECTOR = "#form-search-name > div.search-form-buttons > button.search-form-button-submit.btn.btn-md.btn-primary";

exports.perform = async (page, searchPerson) => {
    
    console.log("Heading directly to search page");

    await Promise.all([
         page.waitForNavigation({waitUntil: 'networkidle0'}), // The promise resolves after navigation has finished
         await page.goto(SEARCH_URL)
     ]);


    console.log(`Filling in information to search ${searchPerson.toString()}`);

    await page.click(NAME_SELECTOR);
    await page.keyboard.type(`${searchPerson.firstname} ${searchPerson.lastname}`);

    await page.click(CITY_STATE_SELECTOR);
    await page.keyboard.type(`${searchPerson.city} , ${searchPerson.state}`);

    console.log("Info filled in. Clicking Free Search button");

    await Promise.all([
           page.waitForNavigation({waitUntil: 'networkidle0', timeout: 5000}), // The promise resolves after navigation has finished
           page.click(FREE_SEARCH_BUTTON_SELECTOR), // Clicking the link will indirectly cause a navigation
      ]).catch(function(err) {
          console.log(`Appears that no results were found for ${searchPerson.toString()}`);
     });
};