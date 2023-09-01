import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/divisions`;

export const divisionService = {
    getAll,
    getById,
};

function getAll() {
    return fetchWrapper.get(`${baseUrl}`);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}