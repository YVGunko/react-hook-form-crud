import "./analytics.less";
import React, { useState, useMemo } from 'react';
import {
  Box, Paper, Grid, Card, CardContent, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem, TextField,
  Button, IconButton, Chip, Stack, LinearProgress
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ruLocale from 'date-fns/locale/ru';

import { analyticsService, alertService } from '@/_services';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function Analytics() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  });
  const [reportType, setReportType] = useState('products');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const params = {
        startDate: dateRange.start,
        endDate: dateRange.end,
        reportType
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

  const exportToExcel = async () => {
    try {
      const params = {
        startDate: dateRange.start,
        endDate: dateRange.end,
        reportType
      };
      
      await analyticsService.exportAnalytics(params);
      alertService.success('Данные экспортированы');
    } catch (error) {
      alertService.error('Ошибка экспорта');
      console.error('Export error:', error);
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
                </Stack>
              </Grid>
            </Grid>
            {loading && <LinearProgress className="analytics-loading" sx={{ mt: 2 }} />}
          </CardContent>
        </Card>

        {loading && <LinearProgress className="analytics-loading" />}

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
                      </Typography>
                      <TableContainer className="analytics-table">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Продукт</TableCell>
                              <TableCell align="right">Количество</TableCell>
                              <TableCell align="right">% от общего</TableCell>
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
                      <Typography className="chart-title" variant="h6" gutterBottom>
                        Топ клиентов по заказам
                      </Typography>
                      <TableContainer className="analytics-table">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Клиент</TableCell>
                              <TableCell align="right">Заказы</TableCell>
                              <TableCell align="right">Общее количество</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {customersReport.map((row, index) => (
                              <TableRow key={row.customerId || index}>
                                <TableCell>{row.customerName}</TableCell>
                                <TableCell align="right">{row.totalOrders}</TableCell>
                                <TableCell align="right">{row.totalQuantity}</TableCell>
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
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={customersReport}>
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
      </Box>
    </LocalizationProvider>
  );
}

export default Analytics;