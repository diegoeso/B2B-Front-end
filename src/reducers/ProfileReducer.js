/**
 * Created by anita on 30/6/20
 */
import {
	REQUEST_GET_PROFILE_DATA,
	REQUEST_GET_PROFILE_DATA_FAILED,
	REQUEST_GET_PENDING,
	REQUEST_GET_SUCCESS
} from '../constants/ProfileConstants';

const initialState = {
     profileData:{},
     isPending:false,

};
export const ProfileData = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_GET_PROFILE_DATA:
            return Object.assign({}, state, { profileData: action.payload});
        default:
            return state;
    }
}