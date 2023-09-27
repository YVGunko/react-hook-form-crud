import config from 'config';
import { fetchWrapper, isString  } from '@/_helpers';

const baseUrl = `${config.apiUrl}/products`;

export const productService = {
  getAll,
  getById,
};

function getAll(divisionCode) {
  let queryParams = '';
  if (divisionCode && isString(divisionCode)) {
    queryParams = queryParams.concat(`?division_code=${divisionCode}`);
    return fetchWrapper.get(`${baseUrl}${queryParams}`);
  }
  return getNew();
}

function getById(id) {
  return fetchWrapper.get(`${baseUrl}/${id}`);
}
