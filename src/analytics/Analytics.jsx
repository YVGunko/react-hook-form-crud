import "./analytics.less";
import React, { useState, useMemo, useEffect } from 'react';
import {
  Box, Paper, Grid, Card, CardContent, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem, TextField,
  Button, IconButton, Chip, Stack, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Autocomplete
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import CategoryIcon from '@mui/icons-material/Category';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ruLocale from 'date-fns/locale/ru';
import { format, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, 
         startOfYear, endOfYear, subMonths, subQuarters, subYears } from 'date-fns';

import { analyticsService, alertService, customerService, productService } from '@/_services';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Функции для расчета периодов
const getPeriodRanges = () => {
  const now = new Date();
  
  return {
    thisMonth: {
      start: startOfMonth(now),
      end: endOfMonth(now)
    },
    lastMonth: {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1))
    },
    thisQuarter: {
      start: startOfQuarter(now),
      end: endOfQuarter(now)
    },
    lastQuarter: {
      start: startOfQuarter(subQuarters(now, 1)),
      end: endOfQuarter(subQuarters(now, 1))
    },
    thisYear: {
      start: startOfYear(now),
      end: endOfYear(now)
    },
    lastYear: {
      start: startOfYear(subYears(now, 1)),
      end: endOfYear(subYears(now, 1))
    }
  };
};

