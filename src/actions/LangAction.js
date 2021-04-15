import { en} from '../lang/en.js';
import { hindi} from '../lang/hindi.js'
export const REQUEST_TO_CHANGE_LANGUAGE = "REQUEST_TO_CHANGE_LANGUAGE";
export const handleChangeLang = (selectedLang) => (dispatch, getState) => {
	 let curentLang = {};
	if(selectedLang == 'hindi') {
		 curentLang = hindi;
	} else {
		 curentLang = en;
		 selectedLang = 'en';
	}
    dispatch({type: REQUEST_TO_CHANGE_LANGUAGE, payload: curentLang, lang: selectedLang })
}