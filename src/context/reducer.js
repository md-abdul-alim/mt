import React, { useReducer } from "react";

 
export const initialState = {
  fabricList: [],
  loading: false,
  errorMessage: null
};
 
export const MachineReducer = (initialState, action) => {
  switch (action.type) {
    case "REQUEST_MACHINE_LIST":
      return {
        ...initialState,
        loading: true
      };
    case "MACHINE_LIST_SUCCESS":
      return {
        ...initialState,
        fabricList: action.payload,
        loading: false
      };
 
    case "MACHINE_LIST_ERROR":
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error
      };
 
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}