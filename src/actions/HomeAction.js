/**
 * Created by azim on 7/5/20.
 */

import {
	REQUEST_GET_HOME_DATA,
	REQUEST_GET_HOME_DATA_FAILED,
	REQUEST_GET_PENDING,
	REQUEST_GET_SUCCESS,
    REQUEST_GET_CUSTOMER_INFO,
} from '../constants/HomeConstants';

import axios from 'axios';
import {API_URL} from '../constants';

export const getHomeData = (companyName) => (dispatch, getState) => {
    
    let query = '';
    if(companyName != '')
        query = '?company_name=' + companyName;

    axios({url: API_URL + '/home'+query, method: "get"})
        .then(function (response) {
            dispatch({type: REQUEST_GET_HOME_DATA, payload: response.data})
        }).catch(function (error) {
        });
}


export const getCustomerInfo = (customer) => (dispatch, getState) => {
    if (customer != undefined && customer != '') {
        axios.get(API_URL + '/customer?name=' + customer)
            .then(function (response) {
                dispatch({type: REQUEST_GET_CUSTOMER_INFO, payload: response.data.customer});
            }).catch(function (error) {
                
            });
    } else {

    }
}