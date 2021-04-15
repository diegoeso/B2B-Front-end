/**
 * Created by Prakash chandra yadav on 4/6/20.
 */
import axios from 'axios';
import {sessionService} from 'redux-react-session';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Redirect} from 'react-router-dom'
import moment from 'moment';
import { API_URL, getUrl, totalEMI, getEMIPrice } from "../constants";
import {
	REQUEST_ADD_TO_ORDER,
	REQUEST_INPUT_CHANGE_ORDER,
	REQUEST_GET_ORDER_FAILED,
	REQUEST_CHANGE_CARD,
	REQUEST_INPUT_CANCEL_ORDER,
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
import { IS_REQUEST_FOR_BOOKING_SUCCEEDED, REQUEST_FOR_BOOKING_ERRORS,
} from '../constants/BookingConstants';
import {
removeFromWishList,
} from './AuthAction';
toast.configure();
export const addToOrder = (props) => (dispatch, getState) => {
		let order = getState().Order.form;
		let langContent = getState().Lang.langContent;
		let user = getState().session.user;
		let customer = getState().Auth.customer;
		let id = getState().Product.productDetails.id;
		let flg = true;
	     let errors ={};
		 if (order.package_frequency == '') {
			errors['package_frequency'] = langContent.package_frequency_is_required;
			flg = false;
		}
		if (order.scheduled_date == '') {
			errors['scheduled_date'] = langContent.scheduled_date_is_required;
			flg = false;
		} else if (order.scheduled_date != '') {
			if (!moment(order.scheduled_date).isSameOrAfter(moment().format('YYYY-MM-DD'))) {
				errors['scheduled_date'] =langContent.Scheduled_date_equal_today;
				flg = false;
			}
		}

		if(flg) {
            dispatch({type: CHANGE_FLAG_VIEW, payload: 'payment-option'})
			if(user != undefined && user.id != undefined) {
				props.history.push(getUrl(customer)+id+"/create-order");
			} else {
				toast.error(langContent.please_login_to_buy, {
					hideProgressBar:true,
				});
			}

		} else {
			dispatch({type: REQUEST_GET_ORDER_FAILED, payload: {'orderValidations': errors}});
		}
	}

export const addToOrderByWishlist = (mywishlist, props) => (dispatch, getState) => {
		let order = getState().Order.form;
		let user = getState().session.user;
		let customer = getState().Auth.customer;
		let id = mywishlist.package_id;
        let langContent = getState().Lang.langContent;
        dispatch({type: REQUEST_INPUT_CHANGE_ORDER, payload: mywishlist})
        dispatch({type: CHANGE_FLAG_VIEW, payload: 'payment-option'})
		if(user != undefined && user.id != undefined) {
			props.history.push(getUrl(customer)+id+"/create-order");
			
		} else {
			toast.error(langContent.please_login_to_buy, {
				hideProgressBar:true,
			});
		}
	}

export const handleInputChange = (data) => (dispatch, getState) => {
	dispatch({type: REQUEST_INPUT_CHANGE_ORDER, payload: data})
}

export const submitOrder = (props) => (dispatch, getState) => {
	dispatch({type: REQUEST_PENDING, payload: true});
	const authToken = getState().session.user.token;
	let langContent = getState().Lang.langContent;
	const form = getState().Order.form;
	let customer = getState().Auth.customer;
	let flag = true;
	let errors = {};
	/*if (form.accept_declaimer == 0) {
		flag = false;
		errors['accept_declaimer'] = langContent.please_accept_declaimer;
	}*/
	if (flag) {
		dispatch({type: REQUEST_DISABLE_SUBMIT_BTN, payload: true});
		dispatch({type: REQUEST_PENDING, payload: true});
		axios.post(API_URL + '/create-order', form, {headers: {'Authorization': 'Bearer ' + authToken}})
			.then(function (response) {
				toast.success(langContent.the_order_placed_successfully, {
					hideProgressBar:true,
				});
				props.history.push(getUrl(customer)+"order")
				dispatch({type: REQUEST_DISABLE_SUBMIT_BTN, payload: false});
				dispatch({type: CHANGE_FLAG_VIEW, payload: 'payment-option'});
				dispatch(removeFromWishList(form.package_id))
			}).catch(function (error) {
				dispatch({type: REQUEST_DISABLE_SUBMIT_BTN, payload: false});
				dispatch({type: REQUEST_PENDING, payload: false});
				toast.error(langContent.something_went_wrong);
		});
	} else {
		dispatch({type: REQUEST_PENDING, payload: false});
		dispatch({type: REQUEST_SUBMIT_ORDER_FAILED, payload: {'orderValidations': errors}});
	}
}
export const handleChangeCard = (data) => (dispatch, getState) => {
	let cards = getState().Auth.user.cards;
	if (cards.length > 0) {
		Object.keys(cards).map(card=> {
			if (cards[card].id == data.card_id) {
				dispatch({type: REQUEST_CARD_SELECT, payload: cards[card].number.slice(cards[card].number.length - 4)});
			}
		});
	}
	dispatch({type: REQUEST_CHANGE_CARD, payload: data})
}

export const handleCancelOrderInput = (data) => (dispatch, getState) => {
	dispatch({type: REQUEST_INPUT_CANCEL_ORDER, payload: data})
}

export const cancelOrder = (props) => (dispatch, getState) => {
	const authToken = getState().session.user.token;
	const company_name = getState().Auth.user.customer.company_name;
	let orderForm = getState().Order.cancel_order_form;
	var order_id = props.match.params.order_id;
	let langContent = getState().Lang.langContent;
	dispatch({type: REQUEST_PENDING, payload: true});
	axios.post(API_URL + '/cancel-order/'+order_id, orderForm, {headers: {'Authorization': 'Bearer ' + authToken}})
		.then(function (response) {
			dispatch({type: CHANGE_POPUP_STATE, payload: false})
			dispatch({type: TOGGLE_IS_CANCELLED_STATE, payload: false});

			props.history.push('/'+company_name+'/order');

			toast.success(langContent.order_cancellation_request_has_been_placed_successfully, {
				pauseOnHover:false,
				hideProgressBar:true,
				autoClose: 2000,
				pauseOnFocusLoss: true,
				onOpen: ({ uid }) => dispatch({type: REQUEST_PENDING, payload: false}), 
			});
		}).catch(function (error) {
		dispatch({type: REQUEST_PENDING, payload: false});
		toast.error(langContent.login_to_raise_cancellation_request, {
			hideProgressBar:true,
		});
	});
}

export const myOrders = (status, props) => (dispatch, getState) => {
	const authToken = getState().session.user.token;
	let langContent = getState().Lang.langContent;
	dispatch({type: IS_REQUEST_FOR_BOOKING_SUCCEEDED, payload: false});
	dispatch({type: REQUEST_FOR_BOOKING_ERRORS, payload: {}});
	if (authToken != undefined) {
		axios.get(API_URL + '/show-orders?status='+status, {headers: {'Authorization': 'Bearer ' + authToken}})
			.then(function (response) {
				dispatch({type: REQUEST_MY_ORDERS, payload: response.data})
				props.history.push('/order/order');
			}).catch(function (error) {
		});
	} else {
		toast.error(langContent.login_view_order, {
			hideProgressBar: true,
		});
	}
}

export const handleChangeScheduleDate = (date) => (dispatch, getState) => {
	let flag = true;
	let errors ={};
	let langContent = getState().Lang.langContent;
	if(date != '' && !moment(date.scheduled_date).isSameOrAfter(moment().format('YYYY-MM-DD'))) {
		flag = false;
		errors['scheduled_date'] = langContent.Scheduled_date_equal_today;
	}
	if (flag) {
		dispatch({type: REQUEST_CHANGE_SINGLE_FORM_VALUE, payload: date})
	} else {
		toast.error(langContent.Scheduled_date_equal_today, {
			hideProgressBar:true,
		});
	}
}

export const handleChangeFrequency = (package_frequency) => (dispatch, getState) => {
	const form = getState().Order.form;
	let lang = getState().Lang.lang;
	dispatch({type: REQUEST_CHANGE_SINGLE_FORM_VALUE, payload: package_frequency})
	dispatch({type: REQUEST_SET_TOTAL_EMI, payload: package_frequency.package_frequency});
	dispatch({type: REQUEST_SET_EMI_COST, payload: getEMIPrice(form.amount, package_frequency.package_frequency)});
}

export const handleChangeCancelReason = (data) => (dispatch, getState) => {
	dispatch({type: REQUEST_CHANGE_REASON, payload: data})
}

export const changeFlag = (data) => (dispatch, getState) => {
	dispatch({type: CHANGE_FLAG_VIEW, payload: data})
}

export const getOrder = (orderId) => (dispatch, getState) => {
	const authToken = getState().session.user.token;
	let langContent = getState().Lang.langContent;
	let lang = getState().Lang.lang;
	dispatch({type: REQUEST_FOR_BOOKING_ERRORS, payload: {}});
	if (authToken != undefined) {
		axios.get(API_URL + '/get-order/' + orderId, {headers: {'Authorization': 'Bearer ' + authToken}})
			.then(function (response) {
				dispatch({type: REQUEST_GET_ORDER_SUCCESS, payload: response.data.order});
				dispatch({type: REQUEST_SET_TOTAL_EMI, payload: response.data.order.payment_cycle});
				dispatch({
					type: REQUEST_SET_EMI_COST,
					payload: getEMIPrice(response.data.order.package.total_amount, response.data.order.payment_cycle)
				});
				dispatch({type: REQUEST_PENDING, payload: false})
				if (response.data.order.status == 4) {
					dispatch({type: TOGGLE_IS_CANCELLED_STATE, payload: false})
				} else {
					dispatch({type: TOGGLE_IS_CANCELLED_STATE, payload: true})
				}
			}).catch(function (error) {
		}).then(function () {

		});
	} else {
		toast.error(langContent.login_view_order, {
			hideProgressBar: true,
		});
	}
}

export const handleChangeFrequencyShowOrder = (data) => (dispatch, getState) => {
	const authToken = getState().session.user.token;
	let langContent = getState().Lang.langContent;
	axios.post(API_URL + '/order/change-frequency/'+data.order_id, data, { headers: { 'Authorization': 'Bearer ' + authToken } })
		.then(function (response) {
			dispatch({type: REQUEST_CHANGE_SINGLE_FORM_VALUE, payload: data.package_frequency});
			dispatch({type: REQUEST_SET_TOTAL_EMI, payload: data.package_frequency});
			dispatch({type: REQUEST_GET_ORDER_SUCCESS, payload: response.data.order});
			dispatch({type: REQUEST_SET_TOTAL_EMI, payload: response.data.order.payment_cycle});
			dispatch({
				type: REQUEST_SET_EMI_COST,
				payload: getEMIPrice(response.data.order.total_amount, data.package_frequency)
			});
			dispatch({type: REQUEST_PENDING, payload: false})
			if (response.data.order.status == 4) {
				dispatch({type: TOGGLE_IS_CANCELLED_STATE, payload: false})
			} else {
				dispatch({type: TOGGLE_IS_CANCELLED_STATE, payload: true})
			}
			toast.success(langContent.frequency_changed_successfully, {
				pauseOnHover:false,
				hideProgressBar:true,
				autoClose: 2000,
				pauseOnFocusLoss: true,
				onOpen: ({ uid }) => dispatch({type: REQUEST_PENDING, payload: false}),
			});
			dispatch({type: CHANGE_POPUP_STATE, payload: false})
		}).catch(function (error) {
			dispatch({type: REQUEST_PENDING, payload: false});
			toast.error(langContent.login_to_change_frequency, {
				hideProgressBar:true,
			});
		});
}

export const handleChangeScheduleDateShowOrder = (data) => (dispatch, getState) => {
	const authToken = getState().session.user.token;
	let langContent = getState().Lang.langContent;
	axios.post(API_URL + '/order/change-schedule-date/'+data.order_id, data, { headers: { 'Authorization': 'Bearer ' + authToken } })
		.then(function (response) {
			dispatch({type: REQUEST_GET_ORDER_SUCCESS, payload: response.data.order});
			dispatch({type: REQUEST_SET_TOTAL_EMI, payload: response.data.order.payment_cycle});
			dispatch({
				type: REQUEST_SET_EMI_COST,
				payload: getEMIPrice(response.data.order.total_amount, response.data.order.payment_cycle)
			});
			dispatch({type: REQUEST_PENDING, payload: false})
			if (response.data.order.status == 4) {
				dispatch({type: TOGGLE_IS_CANCELLED_STATE, payload: false})
			} else {
				dispatch({type: TOGGLE_IS_CANCELLED_STATE, payload: true})
			}
			toast.success(langContent.scheduled_date_changed_successfully, {
				pauseOnHover:false,
				hideProgressBar:true,
				autoClose: 2000,
				pauseOnFocusLoss: true,
				onOpen: ({ uid }) => dispatch({type: REQUEST_PENDING, payload: false}),
			});
			dispatch({type: CHANGE_POPUP_STATE, payload: false})
		}).catch(function (error) {
		dispatch({type: REQUEST_PENDING, payload: false});
		toast.error(langContent.login_to_change_schedule_date, {
			hideProgressBar:true,
		});
	});
}

export const changePopupState = (data) => (dispatch, getState) => {
	dispatch({type: CHANGE_POPUP_STATE, payload: data})
}

export const handleChangeCardOnShowOrder = (data) => (dispatch, getState) => {
	const authToken = getState().session.user.token;
	let langContent = getState().Lang.langContent;
	axios.post(API_URL + '/order/change-card/'+data.order_id, data, { headers: { 'Authorization': 'Bearer ' + authToken } })
		.then(function (response) {
			dispatch({type: CHANGE_FLAG_VIEW, payload: 'order'})
			dispatch({type: REQUEST_GET_ORDER_SUCCESS, payload: response.data.order});
			dispatch({type: REQUEST_SET_TOTAL_EMI, payload: response.data.order.payment_cycle});
			dispatch({
				type: REQUEST_SET_EMI_COST,
				payload: getEMIPrice(response.data.order.total_amount, response.data.order.payment_cycle)
			});
			dispatch({type: REQUEST_PENDING, payload: false})
			if (response.data.order.status == 4) {
				dispatch({type: TOGGLE_IS_CANCELLED_STATE, payload: false})
			} else {
				dispatch({type: TOGGLE_IS_CANCELLED_STATE, payload: true})
			}
			toast.success(langContent.card_changed_successfully, {
				pauseOnHover:false,
				hideProgressBar:true,
				autoClose: 2000,
				pauseOnFocusLoss: true,
				onOpen: ({ uid }) => dispatch({type: REQUEST_PENDING, payload: false}),
			});
		}).catch(function (error) {
			dispatch({type: REQUEST_PENDING, payload: false});
			toast.error(langContent.please_login_to_change_card, {
				hideProgressBar:true,
			});
		});
}