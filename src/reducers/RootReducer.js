import { sessionReducer } from 'redux-react-session';
import {combineReducers} from 'redux';
import { HomeData } from './HomeReducer';
import { Auth } from './AuthReducer';
import { Product } from './ProductReducer';
import { Order } from './OrderReducer';
import { ProfileData } from './ProfileReducer';
import { Card } from './CardReducer';
import { Search } from './SearchReducer';
import { Booking } from './BookingReducer';
import { Lang } from './LangReducer';

const rootReducer = combineReducers({
	session: sessionReducer,
    HomeData,
    Auth,
    Product,
    Order,
    ProfileData,
    Card,
    Search,
    Booking,
    Lang,
});

export default rootReducer;