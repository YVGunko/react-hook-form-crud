import config from 'config';
import { fetchWrapper, isString, isStringInValid, isValidEmail } from '@/_helpers';

const baseUrl = `${config.apiUrl}/customers`;
const NEW_VALUE = 'new';

const fields = ['id', 'name', 'email', 'phone'];

function getNew(props) {
  const {name} = props;
  return {
    id : NEW_VALUE,
    name: name,
    email: 'email',
    phone: 'phone',
  };
}
function getAll(filter, page, pageSize) {
  let queryParams = '';
  if (isString(filter) && !isStringInValid(filter, 1)) queryParams = `?title=${filter}`;
  if (page) queryParams = queryParams.concat(isString(queryParams) ? `&page=${page}` : `?page=${page}`);
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

function del(id) {
  return fetchWrapper.delete(`${baseUrl}/${id}`);
}

function isEmail(id) {
  return isValidEmail(fetchWrapper.get(`${baseUrl}/${id}`).email);
}

export const customerService = {
  getAll,
  getById,
  create,
  update,
  delete: del,
  fields,
  getNew,
  NEW_VALUE,
  isEmail,
};
