/* eslint-disable import/prefer-default-export */
import config from 'config';
import { fetchWrapper, isString } from '@/_helpers';
import { tokenService } from '@/_services';

const baseUrl = `${config.apiUrl}/orders`;

function getAll(isUser, dateFrom, dateTill) {
  let queryParams = '';
  if (isUser) {
    const token = tokenService.get();
    queryParams = queryParams.concat(token ? `?userId=${token.id}` : '');
  }
  if (dateFrom) queryParams = queryParams.concat(isString(queryParams) ? `&dateFrom=${dateFrom}` : `?dateFrom=${dateFrom}`);
  if (dateTill) queryParams = queryParams.concat(isString(queryParams) ? `&dateTill=${dateTill}` : `?dateTill=${dateTill}`);

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

function copy(params) {
  console.log('orderService copy', params);
  return fetchWrapper.post(`${baseUrl}/copy`, params);
}

function sendMail(params) {
  console.log('orderService sendMail', params);
  return fetchWrapper.post(`${baseUrl}/sendMail?id=${params}`, {});
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
    // eslint-disable-next-line no-nested-ternary
    comment: token ? (token.filial ? token.filial : '') : '',
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

export const orderService = {
  getAll,
  getNew,
  getById,
  create,
  copy,
  sendMail,
  update,
  delete: del,
};
