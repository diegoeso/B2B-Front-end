/**
 * Created by Prakash chandra yadav on 4/6/20.
 */
import axios from 'axios';
import {sessionService} from 'redux-react-session';
import {API_URL, getUrl} from '../constants';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    REQUEST_GET_ORDER_SUCCESS,
    REQUEST_INPUT_CHANGE,
    REQUEST_GET_BOOKINGS,
    REQUEST_GET_BOOKING,
    REQUEST_PENDING,
    IS_REQUEST_FOR_BOOKING,
    REQUEST_SET_BOOKING_ID,
    REQUEST_FOR_BOOKING_INFO,
    IS_REQUEST_FOR_BOOKING_SUCCEEDED,
    REQUEST_FOR_BOOKING_ERRORS,
    IS_REQUEST_PENDING,
} from '../constants/BookingConstants';
import {Redirect} from 'react-router-dom';
import moment from 'moment';

toast.configure();

export const handleInputChange = (data) => (dispatch, getState) => {
    dispatch({type: REQUEST_INPUT_CHANGE, payload: data})
}

export const getOrder = (orderId) => (dispatch, getState) => {
    const authToken = getState().session.user.token;
    let langContent = getState().Lang.langContent;
    dispatch({type: IS_REQUEST_FOR_BOOKING_SUCCEEDED, payload: false});
    if (authToken != undefined) {
        axios.get(API_URL + '/get-order/' + orderId, {headers: {'Authorization': 'Bearer ' + authToken}})
            .then(function (response) {
                dispatch({type: REQUEST_GET_ORDER_SUCCESS, payload: response.data.order});
            }).catch(function (error) {
            }).then(function () {
            });
    } else {
        toast.error(langContent.please_login_first, {
            hideProgressBar: true,
        });
    }
}
export const requestForBooking = (form, props) => (dispatch, getState) => {
    let token = getState().session.user.token;
    let noOfGuest = [];
    form.guests.map((guest,i) => {
       if(guest.date_of_birth != undefined && guest.date_of_birth != '') {
                noOfGuest[i] = {'date_of_birth': moment(guest.date_of_birth).format('YYYY-MM-DD'),
                        'first_name': guest.first_name,
                        'last_name':guest.last_name,
                    };
        }
    });
    form.guests = noOfGuest;

    let errors = {}
    let langContent = getState().Lang.langContent;
    if (token != undefined) {
        dispatch({type: IS_REQUEST_PENDING, payload: true});
        axios.post(API_URL + '/request-for-booking', form, {headers: {'Authorization': 'Bearer ' + token}})
            .then(function (response) {
                toast.success(langContent.booking_request_is_successful, {
                    hideProgressBar: true,
                });
                dispatch({type: REQUEST_FOR_BOOKING_INFO, payload: false});
                dispatch({type: REQUEST_SET_BOOKING_ID, payload: response.data.reservation.id});
                dispatch({type: IS_REQUEST_FOR_BOOKING, payload: true});
                dispatch({type: REQUEST_PENDING, payload: false});
                dispatch({type: IS_REQUEST_FOR_BOOKING_SUCCEEDED, payload: true});
            }).catch(err => {
                if (err.response.status == 422) {
                    dispatch({type: REQUEST_FOR_BOOKING_ERRORS, payload: err.response.data.errors});
                }
                dispatch({type: IS_REQUEST_PENDING, payload: false});
            });
    } else {
        toast.error(langContent.please_login_first, {
            hideProgressBar: true,
        });
    }
}

/**
 * Get all booking for listing
 * @author Azim Khan <azim@surmountsoft.in>
 * @param props
 * */
export const myBookings = (status, props) => (dispatch, getState) => {
    const authToken = getState().session.user.token;
    let langContent = getState().Lang.langContent;
    dispatch({type: IS_REQUEST_FOR_BOOKING_SUCCEEDED, payload: false});
    if (authToken != undefined) {
        axios.get(API_URL + '/bookings?status='+status, {headers: {'Authorization': 'Bearer ' + authToken}})
            .then(function (response) {
                dispatch({type: REQUEST_GET_BOOKINGS, payload: response.data, booking_status:response.data.booking_status});
            }).catch(function (error) {
        });
    } else {
        toast.error(langContent.please_login_first, {
            hideProgressBar: true,
        });
    }
}

/**
* Get a single booking details
 * @author Azim Khan <azim@surmountsoft.in>
 * @param id
* */
export const getBooking = (id) => (dispatch, getState) => {
    const token = getState().session.user.token;
    let langContent = getState().Lang.langContent;
    if (token != undefined) {
        axios.get(API_URL + '/get-booking?id='+id, { headers: {'Authorization': 'Bearer ' + token}})
            .then(function (response) {
                dispatch({type: REQUEST_GET_BOOKING, payload: response.data.booking, booking_status:response.data.booking_status});

            }).catch(function (error) {
            dispatch({type: REQUEST_PENDING, payload: false});
        });
    } else {
        toast.error(langContent.please_login_first, {
            hideProgressBar: true,
        });
    }
}

/**
 * for customizing booking details
 * @author Azim Khan <azim@surmountsoft.in>
 * @param form
 * */
export const customizeBooking = (form, props) => (dispatch, getState) => {
    const token = getState().session.user.token;
    let langContent = getState().Lang.langContent;
    let auth = getState().Auth;
    if (token != '') {
        dispatch({type: REQUEST_PENDING, payload: true});
        axios.post(API_URL + '/customize-booking', form, {headers: {'Authorization': 'Bearer ' + token}})
            .then(function (response) {
                let data = response.data;
                toast.success(langContent.booking_customized_successfully, {hideProgressBar: true});
                dispatch({type: REQUEST_PENDING, payload: false});
                props.history.push(getUrl(auth.customer) + 'bookings')
            }).catch(function (error) {
            dispatch({type: REQUEST_PENDING, payload: false});
        });
    } else {
        toast.success(langContent.please_login_first, {hideProgressBar: true});
    }
}

export const toggleRequestForBooking = (action, props) => (dispatch, getState) => {
    let auth = getState().Auth;
    let bookingId = getState().Booking.booking_id;
    dispatch({type: IS_REQUEST_FOR_BOOKING, payload: false});
    dispatch({type: REQUEST_SET_BOOKING_ID, payload: null});
    if (action) {
        props.history.push(getUrl(auth.customer) + bookingId +'/booking-edit');
    } else {
        props.history.push(getUrl(auth.customer) + bookingId +'/booking-view');
    }
}

export const toggleRequestForBookingInfo = (action, props) => (dispatch, getState) => {
    dispatch({type: REQUEST_FOR_BOOKING_INFO, payload: action});
}
export const emptyServerErrors = (action, props) => (dispatch, getState) => {
    dispatch({type: REQUEST_FOR_BOOKING_ERRORS, payload: {}});
}