import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/analytics`;

// Общая аналитика по заказам
function getOrderAnalytics(params) {
  return fetchWrapper.post(`${baseUrl}/orders`, params);
}

// Экспорт данных
function exportAnalytics(params) {
  return fetchWrapper.post(`${baseUrl}/export`, params);
}

// Детальная аналитика по конкретному клиенту
function getCustomerDetailAnalytics(params) {
  return fetchWrapper.post(`${baseUrl}/customers/detail`, params);
}

// Аналитика по продуктам
function getProductAnalytics(params) {
  return fetchWrapper.post(`${baseUrl}/products`, params);
}

// Сводная статистика
function getSummary(params) {
  return fetchWrapper.post(`${baseUrl}/summary`, params);
}

// Аналитика трендов
function getTrends(params) {
  return fetchWrapper.post(`${baseUrl}/trends`, params);
}

// Детальная аналитика по конкретному клиенту
function getProductDetailAnalytics(params) {
  return fetchWrapper.post(`${baseUrl}/products/detail`, params);
}
export const analyticsService = {
  getOrderAnalytics,
  exportAnalytics,
  getCustomerDetailAnalytics,   // для деталей конкретного клиента
  getProductDetailAnalytics,
  getProductAnalytics,
  getSummary,
  getTrends
};