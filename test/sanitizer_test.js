const sanitizer = require('../helpers/sanitize');
const persons = require('../helpers/persons');
const expect = require('chai').expect;

describe('#Sanitizer', function() {
    it('should remove dupes single element', async function() {
        let fpA = new persons.FoundPerson( "A", "A", "A" );

        let cleaned =  await sanitizer.removeDuplicates([fpA, fpA, fpA]); 
    
        let expected = [fpA]
    
        let matched = JSON.stringify(expected)===JSON.stringify(cleaned)

        expect(matched).to.equal(true);
    });

    it('should remove dupes', async function() {
        let fpA = new persons.FoundPerson( "A", "A", "A" );
        let fpB = new persons.FoundPerson( "B", "B", "B" );
    

        let cleaned =  await sanitizer.removeDuplicates([fpA, fpA, fpB, fpA, fpB, fpB, fpA, fpB]); 
    
        //not guaranteed to be ordered
        let expected1 = [fpA, fpB];
        let expected2 = [fpB, fpA];
    

        let matched = JSON.stringify(expected1)===JSON.stringify(cleaned) ||
                   JSON.stringify(expected2)===JSON.stringify(cleaned);

        expect(matched).to.equal(true);
    });

    it('should not remove dupes', async function() {
        let fpA = new persons.FoundPerson( "A", "A", "A" );
        let fpB = new persons.FoundPerson( "B", "B", "B" );
        let fpC = new persons.FoundPerson( "C", "C", "C" );

        let cleaned =  await sanitizer.removeDuplicates([fpA, fpB, fpC]); 
        let expected = [fpA, fpB, fpC];

        expect(JSON.stringify(expected)===JSON.stringify(cleaned)).to.equal(true);
    });
  });