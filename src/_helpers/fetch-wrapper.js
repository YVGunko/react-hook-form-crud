export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete,
    auth: _auth,
};

const opts = {};
const headers = {'Content-Type': 'application/json', 
                'Accept': 'application/json', };
const body = JSON.stringify({});

// helper functions
function setAuth () {
    console.log(`fetchWrapper, setAuth start`);
    const tokenString = sessionStorage.getItem('token');
    const token = JSON.parse(tokenString);

    if (token) {
        console.log(`fetchWrapper, setAuth token`);
        headers.Authorization = `Basic ${btoa(token.username+':'+token.password)}`;
    }
}
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

async function _auth(url, credentials) {
    let options;
    options = Object.assign({headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'Basic ' + btoa(credentials.username+':'+credentials.password)
    }},{ method: `POST` }, credentials ? { body: JSON.stringify(credentials) } : null );
    try {
        const res = await fetch(url, options);
        if (res.ok) {
            return await (opts.raw ? res.text() : res.json());
        }
    
        const err = await res.json();

        throw new Error(err.message || err.statusText);
    } catch (error) {
        throw new Error(err);
    }
}

async function get(url) {
    setAuth();

    const requestOptions = {
        method: 'GET',
        headers,
    };
    try {
        const res = await fetch(url, requestOptions);

        if (res.ok) {
            return await (opts.raw ? res.text() : res.json());
        }
    
        const err = await res.json();

        throw new Error(err.message || err.statusText);
    } catch (error) {
        throw new Error(err);
    }
}

function post(url, body) {
    setAuth;
    const requestOptions = {
        method: 'POST',
        headers, 
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions)
    .then(handleErrors)
        .then(handleResponse)
        .catch(error => console.log(error) );
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions)
    .then(handleErrors)
    .then(handleResponse)
    .catch(error => console.log(error) );   
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers,
    };
    return fetch(url, requestOptions)
        .then(handleErrors)
        .then(handleResponse)
        .catch(error => console.log(error) );
}



function handleErrors(response) {
    if (!response.ok) {
        console.log(`fetchWrapper, handleErrors ${response.statusText}`);
        throw Error(response.statusText);
    }
    return response;
}