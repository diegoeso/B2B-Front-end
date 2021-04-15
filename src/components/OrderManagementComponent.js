import React from 'react'
import ReactDOM from 'react-dom'
import styles from '../Style.css'
import classNames from 'classnames'
import { Row, Col, Modal, Table, Button} from 'react-bootstrap'
import romantic from '../image/romantic.png'
import inr from '../image/rupee.svg'
import duration from '../image/calendar.svg'
import noimage from '../image/no-image.jpeg'
import pendingInst from '../image/duration.svg'
import Form from 'react-bootstrap/Form'
import { Link } from 'react-router-dom'
import filter from '../image/filter.png'
import { myOrders } from '../actions/OrderAction';
import { requestForBooking, toggleRequestForBookingInfo } from '../actions/BookingAction';
import connect from 'react-redux/es/connect/connect'
import RequestForBookingComponent from './booking/RequestForBookingComponent'
import { changeBookingDate } from '../validations/order';
import { getPendingOrderEMis, getUrl, getPaymentCycleName,returnLanguageText,getCurrencySymbol} from "../constants";
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
const mapStateToProps = (state) => {
  return {
    orders: state.Order.my_orders.orders,
    emi_status: state.Order.my_orders.emi_status,
    order_status: state.Order.my_orders.order_status,
    auth: state.Auth,
    langContent: state.Lang.langContent,
    lang: state.Lang.lang,
    customer: state.Auth.customer,
    session: state.session,
    additionalRequestPopup: state.Booking.request_for_booking,
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    myOrders: (status) => dispatch(myOrders(status)),
    requestForBooking: (form) => dispatch(requestForBooking(form, props)),
    toggleRequestForBookingInfo: (action) => dispatch(toggleRequestForBookingInfo(action, props)),
  }
}
class OrderManagementComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      openPopup: false,
      emis:{},
      title: '',
      card_number: '',
      openCheckInOutPopup: false,
      errors:{},
      currentOrder:{},
      packageType: null,
    }
  }
  openCheckInOutPopup = (currentOrder) => {
    this.props.toggleRequestForBookingInfo(true);
    this.setState({ currentOrder });
  }
  openEmiPopup = (order) => {
    this.setState({ currentOrder:order, openPopup: true});
  }
  closePopup = () => {
    let errors = {};
    this.setState({ openPopup: false, openCheckInOutPopup: false, errors })
  }
  handleCheckInOutDate = () => {
    this.setState({ openPopup: false })
  }
  componentDidMount() {
    this.props.myOrders('');
  }
  handleFilterOrder = (event) => {
        let status = event.target.value;
        this.props.myOrders(status);
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
    const { orders, auth, emi_status, order_status,langContent,lang,customer} = this.props;
    const { title, errors, currentOrder} = this.state;
    
    return (
      <Row className='width100 comman-wrapper order-listing-wrapper'>
        <Col xs={12} lg={12} xl={12} className='pad55 mob-pad20 m-t-65 booking-wrapper'>
        <h2 className='cstm-left-heading'>  {langContent.order_management != undefined ? langContent.order_management :'Order Management'} </h2>
              
        <h2 className='cstm-right-heading'>
          <Form.Group controlId="exampleForm.ControlSelect1" className="order-select">
          <i class="fa fa-angle-down fa-3" aria-hidden="true"></i>
          <Form.Control as="select" className="custom-filter-img" name="package_frequency" placeholder="Filter Orders" onChange={this.handleFilterOrder}>
            <img src={filter} class='img-responsive icon-filter' alt='optucorp' />
              <option value=''>  {langContent.all_orders != undefined ? langContent.all_orders :'All Orders'} </option>
            { order_status != null && order_status[lang] != undefined && Object.keys(order_status[lang]).map(status=> {
            if (status == 3 || status == 4 || status == 5) {
            return <option key={status} value={status}>{order_status[lang][status]}</option>;
            }
            }) }
            </Form.Control>
            </Form.Group>
        </h2>

          { orders != null && orders != undefined && orders.length > 0 ? orders.map(order=> {
            var data = getPendingOrderEMis(order.emis);
            var manageOrderLink = getUrl(auth.customer)+order.id+'/order-details';
            var createBooking = getUrl(auth.customer)+order.id+'/create-booking';
            var thumbnail = order.package.uploads != undefined && order.package.uploads != null && order.package.uploads.length > 0 && order.package.uploads[0].thumbnail_url != undefined ? order.package.uploads[0].thumbnail_url : noimage;
            return <><Col xs={12} sm={12} xl={12} className='row cstm-order-box cust-flt-mar animation'>

            <Col xs={12} md={4} lg={3} sm={12} xl={4} className='pad0'>
              {this.getthumnelOfimage(order.package.uploads,'img-responsive cstm-order-img')}
            </Col>
            <Col xs={12} md={8} lg={9} sm={12} xl={8} className='pad10'>
              <Row>
                <Col xs={12} sm={12} md={12} lg={9} xl={9}>
                  <h2 className='cstm-order-info-heading'>
                    {returnLanguageText(order.package,lang,'title')} : {getCurrencySymbol(order.package.currency_data.currency_code,lang)} { order.total_amount != null ? order.total_amount : order.package != null ? order.package.total_amount : '' } ({data.paid} {langContent.paid}{data.refunded != 0 ? ', '+data.refunded+' '+langContent.refunded: ''})
                  </h2>
                  <Col xs={12} xl={12} className='row textLeft m-t-30 pad0'>
                    <Col xs={12} sm={12} md={12} lg={6} className='m-b-20 pad0'>
                      <img src={inr} className='img-responsive cstm-order-icon'/>
                      <span className='cstm-order-info-text'>   {langContent.emi_cost != undefined ? langContent.emi_cost :'EMI Cost'}  </span>
                      <span className='cstm-order-info-text main-dark-info'> {getCurrencySymbol(order.package.currency_data.currency_code,lang)} {data.emi_cost}{getPaymentCycleName(order.payment_cycle,lang)} </span>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6} className='m-b-20 pad0'>
                      <img src={duration} className='img-responsive cstm-order-icon'/>
                      <span className='cstm-order-info-text'>   {langContent.schedule_date != undefined ? langContent.schedule_date :'Schedule Date'} </span>
                      <span className='cstm-order-info-text main-dark-info'> { moment(order.schedule_date).format("MM/DD/YYYY") } </span>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6} className='m-b-20 pad0'>
                      <img
                        src={pendingInst}
                        className='img-responsive cstm-order-icon'
                      />
                      <span className='cstm-order-info-text'>
                      {langContent.pending_installment != undefined ? langContent.pending_installment :'Pending Installment'}      
                      </span>
                      <span className='cstm-order-info-text main-dark-info'>{ data.pending }</span>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6} className='m-b-20 pad0'>
                      <img src={pendingInst} className='img-responsive cstm-order-icon'/>
                        <span className='cstm-order-info-text'>
                        {langContent.total_installment != undefined ? langContent.total_installment :'Total Installment'} 
                        </span>
                      <span className='cstm-order-info-text main-dark-info'>{ order.emis.length }</span>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6} className='pad0 mar-minus-20'>
                      <img src={pendingInst} className='img-responsive cstm-order-icon'/>
                      <span className='cstm-order-info-text'>
                      {langContent.status != undefined ? langContent.status :'Status'}    
                      </span>
                      {
                        order.status != 4 && order.status != 5 ? <span className='cstm-order-info-text order-status'>{ order_status[lang] !=undefined && order_status[lang][order.status] != undefined ? order_status[lang][order.status] : ''}</span> :
                            <span className='cstm-order-info-text order-cancallation'>{  order_status[lang] !=undefined && order_status[lang][order.status] != undefined ? order_status[lang][order.status] :'' }</span>
                      }
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6} className='pad0'>
                      {order.status != 4 && order.status != 5 && order.reservation == null ? <Link to={createBooking}><p className='order-right-text'>  { langContent.request_for_booking != undefined ? langContent.request_for_booking :'Request For Booking' } </p></Link> : '' }
                    </Col>
                  </Col>
                </Col>
                <Col xs={12} md={12} lg={3} xl={3} className='order-right-box'>
                  <p className='order-right-text payment-sch-txt' onClick={this.openEmiPopup.bind(this, order)}>
                  {langContent.view_payment_schedule != undefined ? langContent.view_payment_schedule :'View Payment Schedule'}   
                  </p>
                  { order.status != 4 && order.status != 5 ? <Link to={manageOrderLink}><p className='order-right-text'>  {langContent.manage_order != undefined ? langContent.manage_order :'Manage Order'} </p></Link> : ''}
                  
                  { order.status != 4 && order.status != 5 && order.booking !=undefined  ? <Link to={getUrl(customer)+order.booking.id+'/booking-edit'}> <p className='order-right-text'>  {langContent.manage_booking != undefined ? langContent.manage_booking :'Manage Booking'} </p></Link>: '' }
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

        {/*  Start Payment Schedule Popup */}

        <Modal className="emi-schedule" size='lg' show={this.state.openPopup} aria-labelledby='example-modal-sizes-title-lg'>
          <Modal.Header className='scdl-popup-header'>
            <i className='fa fa-times pop-close-icon' onClick={this.closePopup.bind(this)}/>
          </Modal.Header>
          {currentOrder !=undefined && Object.keys(currentOrder).length >0 ? 
          <Modal.Body className='pad25'>
            <h2 className='schdle-pop-heading emi-popup-title'>
              {returnLanguageText(currentOrder.package,lang,'title')}   {langContent.emi_chedule != undefined ? langContent.emi_chedule :'EMI Schedule'} 
              <i className='fa fa-chevron-right icon-chv-right' />
              <span>  {langContent.total_emis != undefined ? langContent.total_emis :'Total Emis'} : {currentOrder.emis != null ? Object.keys(currentOrder.emis).length : 0}</span>
            </h2>
            <Table responsive className='shdle-tbl'>
              <tbody>
        
              { currentOrder.emis != null ? currentOrder.emis.map((emi, index)=> {
                return <><tr>
                  <td>
                    <p className='schdle-data-heading'>{++index}   {langContent.emi != undefined ? langContent.emi :'EMI'} :</p>
                  </td>
                  <td>
                    <p className='popup-text'> {moment(emi.schedule_pay_date).format("MM/DD/YYYY")} ({(emi.status ==0 || emi.status ==7) && emi.paid_amount != null ? langContent.paid +' '+getCurrencySymbol('',lang)+' '+emi.paid_amount+ ' , ' :'' } {emi_status != undefined &&  emi_status[lang] != undefined ? emi_status[lang][emi.status] : ''} {getCurrencySymbol('',lang)} {emi.status ==0 ? emi.amount-emi.paid_amount : emi.amount })</p>
                  </td>
                  <td>
                    <p className='popup-text'>{currentOrder.card != undefined && currentOrder.card.number != undefined  ? '**** **** **** '+currentOrder.card.number.substr(currentOrder.card.number.length - 4) : ''}</p>
                  </td>
                  <td>
                    <p className='popup-text trans-txt'>{ emi.payment != null ? emi.payment.transaction_id : '' }
                    </p>
                  </td>
                </tr></>
              }) : ''}
              </tbody>
            </Table>
          </Modal.Body>
          :''}
        </Modal>
        {/*  End Payment Schedule Popup */}
      </Row>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderManagementComponent)
