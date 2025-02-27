(function() {
    const requestManager = new RequestManager('https://jsonplaceholder.typicode.com/users');
    const tableManager = new TableManager();

    const dataTable = document.querySelector('#data-table');
    const dataForm = document.querySelector('#data-form');
    const requestSelector = dataForm.querySelector('#action');
    const generalInfo = dataForm.querySelector('#general-info');
    const addressInfo = dataForm.querySelector('#address-details');
    const companyInfo = dataForm.querySelector('#company-details');
    const id = dataForm.querySelector('#id');

    let users = [];

    function hideFormInputs() {
      if (!generalInfo.classList.contains('hide')) generalInfo.classList.toggle('hide');
      if (!addressInfo.classList.contains('hide')) addressInfo.classList.toggle('hide');
      if (!companyInfo.classList.contains('hide')) companyInfo.classList.toggle('hide');
    }

    function displayFormInputs() {
      if (generalInfo.classList.contains('hide')) generalInfo.classList.toggle('hide');
      if (addressInfo.classList.contains('hide')) addressInfo.classList.toggle('hide');
      if (companyInfo.classList.contains('hide')) companyInfo.classList.toggle('hide');
    }

    function hideIdField(hide) {
      if (hide) id.classList.add('hide');
      else id.classList.remove('hide');
    }
    
    function renderUserTable(users) {
      const table = tableManager.createTable(userHeaders, users);
      dataTable.replaceChildren(table);
    }

    function addUserToTable(user) {
      console.log(user);
      const tableBody = dataTable.querySelector('tbody');
      tableBody.appendChild(tableManager.createTableRow(tableManager.getValuesInOrder(userHeaders, user)));
    }

    function createUserFromFormObj(dataObject) {
      const address = new Address(dataObject.street, dataObject.city, dataObject.suite, dataObject.zipcode, new Geolatitude(dataObject.lat, dataObject.lng));
      const company = new Company(dataObject['company-name'], dataObject.bs, dataObject['catch-phrase']);
      const user = new User(dataObject.name, dataObject.username, dataObject.email, dataObject.phone, address, dataObject.website, company, dataObject.id);
      return user;
    }

    function handleFormSubmission(event) {
      event.preventDefault(); // prevent default page refresh on submit
      const form = event.currentTarget;
      const formData = new FormData(form);
      const dataObject = Object.fromEntries(formData.entries());

      let user;
      switch (requestSelector.value) {
        case 'GET':
          requestManager.setPayload('');
          requestManager.setRequestMethod('GET');

          requestManager.sendRequest().then(response => response.json())
                                      .then(data => renderUserTable(data))
                                      .catch(err => handleError(err));
          break;
        case 'POST':
          user = createUserFromFormObj(dataObject);
          requestManager.setRequestMethod('POST');
          requestManager.setPayload(JSON.stringify(user));
          requestManager.setHeaders({
            'Content-type': 'application/json'
          });

          requestManager.sendRequest().then(response => response.json())
                                      .then(data => addUserToTable(data))
                                      .catch(err => handleError(err));
          break;
        case 'PUT':
          user = createUserFromFormObj(dataObject);
          break;
        case 'DELETE':

          break;
      }
    }


    // event listeners and page initialisation

    // initialise user table with data and render on screen
    requestManager.sendRequest()
                  .then(response => response.json())
                  .then(response => {
                    users = response;
                    renderUserTable(users)
                  })
                  .catch(err => handleError(err));

    // handle form submissions
    // - calls handleFormSubmission(event) when the submit button is clicked
    dataForm.addEventListener('submit', handleFormSubmission);

    // change form appearance dependent on option selected
    requestSelector.addEventListener('change', (event) => {
      const select = event.currentTarget;
      
      switch (select.value) {
        case 'GET': 
          hideFormInputs();
          break;
        case 'POST':
          displayFormInputs();
          hideIdField(true);
          break;
        case 'PUT':
          displayFormInputs();
          hideIdField(false);
          break;
        case 'DELETE':
          // TODO
          break;
      }
    });
})();