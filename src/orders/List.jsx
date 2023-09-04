import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { DataGrid, ruRU} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import IconButton from '@mui/material/IconButton';

import { orderService } from '@/_services';

function List({ match }) {
  const { path } = match;
  const [orders, setOrders] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const columnsForDataGrid = [
    {
      field: 'sample',
      headerName: 'Образцы',
      type: 'boolean',
      width: 50,
      headerClassName: 'super-app-theme--header',
      editable: false,
      renderCell: (params) => {
        return params.value ? (
          <ThumbUpAltOutlinedIcon
            style={{
              color: "primary",
            }}
          />
        ) : <></>

      },
    },
    { field: 'id', type: 'string', headerName: '№ заказа', headerAlign: 'center', width: 100, headerClassName: 'super-app-theme--header', },
    { field: 'date', type: 'Date', headerName: 'Дата', headerAlign: 'center', width: 120, headerClassName: 'super-app-theme--header', },
    { field: 'customer_name', headerName: 'Клиент', headerAlign: 'center', width: 120, headerClassName: 'super-app-theme--header', },
    { field: 'division_name', headerName: 'Подразделение', headerAlign: 'center', width: 120, headerClassName: 'super-app-theme--header', },
    { field: 'details', headerName: 'Содежание...', headerAlign: 'center', width: 240, headerClassName: 'super-app-theme--header', },
    {
      field: "edit",
      width: 40,
      headerName: "",
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: ({ row }) =>
        <Link to={`${path}/edit/${row.id}`}  className="btn btn-sm btn-primary mr-1">Edit</Link>
    },
    {
      field: "send",
      width: 40,
      headerName: "",
      sortable: false,
      renderCell: ({ row }) =>
        <IconButton onClick={(event) => sendOrderByEmail(event, row)} variant="outlined" color="primary" size="small">
          <SendOutlinedIcon />
        </IconButton >,
    },

  ];
  //DataGrid helpers
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 10, });
  function onPaginationModelChange(paginationModelL) {
    console.log(`onPaginationModelChange ${JSON.stringify(paginationModelL)}`);
    setPaginationModel({ page: paginationModelL.page, pageSize: paginationModelL.pageSize });
  }

  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const onRowsSelectionHandler = useMemo(() => (ids) => {
    let selOrderData = ids.map((id) => orders.find((row) => row.id === id));
    console.log(`rowSelectionModel ${JSON.stringify(selOrderData[0])}`);
    try {
      setRowSelectionModel(selOrderData[0]);
    } catch {
      console.log(`rowSelectionModel exception!`);
    }
  }, [orders]);
  //DataGrid helpers

  const fetchData = useCallback(async () => {
    console.log(`useCallback ${JSON.stringify(paginationModel)}`);
    const ordersFetched = await orderService.getAll('','', 
      paginationModel?.page ? paginationModel.page : 0, 
      paginationModel?.pageSize ? paginationModel.pageSize : 10);
    setOrders(ordersFetched.orders); 
    setTotalItems(ordersFetched.totalItems);
  }, [paginationModel]);
  useEffect(() => {
    console.log(`useEffect `);
    fetchData();
  }, [paginationModel]);

  const preventDefault = (event, row) => {
    event.preventDefault();
  }

  function sendOrderByEmail(event, row) {
    event.stopPropagation();
    return alert(JSON.stringify(row, null, 4));
  }

  function deleteOrder(id) {
    setOrders(orders.map(x => {
      if (x.id === id) { x.isDeleting = true; }
      return x;
    }));
    orderService.delete(id).then(() => {
      setOrders(orders => orders.filter(x => x.id !== id));
    });
  }

  //JSX
  return (
    <div>
      <h1>Orders</h1>
      <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Order</Link>

      <Box sx={{
        height: '100%', width: '100%',
        '& .super-app-theme--header': {
          backgroundColor: 'primary.light',
        },

      }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <DataGrid localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            rows={orders ? orders : []} columns={columnsForDataGrid}
            rowCount={totalItems ? totalItems : 0}
            gridPageCountSelector
            pageSizeOptions={[10]}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}

            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}

            autoHeight={true}
            loading={loading}
            
          />
        </Stack>
      </Box>

    </div>
  );
}

export { List };