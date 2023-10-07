import { tokenService } from '@/_services';

const opts = {};
const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// helper functions
function setAuth() {
  const token = tokenService.get();

  if (token) {
    headers.Authorization = `Basic ${btoa(`${token.username}:${token.password}`)}`;
  }
}
function handleResponse(response) {
  console.log('fetchWrapper, handleResponse start');

  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      console.error(`fetchWrapper, error ${error}`);
      return Promise.reject(error);
    }

    return data;
  });
}
function handleErrors(response) {
  if (!response.ok) {
    console.error(`fetchWrapper, handleErrors ${response.statusText}`);
    throw Error(response.statusText);
  }
  return response;
}

async function auth(url, credentials) {
  const options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
    },
    method: 'POST',
    ...(credentials ? { body: JSON.stringify(credentials) } : null),
  };
  try {
    const res = await fetch(url, options);
    if (res.ok) {
      return await (opts.raw ? res.text() : res.json());
    }

    const err = await res.json();

    throw new Error(err.message || err.statusText);
  } catch (error) {
    throw new Error(error);
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
    throw new Error(error);
  }
}

async function post(url, body) {
  setAuth();
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  };
  try {
    console.log('fetchWrapper post', requestOptions);
    const response = await fetch(url, requestOptions);
    const responseNoErrors = await handleErrors(response);
    return handleResponse(responseNoErrors);
  } catch (error) {
    return console.log(error);
  }
}

function put(url, body) {
  setAuth();
  const requestOptions = {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions)
    .then(handleErrors)
    .then(handleResponse)
    .catch((error) => console.log(error));
}

// prefixed with underscored because delete is a reserved word in javascript
function del(url) {
  setAuth();
  const requestOptions = {
    method: 'DELETE',
    headers,
  };
  return fetch(url, requestOptions)
    .then(handleErrors)
    .then(handleResponse)
    .catch((error) => console.log(error));
}

const fetchWrapper = {
  get,
  post,
  put,
  delete: del,
  auth,
};
export { fetchWrapper };
