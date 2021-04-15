/**
 * Created by Prakash chandra yadav on 4/6/20.
 */
import axios from 'axios';
import {sessionService} from 'redux-react-session';
import {API_URL,convertToSlug,validateEmail,validateString,getUrl,validateCardExpiry} from '../constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import {
	REQUEST_GET_USER_INFO,
	REQUEST_GET_USER_INFO_FAILED,
    REQUEST_INPUT_CHANGE_LOGIN,
    REQUEST_FORGOT_PASSWORD_SUCCESS,
    SET_COUSTOMER_SUCCESS,
    REQUEST_INPUT_CHANGE_SIGNUP,
    REQUEST_SIGNUP_NEXT,
    REQUEST_INPUT_CHANGE_SET_PASSWORD,
    REQUEST_GET_COUNTRIES,
    REQUEST_GET_STATES,
    REQUEST_GET_CITY,
    REQUEST_GET_STATE_CITIES,
    REQUEST_PENDING,
    REQUEST_CARD_INPUT_CHANGE,
    REQUEST_ADD_CARD_FAILED,
    CARD_ADDED_SUCCESSFULLY,
    REQUEST_INPUT_RESET,
    REQUEST_GET_WISH_LIST,
    REQUEST_ADD_TO_WISHLIST,
    REQUEST_GET_PACKAGE_FREQUENCY, 
    REQUEST_CHANGE_PASSWORD_FAILED,
    SHOW_NOTIFICATION,
    TOGGLE_POPUP,
    TOGGLE_DELETE_CARD_POPUP,
    CARD_DELETED_SUCCESSFULLY,
} from '../constants/UserConstants';
import {
    IS_PRODUCT_FAVOURITE,
   
} from '../constants/ProductConstants';

import  {
    REQUEST_CARD_SELECT,
    CHANGE_FLAG_VIEW
} from '../constants/OrderConstants';

import {Redirect} from 'react-router-dom';
toast.configure();
export const getUser = () => (dispatch, getState) => {
    let companyName = "sCompany Names";
    axios({url: API_URL + '/home?company_name=' + companyName, method: "get"})
        .then(function (response) {
            dispatch({type: REQUEST_GET_USER_INFO, payload: response.data})
        }).catch(function (error) {
        });
}

export const getVarifyEmail = (token) => (dispatch, getState) => {
    
     axios.get(API_URL + '/verify-email/'+token)
        .then(function (response) {
            toast(response.data.success);
            return '<Redirect to={getUrl(customer)} />';
        }).catch(function (error) {
            toast(error.response.data.error);
            return '<Redirect to={getUrl(customer)} />';
    });
}
export const resetInput = () => (dispatch, getState) => {
    dispatch({type: REQUEST_INPUT_RESET, payload: ''})
}

export const unsetErroresMessage = (field) => (dispatch, getState) => {
     let errors = getState().Auth.errors;
    if(errors.signup != undefined) {
        delete errors.signup[field];
        dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'signup': errors.signup}});
    }
}
export const getCountries = () => (dispatch, getState) => {
    
     axios.get(API_URL + '/countries')
        .then(function (response) {
            dispatch({type: REQUEST_GET_COUNTRIES, payload: response.data.countries})
        }).catch(function (error) {
    });
}

export const getState = (countryId) => (dispatch, getState) => {
    var firstIndexValue =''; 
    dispatch({type: REQUEST_INPUT_CHANGE_SIGNUP, payload: { ['country']: countryId }});
    
    dispatch(unsetErroresMessage('country'));

    axios.get(API_URL + '/country-states?id='+countryId)
        .then(function (response) {
            dispatch({type: REQUEST_GET_STATES, payload: response.data.states})
            /*if(response.data.states[0] != undefined){
                firstIndexValue = response.data.states[0].id;
            }
            dispatch(getCity(firstIndexValue));*/
          
        }).catch(function (error) {
    });
}

export const getCity = (stateId) => (dispatch, getState) => {
    dispatch({type: REQUEST_INPUT_CHANGE_SIGNUP, payload: { ['state']: stateId }});
    let errors = getState().Auth.errors;
    dispatch(unsetErroresMessage('state'));
    axios.get(API_URL + '/state-cities?id='+stateId)
        .then(function (response) {
            dispatch({type: REQUEST_GET_CITY, payload: response.data.cities})
        }).catch(function (error) {
    });
}


