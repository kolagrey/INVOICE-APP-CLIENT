import {
    SET_DASHBOARD_SUMMARY, UPDATE_DASHBOARD_SUMMARY
  } from '../../action-types';
  import { dispatcher } from '../action.helper';
  
  export const getDashboardSummary = () => async dispatch => {
    dispatcher(dispatch, SET_DASHBOARD_SUMMARY, { loading: true });
    const data = {}
    dispatcher(dispatch, SET_DASHBOARD_SUMMARY, {
      loading: false,
      data
    });
  };
  
  
  export const updateDashboardSummary = (data) => async dispatch => {
    dispatcher(dispatch, UPDATE_DASHBOARD_SUMMARY, {
      data: [data]
    });
  }
  