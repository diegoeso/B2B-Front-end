/**
 * Created by Azim Khan on 5/8/20.
 */
export const changePasswordValidator = (event, errors,langContent) => {
    var field = {
        'new_password': {'min': 6, 'max': 14},
        'confirm_password': {'min': 6, 'max': 14},
    };
    let eventName = event.target.name;
    let eventValue = event.target.value;

    if (eventName == 'new_password' || eventName == 'confirm_password' && eventValue != '') {
        if (eventValue.length != 0 && field[eventName]['max'] < eventValue.length) {

            errors[eventName] = langContent.the+' '+langContent[eventName]+' '+langContent.maximum+' ' + field[eventName]['max'] + ' '+langContent.characters_required;
        } else if (eventValue.length != 0 && field[eventName]['min'] > eventValue.length) {
            errors[eventName] = langContent.the+' '+langContent[eventName]+' '+langContent.minimum+' ' + field[eventName]['min'] + ' '+langContent.characters_required;
        } else if(eventValue.trim() == '') {
            errors[eventName] = langContent.password_is_required_field;

        }else {
            errors[eventName] = '';
        }
    } else {
        errors[eventName] = '';
    }
    return errors;
}