export const handleInputChange = (data) => (dispatch, getState) => {
    dispatch({type: REQUEST_INPUT_CHANGE_LOGIN, payload: data})
}

export const handleInputChangeSignup = (data) => (dispatch, getState) => {
    dispatch({type: REQUEST_INPUT_CHANGE_SIGNUP, payload: data});
    let errors = getState().Auth.errors;
    if(errors.signup != undefined) {
        delete errors.signup[Object.keys(data)[0]];
        dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'signup': errors.signup}});
    }
}

export const handleInputDate = (data) => (dispatch, getState) => {
    dispatch({type: REQUEST_INPUT_CHANGE_SIGNUP, payload: data});
    let errors = getState().Auth.errors;
    if(errors.signup != undefined) {
        delete errors.signup[Object.keys(data)[0]];
        dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'signup': errors.signup}});
    }
}

export const handleInputSetPassword = (data) => (dispatch, getState) => {
    dispatch({type: REQUEST_INPUT_CHANGE_SET_PASSWORD, payload: data})
}

export const logout = (props) => (dispatch, getState) => {
    let customer = getState().Auth.customer;
    sessionService.deleteSession();
    sessionService.deleteUser();

    return '<Redirect to={getUrl(customer)} />';
  
}

export const setCustomer = (customer) => (dispatch, getState) => {
  dispatch({type: SET_COUSTOMER_SUCCESS, payload: convertToSlug(customer)});
}



export const login = (props,status=0) => (dispatch, getState) => {
    let email = getState().Auth.login.email;
    let password = getState().Auth.login.password;
    let langContent = getState().Lang.langContent;
    
    let loginForm = {
        email:email,
        password:password
    }
    var flg = true;
     if(email.trim() == '') {
       dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'email': langContent.email_is_required_field}});
       flg = false;
     } else {
        if(validateEmail(email) == false) {
            dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'email':  langContent.enter_validate_email}});
            flg = false;
        }
     }

     if(password.trim() == '') {
       dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'password': langContent.password_is_required_field}});
       flg = false;
     }

    if(flg) {
        dispatch({type: REQUEST_PENDING, payload: true});
        let wishList = getState().Auth.wishlist;
        axios.post(API_URL + '/login',loginForm)
            .then(function (response) {
                let customer = response.data.user != undefined && response.data.user.customer != undefined && response.data.user.customer.company_name != undefined ? response.data.user.customer.company_name : '';
                dispatch({type: REQUEST_GET_USER_INFO, payload: response.data.user});
                dispatch({type: SET_COUSTOMER_SUCCESS, payload: convertToSlug(customer)});
                sessionService.saveSession({token:response.data.token,user:response.data.user});
                sessionService.saveUser(response.data.user);
              /*  if (response.data.user.wish_list.length > 0) {
                    let wishlist = response.data.user.wish_list;
                    Object.keys(wishlist).map(wish=> {
                        wishList.push(wishlist[wish]);
                    });
                }*/
                dispatch( getloginUser(response.data.token));
                dispatch({type: REQUEST_ADD_TO_WISHLIST, payload: wishList})
                /*sessionService.saveSession({token:response.data.token,'full_name': response.data.user.full_name});*/
               if(status==0){
                props.history.push('/'+convertToSlug(customer));
               }
                else{
                    dispatch({type: TOGGLE_POPUP, payload:false});
                }
            }).catch(function (error) {
                if(error.response.data != undefined && error.response.data.error !=undefined) {

                    toast.error(error.response.data.error);
                } 
                dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'message': error.response.data.message}});
            });
    }
}
export const getloginUser = (authToken='') => (dispatch, getState) => {
    if(authToken =='') {
        authToken = getState().session.user.token;
    }
    
    let Auth = getState().Auth;
    let langContent = getState().Lang.langContent;
     
    if(Auth.user !=undefined) {
        dispatch({type: REQUEST_PENDING, payload: true});
        let wishList = getState().Auth.wishlist;
        axios.post(API_URL + '/getloginUser',{},{headers: {'Authorization': 'Bearer ' + authToken}})
            .then(function (response) {
                let customer = response.data.user != undefined && response.data.user.customer != undefined && response.data.user.customer.company_name != undefined ? response.data.user.customer.company_name : '';
                dispatch({type: REQUEST_GET_USER_INFO, payload: response.data.user});
                dispatch({type: SET_COUSTOMER_SUCCESS, payload: convertToSlug(customer)});
                if (response.data.user.wish_list.length > 0) {
                    let wishlist = response.data.user.wish_list;
                    Object.keys(wishlist).map(wish=> {
                        wishList.push(wishlist[wish]);
                    });
                }
                dispatch({type: REQUEST_ADD_TO_WISHLIST, payload: wishList})
                /*sessionService.saveSession({token:response.data.token,'full_name': response.data.user.full_name});*/
              
            }).catch(function (error) {
                
            });
    }
}

