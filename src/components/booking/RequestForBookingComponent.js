import React from 'react'
import DatePicker from 'react-datepicker'
import { Row, Col, Form, Button, Table, Modal, Spinner} from 'react-bootstrap'
import connect from 'react-redux/es/connect/connect'
import { requestForBooking, toggleRequestForBooking, toggleRequestForBookingInfo } from '../../actions/BookingAction';
import { requestForBookingValidator, checkInDateBooking, checkOutDateBooking, changeBookingDate } from '../../validations/order';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
const mapStateToProps = (state) => {
  return {
    langContent: state.Lang.langContent,
    lang: state.Lang.lang,
    session: state.session,
    additionalRequestPopup: state.Booking.request_for_booking,
    bookingInfoPopup: state.Booking.request_for_booking_info,
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    requestForBooking: (form) => dispatch(requestForBooking(form, props)),
    toggleRequestForBooking: (action) => dispatch(toggleRequestForBooking(action, props)),
    toggleRequestForBookingInfo: (action) => dispatch(toggleRequestForBookingInfo(action, props)),
  }
}
class RequestForBookingComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      formFields: {
        order_id:this.props.currentOrder.id,
        name_on_reservation: '',
        email: '',
        destination_city: '',
        phone_number: '',
        contact_number: '',
        check_in_date: '',
        check_out_date: '',
        booking_date: '',
        additional_comment: '',
        package_type: Object.keys(this.props.currentOrder).length > 0 && this.props.currentOrder.package != undefined ? this.props.currentOrder.package.package_type : '',
      },
      packageType: this.props.currentOrder.package != undefined ? this.props.currentOrder.package.package_type : '',
      checkInDate: '',
      checkOutDate: '',
      bookingDate: '',
      errors: {},
    }
  }
  inputChangeHandler(event) {
    let formFields = {...this.state.formFields};
    let errors = {...this.state.errors};
    let langContent = this.props.langContent;
    let lang = this.props.lang;
    errors = requestForBookingValidator(event, this.props.currentOrder.package.package_type, errors, langContent,lang);
    formFields[event.target.name] = event.target.value;
    this.setState({ errors, formFields});
  }
  checkInDateChange = (checkIn) => {
    let errors = {...this.state.errors};
    let formFields = {...this.state.formFields};
    let langContent = this.props.langContent;
    errors = checkInDateBooking(checkIn, errors, langContent);
    formFields['check_in_date'] = moment(checkIn).format('YYYY-MM-DD');
    let checkInDate = moment(checkIn).toDate();
    this.setState({ errors, checkInDate, formFields});
  }
  checkOutDateChange = (checkOut) => {
    let errors = {...this.state.errors};
    let formFields = {...this.state.formFields};
    let langContent = this.props.langContent;
    let checkInDate = document.getElementById('check_in_date').value != '' ? moment(document.getElementById('check_in_date').value).format('YYYY-MM-DD') : '';
    errors = checkOutDateBooking(checkOut, checkInDate, errors, langContent);
    formFields['check_out_date'] = moment(checkOut).format('YYYY-MM-DD');
    let checkOutDate = moment(checkOut).toDate();
    this.setState({ errors, checkOutDate, formFields});
  }
  bookingDateChange = (bookingDateSelected) => {
    let errors = {...this.state.errors};
    let formFields = {...this.state.formFields};
    let langContent = this.props.langContent;
    errors = changeBookingDate(bookingDateSelected, errors, langContent);
    formFields['booking_date'] = moment(bookingDateSelected).format('YYYY-MM-DD');
    let bookingDate = moment(bookingDateSelected).toDate();
    this.setState({ errors, bookingDate, formFields});
  }
  handleSubmit() {
    let token = this.props.session.user.token;
    let langContent = this.props.langContent;
    if (token != '') {
      let errors = this.state.errors;
      let form = new FormData();
      let items = this.state.formFields;
      Object.entries(items).forEach(([key, value]) => {
        if ((key != 'additional_comment' && key != 'contact_number' && key != 'package_type' && key != 'order_id') && value == '') {
          if (this.props.currentOrder.package.package_type == 4 && key == 'destination_city') {
            errors[key] = langContent.the+' '+langContent[key]+' '+langContent.field_is_required;
          } else {
            errors[key] = langContent.the + ' ' + langContent[key] + ' ' + langContent.field_is_required;
          }
        }
      });
      if (this.props.currentOrder.package.package_type != 4) {
        delete errors['destination_city'];
      }
      if (this.props.currentOrder.package.package_type == 1) {
        delete errors['check_in_date'];
        delete errors['check_out_date'];
      } else {
        delete errors['booking_date'];
      }
      if (Object.keys(errors).length == 0) {
        form.append('order_id', this.props.currentOrder.id);
        form.append('name_on_reservation', items.name_on_reservation);
        form.append('phone_number', items.phone_number);
        form.append('contact_number', items.contact_number);
        form.append('email', items.email);
        form.append('destination_city', items.destination_city);
        form.append('additional_comment', items.additional_comment);
        form.append('package_type', this.props.currentOrder.package.package_type);
        form.append('booking_date', items.booking_date);
        if (this.props.currentOrder.package.package_type == 1) {
          form.append('booking_date', moment(items.booking_date).format('YYYY-MM-DD'));
        } else {
          form.append('check_in_date', moment(items.check_in_date).format('YYYY-MM-DD'));
          form.append('check_out_date', moment(items.check_out_date).format('YYYY-MM-DD'));
        }
        this.props.requestForBooking(form);
      } else {
        this.setState({errors});
      }
    } else {
      toast.error(langContent.please_login_first, {
        hideProgressBar:true,
      });
    }
  }
  closeRequestBookingPopup = () => {
    let errors = {};
    this.props.toggleRequestForBookingInfo(false);
    this.setState({ errors })
  }
  closePopup = () => {
    this.props.changePopupState(false);
  }
  render () {
    const { langContent, bookingInfoPopup} = this.props;
    const { errors } = this.state;
    var packageType = this.props.currentOrder.package != undefined ? this.props.currentOrder.package.package_type : '';
    return (
        <Modal className="custom-model-size" size='lg' show={ bookingInfoPopup } aria-labelledby='example-modal-sizes-title-lg'>
          <Modal.Header className='scdl-popup-header'>
            <i className='fa fa-times pop-close-icon' onClick={this.closeRequestBookingPopup.bind(this)}/>
          </Modal.Header>

          <Modal.Body className='pad32 order-cancel-popup'>
            <h2 className='schdle-pop-heading text-center custom-hdr-padding'>
              { langContent.please_add_booking_information != undefined ? langContent.please_add_booking_information :'Please add booking information.' }
            </h2>
            <Form.Group as={Row} controlId="formHorizontalNameOnReservation">
              <Form.Label column sm={4} className="card-title"> {langContent.name_on_reservation != undefined ? langContent.name_on_reservation :'Name on reservation'}<sup className="requiredField">*</sup> </Form.Label>
              <Col sm={8}>
                <Form.Control type='text' placeholder={langContent.name_on_reservation != undefined ? langContent.name_on_reservation :'Name on reservation'} className='card-input no-rounded' name="name_on_reservation" isInvalid={errors.name_on_reservation != undefined && !!errors.name_on_reservation} onChange={this.inputChangeHandler.bind(this)}/>
                <Form.Control.Feedback type='invalid'>
                  {errors.name_on_reservation != undefined && errors.name_on_reservation != undefined ?  errors.name_on_reservation : ''}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalEmail">
              <Form.Label column sm={4} className="card-title"> {langContent.email != undefined ? langContent.email :'Email'}<sup className="requiredField">*</sup> </Form.Label>
              <Col sm={8}>
                <Form.Control type='text' placeholder={langContent.email != undefined ? langContent.email :'Email'} className='card-input no-rounded' name="email" isInvalid={errors.email != undefined && !!errors.email} onChange={this.inputChangeHandler.bind(this)}/>
                <Form.Control.Feedback type='invalid'>
                  {errors.email != undefined && errors.email != undefined ?  errors.email : ''}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            { packageType != '' && packageType == 4 ?
                <><Form.Group as={Row} controlId="formHorizontalDestinationCity">
                  <Form.Label column sm={4} className="card-title"> {langContent.destination_city != undefined ? langContent.destination_city :'Destination City'}<sup className="requiredField">*</sup> </Form.Label>
                  <Col sm={8}>
                    <Form.Control type='text' placeholder={langContent.destination_city != undefined ? langContent.destination_city :'Destination City'} className='card-input no-rounded' name="destination_city" isInvalid={errors.destination_city != undefined && !!errors.destination_city}  onChange={this.inputChangeHandler.bind(this)}/>
                    <Form.Control.Feedback type='invalid'>
                      {errors.destination_city != undefined && errors.destination_city != undefined ?  errors.destination_city : ''}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group></> : ''
            }
            <Form.Group as={Row} controlId="formHorizontalPhoneNumber">
              <Form.Label column sm={4} className="card-title"> {langContent.phone_number != undefined ? langContent.phone_number :'Phone number'}<sup className="requiredField">*</sup> </Form.Label>
              <Col sm={8}>
                <Form.Control type='text' placeholder={langContent.phone_number != undefined ? langContent.phone_number :'Phone number'} className='card-input no-rounded' name="phone_number" isInvalid={errors.phone_number != undefined && !!errors.phone_number} onChange={this.inputChangeHandler.bind(this)}/>
                <Form.Control.Feedback type='invalid'>
                  {errors.phone_number != undefined && errors.phone_number != undefined ?  errors.phone_number : ''}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalContactNumber">
              <Form.Label column sm={4} className="card-title"> {langContent.contact_number != undefined ? langContent.contact_number :'Contact number'} </Form.Label>
              <Col sm={8}>
                <Form.Control type='text' placeholder={langContent.contact_number != undefined ? langContent.contact_number :'Contact number'} className='card-input no-rounded' name="contact_number" isInvalid={errors.contact_number != undefined && !!errors.contact_number} onChange={this.inputChangeHandler.bind(this)}/>
                <Form.Control.Feedback type='invalid'>
                  {errors.contact_number != undefined && errors.contact_number != undefined ?  errors.contact_number : ''}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            { packageType != '' && packageType != 1 ? <>
            <Form.Group as={Row} controlId="formHorizontalCheckInDate">
              <Form.Label column sm={4} className="card-title"> {langContent.check_in_date != undefined ? langContent.check_in_date :'Check-In Date'}<sup className="requiredField">*</sup> </Form.Label>
              <Col sm={8}>
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
                  {errors.check_in_date != undefined ? errors.check_in_date : ''}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalCheckOutDate">
              <Form.Label column sm={4} className="card-title"> {langContent.check_out_date != undefined ? langContent.check_out_date :'Check-Out Date'}<sup className="requiredField">*</sup> </Form.Label>
              <Col sm={8}>
                <DatePicker
                    selected={this.state.checkOutDate}
                    name='check_out_date'
                    id="check_out_date"
                    onChange={this.checkOutDateChange}
                    className='card-input cstmDate'
                    placeholderText={langContent.check_out_date != undefined ? langContent.check_out_date :'Check-Out Date' }
                    isInvalid={errors != undefined && !!errors.check_out_date}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.check_out_date != undefined ? errors.check_out_date : ''}
                </Form.Control.Feedback></Col>
            </Form.Group></> : <Form.Group as={Row} controlId="formHorizontalBookingDate">
              <Form.Label column sm={4} className="card-title"> {langContent.booking_date != undefined ? langContent.booking_date :'Booking Date'}<sup className="requiredField">*</sup> </Form.Label>
              <Col sm={8}>
                <DatePicker
                    selected={this.state.bookingDate}
                    name='booking_date'
                    id="booking_date"
                    onChange={this.bookingDateChange}
                    className='card-input cstmDate'
                    placeholderText={langContent.booking_date != undefined ? langContent.booking_date :'Check-Out Date' }
                    isInvalid={errors != undefined && !!errors.booking_date}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.booking_date != undefined ? errors.booking_date : ''}
                </Form.Control.Feedback></Col>
            </Form.Group>
            }
            <Form.Group as={Row} controlId="formHorizontalAdditionalComment">
              <Form.Label column sm={4} className="card-title"> {langContent.additional_comment != undefined ? langContent.additional_comment :'Additional comment'}</Form.Label>
              <Col sm={8}>
                <Form.Control as="textarea" rows="3" placeholder={langContent.additional_comment != undefined ? langContent.additional_comment :'Additional comment'} className='card-input no-rounded' name="additional_comment" isInvalid={errors.additional_comment != undefined && !!errors.additional_comment}  onChange={this.inputChangeHandler.bind(this)}/>
                <Form.Control.Feedback type='invalid'>
                  {errors.additional_comment != undefined && errors.additional_comment != undefined ?  errors.additional_comment : ''}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Row className="dummy-txt-wrapper">
              <Button className='btn btn-block order-cncl-btn' onClick={this.closeRequestBookingPopup.bind(this)}>   {langContent.cancel != undefined ? langContent.cancel :'Cancel'}  </Button>
              <Button type="button" className='btn btn-block order-submit-btn' onClick={ this.handleSubmit.bind(this) }>   {langContent.submit != undefined ? langContent.submit :'Submit'}  </Button>
            </Row>
          </Modal.Body>
        </Modal>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestForBookingComponent)