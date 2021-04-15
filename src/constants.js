export const API_URL = process.env.NODE_ENV == "development" ? "http://localhost:8000/api" : "http://35.154.17.94/api";
export const S3_URL = 'https://b2b-travels.s3.ap-south-1.amazonaws.com/';
export const HOST_NAME = process.env.NODE_ENV == "development" ? "http://localhost:3000/" : "http://35.154.17.94:81/";
export const convertToSlug = (str) =>{
	if(str != undefined  && str != '' && str != ' ') {
		return str.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
	} else {
		return '';
	}

}

export const validateEmail= (email) => {
    var re = /^([a-z0-9+_\.-]+)@([\da-z+\.-]+)\.([a-z+\.]{2,6})$/;
    return re.test(email);
}

export const validateString= (str) => {
    var re = /^[a-zA-Z ]{2,30}$/;
    return re.test(str);
}

export const getHotelStart= (hotel_type) => {
   var hotel_t = [];
    for (var i = 1; i <= hotel_type; i++) {
      hotel_t.push(i);
    }
    return hotel_t;
}

export const getUrl= (customer) => {
    if(customer.trim() !='') {
    	return '/'+customer+'/';
    } else {
    	return '/';
    }

}

export const getEMIPrice = (price, payment_cycle, lang='en') => {
    switch (parseInt(payment_cycle)) {
        case 1:
            return lang =='hindi' ? parseInt(price/12) +'/म' : parseInt(price/12) +'/M';
        case 2:
            return lang =='hindi' ? parseInt(price/26) +'/2-सप्ताह' : parseInt(price/26) +'/2-Week';
        case 3:
                return lang =='hindi' ? parseInt(price/24) +'/15 दिन' : parseInt(price/24) +'/15 Days';
        case 4:
            return lang =='hindi' ? parseInt(price/52) +'/सप्ताह' : parseInt(price/52) +'/Week';
        default:
            return '';
    }
}

export const totalEMI = (payment_cycle,lang='en') => {
    switch (parseInt(payment_cycle)) {
        case 1:
            return lang =='hindi' ? '12(मंथली पेड)' : '12 (Monthly Paid)';
        case 2:
            return lang =='hindi' ? '26(2-सप्ताह)' : '26(2-Week Paid)';
        case 3:
            return lang =='hindi' ? '24(15 दिन)' : '24(15 Days Paid)';
        case 4:
            return lang =='hindi' ? '52(साप्ताहिक भुगतान)' : '52 (Weekly Paid)';
        default:
            return '';
    }
}

export const replaceAll = (string, search, replace) => {
  return string.split(search).join(replace);
}

export const getPricePerMonth = (price, paymentCycle='monthly',lang='en') => {
    let perMonth = Math.round(price/12);
    if(lang =='hindi'){
        return perMonth+'/म';
    } else {
        return perMonth+'/M';
    }
    
}

export const getPendingOrderEMis = (emis) => {
    let data = {
        pending: 0,
        paid: 0,
        emi_cost:0,
        refunded: 0
    };
    let i = 0;
    let refundedAmount = 0;
    let paidAmount = 0;
    Object.keys(emis).map(emi=> {
        if (i == 0 && emis[emi].status == 0) {
            data.emi_cost = emis[emi].amount;
            i++;
        }
        if (emis[emi].status == 0) {
            data.pending += 1;
        }
        if (emis[emi].status == 1 || emis[emi].status == 7) {
            paidAmount += emis[emi].paid_amount;
            if (emis[emi].refund_amount != undefined && emis[emi].refund_amount != null) {
                refundedAmount += emis[emi].refund_amount;
            }
        }
        if (emis[emi].status == 7) {
            data.refund += emis[emi].paid_amount;
        }
    });
    data.paid = paidAmount;
    data.refunded = refundedAmount;
    return data;
}

export const getPaidAmount = (emis) => {
    let pending = 0;
    Object.keys(emis).map(emi=> {
        if (emis[emi].status == 0) {
            pending += 1;
        }
    });
    return pending;
}

