import { UPDATE_PAGE_TITLE } from '../../action-types';

const initialState = {
  pageTitle: 'Overview'
};

export default (state = initialState, action = { type: '' }) => {
  switch (action.type) {
    case UPDATE_PAGE_TITLE:
      const { pageTitle = '' } = action.payload;
      return {
        ...state,
        pageTitle
      };
    default:
      return state;
  }
};
