import React from 'react'
import ReactDOM from 'react-dom'
import styles from '../../Style.css'
import classNames from 'classnames'
import moment from 'moment';
import connect from "react-redux/es/connect/connect";
import { Row, Col, Button, Container } from 'react-bootstrap'
import romantic from '../../image/romantic.png'
import duration from '../../image/calendar.svg'
import family from '../../image/family.png'
import adventure from '../../image/adventure.png'
import arrowIcon from '../../image/right.svg'
import inclusionIcon from '../../image/inclusionIcon.png'
import exclusionIcon from '../../image/exclusionIcon.png'
import termsIcon from '../../image/termsIcon.png'
import cancelIcon from '../../image/cancelIcon.png'
import inr from '../../image/rupee.png'
import pendingInst from '../../image/duration.svg'
import { Link } from 'react-router-dom'
import { getUrl, getAdditionalRequest,returnLanguageText,getCurrencySymbol} from '../../constants'
import { getBooking } from '../../actions/BookingAction';
import ViewAllImageComponent from '../../components/booking/ViewAllImageComponent';


const mapStateToProps = state => {
  return {
    user: state.session.user,
    customer: state.Auth.customer,
    cities: state.Auth.stateCities,
    countries: state.Auth.countries,
    states: state.Auth.states,
    booking: state.Booking.booking,
    booking_status: state.Booking.booking_status,
    langContent: state.Lang.langContent,
    lang: state.Lang.lang,
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    getBooking: (id) => dispatch(getBooking(id)),
  };
}
class BookingViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      additional: null,
      openPopup:false,
    }
  }
  componentWillMount() {
    let id = this.props.match.params.id;
    this.props.getBooking(id);

  }

  closePopup = (flag = false) => {
    this.setState({ openPopup: flag });
  }

  render () {
    const { booking, customer,langContent, booking_status,lang} = this.props;
   if(booking != undefined && booking != null) {
    let additional = getAdditionalRequest(this.props);
    let count = booking != null ? booking.package.hotel_type : 0;
    let mainImage = booking != null && booking.package.uploads != null && Object.keys(booking.package.uploads).length > 0 ? booking.package.uploads[0].file_name_url : romantic;
    let hideAddMore = booking.other_additional_charges.length > 0 ? true : false;
    return (
      <Container className='cstm-home-container'>
        <section className='comman-wrapper pad55 '>
          <Row className='width100'>
            <Col xs={12} lg={12} xl={12} className='mob-pad20 m-t-65'>
              <h2 className='cstm-left-heading'><i className='fa-chevron-left fa m-r-20 cursor' onClick={this.props.history.goBack}/> {langContent.booking_mangement != undefined ? langContent.booking_mangement :'Booking Management'}</h2>
              {/* Image Collage Section */}
              <section>

                <Row>

                  <Col xs={12} sm={6} md={6} lg={6} xl={6} className='trip-img-col1 book-view-left-banner-box'>
                    <img src={ mainImage } className='trip-img-lg img-responsive' alt='b2b' />

                    </Col>

                  <Row xs={12} sm={6} md={6} lg={6} xl={6} className='spl-packimg-col2 book-view-right-banner-box'>
                    { booking != null  && booking.package.uploads.length > 0 ? booking.package.uploads.slice(1, 5).map((file, index)=> {

                    return <><Col xs={12} sm={6} md={6} lg={6} xl={6} className='trip-img-col trip-col1 book-view-inner-banner-box' key={index}>
                      <img src={file.file_name_url} className='trip-img trip-img-sml img-responsive' alt='b2b'/>
                    </Col></>}) : ''}
                      {  booking != null  && booking.package.uploads.length > 4 ? <> <Col xs={12} sm={6} md={6} lg={6} xl={6}> </Col> <Col className='book-view-inner-banner-box show-all' xs={12} sm={6} md={6} lg={6} xl={6}> <span  className="show-txt" onClick={this.closePopup.bind(this,true)}> Show all </span></Col> </> : ''}
                  </Row>
                </Row>
              </section>
              {/* End Image Collage Section */}
              <Row xs={12} lg={12} xl={12} className='pad0'>
                <Col xs={12} md={12} lg={12} xl={7} className='pad0 mar0'>
                  {/* Start Package Info Section */}
                  <section>
                    <Row className='package-info-box'>
                      <Col xs={12} sm={6} lg={6} xl={5} className='m-b-30 pad0'>
                        <span className='htl-cat-text'>

                        {booking.package.package_type !== 1 ? <>{langContent.hotel_category != undefined ? langContent.hotel_category :' '}</> : <>
                          {langContent.room_category != undefined ? langContent.room_category :'Room Category'} 
                        </>}

                        </span>
                        <span className='htl-rate-star'>
                          {booking.package.package_type !== 1 ? <>
                            {(() => {
                              const rows = [];
                              for (let i = 0; i < count; i++) {
                                rows.push(<i className="fa fa-star" aria-hidden="true"></i>);
                              }
                              return rows;
                            })()}
                             </> :  <>
                             { booking.package != null ? booking.room_category[lang][booking.package.room_category] : ''}
                          </>}


                        </span>
                      </Col>
                      <Col xs={12} sm={6} lg={6} xl={6} className='m-b-30 package-tag-btn-box'>
                        {booking != null ? booking.package.themes.map(theme=> {
                          return <span className='ordr-dtl-tag-btn booking-view-tag-btn' key={theme.id}>{lang =='hindi' ? theme.hindi_name : theme.name}</span>;
                        }) : ''}
                      </Col>
                      <Col xs={12} sm={6} lg={6} xl={5} className='m-b-30 pad0'>
                        <img src={duration} className='img responsive ordr-dtls-tym-img' alt='optucorp'/>

                        <span className='ordr-dtls-day-txt'>
                          { booking != null && booking.package.days != null ? booking.package.days+' '+langContent.days : '' } { booking != null && booking.package.nights != null ? ', '+booking.package.nights+' '+langContent.nights : '' }
                        </span>
                      </Col>
                      <Col xs={12} sm={6} lg={6} xl={6} className='m-b-30 pad0'>

                        {additional != null && additional.has_data ? <img src={family} className='img responsive ordr-dtls-tym-img' alt='optucorp'/> : ''}
                        <span className='ordr-dtls-day-txt'>
                          { booking != null && booking.additional_request.adults != null && booking.additional_request.adults != '' ? booking.additional_request.adults +' '+langContent.adults+', ': '' }
                          { booking != null && booking.additional_request.children != null && booking.additional_request.children != '' ? booking.additional_request.children +' '+langContent.children+', ' : '' }
                          { booking != null && booking.additional_request.juniors != null && booking.additional_request.juniors != '' ? booking.additional_request.juniors +' '+langContent.juniors+', ': '' }
                        </span>
                      </Col>
                    </Row>
                  </section>
                  {/* End Package info section */}
                  {/* Start User Info section */}
                  <section className='user-info-box'>
                    <Row>
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>
                        {langContent.reservation_name != undefined ? langContent.reservation_name :'Reservation Name'} :
                        </span>
                        <span className='user-info-text'>{booking != null && booking.name_on_reservation != '' ? booking.name_on_reservation : ''}</span>
                      </Col>
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>{langContent.email != undefined ? langContent.email :'Email'}: </span>
                        <span className='user-info-text'>{booking != null ? booking.email : ''}</span>
                      </Col>
                      {booking != null && booking.package.package_type == 1 ? 
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>  {langContent.leaving_from != undefined ? langContent.leaving_from :'Leaving From'} : </span>
                        <span className='user-info-text'>{ booking != null ? returnLanguageText(booking.package,lang,'leaving_from') : ''}</span>
                      </Col>
                      : ''}
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>{langContent.destination != undefined ? langContent.destination :'Destination'}: </span>
                        <span className='user-info-text'>{ booking != null && booking.package.package_type == 4 ? booking.package.country.country : returnLanguageText(booking.package,lang,'destination')}</span>
                      </Col>
                     
                      {booking != null && booking.package.package_type != 1 ? <>
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>
                        {langContent.check_in_date != undefined ? langContent.check_in_date :'Check In Date'}  :
                        </span>
                        <span className='user-info-text'>{booking != null && booking.details.check_in_date != '' ? moment(booking.details.check_in_date).format("MM/DD/YYYY") : ''}</span>
                      </Col>
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>
                        {langContent.check_out_date != undefined ? langContent.check_out_date :'Check Out Date'} :
                        </span>
                        <span className='user-info-text'>{booking != null && booking.details.check_out_date != '' ? moment(booking.details.check_out_date).format("MM/DD/YYYY") : ''}</span>
                      </Col>
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>
                        {langContent.check_in_time != undefined ? langContent.check_in_time :'Check In Time'} :{' '}
                        </span>
                        <span className='user-info-text'>{booking != null && booking.details.check_in_time != '' ? booking.details.check_in_time : ''}</span>
                      </Col>
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>
                        {langContent.check_out_time != undefined ? langContent.check_out_time :'Check Out Time'}   :
                        </span>
                        <span className='user-info-text'>{booking != null && booking.details.check_out_time != '' ? booking.details.check_out_time : ''}</span>
                      </Col></>
                        : <>
                        <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>
                        {langContent.departure_date != undefined ? langContent.departure_date :'Departure Date'}   :
                        </span>
                          <span className='user-info-text'>{booking != null && booking.details.departure_date != '' ? moment(booking.details.departure_date).format("MM/DD/YYYY") : ''}</span>
                        </Col
                        ></>}
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>  {langContent.customer_deadline != undefined ? langContent.customer_deadline :'Customers Deadline'} : </span>
                        <span className='user-info-text'>{booking != null && booking.customers_deadline_original != null && booking.customers_deadline_original != '' ?  moment(booking.customers_deadline_original).format("MM/DD/YYYY") : ''}</span>
                      </Col>
                      { booking != null && booking.package.package_type == 1 ? <>
                        <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                          <span className='user-info-heading'>  {langContent.cruise_title != undefined ? langContent.cruise_title :'Cruise Title'}: </span>
                          <span className='user-info-text'>{ booking != null ? returnLanguageText(booking.package,lang,'title') : ''}</span>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                          <span className='user-info-heading'>  {langContent.cruise_liner != undefined ? langContent.cruise_liner :'Cruise Liner'}: </span>
                          <span className='user-info-text'>{ booking != null ? returnLanguageText(booking.package,lang,'cruise_liner') : ''}</span>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                          <span className='user-info-heading'>  {langContent.port_of_departure != undefined ? langContent.port_of_departure :'Port of Departure'} : </span>
                          <span className='user-info-text'>{booking != null && booking.details.port_of_departure != '' ? booking.details.port_of_departure : ''}</span>
                        </Col>
                        {/*<Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                          <span className='user-info-heading'>  {langContent.no_of_staterooms != undefined ? langContent.no_of_staterooms :'No. of Staterooms'} : </span>
                          <span className='user-info-text'>{booking != null && booking.details.no_of_staterooms != '' ? booking.details.no_of_staterooms : ''}</span>
                        </Col>*/}
                        <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                          <span className='user-info-heading'>  {langContent.departure_date != undefined ? langContent.departure_date :'Departure Date'} : </span>
                          <span className='user-info-text'>{booking != null && booking.details.departure_date != null ? moment(booking.details.departure_date_original).format("MM/DD/YYYY") : ''}</span>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                          <span className='user-info-heading'>  {langContent.name_of_cruise != undefined ? langContent.name_of_cruise :'Name of Cruise'} : </span>
                          <span className='user-info-text'>{booking != null && booking.details.cruise_name != '' ? booking.details.cruise_name : ''}</span>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                          <span className='user-info-heading'>  {langContent.room_category != undefined ? langContent.room_category :'Room Category'} : </span>
                          <span className='user-info-text'>{booking != null && booking.package.room_category != null && booking.package.room_category != '' ? booking.room_category[lang][booking.package.room_category] : ''}</span>
                        </Col>
                        </> : ''
                      }
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>{langContent.no_of_rooms != undefined ? langContent.no_of_rooms :'No Of Rooms'}: </span>
                        <span className='user-info-text'>{ booking != null && booking.number_of_rooms != null ? booking.number_of_rooms : '' }</span>
                      </Col>
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>  {langContent.adults != undefined ? langContent.adults :'Adults'} : </span>
                        <span className='user-info-text'>{booking != null && booking.details.no_of_adults != '' ? booking.details.no_of_adults : ''}</span>
                      </Col>
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>{langContent.children != undefined ? langContent.children :'Children'} : </span>
                        <span className='user-info-text'>{booking != null && booking.details.no_of_children != '' ? booking.details.no_of_children : ''}</span>
                      </Col>
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>{langContent.juniors != undefined ? langContent.juniors :'juniors'} : </span>
                        <span className='user-info-text'>{booking != null && booking.details.no_of_juniors != '' ? booking.details.no_of_juniors : ''}</span>
                      </Col>
                      {booking != null && booking.package.package_type != 1 ? <>
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>{langContent.hotel_name != undefined ? langContent.hotel_name :'Hotel Name'}: </span>
                        <span className='user-info-text'>
                        {lang == 'en' && booking.details.hotel_name != '' ? booking.details.hotel_name : ''}
                         {lang == 'hindi' && booking.details.hotel_name_hindi != '' ? booking.details.hotel_name_hindi : ''}
                        </span>
                      </Col>
                      
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>
                        {langContent.hotel_address != undefined ? langContent.hotel_address :'Hotel Address'} :{' '}
                        </span>
                        <span className='user-info-text'>
                        {booking.details!=null &&  lang == 'hindi' && booking.details.hotel_address_hindi != undefined ? booking.details.hotel_address_hindi :'' }
                        {booking.details!=null &&  lang == 'en' && booking.details.hotel_address != undefined ? booking.details.hotel_address :'' }
                      </span>
                      </Col>
                      </> : ''}
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>
                        {langContent.confirmation != undefined ? langContent.confirmation :'Confirmation Number'} #:
                        </span>
                        <span className='user-info-text'>{booking != null && booking.confirmation_number != '' ? booking.confirmation_number : ''}</span>
                      </Col>
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>{langContent.phone_number}: </span>
                        <span className='user-info-text'>{booking != null && booking.phone_number != '' ? booking.phone_number : ''}</span>
                      </Col>
                      <Col xs={12} sm={12} md={6} lg={6} className='pad0'>
                        <span className='user-info-heading'>{langContent.status}: </span>
                        <span className='user-info-text'>{booking_status !=undefined && booking_status[lang] != undefined  && booking_status[lang][booking.status] != undefined ? booking_status[lang][booking.status] : ''}</span>
                      </Col>
                    </Row>
                  </section>
                  {/* End User info section */}
                  {/* Start Package Description box */}
                  
                  {/* End Package Description box */}
                </Col>
                <Col xs={12} md={12} lg={12} xl={4} className='pad0 mar0 textLeft booking-view-right-box'>
                  <h2>
                    <span className='pkg-cost-text'>  {langContent.package_cost != undefined ? langContent.package_cost :'Package Cost'}   </span>
                    <span className='pkg-cost'> {getCurrencySymbol(booking.package.currency_data,lang)} { booking != null && booking.package.total_amount != '' ? booking.package.total_amount : ''} /- ({langContent.paid})</span>
                  </h2>
                  <Col xs={12} xl={12} className='pad0 pkg-details-box'>
                    <img src={inr} className='img-responsive  booking-view-icon' alt='optucorp'/>
                    <span className='pkg-details-text'>  {langContent.emi_cost != undefined ? langContent.emi_cost :'Emi Cost'} </span>
                    <span className='pkg-details-cost'>{getCurrencySymbol(booking.package.currency_data,lang)} {booking != null && booking.order.emis != null ? booking.order.emis[0].amount : ''}</span>
                  </Col>
                  <Col xs={12} xl={12} className='pad0 pkg-details-box'>
                    <img src={pendingInst} className='img-responsive booking-view-icon' alt='optucorp'/>
                    <span className='pkg-details-text'>  {langContent.total_emis != undefined ? langContent.total_emis :'Total EMIs'} </span>
                    <span className='pkg-details-cost'>{booking != null && booking.order.emis != null ? booking.order.emis.length : ''}</span>
                  </Col>
                  <Col xs={12} xl={12} className='pad0 pkg-details-box'>
                    { !hideAddMore ? <>
                    <Link to={getUrl(customer)+booking.id+'/booking-edit'}>
                      {' '}
                      <Button className='pkg-customize-btn btn btn-block'>
                      {langContent.add_more != undefined ? langContent.add_more :'Add More'}  
                      </Button>
                    </Link></> : ''}
                  </Col>
                </Col>
              </Row>



                <section className="incl-full-row">
                    <Col xs={12} xl={12} className='pad0 mar0 textLeft'>
                      <h2 className='description-heading'>
                      {returnLanguageText(booking.package,lang,'title')} {langContent.includes != undefined ? langContent.includes :' Includes'} 
                        <img src={arrowIcon} className='img-responsive desp-icon' alt='optucorp'/>
                      </h2>
                      <p className='description-text'>
                        {returnLanguageText(booking.package,lang,'description')}
                      </p>
                      <hr />
                    </Col>
                    <Col xs={12} xl={12} className='pad0 mar0 textLeft'>
                      <h2 className='description-heading'>
                        <img src={inclusionIcon} className='img-responsive desp-left-icon' alt='optucorp'/>
                        {langContent.inclusion != undefined ? langContent.inclusion :'Inclusion'}    
                      </h2>
                      <p className='description-text'>
                      {returnLanguageText(booking.package,lang,'inclusion')}
                      </p>
                      <hr />
                    </Col>
                    <Col xs={12} xl={12} className='pad0 mar0 textLeft'>
                      <h2 className='description-heading'>
                        <img src={exclusionIcon} className='img-responsive desp-left-icon' alt='optucorp'/>
                        {langContent.exclusion != undefined ? langContent.exclusion :'Exclusion'}  
                      </h2>
                      <p className='description-text'>
                        {returnLanguageText(booking.package,lang,'exclusion')}
                      </p>
                      <hr />
                    </Col>
                   
   
                  </section>



            </Col>
          </Row>
        </section>
        <ViewAllImageComponent langContent={langContent} openPopup={this.state.openPopup} onClick={this.closePopup.bind(this)} uploads={booking.package.uploads}/>
      </Container>
    )

    } else {
          return '';
    }
  }

}
export default connect(mapStateToProps, mapDispatchToProps)((BookingViewComponent));