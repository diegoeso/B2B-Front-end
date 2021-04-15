/**
 * Created by Azim Khan on 10/8/20.
 */
export const editBookingValidator = (event, errors,lang,langContent) => {
    let eventName = event.target.name;
    let eventValue = event.target.value;
    delete errors.no_of_adults;
    if (eventName == 'no_of_adults' && eventValue != '') {

        if (validateNumericValue(eventValue)) {
            if (eventValue == 0) {
                errors[eventName] = langContent.field_must_not_Be_0;
            }
        } else {
            errors[eventName] = langContent.the_field_must_be_a_number;
        }
    } else if (eventName == 'no_of_children' && eventValue != '') {
        if (validateNumericValue(eventValue)) {
            if (eventValue == 0) {
                errors[eventName] = langContent.field_must_not_Be_0;
            }
        } else {
            errors[eventName] = langContent.the_field_must_be_a_number;
        }
    } else if (eventName == 'no_of_juniors' && eventValue != '') {
        if (validateNumericValue(eventValue)) {
            if (eventValue == 0) {
                errors[eventName] = langContent.field_must_not_Be_0;
            }
        } else {
            errors[eventName] = langContent.the_field_must_be_a_number;
        }
    } else if (eventName == 'no_of_rooms' && eventValue != '') {
        if (validateNumericValue(eventValue)) {
            if (eventValue == 0) {
                errors[eventName] = langContent.field_must_not_Be_0;
            }
        } else {
            errors[eventName] = langContent.the_field_must_be_a_number;
        }
    } else {
        if (eventName == 'no_of_adults') {
            delete errors.no_of_adults;
        } else if (eventName == 'no_of_children') {
            delete errors.no_of_children;
        } else if (eventName == 'no_of_juniors') {
            delete errors.no_of_juniors;
        } else if (eventName == 'no_of_rooms') {
            delete errors.no_of_rooms;
        }
    }
    return errors;
}

export const validateNumericValue = (value) => {
    var numberRegex = /^\s*[+-]?(\d+|\.\d+|\d+\.\d+|\d+\.)(e[+-]?\d+)?\s*$/;
    return numberRegex.test(value)
}