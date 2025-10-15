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

function search(term) {
  if (!term || term.length < 2) {
    return Promise.resolve([]);
  }
  
  return fetchWrapper.get(`${baseUrl}/search?term=${encodeURIComponent(term)}&limit=20`)
    .catch(error => {
      console.error('Error searching customers:', error);
      return [];
    });
}

export const productService = {
  getAll,
  getById,
  search,
};


