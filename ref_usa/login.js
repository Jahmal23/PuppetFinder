const BASE_URL = "http://lalibcon.state.lib.la.us/redirect.php?illcode=s1no&database=refusa"
const REDIRECT_URL = "http://lalibcon.state.lib.la.us/redirect.php?illcode=s1jf&database=refusa"


exports.performLogin = async (page) => {
    await page.goto(BASE_URL);

    console.log("Ref USA base page loaded. Preparing to login");
};
