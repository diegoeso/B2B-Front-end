import React from 'react'
import ReactDOM from 'react-dom'
import styles from '../../Style.css'
import classNames from 'classnames'
import {ToastContainer, toast} from 'react-toastify';
import { Row, Col, Modal, Table, Button, Form, Spinner} from 'react-bootstrap'
import romantic from '../../image/romantic.png'
import adventure from '../../image/adventure.png'
import moment from 'moment';
import connect from 'react-redux/es/connect/connect'
import DatePicker from 'react-datepicker'
import { Link } from 'react-router-dom'
import { customizeBooking, requestForBooking, emptyServerErrors } from '../../actions/BookingAction';
import { getOrder } from '../../actions/OrderAction';
import { getAdditionalRequest, getOptionArray} from '../../constants';
import { requestForBookingValidator, checkInDateBooking, checkOutDateBooking, changeBookingDate, changeDepartureDate, guestsValidator } from '../../validations/order';
import ViewAllImageComponent from '../../components/booking/ViewAllImageComponent';
toast.configure();
const mapStateToProps = (state) => {
    return {
        user: state.session.user,
        order: state.Order.order,
        isPending: state.Booking.isPending,
        isRequestPending: state.Booking.isRequestPending,
        is_succeeded: state.Booking.is_succeeded,
        booking: state.Booking.booking,
        server_errors: state.Booking.errors,
        langContent: state.Lang.langContent,
        lang: state.Lang.lang,
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        customizeBooking: (form) => dispatch(customizeBooking(form, props)),
        requestForBooking: (form) => dispatch(requestForBooking(form, props)),
        getOrder: (id) => dispatch(getOrder(id)),
        emptyServerErrors: () => dispatch(emptyServerErrors()),
    }
}
class CreateBookingComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            formFields: {
                //step 1 fields
                no_of_adults: '',
                no_of_children: '',
                no_of_juniors: '',
                no_of_rooms: '',
                //step 2 fields
                name_on_reservation: '',
                email: '',
                destination_city: '',
                phone_number: '',
                contact_number: '',
                check_in_date: '',
                check_out_date: '',
               /* booking_date: '',*/
                additional_comment: '',
                package_type: null,
                rooms:[],
                order_id: null,
                port_of_departure: '',
                departure_date: '',
                number_of_days: '',
                cruise_name: '',
                cruise_line_discount_code: '',
                guests: [],
            },
            errors: {},
            btnState: true,
            id: null,
            step: 1,
            checkInDate: '',
            checkOutDate: '',
            bookingDate: '',
            departureDate:'',
            dateOfBirth: '',
            rooms: [{adults:0, juniors:[],children:[]}],
            guests: [],
            package_type: null,
            roomsFields: {},
            is_server_errors: false,
            is_at_least_one_field:false,
            flag: true,
            noOfGuest:0,
            orderNoOfGuest:0,
        }
    }
    componentWillMount() {
        let id = this.props.match.params.id;
        let formFields = this.state.formFields;
        let guests = this.state.guests;
        this.props.getOrder(id);
        let additional = getAdditionalRequest(this.props);
        //formFields.no_of_adults = additional.no_of_adults;
        //formFields.no_of_children = additional.no_of_children;
        //formFields.no_of_juniors = additional.no_of_juniors;
        //formFields.no_of_rooms = additional.no_of_rooms;
        
        this.setState({id, formFields, guests});
    }

    componentWillReceiveProps(nextProps){
        let flag = this.state.flag;
        if(flag && nextProps.order.package != undefined){
            let guests =[];
            let noOfGuest = 0;

            noOfGuest = noOfGuest+parseInt( nextProps.order.package.adults);
            if(isNaN(nextProps.order.package.children))
                noOfGuest = noOfGuest+parseInt(nextProps.order.package.children);
            if(isNaN(nextProps.order.package.juniors))
                noOfGuest = noOfGuest+parseInt( nextProps.order.package.juniors);

            guests = this.getadults(noOfGuest,guests);
            this.setState({guests,flag:false,noOfGuest});
        }
    }

    inputChangeHandler(event) {
        let formFields = {...this.state.formFields};
        let errors = {...this.state.errors};
        let langContent = this.props.langContent;
        let lang = this.props.lang;
        this.props.emptyServerErrors();
        let package_type = Object.keys(this.props.order).length > 0 ? this.props.order.package.package_type : null;
        errors = requestForBookingValidator(event, package_type, errors, langContent,lang);
        formFields[event.target.name] = event.target.value;
        this.setState({ errors, formFields});
    }
    skip() {
        let formFields = this.state.formFields;
        let noOfGuest = this.state.noOfGuest;

        let orderNoOfGuest =0;
        formFields['no_of_adults'] = '';
        formFields['no_of_children'] = '';
        formFields['no_of_rooms'] = '';
        formFields['no_of_juniors'] = '';
        orderNoOfGuest = noOfGuest;
        console.log(noOfGuest,'++++++++');
        this.setState({ formFields, step: 2, is_at_least_one_field: false,orderNoOfGuest});

    }
    next() {
        let errors = {...this.state.errors};
        let formFields = {...this.state.formFields};
        let langContent = this.props.langContent;
        if (errors.no_of_adults == undefined && errors.no_of_children == undefined && errors.no_of_juniors == undefined && errors.no_of_rooms == undefined && (formFields.no_of_adults != '' || formFields.no_of_juniors != '' || formFields.no_of_children != '' || formFields.no_of_rooms != '')) {
      
            this.setState({step: 2, is_at_least_one_field: false});

        } else {
            this.setState({is_at_least_one_field: true});
        }
        let orderNoOfGuest=0
        let noOfGuest = this.state.noOfGuest;
        let guests = [];

        noOfGuest = noOfGuest+Number(formFields.no_of_adults);
        if(isNaN(formFields.no_of_children))
            noOfGuest = noOfGuest+Number(formFields.no_of_children);

        if(isNaN(formFields.no_of_juniors))
            noOfGuest = noOfGuest+Number(formFields.no_of_juniors);
        
        guests = this.getadults(noOfGuest,guests);
        orderNoOfGuest = noOfGuest;
        this.setState({guests,orderNoOfGuest});

    }

    getadults(no,guests=[]) {
            for (let i = 1; i <= no; i++) {
                    guests.push({first_name: '', last_name: '', date_of_birth: ''});
            }

            return guests;
     }
    previous() {
        this.setState({step: 1});
    }
    handleSubmit() {
        let token = this.props.user.token;
        let props = this.props;
        let errors = {};
        let flag = true;
        let langContent = this.props.langContent;
        let items = this.state.formFields;
        items.order_id = this.state.id;
         let guests = this.state.guests;
        items.package_type = Object.keys(this.props.order).length > 0 ? this.props.order.package.package_type : null;
        Object.entries(items).map(item => {
            if (item[0] != 'rooms' && item[0] != 'cruise_name' && item[0] != 'guests' && item[0] != 'order_id' && item[0] != 'additional_comment' && item[0] != 'contact_number' && item[0] != 'cruise_line_discount_code' && item[0] != 'no_of_adults'  && item[0] != 'no_of_children' && item[0] != 'no_of_juniors' && item[0] != 'no_of_rooms' && item[1] == "") {
                
                
                if(item[0] == 'destination_city') {
                    if(items.package_type == 4)
                        errors[item[0]] = langContent.the + ' ' + langContent.specific_destination + ' ' + langContent.field_is_required;

                } else {
                     errors[item[0]] = langContent.the + ' ' + langContent[item[0]] + ' ' + langContent.field_is_required;
                }

                if (items.package_type == 1) {
                    delete errors['check_in_date'];
                    delete errors['check_out_date'];
                } else {
                    delete errors['cruise_name'];
                    delete errors['port_of_departure'];
                    delete errors['departure_date'];
                    delete errors['number_of_days'];
                }
            }
        });

        items.rooms = this.state.rooms;
        items.rooms.map((room, i) => {
            if(room.adults =="") {
                if(errors.rooms != undefined){
                    errors['rooms'][i] = langContent.the + ' ' + langContent.no_of_adults + ' ' + langContent.field_is_required;
                } else {
                    errors['rooms'] = {[i]: langContent.the + ' ' + langContent.no_of_adults + ' ' + langContent.field_is_required};
                }
            }
        });

        if (this.props.order.package.package_type == 1) {
            this.state.guests.map((guest, i) => {
                let guestValidation = {'first_name': '',
                                            'last_name': '',
                                            'date_of_birth': ''};
                let errorsMassageGuest = this.validateGuest(guest,guestValidation);
                
                  if(errorsMassageGuest.first_name !='' || errorsMassageGuest.last_name !='' || errorsMassageGuest.date_of_birth !=''){
                       if(errors.guests != undefined){
                            errors['guests'][i] = errorsMassageGuest
                        } else {
                            errors['guests'] = {[i]: errorsMassageGuest};
                        }
                  }
            });
        }

       
        if (Object.keys(errors).length > 0) {
           
                    flag = false;
        }
       
        if (flag) {
            if (token != undefined && token != '') {
                items.guests = guests ;
                props.requestForBooking(items);
            } else {
                toast.error(langContent.please_login_first, {
                    hideProgressBar: true,
                });
            }
        } else {
            this.setState({errors});
        }
    }

    validateGuest(guest,guestValidation){
         let langContent = this.props.langContent;
        if(guest.first_name.trim() == ''){
                    guestValidation.first_name = langContent.the + ' ' + langContent.first_name + ' ' + langContent.field_is_required;
        }

        if(guest.last_name.trim() == ''){
            guestValidation.last_name = langContent.the + ' ' + langContent.last_name + ' ' + langContent.field_is_required;
        }
        if( typeof guest.date_of_birth != 'null' && guest.date_of_birth == ''){
            guestValidation.date_of_birth = langContent.the + ' ' + langContent.date_of_birth + ' ' + langContent.field_is_required;
        }

        return guestValidation;
    }

    closePopup = (flag = false) => {
        this.setState({ openPopup: flag });
    }
    AddMoreRoom = (type,i)=>{
        let rooms = this.state.rooms;
        let orderNoOfGuest = this.state.orderNoOfGuest;
        
        if(rooms.length < orderNoOfGuest) {

            if(type == 'rooms'){
                rooms.push({adults:0, juniors:[],children:[]});
            } else if(type == 'children') {
                rooms[i].children.push({0:0});
            } else if(type == 'juniors') {
                rooms[i].juniors.push({0:0});
            }
            this.setState({rooms});
        } 
    }

    addRoomFields = (type, i, j, event) => {
        let errors = {...this.state.errors};
        let rooms = this.state.rooms;
        if(type == 'children') {
            rooms[i].children[j] = event.target.value;
        } else if(type == 'juniors') {
            rooms[i].juniors[j] = event.target.value;
        } else if(type == 'adults') {
            rooms[i].adults = event.target.value;
            if (errors['rooms'] != undefined) {
                delete errors['rooms'][i];
            }
        }
        this.setState({rooms, errors});

    }
    guestInputChangeHandler = (i, event, type) => {
        let errors = {...this.state.errors};
        let guests = this.state.guests;
        let langContent = this.props.langContent;
        errors = guestsValidator(event, errors, i, langContent);
        if(type == 'first_name') {
            guests[i].first_name = event.target.value;
        } else if(type == 'last_name') {
            guests[i].last_name = event.target.value;
        }
        this.setState({guests, errors});
    }
    removeRooms = (type,i,j)=>{
        let rooms = this.state.rooms;
        if(type == 'rooms'){
            rooms.splice(i,1);
        } else if(type == 'children') {
            rooms[i].children.splice(j,1);
        } else if(type == 'juniors') {
            rooms[i].juniors.splice(j,1);
        }
        this.setState({rooms});
    }
    checkInDateChange = (checkIn) => {
        let errors = {...this.state.errors};
        let formFields = {...this.state.formFields};
        let langContent = this.props.langContent;
        let checkInDate = '';
        if (checkIn != null) {
            errors = checkInDateBooking(checkIn, errors, langContent);
            formFields['check_in_date'] = moment(checkIn).format('YYYY-MM-DD');
            checkInDate = moment(checkIn).toDate();
        }
        this.setState({ errors, checkInDate, formFields});
    }
    dateOfBirthChange = (i, date) => {
        let errors = {...this.state.errors};
        let guests = this.state.guests;
        let formFields = {...this.state.formFields};
        let langContent = this.props.langContent;
        if (date != null) {
             let years = moment().diff(moment(date).format('YYYY-MM-DD'), 'days');
             if (years < 1) {
                 if(errors.guests != undefined) {
                    errors['guests'][i]['date_of_birth'] = langContent.the_date_of_birth_must_be_past_date;
                 } else {
                    errors['guests'] = {[i]: {['date_of_birth'] : langContent.the_date_of_birth_must_be_past_date}};
                 }

             } else {
                 if (errors.guests != undefined && errors.guests[i] != undefined && errors.guests[i]['date_of_birth']) {
                    
                    delete errors.guests[i]['date_of_birth'];
                 }
             }
            guests[i].date_of_birth = moment(date).toDate();
        }

        this.setState({ errors, guests, formFields});
    }
    checkOutDateChange = (checkOut) => {
        let errors = {...this.state.errors};
        let formFields = {...this.state.formFields};
        let langContent = this.props.langContent;
        let checkInDate = document.getElementById('check_in_date').value != '' ? moment(document.getElementById('check_in_date').value).format('YYYY-MM-DD') : '';
        let checkOutDate = '';
        if (checkOut != null) {
            errors = checkOutDateBooking(checkOut, checkInDate, errors, langContent);
            formFields['check_out_date'] = moment(checkOut).format('YYYY-MM-DD');
            checkOutDate = moment(checkOut).toDate();
        }
        this.setState({ errors, checkOutDate, formFields});
    }
    bookingDateChange = (bookingDateSelected) => {
        let errors = {...this.state.errors};
        let formFields = {...this.state.formFields};
        let langContent = this.props.langContent;
        let bookingDate = '';
        if (bookingDateSelected != null) {
            errors = changeBookingDate(bookingDateSelected, errors, langContent);
            formFields['booking_date'] = moment(bookingDateSelected).format('YYYY-MM-DD');
            bookingDate = moment(bookingDateSelected).toDate();
        } else {
            if (this.props.order.package.package_type == 1) {
                errors['booking_date'] = langContent.please_select_booking_date;
            } else {
                delete errors['booking_date'];
            }
        }
        this.setState({ errors, bookingDate, formFields});
    }
    departureDateChange = (departureDateSelected) => {
        let errors = {...this.state.errors};
        let formFields = {...this.state.formFields};
        let langContent = this.props.langContent;
        let departureDate = '';
        if (departureDateSelected != null) {
            errors = changeDepartureDate(departureDateSelected, errors, langContent);
            formFields['departure_date'] = moment(departureDateSelected).format('YYYY-MM-DD');
            departureDate = moment(departureDateSelected).toDate();
        } else {
            if (this.props.order.package.package_type == 1) {
                errors['departure_date'] = langContent.please_select_departure_date;
            } else {
                delete errors['departure_date'];
            }
        }
        this.setState({ errors, departureDate, formFields});
    }
    render () {
        const { errors, formFields, step, rooms, is_at_least_one_field, guests} = this.state;
        const { langContent, order, is_succeeded, server_errors, isRequestPending } = this.props;
        var packageType = Object.keys(order).length > 0 ? order.package.package_type : null;
        if (Object.keys(server_errors).length > 0) {
            this.state.errors =  server_errors;
        }
        if(Object.keys(order).length > 0) {
            let mainImage = Object.keys(order).length > 0 && order.package.uploads != null && Object.keys(order.package.uploads).length > 0 ? order.package.uploads[0].file_name_url : romantic;
            return (
                <section className='comman-wrapper pad55 '>
                    <Row className='width100'>
                        <Col xs={12} lg={12} xl={12} className='mob-pad20 m-t-65'>
                            <h2 className='cstm-left-heading cursor' onClick={this.props.history.goBack}>
                                <i className='fa-chevron-left fa m-r-20' />
                                {langContent.booking_mangement != undefined ? langContent.booking_mangement :'Booking Management'}
                            </h2>
                            <Button className='booking-customize-btn custom-hide btn btn-block'>
                                {this.state.step == 1 ? langContent.additional_order_request != undefined ? langContent.additional_order_request :'Additional Request' + langContent.step != undefined ? langContent.step :'Step ' +this.state.step : ''}
                            </Button>
                            {/* Image Collage Section */}
                            <section>
                                <Row>
                                    <Col xs={12} sm={6} md={6} lg={6} xl={6} className='trip-img-col1 book-view-left-banner-box'>
                                        <img src={mainImage} className='trip-img-lg img-responsive' alt='optucorp' />
                                    </Col>
                                    <Row xs={12} sm={6} md={6} lg={6} xl={6} className='spl-packimg-col2 book-view-right-banner-box'>
                                        { Object.keys(order).length > 0 && order.package != null && order.package.uploads.length > 0 ? order.package.uploads.slice(1, 5).map((file, index)=> {

                                            return <Col xs={12} sm={12} md={6} lg={6} xl={6} className='trip-img-col trip-col1 book-view-inner-banner-box' key={index}>
                                                <img src={file.file_name_url} className='trip-img trip-img-sml img-responsive' alt='optucorp'/>
                                            </Col>}) : ''}
                                        {  Object.keys(order).length > 0  && order.package.uploads.length > 4 ? <> <Col xs={12} sm={6} md={6} lg={6} xl={6}> </Col> <Col xs={12} sm={6} md={6} lg={6} xl={6} className='book-view-inner-banner-box show-all'> <span  className="show-txt" onClick={this.closePopup.bind(this,true)}> {langContent.show_all != undefined ? langContent.show_all :'Show all'} </span></Col> </> : ''}

                                    </Row>
                                </Row>
                            </section>
                            {/* End Image Collage Section */}
                            {/* Start  Edit Form */}
                            { !is_succeeded ?
                            <section className="booking-shadow-wrapper">
                                <Col xs={12} md={12} lg={12} xl={12} className='pad0 booking-form-wrapper clearfix'>
                                    <Form className='width100' noValidate>
                                        <Row className="payment-wrapper booking">
                                            <Col xs={12} sm={12} md={12} lg={12} className = "emiText">
                                                <h4 className='booking-edit-hdr hotel-fill-txt m-b-30'>
                                                    {this.state.step == 1 ? langContent.additional_order_request != undefined ? langContent.additional_order_request :'Additional Request ' : ''}
                                                    {this.state.step == 2 ? langContent.addition_info != undefined ? langContent.addition_info :'Additional Info' : ''}</h4>
                                                {/*<p className="booking-save-txt clearfix">
                                                    <span className="inr-txt">{Object.keys(order).length > 0 ? getCurrencySymbol('',lang) : ''} { Object.keys(order).length > 0 && order.package.total_amount != '' ? order.package.total_amount : ''} </span>
                                                    <span className="save-txt"> {Object.keys(order).length > 0 && order.emis != null ? langContent.emi+' '+order.emis[0].amount : ''} </span>
                                                </p>*/}
                                            </Col>
                                        </Row>
                                        { !is_succeeded && step == 1 ?
                                            <><section className='width100 pkg-edit'>
                                                <Row className='booking-edit-box'>
                                                    <Col xs={12} md={6} lg={6} xl={6} className='p-l-0 mob-p-r-0'>
                                                        <label
                                                            className="">{langContent.no_of_adults != undefined ? langContent.no_of_adults : 'No. of Adults'}</label>
                                                        <Form.Group className='m-b-30'>
                                                            <Form.Control type='text'
                                                                          placeholder={langContent.no_of_adults != undefined ? langContent.no_of_adults :'No. of Adults'}
                                                                          name='no_of_adults'
                                                                          className='edit-booking-input' min="1"
                                                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                                          value={formFields.no_of_adults}
                                                                          isInvalid={errors != undefined && !!errors.no_of_adults}/>
                                                            <Form.Control.Feedback type='invalid'>
                                                                {errors.no_of_adults != undefined ? errors.no_of_adults : ''}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={12} md={6} lg={6} xl={6} className='cstmSmallPad0'>
                                                        <label className="">{langContent.no_of_children != undefined ? langContent.no_of_children : 'No. of Children'}</label>
                                                        <Form.Group className='m-b-30'>
                                                            <Form.Control type='text'
                                                                          placeholder={langContent.no_of_children != undefined ? langContent.no_of_children :'No. of Children'}
                                                                          name='no_of_children'
                                                                          className='edit-booking-input' min="1"
                                                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                                          value={formFields.no_of_children}
                                                                          isInvalid={errors != undefined && !!errors.no_of_children}/>
                                                            <Form.Control.Feedback type='invalid'>
                                                                { errors.no_of_children != undefined ? errors.no_of_children : '' }
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row className='booking-edit-box'>
                                                    <Col xs={12} md={6} lg={6} xl={6} className='p-l-0 mob-p-r-0 '>
                                                        <label
                                                            className="">{langContent.no_of_juniors != undefined ? langContent.no_of_juniors : 'No. of Juniors'}</label>
                                                        <Form.Group className='m-b-30'>
                                                            <Form.Control type='text'
                                                                          placeholder={langContent.no_of_juniors != undefined ? langContent.no_of_juniors :'No. of Juniors'}
                                                                          name='no_of_juniors'
                                                                          className='edit-booking-input'
                                                                          value={formFields.no_of_juniors}
                                                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                                          isInvalid={errors != undefined && !!errors.no_of_juniors}/>
                                                            <Form.Control.Feedback type='invalid'>
                                                                { errors.no_of_juniors != undefined ? errors.no_of_juniors : '' }
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={12} md={6} lg={6} xl={6}
                                                         className='mob-p-r-0 cstmSmallPad0'>
                                                        <label
                                                            className="">{langContent.no_of_rooms != undefined ? langContent.no_of_rooms : 'No. of Rooms'}</label>
                                                        <Form.Group className='m-b-30'>
                                                            <Form.Control type='text'
                                                                          placeholder={langContent.no_of_rooms != undefined ? langContent.no_of_rooms :'No. of Rooms'}
                                                                          name='no_of_rooms'
                                                                          className='edit-booking-input' min="1"
                                                                          value={formFields.no_of_rooms}
                                                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                                          isInvalid={errors != undefined && !!errors.no_of_rooms}/>
                                                            <Form.Control.Feedback type='invalid'>
                                                                { errors.no_of_rooms != undefined ? errors.no_of_rooms : '' }
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </section>
                                            { is_at_least_one_field ?
                                            <section className='width100 pkg-edit align-required-field'>
                                                <label className="remove-wishlist">{langContent.please_fill_at_least_one_field}</label>
                                            </section> : ''}</>
                                            : ''
                                        }
                                        { !is_succeeded && step == 2 ?
                                            <section className='width100 pkg-edit'>
                                               <Col className="booking-left-wrapper clearfix" xs={12} md={6} lg={6} xl={6}>
                                                <Row className='booking-edit-box'>
                                                    <Col xs={12} md={6} lg={6} xl={6} className='p-l-0 mob-p-r-0'>
                                                        <label
                                                            className="">{langContent.name_on_reservation != undefined ? langContent.name_on_reservation :'Name on reservation'}<sup className="requiredField">*</sup></label>
                                                        <Form.Group className='m-b-30'>
                                                            <Form.Control type='text'
                                                                          placeholder={langContent.name_on_reservation != undefined ? langContent.name_on_reservation :'Name on reservation'}
                                                                          name='name_on_reservation'
                                                                          value={formFields.name_on_reservation}
                                                                          className='edit-booking-input' min="1"
                                                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                                          isInvalid={ errors.name_on_reservation != undefined && !!errors.name_on_reservation }/>
                                                            <Form.Control.Feedback type='invalid'>
                                                                {errors.name_on_reservation != undefined && errors.name_on_reservation != undefined ?  errors.name_on_reservation : ''}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={12} md={6} lg={6} xl={6} className='cstmSmallPad0'>
                                                        <label className="">{langContent.email != undefined ? langContent.email :'Email'}<sup className="requiredField">*</sup></label>
                                                        <Form.Group className='m-b-30'>
                                                            <Form.Control type='text'
                                                                          placeholder={langContent.email != undefined ? langContent.email :'Email'}
                                                                          name='email'
                                                                          value={formFields.email}
                                                                          className='edit-booking-input' min="1"
                                                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                                          isInvalid={errors.email != undefined && errors.email != undefined ?  errors.email : ''}/>
                                                            <Form.Control.Feedback type='invalid'>
                                                                { errors.email != undefined ? errors.email : '' }
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row className='booking-edit-box'>
                                                    <Col xs={12} md={6} lg={6} xl={6} className='p-l-0 mob-p-r-0 '>
                                                        <label className="">{langContent.contact_number != undefined ? langContent.contact_number : 'Contact number'}</label>
                                                        <Form.Group className='m-b-30'>
                                                            <Form.Group className='m-b-30'>
                                                                <Form.Control type='text'
                                                                              placeholder={langContent.contact_number != undefined ? langContent.contact_number :'Contact number'}
                                                                              name='contact_number'
                                                                              className='edit-booking-input'
                                                                              value={ formFields.contact_number }
                                                                              onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                                              isInvalid={ errors.contact_number != undefined && !!errors.contact_number }/>
                                                                <Form.Control.Feedback type='invalid'>
                                                                    { errors.contact_number != undefined && errors.contact_number != undefined ?  errors.contact_number : '' }
                                                                </Form.Control.Feedback>
                                                            </Form.Group>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={12} md={6} lg={6} xl={6} className='mob-p-r-0 cstmSmallPad0'>
                                                        <label className="">{langContent.phone_number != undefined ? langContent.phone_number :'Phone number'}<sup
                                                            className="requiredField">*</sup></label>
                                                        <Form.Group className='m-b-30'>
                                                            <Form.Control type='text'
                                                                          placeholder={langContent.phone_number != undefined ? langContent.phone_number :'Phone number'}
                                                                          name='phone_number'
                                                                          className='edit-booking-input' min="1"
                                                                          value={formFields.phone_number}
                                                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                                          isInvalid={errors.phone_number != undefined && !!errors.phone_number}/>
                                                            <Form.Control.Feedback type='invalid'>
                                                                {errors.phone_number != undefined && errors.phone_number != undefined ?  errors.phone_number : ''}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                { packageType != null && packageType != 1 ? <>
                                                    <Row className='booking-edit-box checkin-date'>
                                                        <Col xs={12} md={6} lg={6} xl={6} className='p-l-0 mob-p-r-0 '>
                                                            <label className="">{langContent.check_in_date != undefined ? langContent.check_in_date :'Check-In Date'}<sup className="requiredField">*</sup></label>
                                                            <Form.Group className='m-b-30'>
                                                                <DatePicker
                                                                    selected={this.state.checkInDate}
                                                                    name='check_in_date'
                                                                    id='check_in_date'
                                                                    onChange={this.checkInDateChange}
                                                                    className='card-input cstmDate'
                                                                    placeholderText={langContent.check_in_date != undefined ? langContent.check_in_date :'Check-In Date' }
                                                                    isInvalid={errors != undefined && !!errors.check_in_date}
                                                                />
                                                                <Form.Control.Feedback type='invalid'>
                                                                    { errors.check_in_date != undefined ? errors.check_in_date : '' }
                                                                </Form.Control.Feedback>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={12} md={6} lg={6} xl={6}
                                                             className='mob-p-r-0 cstmSmallPad0'>
                                                            <label className="">{langContent.check_out_date != undefined ? langContent.check_out_date :'Check-In Date'}<sup className="requiredField">*</sup></label>
                                                            <Form.Group className='m-b-30'>
                                                                <DatePicker
                                                                    selected={this.state.checkOutDate}
                                                                    name='check_out_date'
                                                                    id='check_out_date'
                                                                    onChange={this.checkOutDateChange}
                                                                    className='card-input cstmDate'
                                                                    placeholderText={langContent.check_out_date != undefined ? langContent.check_out_date :'Check-In Date' }
                                                                    isInvalid={errors != undefined && !!errors.check_out_date}
                                                                />
                                                                <Form.Control.Feedback type='invalid'>
                                                                    { errors.check_out_date != undefined ? errors.check_out_date : '' }
                                                                </Form.Control.Feedback>
                                                            </Form.Group>
                                                        </Col>
                                                    </Row></>: <><Row className='booking-edit-box port-departure'>
                                                    <Col xs={12} md={6} lg={6} xl={6} className='p-l-0 mob-p-r-0 '>
                                                        <label className="">{langContent.departure_date != undefined ? langContent.departure_date :'Departure date'}<sup className="requiredField">*</sup></label>
                                                        <Form.Group className='m-b-30'>
                                                            <DatePicker
                                                                selected={this.state.departureDate}
                                                                name='departure_date'
                                                                id='departure_date'
                                                                onChange={this.departureDateChange}
                                                                className='card-input cstmDate '
                                                                placeholderText={langContent.departure_date != undefined ? langContent.departure_date :'Departure date'}
                                                                isInvalid={errors != undefined && !!errors.departure_date}
                                                            />
                                                            <Form.Control.Feedback type='invalid'>
                                                                { errors.departure_date != undefined ? errors.departure_date : '' }
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={12} md={6} lg={6} xl={6} className='p-l-0 mob-p-r-0 port-col'>
                                                        <label className="">{langContent.port_of_departure != undefined ? langContent.port_of_departure :'Specific Destination'}<sup className="requiredField">*</sup></label>
                                                        <Form.Group className='m-b-30'>
                                                            <Form.Control type='text'
                                                                          placeholder={langContent.port_of_departure != undefined ? langContent.port_of_departure :'Specific Destination'}
                                                                          name='port_of_departure'
                                                                          value={formFields.port_of_departure}
                                                                          className='edit-booking-input'
                                                                          value={ formFields.port_of_departure }
                                                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                                          isInvalid={ errors.port_of_departure != undefined && !!errors.port_of_departure }/>
                                                            <Form.Control.Feedback type='invalid'>
                                                                { errors.port_of_departure != undefined && errors.port_of_departure != undefined ? errors.port_of_departure : '' }
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Row></>
                                                }
                                                   {  packageType != null && packageType == 1 ? <>
                                                       <Row className='booking-edit-box cruisename'>
                                                           <Col xs={12} md={12} lg={12} xl={12} className='p-l-0 mob-p-r-0 '>
                                                               <label
                                                                   className="">{langContent.cruise_name != undefined ? langContent.cruise_name : 'Cruise Name'}</label>
                                                               <Form.Group className='m-b-30'>
                                                                   <Form.Control type='text'
                                                                                 placeholder={langContent.cruise_name != undefined ? langContent.cruise_name :'Cruise Name'}
                                                                                 name='cruise_name'
                                                                                 value={formFields.cruise_name}
                                                                                 className='edit-booking-input'
                                                                                 value={ formFields.cruise_name }
                                                                                 onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                                                 isInvalid={ errors.cruise_name != undefined && !!errors.cruise_name }/>
                                                                   <Form.Control.Feedback type='invalid'>
                                                                       { errors.cruise_name != undefined && errors.cruise_name != undefined ? errors.cruise_name : '' }
                                                                   </Form.Control.Feedback>
                                                               </Form.Group>
                                                           </Col>
                                                           
                                                       </Row>
                                                       <Row className='booking-edit-box days-number'>
                                                            <Col xs={12} md={6} lg={6} xl={6} className='p-l-0 mob-p-r-0 days-dropdown'>
                                                               <label className="">{langContent.number_of_days != undefined ? langContent.number_of_days : 'No. of days'}<sup
                                                                   className="requiredField">*</sup></label>
                                                                   <Form.Group className='m-b-30'>
                                                                       <Form.Control as="select"  name="number_of_days" placeholder={langContent.number_of_days != undefined ? langContent.number_of_days :'No. of days'} onChange={(e) => this.inputChangeHandler.call(this, e)}>
                                                                           <option value=''> {langContent.number_of_days != undefined ? langContent.number_of_days :'No. of days'} </option>
                                                                           { getOptionArray(1, 30).map((day)=> {
                                                                               return (<option value={day} key={day}> {day}</option>);
                                                                           }) }
                                                                       </Form.Control>
                                                                       <Form.Control.Feedback type='invalid'>
                                                                           {errors.number_of_days!= undefined ? errors.number_of_days: ''}
                                                                       </Form.Control.Feedback>
                                                                   </Form.Group>
                                                           </Col>
                                                           <Col xs={12} md={6} lg={6} xl={6} className='p-l-0 mob-p-r-0 discount-col'>
                                                               <label className="">{langContent.cruise_line_discount_code != undefined ? langContent.cruise_line_discount_code :'Cruise line discount code'}</label>
                                                               <Form.Group className='m-b-30'>
                                                                   <Form.Control type='text'
                                                                                 placeholder={langContent.cruise_line_discount_code != undefined ? langContent.cruise_line_discount_code :'Cruise line discount code'}
                                                                                 name='cruise_line_discount_code'
                                                                                 value={formFields.cruise_line_discount_code}
                                                                                 className='edit-booking-input'
                                                                                 value={ formFields.cruise_line_discount_code }
                                                                                 onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                                                 isInvalid={ errors.cruise_line_discount_code != undefined && !!errors.cruise_line_discount_code }/>
                                                                   <Form.Control.Feedback type='invalid'>
                                                                       { errors.cruise_line_discount_code != undefined && errors.cruise_line_discount_code != undefined ? errors.cruise_line_discount_code : '' }
                                                                   </Form.Control.Feedback>
                                                               </Form.Group>
                                                           </Col>
                                                       </Row></> : ''
                                                   }
                                                   { packageType != null && packageType != 1 ? <>
                                                   <Row className='booking-edit-box sfc-destination'>
                                                       <Col xs={12} md={12} lg={12} xl={12} className='p-l-0 mob-p-r-0 '>
                                                           <label className="">{langContent.specific_destination != undefined ? langContent.specific_destination : 'Specific Destination'} {packageType != null && packageType == 4 ? <sup
                                                                   className="requiredField">*</sup> :''}</label>
                                                           <Form.Group className='m-b-30'>
                                                               <Form.Control type='text'
                                                                             placeholder={langContent.specific_destination != undefined ? langContent.specific_destination :'Specific Destination'}
                                                                             name='destination_city'
                                                                             value={formFields.destination_city}
                                                                             className='edit-booking-input'
                                                                             value={ formFields.destination_city }
                                                                             onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                                             isInvalid={ errors.destination_city != undefined && !!errors.destination_city }/>
                                                               <Form.Control.Feedback type='invalid'>
                                                                   { errors.destination_city != undefined && errors.destination_city != undefined ? errors.destination_city : '' }
                                                               </Form.Control.Feedback>
                                                           </Form.Group>
                                                       </Col>
                                                   </Row>
                                                   </> : ''
                                                   }

                                                <Row className='booking-edit-box comment'>
                                                    <Col xs={12} md={12} lg={12} xl={12} className='p-l-0 mob-p-r-0 '>
                                                        <label className="additional-comment">{langContent.additional_comment != undefined ? langContent.additional_comment :'Additional Comment'}</label>
                                                        <Form.Group className='m-b-30'>
                                                            <Form.Control as="textarea" rows="4" placeholder={langContent.additional_comment != undefined ? langContent.additional_comment :'Additional comment'} className='card-input no-rounded' name="additional_comment" isInvalid={errors.additional_comment != undefined && !!errors.additional_comment}  onChange={this.inputChangeHandler.bind(this)} value={formFields.additional_comment}/>
                                                            <Form.Control.Feedback type='invalid'>
                                                                { errors.additional_comment != undefined && errors.additional_comment != undefined ?  errors.additional_comment : '' }
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                
                                                {/*being*/}
                                         {packageType != null && packageType == 1 ? <>
                                            {rooms.map((room, i) => (<>

                                            <Col className="booking-room-wrapper">
                                                <Row className='booking-edit-box'>
                                                    <Col xs={12} sm={12} md={12} lg={12} className = "emiText"> <label className=""> {langContent.room_number}-{i+1}</label> {i !=0 ? <span className="room remove-icon" onClick={this.removeRooms.bind(this,'rooms',i,0)}> <i class="fa fa-times pop-close-icon"></i></span> : ''} </Col>
                                                    <Col xs={12} sm={12} md={12} lg={12} className = "emiText">
                                                        <label className="">{langContent.no_of_adults != undefined ? langContent.no_of_adults :'No. of Adults'}</label>
                                                        <Form.Group className='m-b-30'>
                                                            <Form.Control as="select"  name="rooms[1][no_of_adults]" placeholder={langContent.select_no_of_adults != undefined ? langContent.select_no_of_adults :'select no of adults..'} onClick={(event) => this.addRoomFields('adults',i,0, event)}>
                                                                <option value=''>  {langContent.select_no_of_adults != undefined ? langContent.select_no_of_adults :'select no of adults..'}</option>
                                                                {getOptionArray(1,10).map((Adult)=>{
                                                                    return (<option value={Adult}> {Adult}</option>);
                                                                })}
                                                            </Form.Control>
                                                            <Form.Control.Feedback type='invalid'>
                                                                {errors.rooms != undefined && errors.rooms[i] != undefined ? errors.rooms[i] : ''}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row className='booking-edit-box add-multiple-wrapper'>
                                                    <Col xs={6} sm={6} md={6} lg={6} >
                                                        <Row>
                                                            <Col className="add-more-wrapper child" xs={12} sm={12} md={12} lg={12} > <label className="add-more" onClick={this.AddMoreRoom.bind(this,'children',i)}>{langContent.add_childs}</label> </Col>
                                                            {room.children.length > 0 && room.children.map((children, c) => (<>
                                                            <Col className="add-label" xs={12} sm={4} md={4} lg={4} >
                                                                <label className="child-label">{langContent.child} {c+1}</label>
                                                            </Col>
                                                            <Col xs={12} sm={8} md={8} lg={8} className="age-col">
                                                                <span className="remove-icon child-icon" onClick={this.removeRooms.bind(this,'children',i,c)}> <i class="fa fa-times pop-close-icon"></i></span>
                                                                <Form.Group className='m-b-30 child-option'>
                                                                    <Form.Control as="select"  name="rooms[1][children][1][age]" placeholder={langContent.select_age != undefined ? langContent.select_age :'select age..'} onClick={(event) => this.addRoomFields('children',i,c, event)}>
                                                                        <option value=''> {langContent.select_age != undefined ? langContent.select_age :'select age..'} </option>
                                                                        { getOptionArray(0, 12).map((child)=> {
                                                                            return (<option value={child} key={child}> {child}</option>);
                                                                        }) }
                                                                    </Form.Control>
                                                                    <Form.Control.Feedback type='invalid'>
                                                                        {errors.no_of_adults != undefined ? errors.no_of_adults : ''}
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Col>
                                                            </>))}
                                                        </Row>
                                                    </Col>
                                                    <Col xs={6} sm={6} md={6} lg={6} >
                                                        <Row>
                                                            <Col className="add-more-wrapper jr" xs={12} sm={12} md={12} lg={12} > <label className="add-more" onClick={this.AddMoreRoom.bind(this,'juniors',i)}>{langContent.add_junior}</label></Col>
                                                            {room.juniors.map((junior,j) => (<>
                                                            <Col className="add-label" xs={12} sm={4} md={4} lg={4} ><label className="junior-label">{langContent.junior} {j+1}</label> </Col>
                                                            <Col xs={12} sm={8} md={8} lg={8} className="jr-col">
                                                                <span className="remove-icon jr-icon" onClick={this.removeRooms.bind(this,'juniors',i,j)}> <i class="fa fa-times pop-close-icon"></i></span>
                                                                <Form.Group className='m-b-30 jr-option'>
                                                                    <Form.Control as="select"  name="rooms[1][juniors][1][age]" placeholder={langContent.select_age != undefined ? langContent.select_age :'select age..'} onClick={(event) => this.addRoomFields('juniors',i,j, event)}>
                                                                        <option value=''>  {langContent.select_age != undefined ? langContent.select_age :'select age..'}</option>
                                                                        {getOptionArray(13,16).map((junior)=>{
                                                                            return (<option value={junior} key={junior}> {junior}</option>);
                                                                        })}
                                                                    </Form.Control>
                                                                    <Form.Control.Feedback type='invalid'>
                                                                        {errors.no_of_adults != undefined ? errors.no_of_adults : ''}
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Col>
                                                            </>))}
                                                        </Row>
                                                   </Col>

                                                </Row>
                                                </Col>
                                                </>))}

                                                
                                                  <Col className="room-border-wrapper">
                                                    <Row>
                                                    <Col className="add-more-wrapper room" xs={12} sm={12} md={12} lg={12} > <label className="add-more" onClick={this.AddMoreRoom.bind(this,'rooms',1)} title={this.state.orderNoOfGuest <= rooms.length ? langContent.room_not_morethan_guest :'' }>{langContent.add_room}</label> </Col>
                                                </Row>
                                                <Row className='booking-edit-box'>
                                                  
                                                </Row>
                                                  </Col> </> : ''}
                                                {/*end*/}


                                                </Col> {/*booking left wrapper ends*/}



                                        <Col xs={12} md={6} lg={6} xl={6} className="booking-right-wrapper clearfix">
                                           {packageType != null && packageType != 1 ? <Col className="booking-room-wrapper-cruise">
                                            {rooms.map((room, i) => (<>

                                            <Col className="booking-room-wrapper">
                                                <Row className='booking-edit-box'>
                                                    <Col xs={12} sm={12} md={12} lg={12} className = "emiText"> <label className=""> {langContent.room_number}-{i+1}</label>  {i !=0 ? <span className="room remove-icon" onClick={this.removeRooms.bind(this,'rooms',i,0)}> <i class="fa fa-times pop-close-icon"></i></span>: ''}</Col>
                                                    <Col xs={12} sm={12} md={12} lg={12} className = "emiText">
                                                        <label className="">{langContent.no_of_adults != undefined ? langContent.no_of_adults :'No. of Adults'}</label>
                                                        <Form.Group className='m-b-30'>
                                                            <Form.Control as="select"  name="rooms[1][no_of_adults]" placeholder={langContent.select_no_of_adults != undefined ? langContent.select_no_of_adults :'select no of adults..'} onClick={(event) => this.addRoomFields('adults',i,0, event)}>
                                                                <option value=''>  {langContent.select_no_of_adults != undefined ? langContent.select_no_of_adults :'select no of adults..'}</option>
                                                                {getOptionArray(1,10).map((Adult)=>{
                                                                    return (<option value={Adult}> {Adult}</option>);
                                                                })}
                                                            </Form.Control>
                                                            <Form.Control.Feedback type='invalid'>
                                                                {errors.rooms != undefined && errors.rooms[i] != undefined ? errors.rooms[i] : ''}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row className='booking-edit-box add-multiple-wrapper'>
                                                    <Col xs={6} sm={6} md={6} lg={6} >
                                                        <Row>
                                                            <Col className="add-more-wrapper child" xs={12} sm={12} md={12} lg={12} > <label className="add-more" onClick={this.AddMoreRoom.bind(this,'children',i)}>{langContent.add_childs}</label> </Col>
                                                            {room.children.length > 0 && room.children.map((children, c) => (<>
                                                            <Col className="add-label" xs={12} sm={4} md={4} lg={4} >
                                                                <label className="child-label">{langContent.child} {c+1}</label>
                                                            </Col>
                                                            <Col xs={12} sm={8} md={8} lg={8} className="age-col" >
                                                                <span className="remove-icon child-icon" onClick={this.removeRooms.bind(this,'children',i,c)}> <i class="fa fa-times pop-close-icon"></i></span>
                                                                <Form.Group className='m-b-30 child-option'>
                                                                    <Form.Control as="select"  name="rooms[1][children][1][age]" placeholder={langContent.select_age != undefined ? langContent.select_age :'select age..'} onClick={(event) => this.addRoomFields('children',i,c, event)}>
                                                                        <option value=''> {langContent.select_age != undefined ? langContent.select_age :'select age..'} </option>
                                                                        { getOptionArray(0, 12).map((child)=> {
                                                                            return (<option value={child} key={child}> {child}</option>);
                                                                        }) }
                                                                    </Form.Control>
                                                                    <Form.Control.Feedback type='invalid'>
                                                                        {errors.no_of_adults != undefined ? errors.no_of_adults : ''}
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Col>
                                                            </>))}
                                                        </Row>
                                                    </Col>
                                                    <Col xs={6} sm={6} md={6} lg={6} >
                                                        <Row>
                                                            <Col className="add-more-wrapper jr" xs={12} sm={12} md={12} lg={12} > <label className="add-more" onClick={this.AddMoreRoom.bind(this,'juniors',i)}>{langContent.add_junior}</label></Col>
                                                            {room.juniors.map((junior,j) => (<>
                                                            <Col className="add-label" xs={12} sm={4} md={4} lg={4} ><label className="junior-label">{langContent.junior} {j+1}</label> </Col>
                                                            <Col xs={12} sm={8} md={8} lg={8} className="jr-col">
                                                                <span className="remove-icon jr-icon" onClick={this.removeRooms.bind(this,'juniors',i,j)}> <i class="fa fa-times pop-close-icon"></i></span>
                                                                <Form.Group className='m-b-30 jr-option'>
                                                                    <Form.Control as="select"  name="rooms[1][juniors][1][age]" placeholder={langContent.select_age != undefined ? langContent.select_age :'select age..'} onClick={(event) => this.addRoomFields('juniors',i,j, event)}>
                                                                        <option value=''>  {langContent.select_age != undefined ? langContent.select_age :'select age..'}</option>
                                                                        {getOptionArray(13,16).map((junior)=>{
                                                                            return (<option value={junior} key={junior}> {junior}</option>);
                                                                        })}
                                                                    </Form.Control>
                                                                    <Form.Control.Feedback type='invalid'>
                                                                        {errors.no_of_adults != undefined ? errors.no_of_adults : ''}
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Col>
                                                            </>))}
                                                        </Row>
                                                   </Col>

                                                </Row>
                                                </Col>
                                                </>))}

                                                
                                                  <Col className="room-border-wrapper">
                                                    <Row>
                                                    <Col className="add-more-wrapper room" xs={12} sm={12} md={12} lg={12} > <label className="add-more" onClick={this.AddMoreRoom.bind(this,'rooms',1)} title={this.state.orderNoOfGuest <= rooms.length ? langContent.room_not_morethan_guest :'' }>{langContent.add_room}</label> </Col>
                                                </Row>
                                                <Row className='booking-edit-box'>
                                                  
                                                </Row>
                                                  </Col> </Col> : ''}
                                                {/*end*/}

                                                    {/*being*/}
                                                    {packageType != null && packageType == 1 ? <>
                                                      <Col className="booking-room-wrapper guests-box">
                                                          <Col xs={12} sm={12} md={12} lg={12} className = "emiText"> <label className=""> {langContent.guests}</label></Col>
                                                          <Row className='booking-edit-box'>
                                                              <Col xs={4} sm={4} md={4} lg={4} className = "emiText">
                                                                  <label className="">{langContent.first_name != undefined ? langContent.first_name :'First name'}</label>
                                                              </Col>
                                                              <Col xs={4} sm={4} md={4} lg={4} className = "emiText">
                                                                  <label className="">{langContent.last_name != undefined ? langContent.last_name :'First name'}</label>
                                                              </Col>
                                                              <Col xs={4} sm={4} md={4} lg={4} className = "emiText">
                                                                  <label className="">{langContent.date_of_birth != undefined ? langContent.date_of_birth :'Date of Birth'}</label>
                                                              </Col>
                                                          </Row>
                                                          { guests.map((guest, i) => (<>

                                                          <Row className='booking-edit-box guests-wrapper'>

                                                              <Col xs={4} sm={4} md={4} lg={4} className = "emiText guest-name">
                                                                  <Form.Group className='m-b-30'>
                                                                      <Form.Control type='text'
                                                                                    placeholder={langContent.first_name != undefined ? langContent.first_name :'First name'}
                                                                                    value={guest.first_name}
                                                                                    name='first_name'
                                                                                    className='edit-booking-input'
                                                                                    onChange={(event) => this.guestInputChangeHandler(i, event, 'first_name')}
                                                                                    isInvalid={errors.guests != undefined && errors.guests[i] != undefined  && errors.guests[i].first_name != undefined && !!errors.guests[i].first_name}
                                                                      />
                                                                      <Form.Control.Feedback type='invalid'>
                                                                          { errors.guests != undefined && errors.guests[i] != undefined && errors.guests[i].first_name != undefined ? errors.guests[i].first_name : '' }
                                                                      </Form.Control.Feedback>
                                                                  </Form.Group>
                                                              </Col>
                                                              <Col xs={4} sm={4} md={4} lg={4} className = "emiText guest-name">
                                                                  <Form.Group className='m-b-30'>
                                                                      <Form.Control type='text'
                                                                                    placeholder={langContent.last_name != undefined ? langContent.last_name :'Last name'}
                                                                                    name='last_name'
                                                                                    value={guest.last_name}
                                                                                    className='edit-booking-input'
                                                                                    value={ formFields.last_name }
                                                                                    onChange={(event) => this.guestInputChangeHandler(i, event, 'last_name')}
                                                                                    isInvalid={errors.guests != undefined && errors.guests[i] != undefined  && errors.guests[i].last_name != undefined && !!errors.guests[i].last_name}
                                                                      />
                                                                      <Form.Control.Feedback type='invalid'>
                                                                          { errors.guests != undefined && errors.guests[i] != undefined && errors.guests[i].last_name != undefined ? errors.guests[i].last_name : '' }
                                                                      </Form.Control.Feedback>
                                                                  </Form.Group>
                                                              </Col>
                                                              <Col xs={4} sm={4} md={4} lg={4} className = "emiText guest-name dob">
                                                                  <Form.Group className='m-b-30'>
                                                                      <DatePicker
                                                                          selected={guest.date_of_birth}
                                                                          onChange={(event) => this.dateOfBirthChange(i, event)}
                                                                          className='card-input cstmDate'
                                                                          placeholderText={langContent.date_of_birth != undefined ? langContent.date_of_birth :'Date of Birth' }
                                                                          isInvalid={errors.guests != undefined && errors.guests[i] != undefined  && errors.guests[i].date_of_birth != undefined && !!errors.guests[i].date_of_birth}
                                                                      />
                                                                      <Form.Control.Feedback type='invalid'>
                                                                          { errors.guests != undefined && errors.guests[i] != undefined && errors.guests[i].date_of_birth != undefined ? errors.guests[i].date_of_birth : '' }
                                                                      </Form.Control.Feedback>
                                                                  </Form.Group>
                                                              </Col>
                                                          </Row>
                                                          </>))}
                                                      </Col>
                                                    </> :''}





                                                  </Col>{/*booking right ends */}





                                            </section>
                                            : ''
                                        }
                                        <section className='dynamic-clone' />
                                        <Col xs={12} md={12} lg={12} xl={12} className='p-l-0 mob-p-r-0 skip-next-wrapper'>
                                            { step == 1 ? <>
                                                <Button type='button' className='next-btn btn booking-button btn-block edit-booking-save-btn'
                                                        onClick={ this.next.bind(this) }>
                                                    {langContent.next != undefined ? langContent.next : 'Next '}
                                                </Button>
                                                <Button type='button' className='skip-btn booking-button btn btn-block edit-booking-save-btn'
                                                        onClick={ this.skip.bind(this) }>
                                                    {langContent.skip != undefined ? langContent.skip : 'Skip'}
                                                </Button>
                                                </>: <>

                                                    <Button type='button' className='send-btn booking-button btn btn-block edit-booking-save-btn' onClick={ this.handleSubmit.bind(this) }>
                                                        {isRequestPending ? <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/> {langContent.send != undefined ? langContent.send :'Send'}</> : langContent.send != undefined ? langContent.send :'Send'}
                                                    </Button>
                                                    <Button type='button' className='prev-btn booking-button btn btn-block edit-booking-save-btn' onClick={ this.previous.bind(this) }>
                                                    {langContent.previous != undefined ? langContent.previous :'Previous'}
                                                    </Button>
                                            </>
                                            }

                                        </Col>
                                    </Form>
                                </Col>
                            </section> : ''
                            }
                            { is_succeeded ?
                            <section className='width100 pkg-edit'>
                                <Row className='booking-edit-box'>
                                    <Col xs={12} md={6} lg={6} xl={6} className='p-l-0 mob-p-r-0'>
                                        <p className='success-request-for-booking'>
                                            {langContent.request_for_booking_success != undefined ? langContent.request_for_booking_success :'Thank you for your booking request. Soon, you will be contacted by our team.'}
                                        </p>
                                    </Col>
                                </Row>
                            </section> : ''
                                }
                            {/* End Edit Form */}
                        </Col>
                    </Row>
                    <ViewAllImageComponent langContent={langContent} openPopup={this.state.openPopup} onClick={this.closePopup.bind(this)} uploads={order.package.uploads}/>

                </section>
            )
        } else {
            return '';
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateBookingComponent)