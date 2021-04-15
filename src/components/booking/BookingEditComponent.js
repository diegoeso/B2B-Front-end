import React from 'react'
import ReactDOM from 'react-dom'
import styles from '../../Style.css'
import classNames from 'classnames'
import { Row, Col, Modal, Table, Button, Form, Spinner} from 'react-bootstrap'
import romantic from '../../image/romantic.png'
import adventure from '../../image/adventure.png'
import connect from 'react-redux/es/connect/connect'
import $ from 'jquery'
import { Link } from 'react-router-dom'
import { customizeBooking } from '../../actions/BookingAction';
import { editBookingValidator } from '../../validations/booking';
import { getAdditionalRequest,getCurrencySymbol } from '../../constants';
import ViewAllImageComponent from '../../components/booking/ViewAllImageComponent';
const mapStateToProps = (state) => {
  return {
    user: state.session.user,
    order: state.Booking.order,
    isPending: state.Booking.isPending,
    booking: state.Booking.booking,
    langContent: state.Lang.langContent,
    lang: state.Lang.lang,
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    customizeBooking: (form) => dispatch(customizeBooking(form, props))
  }
}
class BookingEditComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      formFields: {
        no_of_adults: '',
        no_of_children: '',
        no_of_juniors: '',
        no_of_rooms: '',
      },
      errors: {},
      isPending: false,
      btnState: true,
      id: null,
    }
  }
  componentWillMount() {
    let id = this.props.match.params.id;
    let formFields = this.state.formFields;
    let additional = getAdditionalRequest(this.props);
    formFields.no_of_adults = additional.no_of_adults;
    formFields.no_of_children = additional.no_of_children;
    formFields.no_of_juniors = additional.no_of_juniors;
    formFields.no_of_rooms = additional.no_of_rooms;
    this.setState({id, formFields});
  }
  inputChangeHandler(event) {
    let lang = this.props.lang;
    let langContent = this.props.langContent; 
    let formFields = {...this.state.formFields};
    let errors = this.state.errors;
    errors = editBookingValidator(event, errors,lang,langContent);
    formFields[event.target.name] = event.target.value;
    this.setState({errors, formFields});
  }
  handleSubmit() {
    let token = this.props.user.token;
    let props = this.props;
    let errors = this.state.errors;
    let flag = true;
    this.setState({errors});
    let form = new FormData();
    let items = this.state.formFields;
    if (Object.keys(errors).length == 0  || !flag) {
      form.append('no_of_adults', items.no_of_adults);
      form.append('no_of_children', items.no_of_children);
      form.append('no_of_juniors', items.no_of_juniors);
      form.append('no_of_rooms', items.no_of_rooms);
      form.append('booking_id', this.state.id);
      if (token != undefined && token != '') {
        props.customizeBooking(form);
      } else {
        this.setState({errors});
      }
    }
  }

  closePopup = (flag = false) => {
    this.setState({ openPopup: flag });
  }
  render () {
    const { errors, formFields} = this.state;
    const { booking,langContent, isPending,lang} = this.props;
     if(booking != undefined && booking != null) {
    let mainImage = booking != null && booking.package.uploads != null  && Object.keys(booking.package.uploads).length > 0 ? booking.package.uploads[0].file_name_url : romantic;
    return (
      <section className='comman-wrapper pad55 '>
        <Row className='width100'>
          <Col xs={12} lg={12} xl={12} className='mob-pad20 m-t-65'>
            <h2 className='cstm-left-heading cursor' onClick={this.props.history.goBack}>
              <i className='fa-chevron-left fa m-r-20' />
              {langContent.booking_mangement != undefined ? langContent.booking_mangement :'Booking Mangement'}
            </h2>
            <Button className='booking-customize-btn custom-hide btn btn-block'>
            {langContent.addition_request != undefined ? langContent.addition_request :'Additional Request'}   
            </Button>
            {/* Image Collage Section */}
            <section>
              <Row>
                <Col xs={12} sm={6} md={6} lg={6} xl={6} className='trip-img-col1 book-view-left-banner-box'>
                  <img src={mainImage} className='trip-img-lg img-responsive' alt='optucorp' />
                </Col>
                <Row xs={12} sm={6} md={6} lg={6} xl={6} className='spl-packimg-col2 book-view-right-banner-box'>
                  { booking != null && booking.package != null && booking.package.uploads.length > 0 ? booking.package.uploads.slice(1, 5).map((file, index)=> {

                    return <Col xs={12} sm={12} md={6} lg={6} xl={6} className='trip-img-col trip-col1 book-view-inner-banner-box' key={index}>
                      <img src={file.file_name_url} className='trip-img trip-img-sml img-responsive' alt='optucorp'/>
                    </Col>}) : ''}
                    {  booking != null  && booking.package.uploads.length > 4 ? <> <Col xs={12} sm={6} md={6} lg={6} xl={6}> </Col> <Col xs={12} sm={6} md={6} lg={6} xl={6} className='book-view-inner-banner-box show-all'> <span  className="show-txt" onClick={this.closePopup.bind(this,true)}> Show all </span></Col> </> : ''}
        
                </Row>
              </Row>
            </section>
            {/* End Image Collage Section */}
            {/* Start  Edit Form */}
            <section>
           
              <Col xs={12} md={12} lg={12} xl={5} className='pad0'>
                <Form className='width100' noValidate>
                <Row className="payment-wrapper booking">
                   <Col xs={12} sm={12} md={12} lg={12} className = "emiText">
                      <h4 className='booking-edit-hdr hotel-fill-txt m-b-30'>{langContent.addition_request != undefined ? langContent.addition_request :'Additional Request'}</h4>
                      <p className="booking-save-txt clearfix">
                        <span className="inr-txt">{booking != null ? getCurrencySymbol('',lang) : ''} { booking != null && booking.package.total_amount != '' ? booking.package.total_amount : ''} </span>
                        <span className="save-txt"> {booking != null && booking.order.emis != null ? langContent.emi+' '+booking.order.emis[0].amount : ''} </span>
                      </p>
                   </Col>
              </Row>

                 <section className='width100 pkg-edit'>
                    <Row className='booking-edit-box'>
                      <Col xs={12} md={6} lg={6} xl={6} className='p-l-0 mob-p-r-0'>
                        <label className="">{langContent.no_of_adults != undefined ? langContent.no_of_adults :'No. of Adults'}</label>
                        <Form.Group className='m-b-30'>
                          <Form.Control type='text' placeholder={langContent.no_of_adults != undefined ? langContent.no_of_adults :'No. of Adults'} name='no_of_adults'
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
                        <label className="">{langContent.no_of_children != undefined ? langContent.no_of_children :'No. of Children'}</label>
                        <Form.Group className='m-b-30'>
                          <Form.Control type='text' placeholder={langContent.no_of_children != undefined ? langContent.no_of_children :'No. of Children'} name='no_of_children'
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
                        <label className="">{langContent.no_of_juniors != undefined ? langContent.no_of_juniors :'No. of Juniors'}</label>
                        <Form.Group className='m-b-30'>
                          <Form.Control type='text' placeholder={langContent.no_of_juniors != undefined ? langContent.no_of_juniors :'No. of Juniors'} name='no_of_juniors'
                                        className='edit-booking-input'
                                        value={formFields.no_of_juniors}
                                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                                        isInvalid={errors != undefined && !!errors.no_of_juniors}/>
                          <Form.Control.Feedback type='invalid'>
                            { errors.no_of_juniors != undefined ? errors.no_of_juniors : '' }
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6} lg={6} xl={6} className='mob-p-r-0 cstmSmallPad0'>
                        <label className="">{langContent.no_of_rooms != undefined ? langContent.no_of_rooms :'No. of Rooms'}</label>
                        <Form.Group className='m-b-30'>
                          <Form.Control type='text' placeholder={langContent.no_of_rooms != undefined ? langContent.no_of_rooms :'No. of Rooms'} name='no_of_rooms'
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
                  <section className='dynamic-clone' />
                  <Col xs={12} md={12} lg={6} xl={6} className='p-l-0 mob-p-r-0 '>
                    <Button type='button' className='btn btn-block edit-booking-save-btn' onClick={ this.handleSubmit.bind(this) }>
                      {isPending ? <>
                      <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>  {langContent.save_details != undefined ? langContent.save_details :' Save Details'}
                      </> : langContent.save_details != undefined ? langContent.save_details :'Save Details'}
                    </Button>
                  </Col>
                </Form>
              </Col>
            </section>
            {/* End Edit Form */}
          </Col>
        </Row>
          <ViewAllImageComponent langContent={langContent} openPopup={this.state.openPopup} onClick={this.closePopup.bind(this)} uploads={booking.package.uploads}/>
     
      </section>
    )
     } else {
          return '';
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(BookingEditComponent)
