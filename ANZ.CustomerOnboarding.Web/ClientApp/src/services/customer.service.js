import { authHeader } from '../helpers/authHeader';
import { handleResponse } from '../helpers/handleResponse';

export const customerService = {
    searchCustomer,
    searchCustomerByName,
    addCustomer,
    editCustomer,
    viewCustomer
};

//keeping it as a POST. At times the criteria text can be too long exceeding
//browser limits.
function searchCustomer(searchCriteria) {

    const multipleheaders = new Headers();
    multipleheaders.append('Content-Type', 'application/json');
    multipleheaders.append('Authorization', authHeader());
    const requestOptions = {
        method: 'POST',
        headers: multipleheaders,
        body: JSON.stringify(searchCriteria)
    };

    return fetch('api/customer/search', requestOptions)
        .then(handleResponse);

}


function searchCustomerByName(searchCriteria) {

    const multipleheaders = new Headers();
    multipleheaders.append('Content-Type', 'application/json');
    multipleheaders.append('Authorization', authHeader());
    const requestOptions = {
        method: 'POST',
        headers: multipleheaders,
        body: JSON.stringify(searchCriteria)
    };

    return fetch('api/customer/searchCustomerByName', requestOptions)
        .then(handleResponse);

}

function addCustomer(customer) {

    const multipleheaders = new Headers();
    multipleheaders.append('Content-Type', 'application/json');
    multipleheaders.append('Authorization', authHeader());
    const requestOptions = {
        method: 'POST',
        headers: multipleheaders,
        body: JSON.stringify(customer)
    };

    return fetch('api/customer/add', requestOptions)
        .then(handleResponse);

}

function editCustomer(customer) {

    const multipleheaders = new Headers();
    multipleheaders.append('Content-Type', 'application/json');
    multipleheaders.append('Authorization', authHeader());
    const requestOptions = {
        method: 'POST',
        headers: multipleheaders,
        body: JSON.stringify(customer)
    };

    return fetch('api/customer/edit', requestOptions)
        .then(handleResponse);

}


function viewCustomer(customerId) {

    const multipleheaders = new Headers();
    multipleheaders.append('Content-Type', 'application/json');
    multipleheaders.append('Authorization', authHeader());
    const requestOptions = {
        method: 'GET',
        headers: multipleheaders
    };

    return fetch('api/customer/view?customerId=' + customerId, requestOptions)
        .then(handleResponse);

}
