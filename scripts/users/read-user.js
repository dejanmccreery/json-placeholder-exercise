(function() {
    const requestSelector = document.querySelector('#method');
    const dataTable = document.querySelector('#data-table');
    const dataForm = document.querySelector('#data-form');
    const userIdField = document.querySelector('#user-id-field');
    const id = document.querySelector('#id');

    function toggleIdVisibility(isVisible) {
        if (isVisible) {
            if (userIdField.classList.contains('hide')) userIdField.classList.remove('hide');
        } else {
            if (!userIdField.classList.contains('hide')) userIdField.classList.add('hide');
        }
    }

    function readAll() {
        setStatus('PREPARING GET REQUEST');

        fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'GET'
        }).then(response => {
            setStatus('RECEIVED RESPONSE');
            if (response.ok) return response.json();
            else throw new Error('Uh oh, something went wrong...');
        })
          .then(users => {
            setStatus('RENDERING TABLE');
            renderUserTable(users, dataTable);
            setStatus('RESPONSE RENDERED INTO TABLE');
        })
          .catch(error => {
            setStatus('ERROR ENCOUNTERED');
            handleError(error);
        });
    }

    function readById() {
        setStatus('PREPARING GET REQUEST');

        fetch(`https://jsonplaceholder.typicode.com/users/${id.value}`, {
            method: 'GET'
        }).then(response => {
            setStatus('RECEIVED RESPONSE');
            if (response.ok) return response.json();
            else throw new Error('Uh oh, something went wrong...');
        })
          .then(user => {
            setStatus('RENDERING TABLE');
            renderUserTable([user], dataTable);
            setStatus('RESPONSE RENDERED INTO TABLE');
        })
          .catch(error => {
            setStatus('ERROR ENCOUNTERED');
            handleError(error);
        });
    }

    // default initialisation
    readAll();

    requestSelector.addEventListener('change', function(event) {
        // access the current element that we are adding an event to with 'this'
        if (this.value == 'ALL') {
            toggleIdVisibility(false);
        } else if (this.value == 'ID') {
            toggleIdVisibility(true);
        }
    });

    dataForm.addEventListener('submit', function(event) {
        event.preventDefault(); // prevent default page refresh on form submission
        if (requestSelector.value == 'ALL') readAll();
        else if (requestSelector.value == 'ID') readById();
    });
})();