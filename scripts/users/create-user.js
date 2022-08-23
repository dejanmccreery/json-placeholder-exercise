(function() {
    // table for displaying result of a create
    const dataTable = document.querySelector('#data-table');
    // form for getting input data for creating new users
    const dataForm = document.querySelector('#data-form');

    function createUserFromFormObj(dataObject) {
        const address = new Address(dataObject.street, dataObject.city, dataObject.suite, dataObject.zipcode, new Geolatitude(dataObject.lat, dataObject.lng));
        const company = new Company(dataObject['company-name'], dataObject.bs, dataObject['catch-phrase']);
        const user = new User(dataObject.name, dataObject.username, dataObject.email, dataObject.phone, address, dataObject.website, company, dataObject.id);
        return user;
    }

    function create() {
        // form data as a js object, all inputs are directly accessible via dot notation
        const formData = new FormData(dataForm);
        const formDataObject = Object.fromEntries(formData.entries());
        // { username: "", street: "", city: "", etc...}
        // - street and city should be in a nested address object but are not
        // - use createUserFromFormObj() to create an appropriate User instance

        setStatus('PREPARING POST REQUEST');
        
        // this fetch request has options as the second parameter
        fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST', // request method
            body: JSON.stringify(createUserFromFormObj(formDataObject)),
            headers: {
                'Content-type': 'application/json' // has json data in the body
            }
        }).then(response => {
            setStatus('RECEIVED RESPONSE');
            // response.ok checks if the response code is between 200 - 206
            // - returns a true value if it is, otherwise false
            if (response.ok) return response.json();
            else throw new Error('Uh oh, something went wrong...');
        })
          .then(user => {
            setStatus('RENDERING TABLE');
            // user is put in an array because renderUserTable() accepts an array of users
            renderUserTable([user], dataTable);
            setStatus('RESPONSE RENDERED INTO TABLE');
        })
          .catch(error => {
            setStatus('ERROR ENCOUNTERED');
            handleError(error);
        });
    }

    function handleFormSubmission(event) {
        // prevent form submission from refreshing page in this case, returning false also does the same
        // - more generally, preventDefault() prevents default behaviours of an event
        event.preventDefault(); 
        create();
        //return false;
    }

    // initialise an event listener for submit events on the form
    dataForm.addEventListener('submit', handleFormSubmission);
})();