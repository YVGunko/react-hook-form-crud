import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/products`;

function getAll(divisionCode) {
  let queryParams = '';
  queryParams = queryParams.concat(`?division_code=${divisionCode}`);
  return fetchWrapper.get(`${baseUrl}${queryParams}`);
}

function getById(id) {
  return fetchWrapper.get(`${baseUrl}/${id}`);
}

export const productService = {
  getAll,
  getById,
};