export const setloginUser = () => (dispatch, getState) => {
   let user = getState().session.user;
   if (user != undefined && user.customer != undefined && user.customer.company_name !=undefined) {
     dispatch({type: SET_COUSTOMER_SUCCESS, payload: convertToSlug(user.customer.company_name)});
   }
   
   dispatch({type: REQUEST_GET_USER_INFO, payload: user});
}

export const createAccountNext = () => (dispatch, getState) => {
        let langContent = getState().Lang.langContent;
        let signup = getState().Auth.signup;
        let flg = true;
        let errors = {
                        confirm_password:'',
                        password: '',
                        email:'',
                    }
        if(signup.password.trim() == '') {
            errors.password = langContent.password_is_required_field;
            flg = false;
        } else {
              
            if(signup.password != signup.confirm_password) {
                errors.confirm_password = langContent.confirm_password_must_match;
                flg = false;
            }

            if(signup.password.length < 6) {
                 errors.password = langContent.password_must_characters;
                
                flg = false;
            }
        }

        if(signup.confirm_password.trim() =='') {
             errors.confirm_password = langContent.password_is_required_field
                flg = false;
        }
        
        if(flg) {
            dispatch({type: REQUEST_PENDING, payload: true});
            axios.post(API_URL + '/validateEmail',{email:signup.email})
            .then(function (response) {
                if(response.data.message !=undefined) {
                     errors.email = response.data.message;
                     dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'signup':errors}});
                } else {
                    dispatch({type: REQUEST_SIGNUP_NEXT, payload: 'personal'});
                }
                
            }).catch(function (error) {
                dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'message': error.response.data.message}});
            });
        }
        else {
            dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'signup':errors}});
        }
}


export const signup = (props) => (dispatch, getState) => {
    let signup = getState().Auth.signup;
    let langContent = getState().Lang.langContent;
    let lang = getState().Lang.lang;
    let errors ={}
    let flg =true;
    signup.customer = getState().Auth.customer;
    var field = {
                 'extension_number' : {'type':'number', 'min': 2,'max':10},
                 'phone_number' : {'type':'number', 'min': 4,'max':15},
                 'mobile_number' : {'type':'number', 'min': 10,'max':10},
                 'zipcode' : {'type':'number', 'min': 4,'max':8},
                 'first_name' : {'type':'string', 'min': 4,'max':8},
                 'last_name' : {'type':'string', 'min': 4,'max':8},
                 /*'designation' : {'type':'string', 'min': 4,'max':8},*/
                }
   
    Object.keys(signup).map(ke =>{
     if(signup[ke] !=undefined) {
      if(signup[ke] != undefined && typeof signup[ke] == 'string' && signup[ke].trim() == '') {
        if(ke != 'accept_term') {
            if (ke != 'extension_number' && ke != 'phone_number') {
                errors[ke] = langContent.the + ' ' + langContent[ke] + ' ' + langContent.field_is_required;
                flg =false;
            }
        } else {
            errors[ke] = langContent.please_accept_term_condition;
            flg =false;
        }
      } else {
        if(field[ke] != undefined) {
            let par= /^([a-z0-9]{5,})$/;
            if(field[ke]['type'] == 'number') {
                 if(isNaN(signup[ke])){
                    flg =false;
                   errors[ke] = langContent.the+' '+langContent[ke]+' '+langContent.field_must_be_number;
                 } else if(field[ke]['min'] > signup[ke].length) {
                    flg =false;
                    errors[ke] = langContent.the+' '+langContent[ke]+' '+langContent.minimum+' '+field[ke]['min']+' '+langContent.characters_required;
                 } else if(field[ke]['max'] < signup[ke].length) {
                    flg =false;
                    errors[ke] = langContent.the+' '+langContent[ke]+' '+langContent.maximum+' '+field[ke]['max']+' '+langContent.characters_required;
                 }
            } else if(field[ke]['type'] == 'string') {
                if(!validateString(signup[ke])) {
                    flg =false;
                    errors[ke] = langContent.the+' '+langContent[ke]+' '+langContent.field_must_be_string;
                } else if(par.test(signup[ke]) && field[ke]['type'] != 'string') {
                    flg =false;
                    errors[ke] = langContent.the+' '+langContent[ke]+' '+langContent.field_must_be_string;
                }
            }
        }
      }
       }
    });
    if(flg) {
        dispatch({type: REQUEST_PENDING, payload: true});
        axios.post(API_URL + '/client/register',signup)
            .then(function (response) {
               dispatch({type: REQUEST_SIGNUP_NEXT, payload: 'success'});
                toast(langContent.you_have_signed_up_successfully);
            }).catch(function (error) {
                if(error.response.data != undefined && error.response.data.messages != undefined && error.response.data.messages[lang] != undefined) {
                    toast.error(error.response.data.messages[lang], {
                        hideProgressBar:true,
                    });
                }
                Object.keys(error.response.data).map(err => {
                    if(error.response.data != undefined && error.response.data[err] != undefined)
                        errors[err] = error.response.data[err][0];
                });
                dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'signup': errors}});
            });

    } else {
        dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'signup':errors}});
    }
}



