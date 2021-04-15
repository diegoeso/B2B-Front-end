/**
 * Created by Azim on 6/7/20.
 */
import {
    REQUEST_PENDING,
    REQUEST_CARD_INPUT_CHANGE,
    CARD_ADDED_SUCCESSFULLY,
    REQUEST_ADD_CARD_FAILED,
} from '../constants/UserConstants';

let card = {
    card_number: '',
    holder_name: '',
    expiry_date: '',
    cvv: '',
    type: ''
};
const initialState = {
    errors:{},
    isPending: false,
    card: card
};
export const Card = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_PENDING:
            return Object.assign({}, state, {isPending: true});
        case REQUEST_CARD_INPUT_CHANGE:
            return Object.assign({}, state, {isPending: false, errors: {}, card: {...state.card, ...action.payload}});
        case CARD_ADDED_SUCCESSFULLY:
            return Object.assign({}, state, {isPending: false, errors: {}, card: card});
        case REQUEST_ADD_CARD_FAILED:
            return Object.assign({}, state, {isPending: false, errors: {...state.errors, ...action.payload}});
        default:
            return state;
    }
}
