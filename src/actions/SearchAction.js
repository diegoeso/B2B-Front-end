/**
 * Created by Prakash chandra yadav on 4/6/20.
 */
import axios from 'axios';
import {sessionService} from 'redux-react-session';
import {API_URL, validateString} from '../constants';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import {
    REQUEST_SEARCH_PENDING,
    REQUEST_INPUT_CHANGE,
    REQUEST_SEARCH_RESULT,
    REQUEST_GET_PACKAGE_FREQUENCY,
} from '../constants/SearchConstants';
import { Redirect } from 'react-router-dom';

toast.configure();

export const handleInputChange = (data) => (dispatch, getState) => {
    dispatch({ type: REQUEST_INPUT_CHANGE, payload: data })
}
/**
 * submit search
 * @author Azim Khan <azim@surmountsoft.in>
 * */
export const submitSearch = (props) => (dispatch, getState) => {
    let keyword = getState().Search.keyword;
    return '<Redirect to={getUrl(customer)} />';
}

export const getSearch = (keyword, limit=5) => (dispatch, getState) => {
    const authToken = getState().session.user.token;
    const customer = getState().Auth.customer;
    dispatch({type: REQUEST_SEARCH_PENDING, payload: true});
    axios.get(API_URL + '/packages/search?keyword='+keyword+'&customer='+customer+'&limit='+limit)
        .then(function (response) {
            dispatch({type: REQUEST_SEARCH_RESULT, payload: response.data.packages, totalCount: response.data.totalCount,room_category: response.data.room_category});
        }).catch(function (error) {
    }).then(function () {

    });
}