export const forgotPassword = (props) => (dispatch, getState) => {
    let email = getState().Auth.login.email;
    let langContent = getState().Lang.langContent;
    let loginForm={
        email:email,
     }
    var flg = true;

     if(email.trim() == '') {
       dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'forgotMessage': langContent.email_is_required_field}});
       flg = false;
     } else {
        if(validateEmail(email) == false) {
            dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'forgotMessage': langContent.enter_validate_email}});
            flg = false;
        }
     }
     if(flg) {
        dispatch({type: REQUEST_PENDING, payload: true});
        axios.post(API_URL + '/forgot/password',loginForm)
            .then(function (response) {
                dispatch({type: REQUEST_FORGOT_PASSWORD_SUCCESS, payload: response.data.message});
                toast(langContent.please_check_your_email);
            }).catch(function (error) {
               
                dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'forgotMessage': error.response.data.error}});
            });
        }
}


export const resetPassword = (props) => (dispatch, getState) => {
        let signup = getState().Auth.resetpassword;
        let langContent = getState().Lang.langContent;
        let token = props.match.params.token;
       
        let flg = true;
        let errors = {
                        confirm_password:'',
                        password: ''
                    }
        if(signup.password.trim() == '') {
            errors.password = langContent.email_is_required_field;
            flg = false;
        } else {
              
            if(signup.password != signup.confirm_password) {
                errors.confirm_password = langContent.confirm_password_must_match;
                flg = false;
            }
            if(signup.password.length < 6) {
                 errors.password = langContent.password_must_characters;
                
                flg = false;
            }
        }
        if(signup.confirm_password.trim() =='') {
             errors.confirm_password = langContent.email_is_required_field;
                flg = false;
        }

        let formData={
            token: token,
            new_password:signup.password
        };

        if(flg) {
            dispatch({type: REQUEST_PENDING, payload: true});
            axios.post(API_URL + '/client/verify-password',formData)
                .then(function (response) {
                   toast(langContent.password_successfully_update);
                   props.history.push('/'+convertToSlug(getState().Auth.customer));
                }).catch(function (error) {
                    dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'message': error.response.data}});
                });
        } else {
             dispatch({type: REQUEST_GET_USER_INFO_FAILED, payload: {'reset_passwor':errors}});
        }
}

