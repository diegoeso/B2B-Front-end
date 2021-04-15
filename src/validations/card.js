/**
 * Created by Azim Khan on 27/7/20.
 */
import { validateCardExpiry } from '../constants'
import moment from "moment";
export const cardValidator = (event, errors,lang,langContent) => {
    let name = event.target.name;
    let textVal = event.target.value;
    var field = {
        'card_number': {'type': 'number', 'min': 16, 'max': 16},
        'expiry_date': {'type': 'date'},
        'holder_name': {'type': 'string', 'min': 4, 'max': 50},
        'cvv': {'type': 'number', 'min': 3, 'max': 3},
    };
    if (name == 'card_number' && textVal != '') {
        let maskingCard = textVal.split('-').join('');
        textVal = maskingCard.match(/.{1,4}/g).join('-');
        let cardNo = textVal;
        cardNo = cardNo.replace(/-/g, "");
        if (isNaN(cardNo)) {
            errors[name] = langContent.the+' '+langContent[name]+' '+langContent.field_must_be_number;
        } else if (field[name]['max'] < cardNo.length) {
            errors[name] = langContent.the+' '+langContent[name]+' '+langContent.maximum+' ' + field[name]['max'] + ' '+langContent.characters_required;
        } else if (field[name]['min'] > cardNo.length) {
            errors[name] = langContent.the+' '+langContent[name]+' '+langContent.minimum+' ' + field[name]['min'] + ' '+langContent.characters_required;
        } else {
            errors[name] = '';
        }
    } else if (name == 'holder_name' && textVal != '') {
        if (field[name]['type'] == 'string') {
            if (!validateCardString(textVal)) {
                errors[name] = langContent.the+' ' + langContent[name] + ' '+langContent.field_must_be_characters;
            } else {
                errors[name] = '';
            }
        } else if (field[name]['max'] < textVal.length) {
            errors[name] = langContent.the+' ' + langContent[name] + ' '+langContent.maximum+' ' + field[name]['max'] + ' '+langContent.characters_required;
        } else {
            errors[name] = '';
        }
    } else if (name == 'cvv' && textVal != '') {
        if (isNaN(textVal)) {
            errors[name] = langContent.the+' ' + langContent[name] + ' '+langContent.field_must_be_number;
        } else if (field[name]['max'] < textVal.length) {
            errors[name] = langContent.the+' ' + langContent[name] + ' '+langContent.maximum+' ' + field[name]['max'] + ' '+langContent.characters_required;
        } else {
            errors[name] = '';
        }
    } else if (name == 'expiry_date' && textVal != '') {
        if (!validateCardExpiry(textVal)) {
            errors[name] = langContent.the+' ' + langContent[name] + ' '+langContent.format_is_invalid;
        } else {
            errors[name] = '';
            let monthYear = textVal.split('/');
            let month = monthYear[0];
            let year = monthYear[1];
            if (year < moment().year()) {
                errors[name] = langContent.the_year_is_invalid;
            } else if (month < moment().month() + 1 && year == moment().year()) {
                errors[name] = langContent.the+' ' + langContent[name] + ' '+langContent.is_invalid;
            } else {
                errors[name] = '';
            }
        }
    } else {
        errors[name] = '';
    }
    return errors;
}

export const validateCardString = (str) => {
    var re = /^[a-zA-Z ]*$/;
    return re.test(str);
}