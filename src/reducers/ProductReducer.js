/**
 * Created by Prakash on 4/6/20.
 */
import {
	REQUEST_GET_PRODUCT_INFO,
    REQUEST_GET_ALL_PRODUCTS,
    REQUEST_GET_PRODUCT_PENDING,
    IS_PRODUCT_FAVOURITE,
    REQUEST_GET_PRODUCT_THEMES
} from '../constants/ProductConstants';

const initialState = {
    productDetails:null,
    products:null,
    errors:{},
    isPending:false,
    isFavourite:0,
    themes:null,
    total:0

};

export const Product = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_GET_PRODUCT_INFO:
            return Object.assign({}, state, {productDetails: action.payload});
        case REQUEST_GET_ALL_PRODUCTS:
            return Object.assign({}, state, {products: action.payload,total: action.total });
        case REQUEST_GET_PRODUCT_THEMES:
            return Object.assign({}, state, {themes: action.payload});
        case REQUEST_GET_PRODUCT_PENDING:
            return Object.assign({}, state, {isPending: action.payload});
        case IS_PRODUCT_FAVOURITE:
            return Object.assign({}, state, {isFavourite: action.payload});
        default:
            return state;
    }
}