export const handleInputCardChange = (data) => (dispatch, getState) => {
    let errors ={}
    let flag = true;
    let langContent = getState().Lang.langContent;
    var field = {
        'card_number' : {'type':'number', 'min': 16,'max':16},
        'expiry_date' : {'type':'date'},
        'holder_name' : {'type':'string', 'min': 4,'max':50},
        'cvv' : {'type':'number', 'min': 3,'max':3},
    }

    if(data.card_number != undefined) {
        let cardNo = data.card_number;
        cardNo = cardNo.replace(/-/g, "");
        if (isNaN(cardNo)) {
            flag = false;
            errors[Object.keys(data)[0]] = langContent.the+' '+langContent[Object.keys(data)[0]]+' '+langContent.field_must_be_number;
        } else if (field[Object.keys(data)[0]]['max'] < cardNo.length) {
            flag = false;
            errors[Object.keys(data)[0]] = langContent.the+' '+langContent[Object.keys(data)[0]]+' '+langContent.maximum+' '+field[Object.keys(data)[0]]['max']+' '+langContent.characters_required;
        }
    } else if(data.holder_name != undefined) {
        if(field[Object.keys(data)[0]]['type'] == 'string') {
            if(!validateString(data.holder_name)) {
                flag =false;
                errors[Object.keys(data)[0]] = langContent.the+' '+langContent[Object.keys(data)[0]]+' '+langContent.field_must_be_string;
            }
        } else if (field[Object.keys(data)[0]]['max'] < data.holder_name.length) {
            flag = false;
            errors[Object.keys(data)[0]] = langContent.the+' '+langContent[Object.keys(data)[0]]+' '+langContent.maximum+' '+field[Object.keys(data)[0]]['max']+' '+langContent.characters_required;
        }
    }  else if(data.cvv != undefined) {
        if (isNaN(data.cvv)) {
            flag = false;
            errors[Object.keys(data)[0]] = langContent.the+' '+langContent[Object.keys(data)[0]]+' '+langContent.field_must_be_number;
        } else if (field[Object.keys(data)[0]]['max'] < data.cvv.length) {
            flag = false;
            errors[Object.keys(data)[0]] = errors[Object.keys(data)[0]] = langContent.the+' '+langContent[Object.keys(data)[0]]+' '+langContent.maximum+' '+field[Object.keys(data)[0]]['max']+' '+langContent.characters_required;
             }
    } else if (data.expiry_date != undefined ) {
        if (!validateCardExpiry(data.expiry_date)) {
            flag = false;
            errors[Object.keys(data)[0]] = langContent.the+' '+langContent[Object.keys(data)[0]]+' '+langContent.format_is_invalid;
        } else {
            errors[Object.keys(data)[0]] = '';
            let monthYear = data.expiry_date.split('/');
            let month = monthYear[0];
            let year = monthYear[1];
            if (month > 12) {
                flag = false;
                errors[Object.keys(data)[0]] = langContent.the_month_is_invalid;
            } else if (year < moment().year()) {
                flag = false;
                errors[Object.keys(data)[0]] = langContent.the_month_is_invalid;
            } else if (month < moment().month() + 1 && year == moment().year()) {
                flag = false;
                errors[Object.keys(data)[0]] = langContent.the+' '+Object.keys(data)[0]+' '+langContent.is_invalid;
            } else {
                errors[Object.keys(data)[0]] = '';
            }
        }
    }
    if (flag)
        dispatch({type: REQUEST_CARD_INPUT_CHANGE, payload: data});
    else
        dispatch({type: REQUEST_ADD_CARD_FAILED, payload: {'card_error': errors}});
}


