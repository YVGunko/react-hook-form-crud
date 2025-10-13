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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ruLocale from 'date-fns/locale/ru';

import { analyticsService, alertService, customerService } from '@/_services';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function Analytics() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  });
  const [reportType, setReportType] = useState('products');
  const [productCategory, setProductCategory] = useState('all'); // 'all', 'samples', 'series'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [customerDetailOpen, setCustomerDetailOpen] = useState(false);
  const [customerDetailData, setCustomerDetailData] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);

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

  // Отчет по продукции
  const productsReport = useMemo(() => {
    if (!data?.products) return [];
    return data.products
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10);
  }, [data?.products]);

  // Отчет по клиентам
  const customersReport = useMemo(() => {
    if (!data?.customers) return [];
    return data.customers
      .sort((a, b) => b.totalOrders - a.totalOrders)
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
        customerId: selectedCustomer ? selectedCustomer.id : null
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

  const loadCustomerDetail = async (customer) => {
    try {
      setCustomerLoading(true);
      const detailData = await analyticsService.getCustomerDetailAnalytics({
        customerId: customer.id,
        startDate: dateRange.start,
        endDate: dateRange.end,
        productCategory
      });
      setCustomerDetailData(detailData);
      setCustomerDetailOpen(true);
    } catch (error) {
      alertService.error('Ошибка загрузки деталей клиента');
      console.error('Customer detail error:', error);
    } finally {
      setCustomerLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      const params = {
        startDate: dateRange.start,
        endDate: dateRange.end,
        reportType,
        productCategory,
        customerId: selectedCustomer ? selectedCustomer.id : null
      };
      
      await analyticsService.exportAnalytics(params);
      alertService.success('Данные экспортированы');
    } catch (error) {
      alertService.error('Ошибка экспорта');
      console.error('Export error:', error);
    }
  };

  const clearFilters = () => {
    setSelectedCustomer(null);
    setProductCategory('all');
    setCustomerSearchTerm('');
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
                <Stack className="analytics-controls" direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  <DatePicker
                    className="date-picker"
                    label="Начало периода"
                    value={dateRange.start}
                    onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                    slotProps={{ textField: { size: 'small' } }}
                  />
                  
                  <DatePicker
                    className="date-picker"
                    label="Конец периода"
                    value={dateRange.end}
                    onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                    slotProps={{ textField: { size: 'small' } }}
                  />

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

                  <Autocomplete
                    size="small"
                    sx={{ minWidth: 250 }}
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
                      />
                    )}
                    loading={customerLoading}
                    noOptionsText="Клиенты не найдены"
                  />

                  <Button
                    variant="contained"
                    onClick={loadAnalytics}
                    disabled={loading}
                    startIcon={<RefreshIcon />}
                  >
                    Обновить
                  </Button>

                  <IconButton 
                    onClick={exportToExcel}
                    disabled={!data || loading}
                    color="primary"
                  >
                    <DownloadIcon />
                  </IconButton>

                  {(selectedCustomer || productCategory !== 'all') && (
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
                    Уникальных продуктов
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

            {/* Отчет по продукции */}
            {(reportType === 'products' || reportType === 'both') && data.products && (
              <>
                <Grid item xs={12} md={6}>
                  <Card className="analytics-chart-card">
                    <CardContent>
                      <Typography className="chart-title" variant="h6" gutterBottom>
                        Топ продукции по количеству
                        {selectedCustomer && ` (${selectedCustomer.name})`}
                      </Typography>
                      <TableContainer className="analytics-table">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Продукт</TableCell>
                              <TableCell align="right">Количество</TableCell>
                              <TableCell align="right">% от общего</TableCell>
                              <TableCell>Тип</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {productsReport.map((row, index) => (
                              <TableRow key={row.productId || index}>
                                <TableCell>
                                  <Chip 
                                    size="small" 
                                    label={row.productName}
                                    sx={{ backgroundColor: COLORS[index % COLORS.length] }}
                                  />
                                </TableCell>
                                <TableCell align="right">{row.totalQuantity}</TableCell>
                                <TableCell align="right">
                                  {((row.totalQuantity / (data.summary?.totalQuantity || 1)) * 100).toFixed(1)}%
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    size="small" 
                                    label={row.isSample ? 'Образец' : 'Серийный'}
                                    variant={row.isSample ? "filled" : "outlined"}
                                    color={row.isSample ? "secondary" : "primary"}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card className="analytics-chart-card">
                    <CardContent>
                      <Typography className="chart-title" variant="h6" gutterBottom>
                        Распределение продукции
                        {selectedCustomer && ` (${selectedCustomer.name})`}
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={productsReport}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ productName, percent }) => 
                              `${productName} (${(percent * 100).toFixed(0)}%)`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="totalQuantity"
                          >
                            {productsReport.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [value, 'Количество']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}

            {/* Отчет по клиентам */}
            {(reportType === 'customers' || reportType === 'both') && data.customers && (
              <>
                <Grid item xs={12} md={6}>
                  <Card className="analytics-chart-card">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography className="chart-title" variant="h6">
                          Топ клиентов по заказам
                        </Typography>
                        <Button
                          startIcon={<FilterListIcon />}
                          onClick={loadAnalytics}
                          size="small"
                        >
                          Обновить
                        </Button>
                      </Box>
                      <TableContainer className="analytics-table">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Клиент</TableCell>
                              <TableCell align="right">Заказы</TableCell>
                              <TableCell align="right">Общее количество</TableCell>
                              <TableCell align="center">Детали</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredCustomersReport.map((row, index) => (
                              <TableRow key={row.customerId || index}>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    {row.customerName}
                                  </Box>
                                </TableCell>
                                <TableCell align="right">{row.totalOrders}</TableCell>
                                <TableCell align="right">{row.totalQuantity}</TableCell>
                                <TableCell align="center">
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => loadCustomerDetail({
                                      id: row.customerId,
                                      name: row.customerName
                                    })}
                                    disabled={customerLoading}
                                  >
                                    Детали
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card className="analytics-chart-card">
                    <CardContent>
                      <Typography className="chart-title" variant="h6" gutterBottom>
                        Активность клиентов
                        {selectedCustomer && ` (${selectedCustomer.name})`}
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={filteredCustomersReport}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="customerName" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="totalOrders" fill="#8884d8" name="Количество заказов" />
                          <Bar dataKey="totalQuantity" fill="#82ca9d" name="Общее количество" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </>
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
            Детальный отчет по клиенту: {customerDetailData?.customer?.name}
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
                          <Typography color="text.secondary">Уникальных продуктов</Typography>
                          <Typography variant="h6">{customerDetailData.summary?.uniqueProducts}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography color="text.secondary">Средний заказ</Typography>
                          <Typography variant="h6">
                            {Math.round(customerDetailData.summary?.totalQuantity / customerDetailData.summary?.totalOrders)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Топ продуктов
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Продукт</TableCell>
                          <TableCell align="right">Количество</TableCell>
                          <TableCell align="right">Тип</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {customerDetailData.products?.map((product, index) => (
                          <TableRow key={product.productId}>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell align="right">{product.quantity}</TableCell>
                            <TableCell align="right">
                              <Chip 
                                size="small" 
                                label={product.isSample ? 'Образец' : 'Серийный'}
                                color={product.isSample ? "secondary" : "primary"}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
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
              onClick={exportToExcel}
              disabled={!customerDetailData}
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