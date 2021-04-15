/**
 * Created by Azim Khan on 28/7/20.
 */
import moment from "moment";
import {validateEmail} from '../constants';
export const requestForBookingValidator = (event, packageType, errors, langContent, lang = 'en') => {
    let eventName = event.target.name;
    let eventValue = event.target.value;
    var field = {
        'no_of_adults': {'type': 'number', 'max': 10},
        'no_of_children': {'type': 'number', 'max': 10},
        'no_of_juniors': {'type': 'number', 'max': 10},
        'no_of_rooms': {'type': 'number', 'max': 30},
        'name_on_reservation': {'type': 'string', 'max': 100},
        'email': {'type': 'string', 'max': 50},
        'contact_number': {'type': 'number', 'min': 10, 'max': 16},
        'phone_number': {'type': 'number', 'min': 10, 'max': 16},
        'destination_city': {'type': 'string', 'max': 100},
        'additional_comment': {'type': 'string', 'max': 255},
        'port_of_departure': {'type': 'string', 'max': 100},
        'number_of_days': {'type': 'number', 'max': 30},
        'cruise_name': {'max': 100},
    };
    if (eventName == 'no_of_adults' || eventName == 'no_of_children' || eventName == 'no_of_juniors' || eventName == 'no_of_rooms') {
        if (eventValue != '') {
            if (validateNumericValue(eventValue)) {
                if (eventValue == 0) {
                    errors[eventName] = langContent.field_must_not_Be_0;
                } else if (field[eventName]['max'] < eventValue) {
                    if(eventName == 'no_of_adults')
                        errors[eventName] = langContent.the_number_of_adults_can_not_be_greater_than_10;
                    else if(eventName == 'no_of_children')
                        errors[eventName] = langContent.the_number_of_children_can_not_be_greater_than_10;
                    else if(eventName == 'no_of_juniors')
                        errors[eventName] = langContent.the_number_of_juniors_can_not_be_greater_than_10;
                    else if(eventName == 'no_of_rooms')
                        errors[eventName] = langContent.the_number_of_rooms_can_not_be_greater_than_30;
                } else {
                    delete errors[eventName];
                }
            } else {
                errors[eventName] = langContent.the_field_must_be_a_number;
            }
        } else {
            delete errors[eventName];
        }
    }
/*    if (eventName == 'no_of_children') {
        if (eventValue != '') {
            if (validateNumericValue(eventValue)) {
                if (eventValue == 0) {
                    errors[eventName] = langContent.field_must_not_Be_0;
                }
            } else {
                errors[eventName] = langContent.the_field_must_be_a_number;
            }
        } else {
            delete errors[eventName];
        }
    }
    if (eventName == 'no_of_juniors') {
        if (eventValue != '') {
            if (validateNumericValue(eventValue)) {
                if (eventValue == 0) {
                    errors[eventName] = langContent.field_must_not_Be_0;
                }
            } else {
                errors[eventName] = langContent.the_field_must_be_a_number;
            }
        } else {
            delete errors[eventName];
        }
    }*/
    if (eventName == 'no_of_rooms') {
        if (eventValue != '') {
            if (validateNumericValue(eventValue)) {
                if (eventValue == 0) {
                    errors[eventName] = langContent.field_must_not_Be_0;
                }
            } else {
                errors[eventName] = langContent.the_field_must_be_a_number;
            }
        } else {
            delete errors[eventName];
        }
    }
    if (eventName == 'destination_city') {
        if (eventValue != '') {
            if (!validateString(eventValue)) {
                errors[eventName] = langContent.the + ' ' + langContent.specific_destination + ' ' + langContent.field_must_be_characters;
            } else if (field[eventName]['max'] < eventValue.length) {
                errors[eventName] = langContent.the + ' ' + langContent.specific_destination + ' ' + langContent.maximum + ' ' + field[eventName]['max'] + ' ' + langContent.characters_required;
            } else {
                delete errors[eventName];
            }
        } else {
            delete errors[eventName];
            //errors[eventName] = langContent.the_specific_destination_is_required;
        }
    }
    if (eventName == 'name_on_reservation') {
        if (eventValue != '') {
            if (field[eventName]['type'] == 'string') {
                if (!validateString(eventValue)) {
                    errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.field_must_be_characters;
                } else {
                    delete errors[eventName];
                }
            } else if (field[eventName]['max'] < eventValue.length) {
                errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.maximum + ' ' + field[eventName]['max'] + ' ' + langContent.characters_required;
            } else {
                delete errors[eventName];
            }
        } else {
            errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.field_is_required;
        }
    }
    if (eventName == 'email') {
        if (eventValue != '') {
            if (!validateEmail(eventValue)) {
                errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.must_valid_email_address;
            } else if (field[eventName]['max'] < eventValue.length) {
                errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.maximum + ' ' + field[eventName]['max'] + ' ' + langContent.characters_required;
            } else {
                delete errors[eventName];
            }
        } else {
            errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.field_is_required;
        }
    }
    if (eventName == 'phone_number') {
        if (eventValue != '') {
            if (field[eventName]['type'] == 'number') {
                if (isNaN(eventValue)) {
                    errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.field_must_be_number;
                } else if (field[eventName]['max'] < eventValue.length) {
                    errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.maximum + ' ' + field[eventName]['max'] + ' ' + langContent.digits_are_required;
                } else if (field[eventName]['min'] > eventValue.length) {
                    errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.minimum + ' ' + field[eventName]['min'] + ' ' + langContent.digits_are_required;
                } else {
                    delete errors[eventName];
                }
            }
        } else {
            errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.field_is_required;
        }
    }
    if (eventName == 'contact_number') {
        if (eventValue != '') {
            if (field[eventName]['type'] == 'number') {
                if (isNaN(eventValue)) {
                    errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.field_must_be_number;
                } else if (field[eventName]['max'] < eventValue.length) {
                    errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.maximum + ' ' + field[eventName]['max'] + ' ' + langContent.digits_are_required;
                } else if (field[eventName]['min'] > eventValue.length) {
                    errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.minimum + ' ' + field[eventName]['min'] + ' ' + langContent.digits_are_required;
                } else {
                    delete errors[eventName];
                }
            }
        } else {
            delete errors[eventName];
        }
    }
    if (eventName == 'additional_comment') {
        if (eventValue != '') {
            if (field[eventName]['max'] < eventValue.length) {
                errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.maximum + ' ' + field[eventName]['max'] + ' ' + langContent.characters_required;
            } else {
                delete errors[eventName];
            }
        } else {
            delete errors[eventName];
        }
    }
    if (eventName == 'port_of_departure') {
        if (packageType == 1 && eventValue != '') {
            if (field[eventName]['type'] == 'string') {
                if (!validateString(eventValue)) {
                    errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.field_must_be_characters;
                } else {
                    delete errors[eventName];
                }
            } else if (field[eventName]['max'] < eventValue.length) {
                errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.maximum + ' ' + field[eventName]['max'] + ' ' + langContent.characters_required;
            } else {
                delete errors[eventName];
            }
        } else {
            errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.field_is_required;
        }
    }
    if (eventName == 'cruise_name') {
        if (packageType == 1 && eventValue != '') {
            if (field[eventName]['max'] < eventValue.length) {
                errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.maximum + ' ' + field[eventName]['max'] + ' ' + langContent.characters_required;
            } else {
                delete errors[eventName];
            }
        } else {
            errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.field_is_required;
        }
    }
    if (eventName == 'number_of_days') {
        if (packageType == 1 && eventValue == '') {
            errors[eventName] = langContent.the + ' ' + langContent[eventName] + ' ' + langContent.field_is_required;
        } else {
            delete errors[eventName];
        }
    }
    return errors;
}