/**
* add card
 * @author Azim Khan <azim@surmountsoft.in>
* */
export const addCard = (respornce,props) => (dispatch, getState) => {
    let card = getState().Auth.card;
    let langContent = getState().Lang.langContent;
    let errors ={};
    let flag = true;
    /*var field = {
        'card_number' : {'type':'number', 'min': 16,'max':16},
        'expiry_date' : {'type':'date'},
        'holder_name' : {'type':'string', 'min': 4,'max':50},
        'cvv' : {'type':'number', 'min': 3,'max':3},
    }*/
    /*Object.keys(card).map(key =>{

        if(card[key] != undefined) {
            if (card[key].trim() == '') {
                errors[key] =  langContent.the+' '+langContent[key]+' '+langContent.field_is_required;
                flag = false;
            } else {
                if(field[key] != undefined) {
                    if(field[key]['type'] == 'number') {
                        if (key == 'card_number') {
                            let cardNo = card[key];
                            cardNo = cardNo.replace(/-/g, "");
                            if (isNaN(cardNo)) {
                                flag = false;
                                errors[key] = langContent.the+' '+langContent[key]+' '+langContent.field_must_be_number; 
                            } else if (field[key]['max'] < cardNo.length) {
                                flag = false;
                                errors[key] = langContent.the+' '+langContent[key]+' '+langContent.maximum+' ' + field[key]['max'] + ' '+langContent.characters_required;
                            }
                        } else {
                            if (isNaN(card[key])) {
                                flag = false;
                                errors[key] = langContent.the+' '+langContent[key]+' '+langContent.field_must_be_number; 
                            } else if (field[key]['min'] > card[key].length) {
                                flag = false;
                                errors[key] = langContent.the+' '+langContent[key]+' '+langContent.maximum+' ' + field[key]['max'] + ' '+langContent.characters_required;
                            } else if (field[key]['max'] < card[key].length) {
                                flag = false;
                                errors[key] =  langContent.the+' '+langContent[key]+' '+langContent.minimum+' ' + field[key]['min'] + ' '+langContent.characters_required;
                            }
                        }
                    } else if(field[key]['type'] == 'string') {
                        if(!validateString(card[key])) {
                            flag =false;
                            errors[key] = langContent.the+' '+langContent[key]+' '+langContent.field_must_be_string; 
                        }
                    } else if (field[key]['type'] == 'date') {
                        if (moment(card[key]).year() < moment().year()) {
                            flag =false;
                            errors[key] = langContent.the+' ' + langContent[key] + ' '+langContent.is_invalid;
                        } else if ((moment(card[key]).month() + 1 < moment().month() + 1) && (moment(card[key]).year() == moment().year())) {
                            flag =false;
                            errors[key] = langContent.the+' ' + langContent[key] + ' '+langContent.is_invalid;
                        }

                    }

                }
            }
        }
    });*/

    if(flag) {

        dispatch({type: REQUEST_PENDING, payload: true});
        const authToken = getState().session.user.token;
        const form = getState().Order.form;
        const cards = getState().Auth.user.cards;
        const user = getState().Auth.user;
        axios.post(API_URL + '/add-card', respornce, { headers: { 'Authorization': 'Bearer ' + authToken } })
            .then(function (response) {
                let card = response.data.card != undefined ? response.data.card : '';
                dispatch({type: CARD_ADDED_SUCCESSFULLY, payload: response.data.card});
                form.card_id = response.data.card.id;
                cards.push(response.data.card);
                user.cards = cards;
                dispatch({type: REQUEST_CARD_SELECT, payload: card.number.slice(card.number.length - 4)});
                toast.success(langContent.card_added_successfully);
                dispatch({type: CHANGE_FLAG_VIEW, payload: 'payment-option'})
            }).catch(function (error) {
            Object.keys(error.response.data).map(err => {
                if(error.response.data != undefined && error.response.data[err] != undefined)
                    errors[err] = error.response.data[err][0];
            });
            dispatch({type: REQUEST_ADD_CARD_FAILED, payload: {'card_error': errors}});
        });
    } else {
        dispatch({type: REQUEST_ADD_CARD_FAILED, payload: {'card_error':errors}});
    }
}

export const getWishList = () => (dispatch, getState) => {
    const authToken = getState().session.user.token;
    axios.get(API_URL + '/carts', {headers: {'Authorization': 'Bearer ' + authToken}})
        .then(function (response) {
            dispatch({type: REQUEST_GET_WISH_LIST, payload: response.data.wishlist, room_category: response.data.room_category});
            dispatch({type: REQUEST_GET_PACKAGE_FREQUENCY, payload: response.data.package_frequency});
        }).catch(function (error) {
    }).then(function () {

    });
}

export const addToWishList = (id) => (dispatch, getState) => {
    const authToken = getState().session.user.token;
    let langContent = getState().Lang.langContent;
    if (authToken != "" && authToken != undefined) {
        let wishlist = getState().Auth.wishlist;
        let form = {
            package_id : id
        };
        
        if(wishlist.includes(id)) {
            return false;
        }

        axios.post(API_URL + '/carts/add', form, {headers: {'Authorization': 'Bearer ' + authToken}})
            .then(function (response) {
                toast.success(langContent.add_wishlist_success);

                wishlist.push(id);
                dispatch({type: REQUEST_ADD_TO_WISHLIST, payload: wishlist});
                dispatch({type: IS_PRODUCT_FAVOURITE, payload: id})
            }).catch(function (error) {
            dispatch({type: REQUEST_PENDING, payload: false});
        });
    } else {
        toast.error(langContent.please_login_first, {
            hideProgressBar:true,
        });
    }
}

export const removeWishList = (id) => (dispatch, getState) => {
    const authToken = getState().session.user.token;
    let langContent = getState().Lang.langContent;
    if (authToken != "") {
        let wishlist = getState().Auth.wishlist;
        let index = wishlist.indexOf(id);
        
        axios.delete(API_URL + '/carts/remove/'+id, {headers: {'Authorization': 'Bearer ' + authToken}})
            .then(function (response) {
               if (index > -1) {
                    wishlist.splice(index, 1);
                }
                dispatch({type: IS_PRODUCT_FAVOURITE, payload: 0});
                toast.success(langContent.remove_wishlist_success, {
                    pauseOnHover: false,
                    hideProgressBar: true,
                    autoClose: 1500,
                    pauseOnFocusLoss: true,
                    onOpen: ({ uid }) => dispatch({type: REQUEST_ADD_TO_WISHLIST, payload: wishlist}),
                     //onClose: ({ uid }) => props.history.push('/'+company_name+'/wishlist')
                });
            }).catch(function (error) {
            dispatch({type: REQUEST_PENDING, payload: false});
        });
    } else {
        toast.error(langContent.please_login_first, {
            hideProgressBar:true,
        });
    }
}

