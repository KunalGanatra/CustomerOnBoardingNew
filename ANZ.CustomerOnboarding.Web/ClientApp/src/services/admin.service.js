import { authHeader } from '../helpers/authHeader';
import { handleResponse } from '../helpers/handleResponse';

export const adminService = {
    searchUser,
    addUser,
    editUser
};

//keeping it as a POST. At times the criteria text can be too long exceeding
//browser limits.
function searchUser(searchCriteria) {

    const multipleheaders = new Headers();
    multipleheaders.append('Content-Type', 'application/json');
    multipleheaders.append('Authorization', authHeader());
    const requestOptions = {
        method: 'POST',
        headers: multipleheaders,
        body: JSON.stringify(searchCriteria)
    };

    return fetch('api/user/search', requestOptions)
        .then(handleResponse);


}

function addUser(user) {

    const multipleheaders = new Headers();
    multipleheaders.append('Content-Type', 'application/json');
    multipleheaders.append('Authorization', authHeader());
    const requestOptions = {
        method: 'POST',
        headers: multipleheaders,
        body: JSON.stringify(user)
    };

    return fetch('api/user/add', requestOptions)
        .then(handleResponse);

}

function editUser(user) {

    const multipleheaders = new Headers();
    multipleheaders.append('Content-Type', 'application/json');
    multipleheaders.append('Authorization', authHeader());
    const requestOptions = {
        method: 'POST',
        headers: multipleheaders,
        body: JSON.stringify(user)
    };

    return fetch('api/user/edit', requestOptions)
        .then(handleResponse);

}
