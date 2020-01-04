const BASE_URL = "TermsAndConditions"

const ACCEPT_SELECTOR = "#chkAgree"
const CONTINUE_BUTTON_SELECTOR = "#TACForm > fieldset > div > ul > li:nth-child(2) > div > a.originButton.ui-priority-primary.action-agree.tcButton > span > span"

exports.accept = async (page) => {

    if (!page.url().includes(BASE_URL)) {
        console.log(`Unexpected starting url ${BASE_URL} for terms and conditions`);
        return;
    }

    console.log("On Terms and conditions, about to check agree box");

    // await page.click(BARCODE_SELECTOR);
    //
    // await page.keyboard.type(LIBRARY_CARD);
    //
    // await Promise.all([
    //     page.waitForNavigation({waitUntil: 'networkidle0'}), // The promise resolves after navigation has finished
    //     page.click(LOGIN_BUTTON_SELECTOR), // Clicking the link will indirectly cause a navigation
    // ]);
    //
    // //ref usa has a looooooong initial load time
    // await page.waitFor(10*1000);
};
