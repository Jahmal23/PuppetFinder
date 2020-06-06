const createCsvWriter = require('csv-writer').createObjectCsvWriter;

exports.writeCSV = async (header, path, records, writer = null) => {
    
    if (records.length == 0) {
        console.log('no records, skipping csv creation');
        return false;
    }

    let csvWriter = writer ? writer : createCsvWriter({
        path: path,
        header: header
    });

    await csvWriter.writeRecords(records)  
        .then(() => {
            console.log('...Done creating CSV');
        });

    return true;
}
