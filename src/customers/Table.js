import React, {useState, useEffect, useMemo} from "react"
import { useTable, usePagination, useSortBy } from "react-table"
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import axios from 'axios'

import { CUSTOMER_COLUMNS } from "./columns"
import SortIcon from 'mdi-react/SortIcon'
import SortAscendingIcon from 'mdi-react/SortAscendingIcon'
import SortDescendingIcon from 'mdi-react/SortDescendingIcon'
import ReactTablePagination from "../_helpers/ReactTablePagination"
import TableFilter  from "../_helpers/TableFilter"

const queryClient = new QueryClient();

const initialState = {
    queryPageIndex: 0,
    queryPageSize: 10,
    totalCount: 0,
    queryPageFilter:"",
    queryPageSortBy: [],
};

const PAGE_CHANGED = 'PAGE_CHANGED'
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED'
const PAGE_SORT_CHANGED = 'PAGE_SORT_CHANGED'
const PAGE_FILTER_CHANGED = 'PAGE_FILTER_CHANGED'
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED'

const reducer = (state, { type, payload }) => {
    switch (type) {
      case PAGE_CHANGED:
          return {
              ...state,
              queryPageIndex: payload,
          };
      case PAGE_SIZE_CHANGED:
          return {
              ...state,
              queryPageSize: payload,
          };
      case PAGE_SORT_CHANGED:
          return {
              ...state,
              queryPageSortBy: payload,
          };
      case PAGE_FILTER_CHANGED:
          return {
              ...state,
              queryPageFilter: payload,
          };
      case TOTAL_COUNT_CHANGED:
          return {
              ...state,
              totalCount: payload,
          };
      default:
        throw new Error(`Unhandled action type: ${type}`);
    }
  };
  
const TableWrapper = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable />
        </QueryClientProvider>
    )
}

export default TableWrapper;