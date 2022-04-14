function Geolatitude(lat, lng) {
    this.lat = lat;
    this.lng = lng;
    this.toString = function() {
        return `lat: ${this.lat}, long: ${this.lng}`;
    }
}

function Address(street, city, suite, zipcode, geo) {
    console.log(geo)
    this.street = street;
    this.city = city;
    this.suite = suite;
    this.zipcode = zipcode;
    this.geo = geo;
    this.toString = function() {
        let output = `${street}\n${city}\n${zipcode}`;
        return output;
    }
}

function Company(name, bs, catchPhrase) {
    this.name = name;
    this.bs = bs;
    this.catchPhrase = catchPhrase;
}

function User(name, username, email, phone, address, website, company, id = null) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.phone = phone;
    this.website = website;
    this.address = new Address(address.street, address.city, address.suite, address.zipcode, new Geolatitude(address.geo.lat, address.geo.lng));;
    this.company = new Company(company['company-name'], company.bs, company['catch-phrase']);
    this.id = id;
}

const userHeaders = ['id', 'name', 'username', 'email', 'phone', 'website', 'address', 'company'];

// containerElement is the element we want to render the table into
// users is an array of objects representing user data
function renderUserTable(users, containerElement) {
    const tableManager = new TableManager();
    const table = tableManager.createTable(userHeaders, users);
    containerElement.replaceChildren(table);
}