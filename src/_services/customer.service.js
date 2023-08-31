import config from 'config';
import { fetchWrapper } from '@/_helpers';
import { isString, isStringInValid } from '@/_helpers';

const baseUrl = `${config.apiUrl}/customers`;

export const customerService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

function getAll(filter, page, pageSize) {
    let queryParams = ``;
    if (isString(filter) && !isStringInValid(filter,1)) queryParams = `?title=${filter}`;
    queryParams.concat (isString(queryParams) ? `&page=${page}` : `?page=${page}`);
    queryParams.concat (isString(queryParams) ? `&size=${pageSize}` : `?size=${pageSize}`);
    
    return fetchWrapper.get(url);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}
