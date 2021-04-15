/**
 * Created by Azim on 6/7/20.
 */
import {
    REQUEST_SEARCH_PENDING,
    REQUEST_INPUT_CHANGE,
    REQUEST_SEARCH_RESULT,
    REQUEST_GET_PACKAGE_FREQUENCY,
} from '../constants/SearchConstants';

const initialState = {
    keyword: '',
    isPending: false,
    result: [],
    totalCount:0,
    package_frequency: {},
    room_category:null,
};
export const Search = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_SEARCH_PENDING:
            return Object.assign({}, state, {isPending: true});
        case REQUEST_INPUT_CHANGE:
            return Object.assign({}, state, {keyword: action.payload.keyword});
        case REQUEST_SEARCH_RESULT:
            return Object.assign({}, state, {isPending: false, result: action.payload, totalCount: action.totalCount, room_category: action.room_category});
        case REQUEST_GET_PACKAGE_FREQUENCY:
            return Object.assign({}, state, {isPending: false, package_frequency: action.payload});
        default:
            return state;
    }
}
