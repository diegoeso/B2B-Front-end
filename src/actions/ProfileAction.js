/**
 * Created by anita on 30/6/2020
 */

import {
    REQUEST_GET_PROFILE_DATA,
    REQUEST_GET_PROFILE_DATA_FAILED,
    REQUEST_GET_PENDING,
    REQUEST_GET_SUCCESS
} from '../constants/ProfileConstants';

import axios from 'axios';
import {API_URL} from '../constants';

export const getProfileData = () => (dispatch, getState) => {
    
    let companyName = "sCompany Names";
    axios({url: API_URL + '/client-profile=' + companyName, method: "post"})
        .then(function (response) {
            dispatch({type: REQUEST_GET_USER_INFO:, payload: response.data.userinfo})
        }).catch(function (error) {
        });
}