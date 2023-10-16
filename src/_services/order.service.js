/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import config from 'config';
import { fetchWrapper, isString } from '@/_helpers';
import { tokenService } from '@/_services';

const baseUrl = `${config.apiUrl}/orders`;

function getAll(dateFrom, dateTill, isUser, customer_id, division_code) {
  let queryParams = '';
  const token = tokenService.get();
  if (token && isUser) queryParams = queryParams.concat(token ? `?userId=${token.id}` : '');
  if (token && isString(token.filial)) { queryParams = queryParams.concat(isString(queryParams) ? `&filial_id=${token.filial_id}` : `?filial_id=${token.filial_id}`); }
  if (customer_id) queryParams = queryParams.concat(isString(queryParams) ? `&customer_id=${customer_id}` : `?customer_id=${customer_id}`);
  if (division_code) queryParams = queryParams.concat(isString(queryParams) ? `&division_code=${division_code}` : `?division_code=${division_code}`);
  if (dateFrom) queryParams = queryParams.concat(isString(queryParams) ? `&dateFrom=${dateFrom}` : `?dateFrom=${dateFrom}`);
  if (dateTill) queryParams = queryParams.concat(isString(queryParams) ? `&dateTill=${dateTill}` : `?dateTill=${dateTill}`);

  return fetchWrapper.get(`${baseUrl}${queryParams}`);
}

function getById(id) {
  return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
  return fetchWrapper.post(baseUrl, params);
}

function copy(params) {
  return fetchWrapper.post(`${baseUrl}/copy`, params);
}

function sendMail(params) {
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
