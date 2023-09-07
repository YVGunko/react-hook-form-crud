import config from 'config';
import { fetchWrapper, isString } from '@/_helpers';
import { tokenService } from '@/_services';

const baseUrl = `${config.apiUrl}/orders`;

export const orderService = {
  getAll,
  getNew,
  getById,
  create,
  update,
  delete: del,
};

function getAll(customerId, userId, page, pageSize) {
  let queryParams = '';
  if (customerId) queryParams = queryParams.concat(isString(customerId) ? `?customerId=${customerId}` : '');
  if (userId) queryParams = queryParams.concat(isString(queryParams) ? `&userId=${userId}` : `?userId=${userId}`);
  if (page) queryParams = queryParams.concat(isString(queryParams) ? `&page=${page}` : `?page=${page}`);
  if (pageSize) queryParams = queryParams.concat(isString(queryParams) ? `&size=${pageSize}` : `?size=${pageSize}`);

  return fetchWrapper.get(`${baseUrl}${queryParams}`);
}

function getById(id) {
  return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
  console.log('orderService getById', params);
  return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
  return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

// prefixed with underscored because delete is a reserved word in javascript
function del(id) {
  return fetchWrapper.delete(`${baseUrl}/${id}`);
}

function getNew() {
  const token = tokenService.get();
  return {
    id: '',
    comment: '',
    details: '',
    customer_id: '',
    customer_name: '',
    division_code: '',
    division_name: '',
    user_id: token ? token.id : '',
    user_name: token ? token.username : '',
    sample: false,
    date: '',
  };
}
