import config from 'config';
import { fetchWrapper } from '@/_helpers';
import { isString, isStringInValid } from '@/_helpers';

const baseUrl = `${config.apiUrl}/orders`;

export const orderService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

function getAll(customerId, userId, page, pageSize) {
    var queryParams = '';
    if (customerId) queryParams = queryParams.concat(isString(customerId) ? `?customerId=${customerId}` : ``);
    if (userId) queryParams = queryParams.concat(isString(queryParams) ? `&userId=${userId}` : `?userId=${userId}`);
    if (page) queryParams = queryParams.concat (isString(queryParams) ? `&page=${page}` : `?page=${page}`);
    if (pageSize) queryParams = queryParams.concat(isString(queryParams) ? `&size=${pageSize}` : `?size=${pageSize}`);

    return fetchWrapper.get(`${baseUrl}${queryParams}`);
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