export const removeFromWishList = (id, props=null) => (dispatch, getState) => {
    let authToken = getState().session.user.token;
    let customer = getState().Auth.customer;
    let wishlist = getState().Auth.wishlist;
    let mywishlist = getState().Auth.mywishlist;
    let langContent = getState().Lang.langContent;
    let index =-1;
    let wishlistIndex = -1;

    if (authToken != "") {
        
        axios.delete(API_URL + '/carts/remove/'+id, { headers: {'Authorization': 'Bearer ' + authToken} })
            .then(function (response) {
                
                index = mywishlist.carts.findIndex(function (element) {
                            return element.package_id === id;
                    });

                wishlistIndex = wishlist.indexOf(id);

                if (index !== -1) {
                    mywishlist.carts.splice(index, 1);
                }

                if (wishlistIndex !== -1) {
                    wishlist.splice(wishlistIndex, 1);
                }

                dispatch({type: REQUEST_GET_WISH_LIST, payload: mywishlist});
                dispatch({type: REQUEST_ADD_TO_WISHLIST, payload: wishlist})

                if(props != null) {

                    props.history.push(getUrl(customer)+"wishlist");
                    toast.success(langContent.remove_wishlist_success, {
                        pauseOnHover: false,
                        hideProgressBar: true,
                        autoClose: 1000,
                        pauseOnFocusLoss: true,
                    });
                }
            }).catch(function (error) {
            dispatch({type: REQUEST_PENDING, payload: false});
        });
    } else {
        toast.error(langContent.please_login_first, {
            hideProgressBar:true,
        });
    }
}
export const buyNowWishList = (id, props) => (dispatch, getState) => {
    let customer = getState().Auth.customer;
    props.history.push(getUrl(customer)+id+"/create-order");
}

export const pushOrUpdateCard = (form, isCreate, props) => (dispatch, getState) => {
    let auth = getState().Auth;
    let token = getState().session.user.token;
    let cards = auth.user.cards;
    let route = API_URL;
    let langContent = getState().Lang.langContent;
    let message = '';
    
    if (isCreate) {
        route = route + '/add-card';
        message = langContent.card_added_successfully;
    } else {
        route = route + '/update-card';
        message = langContent.card_update_successfully;
    }
    axios.post(route, form, {headers: {'Authorization': 'Bearer ' + token}})
        .then(function (response) {
            let card = response.data.card;
            toast.success(message, {
                hideProgressBar: true,
            });
            if (isCreate) {
                cards.push(card);
            } else {
                if (cards.length > 0) {
                    Object.keys(cards).map(index=> {
                        if (cards[index].id == card.id) {
                            cards[index] = card;
                        }
                    });
                }
            }
            props.history.push(getUrl(auth.customer) + 'user-profile');
        }).catch(function (error) {
    });
}

export const updateClient = (form, props) => (dispatch, getState) => {
    const token = getState().session.user.token;
    let auth = getState().Auth;
    let langContent = getState().Lang.langContent;
     dispatch({type: REQUEST_PENDING, payload: true});
    axios.post(API_URL + '/client-profile/update', form, { headers: {'content-type': 'multipart/form-data', 'Authorization': 'Bearer ' + token}})
        .then(function (response) {
            let data = response.data.client;
            dispatch({type: REQUEST_GET_USER_INFO, payload: data.user});
            //sessionService.saveSession({token:data.token,'user': data});
            //sessionService.saveUser(data);
            dispatch({type: REQUEST_GET_USER_INFO, payload: data});
             dispatch( getloginUser(token));
            toast.success(langContent.successfully_update_client, {
                hideProgressBar:true,
            });
             dispatch({type: REQUEST_PENDING, payload: false});
            props.history.push(getUrl(auth.customer)+'user-profile');
        }).catch(function (error) {
    });
}

