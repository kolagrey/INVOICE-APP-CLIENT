import { UPDATE_PAGE_TITLE, SET_DIALOG_STATE } from '../../action-types';

const initialState = {
  pageTitle: 'Overview',
  dialogState: false
};

export default (state = initialState, action = { type: '' }) => {
  switch (action.type) {
    case UPDATE_PAGE_TITLE:
      const { pageTitle = '' } = action.payload;
      return {
        ...state,
        pageTitle
      };
    case SET_DIALOG_STATE:
      const { dialogState = false } = action.payload;
      return {
        ...state,
        dialogState
      };
    default:
      return state;
  }
};
