import {
    SET_DASHBOARD_SUMMARY, UPDATE_DASHBOARD_SUMMARY
} from '../../action-types';
import { getTotal } from '../../../shared/utils';

const initialState = {
    users: 0,
    bounties: 0,
    vault: 0
};

export default (state = { summary: initialState, onboardingChartData: [], bountyHuntingChartData: [], loading: false }, action = {}) => {

    const { loading = false, data = [] } = action.payload || { loading: false, data: [] };

    switch (action.type) {
        case SET_DASHBOARD_SUMMARY:
            return Object.assign(state, {
                summary: {
                    users: getTotal({ target: 'users', data }),
                    bounties: getTotal({ target: 'bounties', data }),
                    vault: getTotal({ target: 'vault', data }),
                }, 
                loading: loading
            });
        case UPDATE_DASHBOARD_SUMMARY:
            const { resource } = data[0];
            const summary = {
                [resource]: getTotal({ target: resource, data })
            };
            return Object.assign(state, { summary: Object.assign(state.summary, summary)});
        default:
            return state;
    }
}