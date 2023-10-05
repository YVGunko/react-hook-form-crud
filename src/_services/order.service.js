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

function getAll(isUser, dateFrom, dateTill) {
  let queryParams = '';
  if (isUser) {
    const token = tokenService.get();
    queryParams = queryParams.concat(token ? `?userId=${token.id}` : '');
  }
  if (dateFrom) queryParams = queryParams.concat(isString(queryParams) ? `&dateFrom=${dateFrom}` : `?dateFrom=${dateFrom}`);
  if (dateTill) queryParams = queryParams.concat(isString(queryParams) ? `&dateFrom=${dateTill}` : `?dateFrom=${dateTill}`);

console.log('orderService getAll', queryParams);
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
