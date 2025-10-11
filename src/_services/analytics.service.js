import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/analytics`;

function getOrderAnalytics(params) {
  return fetchWrapper.post(`${baseUrl}/orders`, params);
}

function exportAnalytics(params) {
  return fetchWrapper.post(`${baseUrl}/export`, params);
}

// Дополнительные методы аналитики
function getCustomerAnalytics(params) {
  return fetchWrapper.post(`${baseUrl}/customers`, params);
}

function getProductAnalytics(params) {
  return fetchWrapper.post(`${baseUrl}/products`, params);
}

// Метод для получения сводной статистики
function getSummary(params) {
  return fetchWrapper.post(`${baseUrl}/summary`, params);
}

// Метод для получения трендов
function getTrends(params) {
  return fetchWrapper.post(`${baseUrl}/trends`, params);
}

export const analyticsService = {
  getOrderAnalytics,
  exportAnalytics,
  getCustomerAnalytics,
  getProductAnalytics,
  getSummary,
  getTrends
};