export const validateCardFormat = (cardNumber) => {
    return /^([0-9]{4}-){3}[0-9]{4}$/.test(cardNumber)
}

export const getPaymentCycleName = (payment_cycle, lang='en') => {
    switch (parseInt(payment_cycle)) {
        case 1:
            return lang =='hindi' ? '/म': '/M';
        case 2:
            return lang =='hindi' ? '2-सप्ताह' : '/2-Weeks';
        case 3:
            return lang =='hindi' ? '15 दिन' : '/15 days';
        case 4:
            return lang =='hindi' ? 'सप्ताह' : '/Week';
        default:
            return '';
    }
}

export const getPrice = (productDetails, type ='', lang) => {
    if(productDetails != undefined && productDetails != null) {

        let currency_code = '₹';
        let price = productDetails.total_amount;
        let text = 'Save';
        if(lang=='hindi') {
          text = 'सहेजें';
        }

        if(productDetails.currency_data !=undefined && productDetails.currency_data.currency_code !=undefined) {
            currency_code = '₹';
        }

        if(type == 'save') {
            if(productDetails.discount_price != null) {

                price = productDetails.discount_price;
                currency_code = text+' ₹';
            } else {
                 price = 0;
            }
        }

        if(type == 'regular_price') {
            price = productDetails.regular_price;
        }

        price = Math.round(price);

       if(price >= 0)
            return currency_code+' '+price;
       else
            return '';
    }

    return false;
}

export const validateCardExpiry= (expiry) => {
    var re = /^(\d{1,2})\/(\d{4})$/;
    return re.test(expiry);
}

export const returnLanguageText= (paikageDetails,lang,text) => {
    if(lang =='hindi') {
      if(paikageDetails.language_packages != undefined && paikageDetails.language_packages[0] != null && paikageDetails.language_packages[0] != undefined ) {
         return paikageDetails.language_packages[0][text] != undefined && paikageDetails.language_packages[0][text] != null ? paikageDetails.language_packages[0][text] : '';
      } else {
        return '';
      }
    } else {
        if(paikageDetails != undefined) {
         return paikageDetails[text] != undefined ? paikageDetails[text] : '';
        }
    } 

}


export const getDataFromArray = (array,key) => {
    if(array != undefined != undefined && array[key] != undefined) {
        return array[key];
    } else {
         return '';
    }
}

export const getCurrencySymbol = (currency,lang) => {
    return '₹';
}


export const getWelcomeMassage = (massage,lang) => {
    if(massage != undefined && massage.welcome_message_english != undefined) {

        if(lang == 'hindi')
            return massage.welcome_message_hindi;
        else
            return massage.welcome_message_english;
    } else {
        return '';
    }
}

export const getAdditionalRequest = (props) => {
    let additional = {
        'no_of_adults' : '',
        'no_of_children' : '',
        'no_of_juniors' : '',
        'no_of_rooms' : '',
        'has_data': false,
    };
    if (props.booking != null && Object.keys(props.booking.other_additional_charges).length > 0) {
        Object.keys(props.booking.other_additional_charges).map(index=> {
            if(props.booking.other_additional_charges[index].type == 1) {
                additional.no_of_adults = props.booking.other_additional_charges[index].no_of_type
                additional.has_data = true;
            }
            if(props.booking.other_additional_charges[index].type == 2) {
                additional.no_of_children = props.booking.other_additional_charges[index].no_of_type
                additional.has_data = true;
            }
            if(props.booking.other_additional_charges[index].type == 3) {
                additional.no_of_juniors = props.booking.other_additional_charges[index].no_of_type
                additional.has_data = true;
            }
            if(props.booking.other_additional_charges[index].type == 5) {
                additional.no_of_rooms = props.booking.other_additional_charges[index].no_of_type
                additional.has_data = true;
            }
        });
    }

    return additional;
}


export const getCookie = (cname) => {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


export const setCookie = (cname, cvalue, exdays) => {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const getOptionArray = (i=1,numrows) => {
    let arr =[];
    for (var i; i <= numrows; i++) {
        arr.push(i);
    }
    return arr;
}