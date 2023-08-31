export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete
};

function get(url, credentials) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 
            'Accept': 'application/json', 
            "Authorization": 'Basic ' + btoa(credentials.username+':'+credentials.password)},
    };
    return fetch(url, requestOptions)
    .then(handleErrors)
        .then(handleResponse)
        .catch(error => console.log(error) );
}

function post(url, credentials, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 
            'Accept': 'application/json', 
            "Authorization": 'Basic ' + btoa(credentials.username+':'+credentials.password)}, 
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions)
    .then(handleErrors)
        .then(handleResponse)
        .catch(error => console.log(error) );
}

function put(url, credentials, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 
            'Accept': 'application/json', 
            "Authorization": 'Basic ' + btoa(credentials.username+':'+credentials.password)},
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions)
    .then(handleErrors)
    .then(handleResponse)
    .catch(error => console.log(error) );   
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url, credentials) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 
            'Accept': 'application/json', 
            "Authorization": 'Basic ' + btoa(credentials.username+':'+credentials.password)},
    };
    return fetch(url, requestOptions)
        .then(handleErrors)
        .then(handleResponse)
        .catch(error => console.log(error) );
}

// helper functions

function handleResponse(response) {
    console.log(`fetchWrapper, handleResponse start`);
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            console.log(`fetchWrapper, error ${error}`);
            return Promise.reject(error);
        }

        return data;
    });
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(`fetchWrapper, handleErrors ${response.statusText}`);
        throw Error(response.statusText);
    }
    return response;
}