/* eslint-disable import/prefer-default-export */
import React from 'react';
/*
export const OrderGridService = () => {
  const [gridState, setGridState] = React.useState({});
};

export const [gridState, setGridState] = React.useState({});
OrderGridService.set = (orderGridState) => {
  setGridState(orderGridState || {});
};*/

export const gridState = {};

export const setGridState = (obj) => {
  Object.assign(gridState, obj);
};
export const getGridState = () => {
  if (gridState !== undefined) {
    return gridState;
  }
  return null;
};
