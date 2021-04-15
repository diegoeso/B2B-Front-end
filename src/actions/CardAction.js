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
    REQUEST_PENDING,
    REQUEST_CARD_INPUT_CHANGE,
    REQUEST_ADD_CARD_FAILED,
    CARD_ADDED_SUCCESSFULLY,
} from '../constants/CardConstants';
import {Redirect} from 'react-router-dom';

toast.configure();

export const handleInputCardChange = (data) => (dispatch, getState) => {
    dispatch({type: REQUEST_CARD_INPUT_CHANGE, payload: data})
}
/**
 * add card
 * @author Azim Khan <azim@surmountsoft.in>
 * */
export const addCard = (props) => (dispatch, getState) => {
    let card = getState().Auth.card;
    let errors = {}
    let flag = true;
    var field = {
        'card_number': {'type': 'number', 'min': 16, 'max': 16},
        'expiry_date': {'type': 'date'},
        'holder_name': {'type': 'string', 'min': 4, 'max': 50},
        'cvv': {'type': 'number', 'min': 3, 'max': 3},
    }
    Object.keys(card).map(key => {
        if (card[key] != undefined) {
            if (card[key].trim() == '') {
                errors[key] = 'The ' + key.replace('_', ' ') + ' field is required';
                flag = false;
            } else {
                if (field[key] != undefined) {
                    if (field[key]['type'] == 'number') {
                        if (isNaN(card[key])) {
                            flag = false;
                            errors[key] = 'The ' + key.replace('_', ' ') + ' field must be a number';
                        } else if (field[key]['min'] > card[key].length) {
                            flag = false;
                            errors[key] = 'The ' + key.replace('_', ' ') + ' minimum ' + field[key]['min'] + ' characters is required.';
                        } else if (field[key]['max'] < card[key].length) {
                            flag = false;
                            errors[key] = 'The ' + key.replace('_', ' ') + ' maximum ' + field[key]['max'] + ' characters is required.';
                        }
                    } else if (field[key]['type'] == 'string') {
                        if (!validateString(card[key])) {
                            flag = false;
                            errors[key] = 'The ' + key.replace('_', ' ') + ' field must be a string';
                        }
                    } else if (field[key]['type'] == 'date') {
                        if ((moment(card[key]).month() + 1 < moment().month() + 1) || (moment(card[key]).year() < moment().year())) {
                            flag = false;
                            errors[key] = 'The ' + key.replace('_', ' ') + ' is invalid';
                        }
                    }
                    /* else if (field[key]['type'] == 'card_number' && !validateCardFormat(card[key])) {
                     flag =false;
                     errors[key] = 'The '+key.replace('_',' ')+' format must be xxxx-xxxx-xxxx-xxxx';
                     }*/

                }
            }
        }
    });
    if (flag) {
        dispatch({type: REQUEST_PENDING, payload: true});
        const authToken = getState().session.user.token;
        const cards = getState().Auth.user.cards;
        const user = getState().Auth.user;
        axios.post(API_URL + '/add-card', card, {headers: {'Authorization': 'Bearer ' + authToken}})
            .then(function (response) {
                /*let card = response.data.card != undefined ? response.data.card : '';
                dispatch({type: CARD_ADDED_SUCCESSFULLY, payload: response.data.card});
                form.card_id = response.data.card.id;
                cards.push(response.data.card);
                user.cards = cards;*/
                toast.success("Card added successfully!");
            }).catch(function (error) {
            Object.keys(error.response.data).map(err => {
                if (error.response.data != undefined && error.response.data[err] != undefined)
                    errors[err] = error.response.data[err][0];
            });
            dispatch({type: REQUEST_ADD_CARD_FAILED, payload: {'errors': errors}});
        });
    } else {
        dispatch({type: REQUEST_ADD_CARD_FAILED, payload: {'errors': errors}});
    }
}