import { UPDATE_PAGE_TITLE, SET_DIALOG_STATE } from '../../action-types';

import { dispatcher } from '../action.helper';

export const updatePageTitle = (payload) => async (dispatch) => {
  dispatcher(dispatch, UPDATE_PAGE_TITLE, {
    pageTitle: payload
  });
};

export const updateAlertDialogState = (payload) => async (dispatch) => {
  dispatcher(dispatch, SET_DIALOG_STATE, {
    dialogState: payload
  });
};