export const getCities = (stateId) => (dispatch, getState) => {
    dispatch({type: REQUEST_INPUT_CHANGE_SIGNUP, payload: { ['state']: stateId }});
    
    axios.get(API_URL + '/state-cities?id='+stateId)
        .then(function (response) {
            dispatch({type: REQUEST_GET_STATE_CITIES, payload: response.data.cities})
        }).catch(function (error) {
    });
}
export const setErrorschangePassword = (errors) => (dispatch, getState) => {
    dispatch({type: REQUEST_CHANGE_PASSWORD_FAILED, payload: errors});
}
export const changePassword = (form, props) => (dispatch, getState) => {
    const token = getState().session.user.token;
    let auth = getState().Auth;
    let langContent = getState().Lang.langContent;

    if (token != '') {
        axios.post(API_URL + '/change-password', form, {headers: {'Authorization': 'Bearer ' + token}})
            .then(function (response) {
                let data = response.data;
                 dispatch({type: REQUEST_CHANGE_PASSWORD_FAILED, payload: {}});
                toast.success(langContent.your_password_has_been_successfully_updated, { hideProgressBar:true });
                props.history.push(getUrl(auth.customer) + 'user-profile');
            }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                switch (error.response.status) {
                    case 422:
                        let errors = {};
                        Object.keys(error.response.data).map(err => {
                            if (error.response.data[err][0] != undefined) {
                                errors[err] = error.response.data[err][0];
                            } else {
                                errors[err] = error.response.data[err];
                            }
                        });
                        dispatch({type: REQUEST_CHANGE_PASSWORD_FAILED, payload: errors});
                    default:
                        console.log(error.response.data);
                }
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        });
    } else {
        toast.error(langContent.please_login_first, {
            hideProgressBar:true,
        });
    }
}
export const getNotifications = () => (dispatch,getState) => {
    const token = getState().session.user.token;
    let langContent = getState().Lang.langContent;
    if (token != '') {
    axios.get(API_URL + '/get/notifications', {headers: {'Authorization': 'Bearer ' + token}})
        .then(function (response) {
            dispatch({type: SHOW_NOTIFICATION, payload: response.data})
            
        }).catch(function (error) {
    });
}
else {
    toast.error(langContent.please_login_first, {
        hideProgressBar:true,
    });
}

}
export const removeNotification = (id,index) => (dispatch, getState) => {
    const authToken = getState().session.user.token;
    let langContent = getState().Lang.langContent;
    
    if (authToken != "") {
        let notification = getState().Auth.notification;
        //let index = notification.indexOf(id);
        
        axios.delete(API_URL + '/delete/notification/'+id, {headers: {'Authorization': 'Bearer ' + authToken}})
        .then(function (response) {
            console.log(index);
 
            let updatedPayload = notification.filter(res =>{
                  return res.id != id
            });
            dispatch({type: SHOW_NOTIFICATION, payload:updatedPayload});
            toast.success(langContent.notification_successfully_removed);
        }).catch(function (error) {
        dispatch({type: REQUEST_PENDING, payload: false});
    });
    } else {
        toast.error(langContent.please_login_first, {
            hideProgressBar:true,
        });
    }
}
export const toggleLogin = (status) => (dispatch, getState) => {
   dispatch({type: TOGGLE_POPUP, payload:status});
}
export const toggleDeleteCardPopup = (status) => (dispatch, getState) => {
   // dispatch({type: TOGGLE_DELETE_CARD_POPUP, payload:status});
    let langContent = getState().Lang.langContent;
    //toast.error(langContent.you_cant_delete_the_card);
    toast.error(langContent.you_cant_delete_the_card);
}
export const deleteCard = (card) => (dispatch, getState) => {
    const cards = getState().Auth.user.cards;
    const user = getState().Auth.user;
    let langContent = getState().Lang.langContent;
    if (user.token != "") {
        axios.delete(API_URL + '/delete-card/' + card.id, {headers: {'Authorization': 'Bearer ' + user.token}})
            .then(function (response) {
                dispatch( getloginUser(user.token));
                dispatch({type: TOGGLE_DELETE_CARD_POPUP, payload:false});
                toast.success(langContent.card_deleted_successfully);
            }).catch(function (error) {
                if (error.response) {
                    switch (error.response.status) {
                        case 404:
                            toast.error(langContent.card_not_found, {
                                hideProgressBar:true,
                            });
                        default:
                            console.log(error.response.data);
                    }
                }
            });
    } else {
        toast.error(langContent.please_login_first, {
            hideProgressBar:true,
        });
    }
}