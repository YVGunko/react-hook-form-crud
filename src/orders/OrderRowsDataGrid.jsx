import React from 'react';
import PropTypes from 'prop-types';
import {
    Grid, Paper, Button, Divider, Typography, Stack, Box,
  } from '@mui/material';

const OrderRowsDataGrid = ({ orderId }) => {
    const [orderRows, setOrderRows] = useState([]);
    const fetchRows = useCallback(async () => {
      const rowsFetched = await orderRowService.getAll(id);
      setOrderRows(rowsFetched);
    }, []);
    useEffect(() => {
      console.log('useEffect fetchRows');
      fetchRows();
    }, [orderId]);

    return (
        <Box sx={{
            height: '100%',
            width: '100%',
          }}
          >
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <DataGrid
                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                rows={orderRows || []}
                columns={rowColumns}
                autoHeight
                loading={loading}
              />
            </Stack>
          </Box>
    )
}

export { OrderRowsDataGrid };