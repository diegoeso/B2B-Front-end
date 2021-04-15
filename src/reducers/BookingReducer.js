/**
 * Created by Azim on 6/7/20.
 */
import {
    REQUEST_PENDING,
    REQUEST_GET_ORDER_SUCCESS,
    REQUEST_GET_BOOKINGS,
    REQUEST_GET_BOOKING,
    IS_REQUEST_FOR_BOOKING,
    REQUEST_SET_BOOKING_ID,
    REQUEST_FOR_BOOKING_INFO,
    IS_REQUEST_FOR_BOOKING_SUCCEEDED,
    REQUEST_FOR_BOOKING_ERRORS,
    IS_REQUEST_PENDING,
} from '../constants/BookingConstants';

const initialState = {
    order: null,
    isPending: false,
    bookings: {},
    booking: null,
    request_for_booking: false,
    request_for_booking_info: false,
    booking_id: null,
    is_succeeded: false,
    isRequestPending: false,
    errors: {},
    booking_status:{},
};
export const Booking = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_PENDING:
            return Object.assign({}, state, {isPending: true});
        case REQUEST_GET_ORDER_SUCCESS:
            return Object.assign({}, state, {isPending: false, order: action.payload});
        case REQUEST_GET_BOOKINGS:
            return Object.assign({}, state, { isPending: false, bookings: action.payload, booking_status: action.booking_status });
        case REQUEST_GET_BOOKING:
            return Object.assign({}, state, { booking: action.payload, booking_status: action.booking_status});
        case IS_REQUEST_FOR_BOOKING:
            return Object.assign({}, state, { request_for_booking: action.payload });
        case REQUEST_SET_BOOKING_ID:
            return Object.assign({}, state, { booking_id: action.payload });
        case REQUEST_FOR_BOOKING_INFO:
            return Object.assign({}, state, { request_for_booking_info: action.payload });
        case IS_REQUEST_FOR_BOOKING_SUCCEEDED:
            return Object.assign({}, state, { isRequestPending: false, is_succeeded: action.payload });
        case REQUEST_FOR_BOOKING_ERRORS:
            return Object.assign({}, state, { errors: action.payload });
        case IS_REQUEST_PENDING:
            return Object.assign({}, state, {isRequestPending: action.payload});
        default:
            return state;
    }
}
