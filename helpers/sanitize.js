

exports.removeDuplicates = async (foundPersons) => {

    if (foundPersons.length === 0) return foundPersons;

    //todo rewrite this using a true filter
    filtered = [];

    //first person cannot be a duplicate in an empty list
    filtered.push(foundPersons[0]);

    for(let i = 1; i < foundPersons.length; i++){
        
        currentPerson = foundPersons[i];
        let isUnique = true;

        for(let j = 0; j < filtered.length; j++){

            alreadyAdded = filtered[j];

            if (currentPerson.isFamilyMember(alreadyAdded)) isUnique = false;
        }

        if (isUnique) filtered.push(currentPerson);
    }
    
    return filtered;
  
  }