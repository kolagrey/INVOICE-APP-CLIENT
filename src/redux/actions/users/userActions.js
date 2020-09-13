import { SET_USERS, ADD_USERS, ADD_USER } from '../../action-types';
import { dispatcher } from '../action.helper';

export const getUsers = () => async dispatch => {
    dispatcher(dispatch, SET_USERS, { loading: true });
    const result = {}
      
    dispatcher(dispatch, SET_USERS, {
        loading: false,
        data: result.data
    });
};

export const getMoreUsers = (start = 0) => async dispatch => {
    dispatcher(dispatch, ADD_USERS, { loading: true });
    const result = {}
      
    dispatcher(dispatch, ADD_USERS, {
        loading: false,
        data: result.data
    });
};

export const addUser = (data) => async dispatch => {
    dispatcher(dispatch, ADD_USER, {
        loading: false,
        data: [data]
    });
};