function Analytics() {
  const periodRanges = useMemo(() => getPeriodRanges(), []);
  
  const [dateRange, setDateRange] = useState(periodRanges.thisMonth);
  const [presetPeriod, setPresetPeriod] = useState('thisMonth');
  const [reportType, setReportType] = useState('both');
  const [productCategory, setProductCategory] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [customerDetailOpen, setCustomerDetailOpen] = useState(false);
  const [customerDetailData, setCustomerDetailData] = useState(null);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [productDetailData, setProductDetailData] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [productDetailLoading, setProductDetailLoading] = useState(false);

  // Обработчик изменения предустановленного периода
  const handlePresetPeriodChange = (period) => {
    setPresetPeriod(period);
    setDateRange(periodRanges[period]);
  };

  // Обработчики для DatePicker - сбрасывают presetPeriod на 'custom'
  const handleStartDateChange = (date) => {
    setDateRange(prev => ({ ...prev, start: date }));
    setPresetPeriod('custom');
  };

  const handleEndDateChange = (date) => {
    setDateRange(prev => ({ ...prev, end: date }));
    setPresetPeriod('custom');
  };

  // Загрузка клиентов для автодополнения
  useEffect(() => {
    const loadCustomers = async () => {
      if (customerSearchTerm.length < 2) return;

      setCustomerLoading(true);
      try {
        const customersList = await customerService.search(customerSearchTerm);
        setCustomers(customersList);
      } catch (error) {
        console.error('Error loading customers:', error);
      } finally {
        setCustomerLoading(false);
      }
    };

    const debounceTimer = setTimeout(loadCustomers, 300);
    return () => clearTimeout(debounceTimer);
  }, [customerSearchTerm]);

  // Загрузка продукции для автодополнения
  useEffect(() => {
    const loadProducts = async () => {
      if (productSearchTerm.length < 2) return;

      setProductLoading(true);
      try {
        const productsList = await productService.search(productSearchTerm);
        setProducts(productsList);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setProductLoading(false);
      }
    };

    const debounceTimer = setTimeout(loadProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [productSearchTerm]);

  // Форматирование даты для отображения
  const formatDateRange = () => {
    return `с ${format(dateRange.start, 'dd.MM.yyyy')} по ${format(dateRange.end, 'dd.MM.yyyy')}`;
  };

  // Отчет по продукции
  const productsReport = useMemo(() => {
    if (!data?.products) return [];
    
    let filteredProducts = data.products;
    
    // Фильтрация по выбранному продукту
    if (selectedProduct) {
      filteredProducts = filteredProducts.filter(product =>
        product.productId === selectedProduct.id
      );
    }
    
    return filteredProducts
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10);
  }, [data?.products, selectedProduct]);

  // Отчет по клиентам
  const customersReport = useMemo(() => {
    if (!data?.customers) return [];
    return data.customers
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10);
  }, [data?.customers]);

  // Фильтрация клиентов по выбранному
  const filteredCustomersReport = useMemo(() => {
    if (!selectedCustomer) return customersReport;

    return customersReport.filter(customer =>
      customer.customerId === selectedCustomer.id
    );
  }, [customersReport, selectedCustomer]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const params = {
        startDate: dateRange.start,
        endDate: dateRange.end,
        reportType,
        productCategory,
        customerId: selectedCustomer ? selectedCustomer.id : null,
        productId: selectedProduct ? selectedProduct.id : null
      };

      const result = await analyticsService.getOrderAnalytics(params);
      setData(result);
    } catch (error) {
      alertService.error('Ошибка загрузки аналитики');
      console.error('Analytics load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Автоматическая загрузка данных при монтировании компонента
  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCustomerDetail = async (customer) => {
    try {
      setCustomerLoading(true);
      const detailData = await analyticsService.getCustomerDetailAnalytics({
        customerId: customer.id,
        startDate: dateRange.start,
        endDate: dateRange.end,
        productCategory
      });
      setCustomerDetailData({
        ...detailData,
        customerInfo: {
          name: customer.name,
          period: formatDateRange()
        }
      });
      setCustomerDetailOpen(true);
    } catch (error) {
      alertService.error('Ошибка загрузки деталей клиента');
      console.error('Customer detail error:', error);
    } finally {
      setCustomerLoading(false);
    }
  };

  const loadProductDetail = async (product) => {
    try {
      setProductDetailLoading(true);
      const detailData = await analyticsService.getProductDetailAnalytics({
        productId: product.productId,
        divisionName: product.divisionName,
        startDate: dateRange.start,
        endDate: dateRange.end,
        productCategory
      });
      setProductDetailData({
        ...detailData,
        productInfo: {
          name: product.productName,
          division: product.divisionName,
          period: formatDateRange(),
          totalQuantity: product.totalQuantity,
          isSample: product.isSample
        }
      });
      setProductDetailOpen(true);
    } catch (error) {
      alertService.error('Ошибка загрузки деталей продукции');
      console.error('Product detail error:', error);
    } finally {
      setProductDetailLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      const params = {
        startDate: dateRange.start,
        endDate: dateRange.end,
        reportType,
        productCategory,
        customerId: selectedCustomer ? selectedCustomer.id : null,
        productId: selectedProduct ? selectedProduct.id : null
      };

      await analyticsService.exportAnalytics(params);
      alertService.success('Данные экспортированы');
    } catch (error) {
      alertService.error('Ошибка экспорта');
      console.error('Export error:', error);
    }
  };

  const exportProductDetailToExcel = async () => {
    try {
      if (!productDetailData) return;

      const params = {
        startDate: dateRange.start,
        endDate: dateRange.end,
        productId: productDetailData.productInfo?.productId,
        reportType: 'product_detail'
      };

      await analyticsService.exportAnalytics(params);
      alertService.success('Данные по продукции экспортированы');
    } catch (error) {
      alertService.error('Ошибка экспорта данных по продукции');
      console.error('Product export error:', error);
    }
  };

  const clearFilters = () => {
    setSelectedCustomer(null);
    setSelectedProduct(null);
    setProductCategory('all');
    setCustomerSearchTerm('');
    setProductSearchTerm('');
  };

  const formatProductLabel = (product) => {
    const { productName, divisionName } = product;

    if (!divisionName) {
      return productName;
    }

    const divisionPart = divisionName.split(' ')[0];

    if (!divisionPart) {
      return productName;
    }

    // Создаем регулярное выражение для поиска divisionPart как отдельного слова
    // Учитывает начало строки, конец строки и пробелы вокруг
    const regex = new RegExp(`(^|\\s)${divisionPart}($|\\s)`, 'i');

    // Если productName содержит divisionPart как отдельное слово
    if (regex.test(productName)) {
      return productName;
    } else {
      // Иначе добавляем divisionPart к productName
      return `${productName} ${divisionPart}`;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
      <Box className="analytics-container" sx={{ p: 3 }}>
        {/* Заголовок и управление */}
        <Card className="analytics-header">
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <Typography variant="h5" gutterBottom>
                  Аналитика заказов
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Анализ продукции и клиентов за период
                </Typography>
              </Grid>

              <Grid item xs={12} md={9}>
                {/* Первая строка - период */}
                <Stack className="analytics-controls" direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
                  {/* Селектор предустановленных периодов */}
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Период</InputLabel>
                    <Select
                      value={presetPeriod}
                      label="Период"
                      onChange={(e) => handlePresetPeriodChange(e.target.value)}
                    >
                      <MenuItem value="thisMonth">Этот месяц</MenuItem>
                      <MenuItem value="lastMonth">Прошлый месяц</MenuItem>
                      <MenuItem value="thisQuarter">Этот квартал</MenuItem>
                      <MenuItem value="lastQuarter">Прошлый квартал</MenuItem>
                      <MenuItem value="thisYear">Этот год</MenuItem>
                      <MenuItem value="lastYear">Прошлый год</MenuItem>
                      <MenuItem value="custom">Произвольный период</MenuItem>
                    </Select>
                  </FormControl>

                  <DatePicker
                    className="date-picker"
                    label="Начало периода"
                    value={dateRange.start}
                    onChange={handleStartDateChange}
                    slotProps={{ textField: { size: 'small' } }}
                  />

                  <DatePicker
                    className="date-picker"
                    label="Конец периода"
                    value={dateRange.end}
                    onChange={handleEndDateChange}
                    slotProps={{ textField: { size: 'small' } }}
                  />
                </Stack>

                {/* Вторая строка - отчеты и управление */}
                <Stack className="analytics-controls" direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  <FormControl className="report-type-select" size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Тип отчета</InputLabel>
                    <Select
                      value={reportType}
                      label="Тип отчета"
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <MenuItem value="products">По продукции</MenuItem>
                      <MenuItem value="customers">По клиентам</MenuItem>
                      <MenuItem value="both">Оба отчета</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Тип продукции</InputLabel>
                    <Select
                      value={productCategory}
                      label="Тип продукции"
                      onChange={(e) => setProductCategory(e.target.value)}
                    >
                      <MenuItem value="all">Вся продукция</MenuItem>
                      <MenuItem value="samples">Образцы</MenuItem>
                      <MenuItem value="series">Серийная</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    onClick={loadAnalytics}
                    disabled={loading}
                    startIcon={<RefreshIcon />}
                  >
                    Обновить
                  </Button>

                  {(productCategory !== 'all' || selectedCustomer || selectedProduct) && (
                    <Button
                      variant="outlined"
                      onClick={clearFilters}
                      color="secondary"
                    >
                      Очистить фильтры
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>

            {/* Чипсы активных фильтров */}
            <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap">
              <Chip
                label={`Период: ${formatDateRange()}`}
                color="primary"
                variant="filled"
                icon={<CalendarTodayIcon />}
              />
              {productCategory !== 'all' && (
                <Chip
                  label={`Тип: ${productCategory === 'samples' ? 'Образцы' : 'Серийная'}`}
                  onDelete={() => setProductCategory('all')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedCustomer && (
                <Chip
                  label={`Клиент: ${selectedCustomer.name}`}
                  onDelete={() => setSelectedCustomer(null)}
                  color="primary"
                  variant="outlined"
                  icon={<PersonIcon />}
                />
              )}
              {selectedProduct && (
                <Chip
                  label={`Продукция: ${selectedProduct.name}`}
                  onDelete={() => setSelectedProduct(null)}
                  color="primary"
                  variant="outlined"
                  icon={<CategoryIcon />}
                />
              )}
            </Stack>

            {loading && <LinearProgress className="analytics-loading" sx={{ mt: 2 }} />}
          </CardContent>
        </Card>

        {loading && <LinearProgress />}

        {data && (
          <Grid container spacing={3}>
            {/* Карточки с общей статистикой */}
            <Grid item xs={12} md={3}>
              <Card className="stats-card orders-card">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Всего заказов
                  </Typography>
                  <Typography variant="h4">
                    {data.summary?.totalOrders || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {productCategory === 'samples' && 'только образцы'}
                    {productCategory === 'series' && 'только серийная'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card className="stats-card products-card">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Уникальных продукции
                  </Typography>
                  <Typography variant="h4">
                    {data.summary?.uniqueProducts || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card className="stats-card customers-card">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Активных клиентов
                  </Typography>
                  <Typography variant="h4">
                    {data.summary?.activeCustomers || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card className="stats-card quantity-card">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Общее количество
                  </Typography>
                  <Typography variant="h4">
                    {data.summary?.totalQuantity || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Отчет по клиентам */}
            {(reportType === 'customers' || reportType === 'both') && data.customers && (
              <Grid item xs={12}>
                <Card className="analytics-chart-card" sx={{ height: 'fit-content' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography className="chart-title" variant="h6" gutterBottom>
                          Топ клиентов по заказам
                        </Typography>
                        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                          <Chip
                            label={`Всего клиентов: ${filteredCustomersReport.length}`}
                            variant="outlined"
                            size="small"
                          />
                          <Chip
                            label={`Всего заказов: ${filteredCustomersReport.reduce((sum, c) => sum + c.totalOrders, 0)}`}
                            variant="outlined"
                            size="small"
                            color="primary"
                          />
                          <Chip
                            label={`Всего продукции: ${filteredCustomersReport.reduce((sum, c) => sum + c.totalQuantity, 0)}`}
                            variant="outlined"
                            size="small"
                            color="secondary"
                          />
                        </Box>
                      </Box>
                      
                      <Box display="flex" alignItems="center" gap={2}>
                        {/* Поиск клиента */}
                        <Box sx={{ minWidth: 250 }}>
                          <Autocomplete
                            size="small"
                            options={customers}
                            getOptionLabel={(option) => option.name || ''}
                            value={selectedCustomer}
                            onChange={(event, newValue) => setSelectedCustomer(newValue)}
                            onInputChange={(event, newInputValue) => setCustomerSearchTerm(newInputValue)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Поиск клиента"
                                placeholder="Начните вводить имя клиента..."
                                size="small"
                              />
                            )}
                            loading={customerLoading}
                            noOptionsText="Клиенты не найдены"
                          />
                        </Box>
                        <Button
                          startIcon={<RefreshIcon />}
                          onClick={loadAnalytics}
                          size="small"
                          disabled={loading}
                        >
                          Обновить
                        </Button>
                        <Button
                          startIcon={<DownloadIcon />}
                          onClick={exportToExcel}
                          size="small"
                          variant="contained"
                        >
                          Экспорт
                        </Button>
                      </Box>
                    </Box>

                    {selectedCustomer && (
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Chip
                          label={`Выбран клиент: ${selectedCustomer.name}`}
                          onDelete={() => setSelectedCustomer(null)}
                          color="primary"
                          variant="outlined"
                          icon={<PersonIcon />}
                        />
                        <Button
                          size="small"
                          onClick={() => setSelectedCustomer(null)}
                          color="secondary"
                        >
                          Сбросить фильтр
                        </Button>
                      </Box>
                    )}

                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell width="5%">#</TableCell>
                            <TableCell width="40%">Клиент</TableCell>
                            <TableCell width="12%" align="right">Заказов</TableCell>
                            <TableCell width="12%" align="right">Продукции</TableCell>
                            <TableCell width="12%" align="right">Средний заказ</TableCell>
                            <TableCell width="12%" align="right">Доля от общего</TableCell>
                            <TableCell width="7%" align="center">Детали</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredCustomersReport.map((row, index) => {
                            const totalQuantity = filteredCustomersReport.reduce((sum, c) => sum + c.totalQuantity, 0);
                            const percentage = totalQuantity > 0 ? (row.totalQuantity / totalQuantity * 100).toFixed(1) : 0;

                            return (
                              <TableRow key={row.customerId || index} hover>
                                <TableCell>
                                  <Chip
                                    size="small"
                                    label={index + 1}
                                    color={index < 3 ? "primary" : "default"}
                                    variant={index < 3 ? "filled" : "outlined"}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2" fontWeight="medium">
                                      {row.customerName}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell align="right">
                                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                                    <Typography fontWeight="bold" sx={{ mr: 1 }}>
                                      {row.totalOrders}
                                    </Typography>
                                    <Box
                                      sx={{
                                        width: 4,
                                        height: 20,
                                        bgcolor: 'primary.main',
                                        borderRadius: 1,
                                        opacity: row.totalOrders / Math.max(...filteredCustomersReport.map(c => c.totalOrders))
                                      }}
                                    />
                                  </Box>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography fontWeight="bold" color="primary">
                                    {row.totalQuantity.toLocaleString()}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body2">
                                    {Math.round(row.totalQuantity / row.totalOrders).toLocaleString()}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                                    <LinearProgress
                                      variant="determinate"
                                      value={percentage}
                                      sx={{
                                        width: 60,
                                        mr: 1,
                                        height: 6,
                                        borderRadius: 3
                                      }}
                                    />
                                    <Typography variant="body2">
                                      {percentage}%
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    size="small"
                                    onClick={() => loadCustomerDetail({
                                      id: row.customerId,
                                      name: row.customerName
                                    })}
                                    disabled={customerLoading}
                                    color="primary"
                                  >
                                    <DirectionsWalkIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Отчет по продукции */}
            {(reportType === 'products' || reportType === 'both') && data.products && (
              <Grid item xs={12}>
                <Card className="analytics-chart-card" sx={{ height: 'fit-content' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography className="chart-title" variant="h6" gutterBottom>
                          Топ продукции по количеству
                        </Typography>
                        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                          <Chip
                            label={`Всего продукции: ${productsReport.length}`}
                            variant="outlined"
                            size="small"
                          />
                          <Chip
                            label={`Общее количество: ${data.summary?.totalQuantity || 0}`}
                            variant="outlined"
                            size="small"
                            color="primary"
                          />
                          <Chip
                            label={`Уникальных позиций: ${data.summary?.uniqueProducts || 0}`}
                            variant="outlined"
                            size="small"
                            color="secondary"
                          />
                        </Box>
                      </Box>
                      
                      <Box display="flex" alignItems="center" gap={2}>
                        {/* Поиск продукции */}
                        <Box sx={{ minWidth: 250 }}>
                          <Autocomplete
                            size="small"
                            options={products}
                            getOptionLabel={(option) => option.name || ''}
                            value={selectedProduct}
                            onChange={(event, newValue) => setSelectedProduct(newValue)}
                            onInputChange={(event, newInputValue) => setProductSearchTerm(newInputValue)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Поиск продукции"
                                placeholder="Начните вводить название продукции..."
                                size="small"
                              />
                            )}
                            loading={productLoading}
                            noOptionsText="Продукция не найдена"
                          />
                        </Box>
                        <Button
                          startIcon={<RefreshIcon />}
                          onClick={loadAnalytics}
                          size="small"
                          sx={{ mr: 1 }}
                          disabled={loading}
                        >
                          Обновить
                        </Button>
                        <Button
                          startIcon={<DownloadIcon />}
                          onClick={exportToExcel}
                          size="small"
                          variant="contained"
                        >
                          Экспорт
                        </Button>
                      </Box>
                    </Box>

                    {selectedProduct && (
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Chip
                          label={`Выбрана продукция: ${selectedProduct.name}`}
                          onDelete={() => setSelectedProduct(null)}
                          color="primary"
                          variant="outlined"
                          icon={<CategoryIcon />}
                        />
                        <Button
                          size="small"
                          onClick={() => setSelectedProduct(null)}
                          color="secondary"
                        >
                          Сбросить фильтр
                        </Button>
                      </Box>
                    )}

                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell width="5%">#</TableCell>
                            <TableCell width="45%">Продукция</TableCell>
                            <TableCell width="15%" align="right">Количество</TableCell>
                            <TableCell width="15%" align="right">% от общего</TableCell>
                            <TableCell width="10%" align="center">Тип</TableCell>
                            <TableCell width="10%" align="center">Детали</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {productsReport.map((row, index) => {
                            const percentage = data.summary?.totalQuantity 
                              ? (row.totalQuantity / data.summary.totalQuantity * 100).toFixed(1)
                              : 0;

                            return (
                              <TableRow key={row.productId || index} hover>
                                <TableCell>
                                  <Chip
                                    size="small"
                                    label={index + 1}
                                    color={index < 3 ? "primary" : "default"}
                                    variant={index < 3 ? "filled" : "outlined"}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <Chip
                                      size="small"
                                      label={formatProductLabel(row)}
                                      sx={{ 
                                        backgroundColor: COLORS[index % COLORS.length],
                                        color: 'white',
                                        fontWeight: 'bold',
                                        maxWidth: 200
                                      }}
                                    />
                                  </Box>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography fontWeight="bold" color="primary">
                                    {row.totalQuantity.toLocaleString()}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                                    <LinearProgress
                                      variant="determinate"
                                      value={percentage}
                                      sx={{
                                        width: 60,
                                        mr: 1,
                                        height: 6,
                                        borderRadius: 3
                                      }}
                                    />
                                    <Typography variant="body2">
                                      {percentage}%
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    size="small"
                                    label={row.isSample ? 'Образец' : 'Серийный'}
                                    color={row.isSample ? "secondary" : "primary"}
                                    variant="outlined"
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    size="small"
                                    onClick={() => loadProductDetail(row)}
                                    disabled={productDetailLoading}
                                    color="primary"
                                    title="Детали продукции"
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            )}          
          </Grid>
        )}

        {!data && !loading && (
          <Card>
            <CardContent className="analytics-empty-state">
              <div className="empty-icon">📊</div>
              <Typography className="empty-text" variant="h6">
                Выберите параметры и нажмите "Обновить" для загрузки аналитики
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Диалог с детальной информацией по клиенту */}
        <Dialog
          open={customerDetailOpen}
          onClose={() => setCustomerDetailOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box>
              <Typography variant="h5" component="div" gutterBottom>
                Детальный отчет по клиенту
              </Typography>
              <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center">
                  <PersonIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    {customerDetailData?.customerInfo?.name || 'Неизвестный клиент'}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {customerDetailData?.customerInfo?.period || formatDateRange()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            {customerLoading ? (
              <LinearProgress />
            ) : customerDetailData ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Статистика за период
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography color="text.secondary">Всего заказов</Typography>
                          <Typography variant="h6">{customerDetailData.summary?.totalOrders}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography color="text.secondary">Общее количество</Typography>
                          <Typography variant="h6">{customerDetailData.summary?.totalQuantity}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography color="text.secondary">Уникальной продукции</Typography>
                          <Typography variant="h6">{customerDetailData.summary?.uniqueProducts}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography color="text.secondary">Средний заказ</Typography>
                          <Typography variant="h6">
                            {customerDetailData.summary?.totalOrders
                              ? Math.round(customerDetailData.summary.totalQuantity / customerDetailData.summary.totalOrders)
                              : 0}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Топ продукции
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Продукция</TableCell>
                          <TableCell align="right">Количество</TableCell>
                          <TableCell align="center">Тип</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {customerDetailData.products?.map((product, index) => (
                          <TableRow key={product.productId || index}>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Chip
                                  size="small"
                                  label={formatProductLabel(product)}
                                  sx={{
                                    backgroundColor: COLORS[index % COLORS.length],
                                    color: 'white',
                                    fontWeight: 'bold'
                                  }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body1" fontWeight="bold">
                                {product.quantity || product.totalQuantity || 0}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                size="small"
                                label={product.isSample ? 'Образец' : 'Серийный'}
                                color={product.isSample ? "secondary" : "primary"}
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!customerDetailData.products || customerDetailData.products.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              <Typography variant="body2" color="text.secondary">
                                Нет данных о продукции
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            ) : (
              <Typography>Нет данных</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCustomerDetailOpen(false)}>Закрыть</Button>
            <Button
              variant="contained"
              onClick={() => {
                exportToExcel();
                setCustomerDetailOpen(false);
              }}
              disabled={!customerDetailData}
            >
              Экспорт в Excel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Диалог с детальной информацией по продукции */}
        <Dialog
          open={productDetailOpen}
          onClose={() => setProductDetailOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box>
              <Typography variant="h5" component="div" gutterBottom>
                Детальный отчет по продукции
              </Typography>
              <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center">
                  <Chip
                    label={productDetailData?.productInfo?.name || 'Неизвестная продукция'}
                    color="primary"
                    sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                  />
                </Box>
                <Box display="flex" alignItems="center">
                  <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {productDetailData?.productInfo?.period || formatDateRange()}
                  </Typography>
                </Box>
                {productDetailData?.productInfo && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      size="small"
                      label={`Общее количество: ${productDetailData.productInfo.totalQuantity}`}
                      color="secondary"
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label={productDetailData.productInfo.isSample ? 'Образец' : 'Серийный'}
                      color={productDetailData.productInfo.isSample ? "secondary" : "primary"}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            {productDetailLoading ? (
              <LinearProgress />
            ) : productDetailData ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Клиенты, заказывавшие данную продукцию
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Клиент</TableCell>
                          <TableCell align="right">Количество</TableCell>
                          <TableCell align="right">% от общего</TableCell>
                          <TableCell align="center">Дата последнего заказа</TableCell>
                          <TableCell align="center">Количество заказов</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productDetailData.customers?.map((customer, index) => (
                          <TableRow key={customer.customerId || index}>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body1">
                                  {customer.customerName}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body1" fontWeight="bold">
                                {customer.totalQuantity || 0}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body1" color="text.secondary">
                                {productDetailData.productReport?.totalQuantity
                                  ? ((customer.totalQuantity / productDetailData.productReport.totalQuantity) * 100).toFixed(1) + '%'
                                  : '0%'
                                }
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                size="small"
                                label={customer.lastOrderDate ? format(new Date(customer.lastOrderDate), 'dd.MM.yyyy') : 'Нет данных'}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                size="small"
                                label={customer.totalOrders || 0}
                                color="primary"
                                variant="filled"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!productDetailData.customers || productDetailData.customers.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              <Typography variant="body2" color="text.secondary">
                                Нет данных о клиентах
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            ) : (
              <Typography>Нет данных</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProductDetailOpen(false)}>Закрыть</Button>
            <Button
              variant="contained"
              onClick={() => {
                exportProductDetailToExcel();
                setProductDetailOpen(false);
              }}
              disabled={!productDetailData}
            >
              Экспорт в Excel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}

export { Analytics };