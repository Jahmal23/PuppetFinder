const csvWriter = require('../helpers/csv_writer');
const persons = require('../helpers/persons');
const expect = require('chai').expect;

describe('#CSV', function() {
    it('should write', async function() {
        let mock_writer = {};
        mock_writer.promise = {
            then: function () {
           }
        };
        mock_writer.writeRecords = function(p){return this.promise;}

        let foundPersons = [new persons.FoundPerson( "FOO", "Foo street", "123-345" )];

        let success = await csvWriter.writeCSV([
            {id: 'lastname', title: 'LastName'},
            {id: 'address', title: 'Address'},
            {id: 'telephone', title: 'Telephone'}], `results.csv`, foundPersons, mock_writer);           

        expect(success).to.equal(true);
    });

    it('should not send', async function() {
        let foundPersons = [];

        let success = await csvWriter.writeCSV([
            {id: 'lastname', title: 'LastName'},
            {id: 'address', title: 'Address'},
            {id: 'telephone', title: 'Telephone'}], `results.csv`, foundPersons);           

        expect(success).to.equal(false);
    });
  });