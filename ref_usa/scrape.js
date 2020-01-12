
BASE_URL = "http://www.referenceusa.com/UsWhitePages/Result/"

const RESULTS_TABLE_SELECTOR = "#tblResults"

exports.perform = async (page) => {

    if (!page.url().includes(BASE_URL)) {
        console.log(`Unexpected starting url ${BASE_URL} for result page`);
        return;
    }

    console.log("On results page, attempting to compile results ");

    

};

async function scrapeCurrentPage(pageNum = 1) {







}


