import React from 'react'
import styles from '../../Style.css'
import moment from 'moment';
import classNames from 'classnames'
import { Row, Col, Modal, Table, Button,Container, Spinner } from 'react-bootstrap'
import noimage from '../../image/no-image.jpeg'
import bookingUser from '../../image/user.png'
import duration from '../../image/duration.svg'
import Form from 'react-bootstrap/Form'
import bookingLocation from '../../image/location.png'
import filter from '../../image/filter.png'
import { Link } from 'react-router-dom'
import connect from 'react-redux/es/connect/connect'
import { myBookings } from '../../actions/BookingAction';
import { getUrl,returnLanguageText } from "../../constants";
const mapStateToProps = (state) => {
  return {
    bookings: state.Booking.bookings.reservations,
    booking_status: state.Booking.bookings.booking_status,
    auth: state.Auth,
    langContent: state.Lang.langContent,
    lang: state.Lang.lang,
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    myBookings: (status) => dispatch(myBookings(status)),
  }
}
class BookingComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      bookings: {},
    }
  }
  componentDidMount() {
    this.props.myBookings('');
  }
  handleFilterOrder = (event) => {
    let status = event.target.value;
    this.props.myBookings(status);
  }

  getthumnelOfimage = (uploads,classIMG='customPoplarDestintion') => {
    if(uploads != undefined && uploads.length >0 ) {
        let uploadss = uploads.filter(upload => upload.thumbnail_active == 1);
        if(uploadss.length>0) {
          return uploads.map((upload, key) => {
            if(upload.thumbnail_active == 1) {
              return <img src={upload.thumbnail_url} className={classIMG}/>
            }
          });
        } else{
          return <img src={uploads[0].thumbnail_url} className={classIMG}/>
        }
    } else {
       return <img src={noimage} className={classIMG}/>
    }
 
  }

  render () {
    const { bookings, booking_status, auth,langContent,lang} = this.props;
    return (
      <Container className='cstm-home-container'>
        <section className='comman-wrapper cstm-bookinglist-wrapper'>
          <Row className='width100'>
            <Col xs={12} lg={12} xl={12} className='pad55 mob-pad20 m-t-65 booking-wrapper'>
              <h2 className='cstm-left-heading cursor' onClick={this.props.history.goBack}>
                <i className='fa-chevron-left fa m-r-20' />
                {langContent.booking_mangement != undefined ? langContent.booking_mangement :'Booking Management'}
              </h2>
             <h2 className='cstm-right-heading'>
                <Form.Group controlId="exampleForm.ControlSelect1" className="order-select">
                  <i class="fa fa-angle-down fa-3" aria-hidden="true"></i>
                    <Form.Control as="select" className="custom-filter-img" name="booking_status" placeholder="Filter Bookings" onChange={this.handleFilterOrder}>
                      <img src={filter} class='img-responsive icon-filter' alt='Optucrop' />
                      <option value=''>  {langContent.all_bookings != undefined ? langContent.all_bookings :'All Bookings'} </option>
                      { booking_status != null && booking_status[lang] != undefined && Object.keys(booking_status[lang]).map(status=> {
                          return <option key={status} value={status}>{booking_status[lang][status]}</option>;
                      }) }
                    </Form.Control>
                </Form.Group>
              </h2>
              { bookings != null && bookings != undefined && bookings.length > 0 ? bookings.map(booking=> {
                var thumbnail = booking.package.uploads != undefined && booking.package.uploads != null && booking.package.uploads.length > 0 && booking.package.uploads[0].thumbnail_url != undefined ? booking.package.uploads[0].thumbnail_url : noimage;
              return <><Col xs={12} sm={12} xl={12} className='row cstm-order-box animation'>
                <Col xs={12} md={4} lg={3} sm={4} xl={4} className='pad0'>
                  
                  {this.getthumnelOfimage(booking.package.uploads,'img-responsive cstm-order-img')}
                </Col>

                <Col xs={12} md={8} lg={9} sm={8} xl={8} className='pad10'>
                  <Row>
                    <Col xs={12} md={12} lg={12} xl={12}>
                      <h2 className='cstm-order-info-heading booking'>
                        {returnLanguageText(booking.package,lang,'title')}
                      </h2>
                      <Row xs={12} xl={12} className='textLeft m-t-20'>
                        <Col xs={12} md={12} lg={9} className='row cstm-booking-details-wrapper'>
                          <Col xs={12} sm={12} md={12} lg={6} className='m-b-20 book-order-info-box'>
                            <img src={bookingUser} className='img-responsive cstm-order-icon' alt='optucorp'/>
                            <span className='cstm-order-info-text'>
                            {langContent.reservation_name != undefined ? langContent.reservation_name :'Reservation Name'}   
                            </span>
                            <span className='cstm-order-info-text dark-text-clr reservation-name-text'>
                              {booking.name_on_reservation}
                            </span>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={6} className='m-b-20 book-order-info-box'>
                            <img src={bookingLocation} className='img-responsive cstm-order-icon' alt='optucorp'/>
                            <span className='cstm-order-info-text'>
                            {langContent.destination != undefined ? langContent.destination :'Destination'}  
                            </span>
                            <span className='cstm-order-info-text dark-text-clr booking-comman-text'>
                              
                              { booking.package.package_type != 4 ? returnLanguageText(booking.package, lang, 'destination') : booking.package.country.country}
                            </span>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={6} className='m-b-20 book-order-info-box book-order-info-box'>
                            <img src={duration} className='img-responsive cstm-order-icon' alt='optucorp'/>
                            <span className='cstm-order-info-text'>
                              {booking.package.package_type == 1 ? langContent.departure_date != undefined ? langContent.departure_date :'Departure_date:' : langContent.check_in != undefined ? langContent.check_in :'Check In:'}
                            </span>
                            <span className='cstm-order-info-text dark-text-clr booking-comman-text'>
                              { booking.package.package_type != 1 ? booking.details.check_in_date != null ?  moment(booking.details.check_in_date).format("MM/DD/YYYY") : '' : moment(booking.details.departure_date).format("MM/DD/YYYY") }
                            </span>
                          </Col>
                          { booking.package.package_type != 1 ?
                              <Col xs={12} sm={12} md={12} lg={6} className='m-b-20 book-order-info-box'>
                                <img src={duration} className='img-responsive cstm-order-icon' alt='optucorp'/>
                            <span className='cstm-order-info-text'>
                            {langContent.checkout != undefined ? langContent.checkout :'Checkout'}  
                            </span>
                            <span className='cstm-order-info-text dark-text-clr booking-comman-text'>
                              { booking.package.package_type != 1 ? booking.details.check_out_date != null ?  moment(booking.details.check_out_date).format("MM/DD/YYYY") : '' : '' }
                            </span>
                              </Col>
                          : ''}
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={3} className='m-b-20 pad0 right-booking-wrapper'>
                          <Link to={getUrl(auth.customer)+booking.id+'/booking-view'}>
                            <span className='view-book-text booking'>  {langContent.view_booking != undefined ? langContent.view_booking :'View Booking'} </span>
                          </Link>
                         
                        </Col>
                      </Row>
                      <p className='status-cnfrm-txt'>
                          {langContent.status != undefined ? langContent.status :'Status'}: <span>{booking_status[lang][booking.status]}</span>
                          </p>
                    </Col>
                  </Row>
                </Col>
              </Col></>
              }) : 

              <Col xs={6} sm={6} md={6} lg={6} className="error-wrapper">
                 <h2 className='odr-dtls-no-info'>   {langContent.no_record_found != undefined ? langContent.no_record_found :'No record found'}  </h2>

              </Col>


            }
            </Col>
          </Row>
        </section>
      </Container>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(BookingComponent)
