class FoundPerson {
    constructor(lastname, address, telephone) {
        this.lastname = lastname;
        this.address = address;
        this.telephone = telephone;
    }
}

class SearchPerson {
    constructor(firstName, lastName, city, state) {
        this.firstname = firstName;
        this.lastname = lastName;
        this.city = city;
        this.state = state;
    }

    toString() {
        return `${this.firstname} ${this.lastname} ${this.city} ${this.state}`;
    }
}

module.exports = {
    FoundPerson, SearchPerson
}