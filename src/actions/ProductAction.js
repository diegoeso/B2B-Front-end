/**
 * Created by Prakash chandra yadav on 4/6/20.
 */
import axios from 'axios';
import {sessionService} from 'redux-react-session';
import { totalEMI, getEMIPrice, API_URL } from '../constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Redirect} from 'react-router-dom'
import {
		REQUEST_GET_PRODUCT_INFO,
		REQUEST_GET_ALL_PRODUCTS,
		REQUEST_GET_PRODUCT_PENDING,
		IS_PRODUCT_FAVOURITE,
		REQUEST_GET_PRODUCT_THEMES,
} from '../constants/ProductConstants';
import {
	REQUEST_CARD_SELECT,
	REQUEST_SET_TOTAL_EMI,
	REQUEST_SET_EMI_COST,
} from '../constants/OrderConstants';
import {
		REQUEST_ADD_TO_WISHLIST
} from '../constants/UserConstants';

toast.configure();

export const getProduct = (productId) => (dispatch, getState) => {
	const form = getState().Order.form;
	const wishlist = getState().Auth.wishlist;
	let favouriteState = false;
    axios.get(API_URL + '/product/'+productId)
        .then(function (response) {
			if(wishlist.indexOf(response.data.product.id) > -1) {
				favouriteState = true;
			}
			dispatch({type: IS_PRODUCT_FAVOURITE, payload: favouriteState});
			dispatch({type: REQUEST_GET_PRODUCT_INFO, payload: response.data.product});
			form.amount = response.data.product.total_amount;
			dispatch({type: REQUEST_SET_TOTAL_EMI, payload: totalEMI(form.package_frequency)});
			dispatch({type: REQUEST_SET_EMI_COST, payload: getEMIPrice(response.data.product.total_amount, form.package_frequency)});
		}).catch(function (error) {
	}).then(function () {

	});
}

export const getThemes = () => (dispatch, getState) => {
    axios.get(API_URL + '/get-themes')
        .then(function (response) {
            dispatch({type: REQUEST_GET_PRODUCT_THEMES, payload: response.data})
        }).catch(function (error) {
    });
}

export const getProducts = (type,limit, themeId = '') => (dispatch, getState) => {
	let themes = getState().Product.themes;
	let customer = getState().Auth.customer;
   if(themeId == '' && themes != undefined && themes != null && themes[0] != undefined) {
   		themeId = themes[0].id;
   }
	dispatch({type: REQUEST_GET_PRODUCT_PENDING, payload: true});

    axios.get(API_URL + '/products?type='+type+'&company_name=' + customer+'&limit='+limit+'&theme='+themeId)
        .then(function (response) {
            dispatch({type: REQUEST_GET_ALL_PRODUCTS, payload: response.data.data, total: response.data.total })
            dispatch({type: REQUEST_GET_PRODUCT_PENDING, payload: false});
        }).catch(function (error) {
    });
}

export const addWislist = (id) => (dispatch, getState) => {
	 let wishlist = getState().Auth.wishlist;
	 wishlist.push(id);
	 toast("The product was successfully added to your wishlist !");
	 dispatch({type: REQUEST_ADD_TO_WISHLIST, payload: wishlist})
}

export const removeWislist = (id) => (dispatch, getState) => {
	 let wishlist = getState().Auth.wishlist;

	 const index = wishlist.indexOf(id);
		if (index > -1) {
		  wishlist.splice(index, 1);
		}
	 toast("The product was successfully removed from wishlist !");
	 dispatch({type: REQUEST_ADD_TO_WISHLIST, payload: wishlist})
}

