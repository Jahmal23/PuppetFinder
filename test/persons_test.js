const persons = require('../helpers/persons');
var expect = require('chai').expect;

describe('#Persons', function() {
    it('should be a family member', async function() {
        let fpA = new persons.FoundPerson( "SameLastName", "SameHouse", "PhoneNumber" );
        let fpB = new persons.FoundPerson( "SameLastName", "SameHouse", "Different PhoneNumber" );
    
        expect(fpA.isFamilyMember(fpB)).to.equal(true);
    });

    it('should NOT be a family member', async function() {
        let fpA = new persons.FoundPerson( "SameLastName", "SameHouse", "PhoneNumber" );
        let fpB = new persons.FoundPerson( "SameLastName", "Diff House", "Different PhoneNumber" );
        let fpC = new persons.FoundPerson( "Diff LastName", "SameHouse", "Different PhoneNumber" );
    
        expect(fpA.isFamilyMember(fpB)).to.equal(false);
        expect(fpA.isFamilyMember(fpC)).to.equal(false);
    });

  });
