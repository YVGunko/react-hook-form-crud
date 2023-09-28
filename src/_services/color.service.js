import config from 'config';
import { fetchWrapper, isString } from '@/_helpers';

const baseUrl = `${config.apiUrl}/colors`;

export const colorService = {
  getAll,
  getById,
};

function getAll(divisionCode) {
  let queryParams = '';
  if (divisionCode && isString(divisionCode)) {
    queryParams = queryParams.concat(`?division_code=${divisionCode}`);
    return fetchWrapper.get(`${baseUrl}${queryParams}`);
  }
}

function getById(id) {
  return fetchWrapper.get(`${baseUrl}/${id}`);
}
