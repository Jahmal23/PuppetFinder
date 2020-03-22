const createCsvWriter = require('csv-writer').createObjectCsvWriter;

exports.writeCSV = async (header, path, records) => {

    const csvWriter = createCsvWriter({
        path: path,
        header: header
    });
     
    await csvWriter.writeRecords(records)  
        .then(() => {
            console.log('...Done creating CSV');
        });
}
