const BASE_URL = "http://lalibcon.state.lib.la.us/redirect.php?illcode=s1no&database=refusa"
const REDIRECT_URL = "http://lalibcon.state.lib.la.us/redirect.php?illcode=s1jf&database=refusa"

const BARCODE_SELECTOR = '#barcode';
const LIBRARY_CARD = process.env.LIBRARY_CARD;
const LOGIN_BUTTON_SELECTOR = "#loginbox > form > input[type=submit]:nth-child(5)";

exports.performLogin = async (page) => {
    await page.goto(BASE_URL);

    console.log("Ref USA base page loaded. Preparing to login");
    console.log("Adding in Library card info");

    await page.click(BARCODE_SELECTOR);

    await page.keyboard.type(LIBRARY_CARD);

    await Promise.all([
        page.waitForNavigation({waitUntil: 'networkidle0'}), // The promise resolves after navigation has finished
         page.click(LOGIN_BUTTON_SELECTOR), // Clicking the link will indirectly cause a navigation
    ]);

    //ref usa has a looooooong initial load time
    await page.waitFor(10*1000);
};