export const changeBookingDate = (date, errors, langContent) => {
    var today = moment().format('YYYY-MM-DD');
    if (date == '') {
        errors['booking_date'] = langContent.please_select_booking_date;
    } else if (!moment(date).isSameOrAfter(today)) {
        errors['booking_date'] = langContent.the + ' ' + langContent['booking_date'] + ' ' + langContent.the_ganarate_date_must_be_same_after_check_in_date;
    } else {
        delete errors['booking_date'];
    }
    return errors;
}
export const changeDepartureDate = (date, errors, langContent) => {
    var today = moment().format('YYYY-MM-DD');
    if (date == '') {
        errors['departure_date'] = langContent.please_select_departure_date;
    } else if (!moment(date).isSameOrAfter(today)) {
        errors['departure_date'] = langContent.the_departure_date_must_after_today_date;
    } else {
        delete errors['departure_date'];
    }
    return errors;
}
export const checkInDateBooking = (date, errors, langContent) => {
    var today = moment().format('YYYY-MM-DD');
    if (date == '') {
        errors['check_in_date'] = langContent.please_select_check_in_date;
    } else if (!moment(date).isSameOrAfter(today)) {
        errors['check_in_date'] = langContent.the_check_in_date_must_after_today_date;
    } else {
        delete errors['check_in_date'];
    }
    return errors;
}
export const checkOutDateBooking = (date, checkInDate, errors, langContent) => {
    var today = moment().format('YYYY-MM-DD');
    if (checkInDate == '') {
        errors['check_in_date'] = langContent.please_select_check_in_date;
    } else if (!moment(checkInDate).isSameOrAfter(today)) {
        errors['check_in_date'] = langContent.the_check_in_date_must_after_today_date;
    } else if (!moment(date).isSameOrAfter(checkInDate)) {
        errors['check_out_date'] = langContent.the_check_out_date_must_be_same_after_check_in_date;
    } else {
        delete errors['check_out_date'];
    }
    return errors;
}
export const guestsValidator = (event, errors, i, langContent) => {
    if (event.target.value != '') {
        if (!validateString(event.target.value)) {
            errors.guests = {[i]: {[event.target.name]: langContent.the + ' ' + langContent[event.target.name] + ' ' + langContent.field_must_be_characters}};
        } else {
            if (errors['guests'] != undefined && errors.guests[i] != undefined && errors.guests[i][event.target.name] != undefined)
                delete errors.guests[i][event.target.name];
        }
    } else {
        errors.guests = {[i]: {[event.target.name]: langContent.the + ' ' + langContent[event.target.name] + ' ' + langContent.field_is_required}};
    }
    return errors;
}
export const validateString = (str) => {
    var re = /^[a-zA-Z ]*$/;
    return re.test(str);
}
export const validateNumericValue = (value) => {
    var numberRegex = /^\s*[+-]?(\d+|\.\d+|\d+\.\d+|\d+\.)(e[+-]?\d+)?\s*$/;
    return numberRegex.test(value)
}