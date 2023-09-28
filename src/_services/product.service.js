import config from 'config';
import { fetchWrapper, isString } from '@/_helpers';

const baseUrl = `${config.apiUrl}/products`;

function getAll(divisionCode) {
  console.log('productService getAll divisionCode', divisionCode);
  let queryParams = '';
  //if !(divisionCode && isString(divisionCode)) {
  queryParams = queryParams.concat(`?division_code=${divisionCode}`);
  return fetchWrapper.get(`${baseUrl}${queryParams}`);
}

function getById(id) {
  return fetchWrapper.get(`${baseUrl}/${id}`);
}
// eslint-disable-next-line import/prefer-default-export
export const productService = {
  getAll,
  getById,
};


