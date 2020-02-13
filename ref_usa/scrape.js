
BASE_URL = "http://www.referenceusa.com/UsWhitePages/Result/"

const RESULTS_TABLE_SELECTOR = '#tblResults tr td'

exports.perform = async (page) => {

    if (!page.url().includes(BASE_URL)) {
        console.log(`Unexpected starting url ${BASE_URL} for result page`);
        return;
    }

    console.log("On results page, attempting to compile results ");

    await scrapeCurrentPage(page);
};

async function scrapeCurrentPage(page, pageNum = 1) {

    console.log("About to try and dump the Ref Usa results table");
    const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('#tblResults tr td')); //todo why do I have to hardcode this?
        return tds.map(td => td.innerHTML);
    });

    console.log(data[1]);
}






