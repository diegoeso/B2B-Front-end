/**
 * Created by Prakash on 4/6/20.
 */
import {
    REQUEST_ADD_TO_ORDER,
    REQUEST_INPUT_CHANGE_ORDER,
    REQUEST_GET_ORDER_FAILED,
    REQUEST_CHANGE_CARD,
    REQUEST_SUBMIT_ORDER_FAILED,
    REQUEST_PENDING,
    REQUEST_DISABLE_SUBMIT_BTN,
    REQUEST_CARD_SELECT,
    REQUEST_MY_ORDERS,
    REQUEST_CHANGE_SINGLE_FORM_VALUE,
    REQUEST_CHANGE_REASON,
    REQUEST_SET_TOTAL_EMI,
    REQUEST_SET_EMI_COST,
    CHANGE_FLAG_VIEW,
    REQUEST_GET_ORDER_SUCCESS,
    CHANGE_POPUP_STATE,
    TOGGLE_IS_CANCELLED_STATE,
} from '../constants/OrderConstants';

const initialState = {
    form: {
        package_id: null,
        package_frequency: 1,
        scheduled_date: '',
        card_id: null,
        amount: null,
        payment_method: 1,
        accept_declaimer: 0,
    },
    errors: {},
    isPending: false,
    disableSubmitBtn: false,
    card_digit:'',
    cancel_order_form: {
        reason_for_cancellation: '',
    },
    my_orders:{},
    frequency: '',
    emi_cost: '',
    flagView: 'payment-option',
    order: {},
    openPopup: false,
    isCancelled: true,
};
export const Order = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_ADD_TO_ORDER:
            return Object.assign({}, state, {isPending: false, form: {...state.form,...action.payload}});
        case REQUEST_GET_ORDER_FAILED:
            return Object.assign({}, state, {isPending:false, errors: {...state.errors,...action.payload}});
        case REQUEST_INPUT_CHANGE_ORDER:
            return Object.assign({}, state, { form: {...state.form,...action.payload}});
        case REQUEST_CHANGE_CARD:
            return Object.assign({}, state, { form: {...state.form,...action.payload}});
        case REQUEST_SUBMIT_ORDER_FAILED:
            return Object.assign({}, state, {isPending:false, errors: {...state.errors,...action.payload}});
        case REQUEST_PENDING:
            return Object.assign({}, state, { isPending: action.payload });
        case REQUEST_DISABLE_SUBMIT_BTN:
            return Object.assign({}, state, { disableSubmitBtn: action.payload });
        case REQUEST_CARD_SELECT:
            return Object.assign({}, state, { isPending:false, card_digit: action.payload });
        case REQUEST_MY_ORDERS:
            return Object.assign({}, state, { my_orders: action.payload });
        case REQUEST_CHANGE_SINGLE_FORM_VALUE:
            return Object.assign({}, state, { form: {...state.form,...action.payload}});
        case REQUEST_CHANGE_REASON:
            return Object.assign({}, state, { cancel_order_form: {...state.cancel_order_form,...action.payload}});
        case REQUEST_SET_TOTAL_EMI:
            return Object.assign({}, state, { frequency: action.payload });
        case REQUEST_SET_EMI_COST:
            return Object.assign({}, state, { emi_cost: action.payload });
        case CHANGE_FLAG_VIEW:
            return Object.assign({}, state, { flagView: action.payload });
        case REQUEST_GET_ORDER_SUCCESS:
            return Object.assign({}, state, { order: action.payload });
        case CHANGE_POPUP_STATE:
            return Object.assign({}, state, { openPopup: action.payload });
        case TOGGLE_IS_CANCELLED_STATE:
            return Object.assign({}, state, { isCancelled: action.payload });
        default:
            return state;
    }
}