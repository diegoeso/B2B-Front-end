/**
 * Created by azim on 6/5/20.
 */
import {
	REQUEST_GET_HOME_DATA,	
    REQUEST_GET_CUSTOMER_INFO,
} from '../constants/HomeConstants';

const initialState = {
    homeData: {},
    isPending: false,
    customerInfo: {},
};
export const HomeData = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_GET_HOME_DATA:
            return Object.assign({}, state, { homeData: action.payload});
        case REQUEST_GET_CUSTOMER_INFO:
            return Object.assign({}, state, { customerInfo: action.payload});
        default:
            return state;
    }
}