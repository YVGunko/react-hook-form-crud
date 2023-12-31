import config from 'config';
import { fetchWrapper, isString } from '@/_helpers';

const baseUrl = `${config.apiUrl}/orderRows`;
const copyUrl = `${config.apiUrl}/orderRows/copy`;
const copyUrlSizeUp = `${config.apiUrl}/orderRows/copySizeUp`;

export const orderRowService = {
  getAll,
  getNew,
  getById,
  create,
  copy,
  copySizeUp,
  update,
  delete: del,
};

function getNew(orderId) {
  return {
    id: '',
    order_id: orderId,
    attribute: '',
    number: '0',
    barcode: '',
    product_id: '',
    sProduct: '',
    size: '',
    color_id: '',
    liner_id: '',
    shpalt_id: '',
    rant_id: '',
    sColor: '',
    sLiner: '',
    sShpalt: '',
    sRant: '',
    vstavka_id: '',
    sVstavka: '',
    gelenok_id: '',
    sGelenok: '',
    guba_id: '',
    sGuba: '',
    kabluk_id: '',
    sKabluk: '',
    matirovka_id: '',
    sMatirovka: '',
    pechat_id: '',
    sPechat: '',
    proshiv_id: '',
    sProshiv: '',
    pyatka_id: '',
    sPyatka: '',
    sled_id: '',
    sSled: '',
    spoyler_id: '',
    sSpoyler: '',
    ashpalt_id: '',
    sAshpalt: '',
    plastizol_id: '',
    sPlastizol: '',
    prodir: false,
    difersize: false,
    tert: false,
    frez: false,
    sample: false,
  };
}

function getAll(orderId) {
  let queryParams = '';
  if (orderId && isString(orderId)) {
    queryParams = queryParams.concat(`?orderId=${orderId}`);
    return fetchWrapper.get(`${baseUrl}${queryParams}`);
  }
  return getNew(orderId);
}

function getById(id, params) {
  return fetchWrapper.get(`${baseUrl}/${id}`, params);
}

function create(params) {
  return fetchWrapper.post(baseUrl, params);
}
function copy(params) {
  return fetchWrapper.post(copyUrl, params);
}
function copySizeUp(params) {
  return fetchWrapper.post(copyUrlSizeUp, params);
}

function update(id, params) {
  return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

function del(id) {
  return fetchWrapper.delete(`${baseUrl}/${id}`);
}
