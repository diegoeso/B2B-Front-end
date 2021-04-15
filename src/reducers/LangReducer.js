/**
 * Created by azim on 6/5/20.
 */
import React from 'react';
import { en} from '../lang/en.js'
export const REQUEST_TO_CHANGE_LANGUAGE = "REQUEST_TO_CHANGE_LANGUAGE";

const initialState = {
      lang:'en', 
      langContent: en
};
export const Lang = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_TO_CHANGE_LANGUAGE:
            return Object.assign({}, state, { langContent: action.payload, lang: action.lang});
        default:
            return state;
    }
}