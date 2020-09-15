import { UPDATE_PAGE_TITLE } from '../../action-types';

import { dispatcher } from '../action.helper';

export const updatePageTitle = (payload) => async (dispatch) => {
  dispatcher(dispatch, UPDATE_PAGE_TITLE, {
    pageTitle: payload
  });
};
