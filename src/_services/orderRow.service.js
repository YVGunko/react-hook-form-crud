import config from 'config';
import { fetchWrapper, isString } from '@/_helpers';
import { tokenService } from '@/_services';

const baseUrl = `${config.apiUrl}/orderRows`;

export const orderRowService = {
  getAll,
  getNew,
  getById,
  create,
  update,
  delete: del,
};

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

function getAll(orderId) {
  let queryParams = '';
  if (orderId && isString(orderId)) {
    queryParams = queryParams.concat(`?orderId=${orderId}`);
    return fetchWrapper.get(`${baseUrl}${queryParams}`);
  }
  return getNew();
}

function getById(id, params) {
  console.log('orderRowService getById', params);
  return fetchWrapper.get(`${baseUrl}/${id}`, params);
}

function create(params) {
  console.log('orderRowService create', params);
  return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
  console.log('orderRowService update', params);
  return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

// prefixed with underscored because delete is a reserved word in javascript
function del(id, params) {
  return fetchWrapper.delete(`${baseUrl}/${id}`, params);
}
