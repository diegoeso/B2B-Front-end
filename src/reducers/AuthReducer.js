/**
 * Created by Prakash on 4/6/20.
 */
import {
	REQUEST_GET_USER_INFO,
    REQUEST_INPUT_CHANGE_LOGIN,
	REQUEST_GET_USER_INFO_FAILED,
	REQUEST_GET_PENDING,
	REQUEST_GET_SUCCESS,
    REQUEST_FORGOT_PASSWORD,
    REQUEST_FORGOT_PASSWORD_SUCCESS,
    REQUEST_FORGOT_PASSWORD_FAILED,
    SET_COUSTOMER_SUCCESS,
    REQUEST_INPUT_CHANGE_SIGNUP,
    REQUEST_INPUT_CHANGE_SET_PASSWORD,
    REQUEST_SIGNUP_SUCCESS,
    REQUEST_SIGNUP_NEXT,
    REQUEST_SET_PASSWORD,
    REQUEST_GET_COUNTRIES,
    REQUEST_GET_STATES,
    REQUEST_GET_CITY,
    REQUEST_GET_STATE_CITIES,
    REQUEST_ADD_TO_WISHLIST,
    REQUEST_PENDING,
    REQUEST_CARD_INPUT_CHANGE,
    CARD_ADDED_SUCCESSFULLY,
    REQUEST_ADD_CARD_FAILED,
    REQUEST_INPUT_RESET,
    REQUEST_GET_WISH_LIST,
    REQUEST_GET_PACKAGE_FREQUENCY,
    UPDATE_CLIENT_INFO,
    REQUEST_CHANGE_PASSWORD_FAILED, 
    SHOW_NOTIFICATION,
    TOGGLE_POPUP,
    TOGGLE_DELETE_CARD_POPUP,
    CARD_DELETED_SUCCESSFULLY,
} from '../constants/UserConstants';

let login = {
    email: '',
    password: '',
};
let signup = {
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    gender: '',
    password: '',
    confirm_password: '',
    /*designation: '',*/
    city: '',
    state: '',
    country: '',
    customer: '',
    extension_number: '',
    phone_number: '',
    mobile_number: '',
    accept_term: '',
    zipcode: '',
    full_address: '',
};
let card = {
    card_number: '',
    holder_name: '',
    expiry_date: '',
    cvv: '',
    type: ''
};
let resetpassword = {
    password: '',
    confirm_password: '',
    toket: ''
};
let changePassword = {
    old_password: '',
    new_password: '',
    confirm_password: '',
};
const initialState = {
    user: {},
    login: login,
    forgotPassword: '',
    errors: {},
    isPending: false,
    authentication: null,
    customer: '',
    signup: signup,
    flag: '',
    countries: [],
    states: [],
    cities: [],
    stateCities: [],
    card: card,
    resetpassword: resetpassword,
    changePassword: changePassword,
    wishlist: [],
    mywishlist: {},
    flagView: '',
    package_frequency: {},
    notification:{},
    displayPopUp:false,
    deleteCardPopup:false,
    room_category:null,
};
export const Auth = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_GET_USER_INFO:
            return Object.assign({}, state, {isPending:false,login: login, authentication:true,errors:{},user: action.payload});
        case REQUEST_GET_USER_INFO_FAILED:
            return Object.assign({}, state, {isPending:false, errors: {...state.errors,...action.payload}});
        case REQUEST_INPUT_CHANGE_LOGIN:
            return Object.assign({}, state, {isPending:false,errors:{}, login: {...state.login,...action.payload}});
        case REQUEST_INPUT_CHANGE_SIGNUP:
            return Object.assign({}, state, {isPending:false,signup: {...state.signup,...action.payload}});
        case REQUEST_INPUT_CHANGE_SET_PASSWORD:
            return Object.assign({}, state, {isPending:false,errors:{}, resetpassword: {...state.resetpassword,...action.payload}});
        case REQUEST_FORGOT_PASSWORD_SUCCESS:
            return Object.assign({}, state, {isPending:false,errors:{}, forgotPassword: action.payload});
        case SET_COUSTOMER_SUCCESS:
            return Object.assign({}, state, {isPending:false,errors:{}, customer: action.payload});
        case REQUEST_SIGNUP_NEXT:
            return Object.assign({}, state, {isPending:false,errors:{}, flag: action.payload});
        case REQUEST_GET_COUNTRIES:
            return Object.assign({}, state, {isPending:false,errors:{}, countries: action.payload});
        case REQUEST_GET_STATES:
            return Object.assign({}, state, {isPending:false,states: action.payload});
        case REQUEST_GET_CITY:
            return Object.assign({}, state, {isPending:false,cities: action.payload});
        case REQUEST_GET_STATE_CITIES:
            return Object.assign({}, state, {isPending:false,stateCities: action.payload});
        case REQUEST_ADD_TO_WISHLIST:
            return Object.assign({}, state, {isPending:false,wishlist: action.payload});
        case REQUEST_PENDING:
            return Object.assign({}, state, {isPending: true});
        case REQUEST_CARD_INPUT_CHANGE:
            return Object.assign({}, state, {isPending:false, errors:{}, card: {...state.card,...action.payload}});
        case CARD_ADDED_SUCCESSFULLY:
            return Object.assign({}, state, {flagView: 'flagView', isPending:false, errors:{}, card: card});
        case REQUEST_ADD_CARD_FAILED:
            return Object.assign({}, state, {isPending:false, errors: {...state.errors,...action.payload}});
        case REQUEST_INPUT_RESET:
            return Object.assign({}, state, {resetpassword: resetpassword,signup:signup,login:login});
        case REQUEST_GET_WISH_LIST:
            return Object.assign({}, state, {isPending:false, mywishlist: action.payload, room_category:action.room_category});
        case REQUEST_GET_PACKAGE_FREQUENCY:
            return Object.assign({}, state, {isPending:false,package_frequency: action.payload});
        case UPDATE_CLIENT_INFO:
            return Object.assign({}, state, {isPending:false,user: action.payload});
        case REQUEST_CHANGE_PASSWORD_FAILED:
            return Object.assign({}, state, {isPending:false, errors: action.payload});
        case SHOW_NOTIFICATION:
            return Object.assign({}, state, {isPending:false, notification: action.payload});
            return Object.assign({}, state, {isPending:false, notification: action.TOGGLE_POPUP});
         case TOGGLE_POPUP:
            return Object.assign({}, state, {displayPopUp: action.payload,isPending:false});
        case TOGGLE_DELETE_CARD_POPUP:
            return Object.assign({}, state, {deleteCardPopup: action.payload});
        case CARD_DELETED_SUCCESSFULLY:
            return Object.assign({}, state, {isPending:false, errors:{}, card: card});
        default:
            return state;
    }
}
