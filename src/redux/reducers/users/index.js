import { SET_USERS, ADD_USERS, ADD_USER } from '../../action-types';

const initialState = [];

export default (state = { hunters: initialState, loading: false }, action = {}) => {

    const { loading = false, data = [] } = action.payload || { loading: false , data: [] };

    switch (action.type) {
        case SET_USERS:
            return {
                hunters: data,
                loading
            };
        case ADD_USERS:
            return {
                hunters: data.length ? [...state.hunters, ...data] : state.hunters,
                loading: false
            };
        case ADD_USER:
            return {
                hunters: data.length ? [...state.hunters, ...data] : state.hunters,
                loading
            };
        default:
            return state;
    }
}