import React from 'react'
import ReactDOM from 'react-dom'
import styles from '../../Style.css'
import classNames from 'classnames'
import DatePicker from 'react-datepicker'
import { Row, Col, Form, Button, Table, Modal, Spinner} from 'react-bootstrap'
import smallArrowLeft from '../../image/smallArrowLeft.png'
import { Link } from 'react-router-dom'
import paymentCard from '../../image/paymentCard.png'
import duration from '../../image/duration.svg'
import calender from '../../image/calendar.svg'
import cardIcon from '../../image/card.svg'
import family from '../../image/family.png'
import arrowIcon from '../../image/right.png'
import inr from '../../image/rupee.png'
import pendingInst from '../../image/duration.svg'
import connect from 'react-redux/es/connect/connect'
import { ToastContainer, toast } from 'react-toastify';
import { requestForBooking, toggleRequestForBookingInfo } from '../../actions/BookingAction';
import { handleChangeCardOnShowOrder, handleChangeScheduleDateShowOrder, handleChangeFrequencyShowOrder, cancelOrder, handleChangeCancelReason, changeFlag, getOrder, changePopupState} from '../../actions/OrderAction';
import { addCard, handleInputCardChange } from '../../actions/AuthAction';
import { getHotelStart, getPendingOrderEMis,returnLanguageText,getCurrencySymbol,totalEMI,getUrl} from "../../constants";
import moment from 'moment';
const mapStateToProps = (state) => {
  return {
    order: state.Order.order,
    form: state.Order.form,
    errors: state.Auth.errors,
    orderErrors: state.Order.errors,
    cards: state.Auth.user.cards,
    isPending: state.Order.isPending,
    authIsPending: state.Auth.isPending,
    disable_btn: state.Order.disableSubmitBtn,
    frequency: state.Order.frequency,
    emi_cost: state.Order.emi_cost,
    flagView: state.Order.flagView,
    openPopup: state.Order.openPopup,
    isCancelled: state.Order.isCancelled,
    langContent: state.Lang.langContent,
    lang: state.Lang.lang,
    session: state.session,
    auth: state.Auth,
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    getOrder: (id) => dispatch(getOrder(id)),
    addCard: (props) => dispatch(addCard(props)),
    handleInputCardChange: (data) => dispatch(handleInputCardChange(data)),
    handleChangeCardOnShowOrder: (data) => dispatch(handleChangeCardOnShowOrder(data)),
    handleChangeScheduleDateShowOrder: (data) => dispatch(handleChangeScheduleDateShowOrder(data)),
    handleChangeFrequencyShowOrder: (data) => dispatch(handleChangeFrequencyShowOrder(data)),
    handleChangeCancelReason: (data) => dispatch(handleChangeCancelReason(data)),
    cancelOrder: () => dispatch(cancelOrder(props)),
    changeFlag: (data) => dispatch(changeFlag(data)),
    changePopupState: (data) => dispatch(changePopupState(data)),
    requestForBooking: (form) => dispatch(requestForBooking(form, props)),
    toggleRequestForBookingInfo: (action) => dispatch(toggleRequestForBookingInfo(action, props)),
  }
}
class OrderComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      accept_declaimer: 0,
      show_order_tab: false,
      btn_disable: true,
      showOrder: false,
      frequencyBody: false,
      scheduleDateBody: false,
      cancellationBody: false,
      readMore: false,
      order_id: null,
      selected_frequency: '',
      selected_scheduled_date: '',
      scheduleDate: '',
      errors: {},
      requestForBookingPopup: false,
      packageType: null,
      requestForBookingErrors: {},
    }
  }
  componentWillMount() {
    let id = undefined;
    if (this.props.match.params.order_id != undefined) {
      id = this.props.match.params.order_id;
      this.setState({ order_id: id});
      this.props.changeFlag('order');
    } else {
      id = this.props.match.params.package_id;
    }
    this.props.getOrder(id);
    this.props.form.package_id = id;

  }

  componentDidMount() {
    if (this.props.match.params.order_id != undefined) {
     this.setState({ showOrder:true });
    }
  }
  orderShow = (flagView) => {
    if (flagView == 'payment') {
      this.setState({show_order_tab: false});
    }
    this.props.handleInputCardChange({ flagView: flagView });
  }
  openPopup = (type) => {
    if (type == 'change_frequency') {
      this.setState({frequencyBody: true, scheduleDateBody: false, cancellationBody: false, readMore: false});
    } else if (type == 'change_schedule_date') {
      this.setState({frequencyBody: false, scheduleDateBody: true, cancellationBody: false, readMore: false});
    } else if (type == 'read_more') {
      this.setState({frequencyBody: false, scheduleDateBody: false, cancellationBody: false, readMore: true});
    } else {
      this.setState({frequencyBody: false, scheduleDateBody: false, cancellationBody: true, readMore: false});
    }
    this.props.changePopupState(true);
  }
  handleChange = (scheduleDate) => {
    let requestForBookingErrors = {...this.state.requestForBookingErrors};
    let scheduledDate = moment(scheduleDate).toDate();
    this.setState({selected_scheduled_date: moment(scheduleDate).format('YYYY-MM-DD'), requestForBookingErrors, scheduledDate});
  }
  closePopup = () => {
    this.props.changePopupState(false);
  }
  closeRequestBookingPopup = () => {
    let requestForBookingErrors = {};
    this.setState({ requestForBookingPopup: false, requestForBookingErrors })
  }
  handleInputChange = (event) => {
    this.props.handleInputCardChange({ [event.target.name]: event.target.value });
  }
  handleChangeScheduleDate = (event) => {
    this.setState({selected_scheduled_date: event.target.value});
  }
  handleChangeFrequency = (event) => {
    this.setState({selected_frequency: event.target.value});
  }
  handleChangeCancelReason = (event) => {
    this.props.handleChangeCancelReason({ [event.target.name]: event.target.value });
  }
  handleChangeCardOnShowOrder = (event) => {
    if (event.target.name == 'card_id' && event.target.value != '') {
      this.setState({ show_order_tab: true })
    }
    //this.props.handleChangeCardOnShowOrder({ [event.target.name]: event.target.value });
    this.props.handleChangeCardOnShowOrder({card_id: event.target.value, order_id: this.state.order_id});
  }

  submitChange = () => {
    if (this.state.frequencyBody) {
      this.props.handleChangeFrequencyShowOrder({package_frequency: this.state.selected_frequency, order_id: this.state.order_id});
    } else if (this.state.scheduleDateBody) {
      this.props.handleChangeScheduleDateShowOrder({scheduled_date: this.state.selected_scheduled_date, order_id: this.state.order_id});
    }
    this.setState({openPopup: false});
  }
  openCheckInOutPopup = () => {
    this.props.toggleRequestForBookingInfo(true);
    //this.setState({ requestForBookingPopup: true, formFields, packageType });
  }
  closeAdditionalRequestPopup = (action) => {
    this.props.toggleRequestForBooking(action);
  }
  render () {
    const { addCard, errors, submitOrder, cards, orderErrors, isPending, disable_btn, auth,
        cancelOrder, frequency, emi_cost, authFlagView, authIsPending, flagView, order, openPopup, isCancelled,langContent,lang, changeFlag } = this.props;
    const { frequencyBody, scheduleDateBody, cancellationBody, readMore,} = this.state;
    if (order.package == null) {
      return '';
    }
    return (
      <Row className='width100 comman-wrapper'>
        <Col xs={12} xl={12} lg={12} className='pad50 textLeft cstm-order-details-box'>
          <h2 className='ordr-dtls-head' onClick={this.props.history.goBack}>
            <i className='fa-chevron-left fa m-r-20' />
            {returnLanguageText(order.package,lang,'title')}

          </h2>
          <br clear='all' />
          <Row className='width100 odr-dtls-box'>
            <Col xs={12} xl={12} className='order-dtls-tab-box'>
              { flagView == 'payment-option' ?
                  <p className={ flagView == 'payment' ? 'ordr-dtls-tab-text-active' : 'ordr-dtls-tab-text pay-option-txt' }
                     onClick={changeFlag.bind(this, 'payment-option')}>
                    {langContent.payment_option != undefined ? langContent.payment_option : ' Payment Option'}
                  </p> : ''
              }
              { this.state.show_order_tab || this.props.match.params.order_id != undefined ?
                  <p className={ flagView == 'order' ? 'ordr-dtls-tab-text-active order-dtl-txt' : 'ordr-dtls-tab-text order-dtl-txt' }
                     onClick={changeFlag.bind(this, 'order')}
                  >   {langContent.order_details != undefined ? langContent.order_details :'Order Details'}
                  </p> : ''
              }
            </Col>
            {/* Start Payment Option  */}
            { flagView == 'payment-option'? (
                <>
                <Row  className='payment-card-wrapper width100'>
                  <Col className="custom-pad0" xs={12} md={6} lg={6}>
                    { cards != null ? Object.keys(cards).map((card, index) => {
                      return <>
                      <Col className="payment-opt-wrapper">

                        <Form.Check
                            className="card-info clearfix"
                            label={'**** **** **** '+cards[card].number.slice(cards[card].number.length - 4)}
                            type="radio"
                            name="card_id"
                            value={cards[card].id}
                            id={"formHorizontalRadios"+index}
                            onChange={this.handleChangeCardOnShowOrder.bind(this)}
                        />

                        <Col className="select-txt">
                          <p>{langContent.select_card != undefined ? langContent.select_card :'Select Card'} </p>
                        </Col>

                      </Col>
                      </>;
                    }) : 

                    <Col xs={6} sm={6} md={6} lg={6} className="error-wrapper">

                        <h2 className='odr-dtls-no-info'>   {langContent.no_info_available != undefined ? langContent.no_info_available :'No Info Available '}  </h2>

                      </Col>

                  }

                    {<h2 className='odr-dtls-add-card' onClick={changeFlag.bind(this, 'add-card')}>  {langContent.add_new_card != undefined ? langContent.add_new_card :'+ Add New Card'} </h2>}
                  </Col>
                  <Col xs={12} md={6} lg={6}>
                    <img src={paymentCard} className='img-responsive ordr-pymy-img'/>
                  </Col>
                </Row>
                </>
            ) : (
                ''
            )}
            {/* End Start Payment Option  */}
            {/* Start Add Card details */}
            {flagView == 'add-card' ? (
              <>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className='add-card-box'>
                  <h2>   {langContent.fill_card_details != undefined ? langContent.fill_card_details :'Fill Card Details'}  </h2>
                  <Form className='pad20'>
                    <Form.Group>
                     <Col className ="card-name-wrapper">
                       <span className='card-name'>  {langContent.debit_card != undefined ? langContent.debit_card :'Debit Card'} </span>
                       <Form.Check type='radio' name='type' value = "1" inline onChange={this.handleInputChange.bind(this)} isInvalid={errors.card_error != undefined && !!errors.card_error.type}/>
                      </Col>
                    <Col className ="card-name-wrapper">
                      <span className='card-name'>  {langContent.credit_card != undefined ? langContent.credit_card :'Credit Card'} </span>
                      <Form.Check type='radio' label='' name='type' value = "2" inline onChange={this.handleInputChange.bind(this)} isInvalid={errors.card_error != undefined && !!errors.card_error.type}/>
                    </Col>
                    <Form.Control.Feedback type='invalid'>
                      {errors.card_error != undefined && errors.card_error.type != undefined ?  errors.card_error.type : ''}
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Row xs={12} xl={12} className='width100 add-card-input-box'>
                      <Col xs={12} sm={12} lg={6} md={6} xl={6} className='p-l-0'>
                        <Form.Group>
                        <Form.Control type='text' placeholder=  {langContent.card_no != undefined ? langContent.card_no :'Card No.'}  className='card-input' name="card_number" onChange={this.handleInputChange.bind(this)} isInvalid={errors.card_error != undefined && !!errors.card_error.card_number}/>
                          <Form.Control.Feedback type='invalid'>
                            {errors.card_error != undefined && errors.card_error.card_number != undefined ?  errors.card_error.card_number : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={12} lg={6} md={6} xl={6} className='p-l-0'>
                        <Form.Group>
                          <Form.Control type='date' placeholder=  {langContent.expiry_month != undefined ? langContent.expiry_month :'Expiry mm/yy'} className='card-input cstmDate' name="expiry_date" onChange={this.handleInputChange.bind(this)} isInvalid={errors.card_error != undefined && errors.card_error != null && !!errors.card_error.expiry_date}/>
                          <Form.Control.Feedback type='invalid'>
                            {errors.card_error != undefined && errors.card_error.expiry_date != undefined ?  errors.card_error.expiry_date : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={12} lg={6} md={6} xl={6} className='p-l-0'>
                        <Form.Group>
                          <Form.Control type='text' placeholder=  {langContent.name_on_card != undefined ? langContent.name_on_card : 'Name On Card' }className='card-input' name="holder_name" onChange={this.handleInputChange.bind(this)} isInvalid={errors.card_error != undefined && errors.card_error != null && !!errors.card_error.holder_name}/>
                          <Form.Control.Feedback type='invalid'>
                            {errors.card_error != undefined && errors.card_error.holder_name != undefined ?  errors.card_error.holder_name : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={12} lg={6} md={6} xl={6} className='p-l-0'>
                        <Form.Group>
                          <Form.Control type='text' placeholder=  {langContent.cvv != undefined ? langContent.cvv :'CVV'}  className='card-input' name="cvv" onChange={this.handleInputChange.bind(this)} isInvalid={errors.signup != undefined && !!errors.signup.cvv}/>
                          <Form.Control.Feedback type='invalid'>
                            {errors.card_error != undefined && errors.card_error.cvv != undefined ?  errors.card_error.cvv : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={12} lg={12} md={12} xl={12} className='p-l-0'>
                        <Form.Group>
                          <Button type='button' className='add-card-sbmt-btn btn btn-block' onClick={ addCard.bind(this) }>
                            {authIsPending ? <>
                            <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>   {langContent.submit != undefined ? langContent.submit :'Submit'} 
                            </> : 'Submit'}
                          </Button>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </>
            ) : (
              ''
            )}
            {/* End Card Details */}

            {/*  Start Order Details Box */}
            {flagView == 'order' || authFlagView == 'order' ? (
              <>
                <Row xs={12} lg={12} xl={12} className='width100 ordr-inr-dtls-box'>
                  <Col xs={12} md={12} lg={12} xl={7} className='ordr-lft-dtls-box' >
                    <h2>{returnLanguageText(order.package,lang,'title')}</h2>
                    <br clear='all' />
                    <Row>
                      <Col xs={12} sm={6} lg={6} xl={5} className='m-b-30 pl-0'>
                        <span className='htl-cat-text'> 
                        {order.package.package_type !== 1 ? <>{langContent.hotel_category != undefined ? langContent.hotel_category :' '}</> : <>
                          {langContent.room_category != undefined ? langContent.room_category :'Room Category'} 
                        </>}
                        </span>
                        <span className='htl-rate-star'>
                        {order.package.package_type !== 1 ? <>
                          { typeof order.package.hotel_type == 'string' ? order.package.hotel_type : (<>
                              { getHotelStart(order.package.hotel_type).map((hType, i) => {
                                return <i className="fa fa-star" aria-hidden="true" key={i}></i>;
                              }) }
                              </>)}
                           </> :  <>
                             { order.package != null ? order.room_category[lang][order.package.room_category] : ''}
                          </>}

                        </span>
                      </Col>
                      <Col xs={12} sm={6} lg={6} xl={6} className='m-b-30 pl-0-res'>
                        {order.package!= null ? order.package.themes.map(theme=> {
                          return <span className='ordr-dtl-tag-btn'>{lang =='hindi' ? theme.hindi_name : theme.name}</span>;
                        }) : ''}
                      </Col>
                      <Col xs={12} sm={6} lg={6} xl={4} className='m-b-30 pl-0'>
                        <img src={calender} class='img responsive ordr-dtls-tym-img duration-icon'/>
                        <span className='ordr-dtls-day-txt'>
                          { order.package!= null && order.package.days != null ? order.package.days+langContent.days != undefined ? langContent.days :'Days' : '' } { order.package!= null && order.package.nights != null ? ', '+ order.package.nights+ langContent.night != undefined ? langContent.night : ' Nights' : '' }
                        </span>
                      </Col>
                      <Col xs={12} sm={6} lg={6} xl={6} className='m-b-30'>
                        <img
                          src={family}
                          class='img responsive ordr-dtls-tym-img family-icon'
                        />
                        <span className='ordr-dtls-day-txt'>
                          { order.package!= null && order.package.adults != null ? order.package.adults+' '+langContent.adults +' ' : '' }
                          { order.package!= null && order.package.children != null ? ', '+order.package.children+' '+langContent.children+' ' : '' }
                          { order.package!= null && order.package.juniors != null ? ', '+order.package.juniors+' '+langContent.juniors+' ' : '' }
                        </span>
                      </Col>
                      <br clear='all' />
                      <Col xs={12} xl={12} className='pkg-des-box pl-0'>
                        <h2 className='pkg-incd-txt'>
                        {langContent.package_include != undefined ? langContent.package_include :'Package Include'} 
                          <img
                            src={arrowIcon}
                            className='img-responsive pkg-arrow-icon'
                          />
                        </h2>
                        <p className='pkg-des-txt'>
                          { order.package!= null && order.package.description != null ?  returnLanguageText(order.package,lang,'description') : '' }
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={12} lg={12} xl={5} className='pkg-rgt-box'>
                    <span className='lft-pkg-cost-txt'>      {langContent.package_cost != undefined ? langContent.package_cost :'Package Cost'}  </span>
                    <span className='lft-pkg-cost'>{order.package != null ? getCurrencySymbol(order.package,lang) : ''} {order.package != null ? order.package.total_amount : ''}/-</span>
                    <Table responsive className='order-dtls-table'>
                      <tbody>
                        <tr>
                          <td>
                            <img
                              src={inr}
                              className='img-responsive ordr-inr-icon'
                            />
                          </td>
                          <td>
                            <span className='emi-txt'>{langContent.emi_cost != undefined ? langContent.emi_cost :'EMI Cost'} :</span>
                          </td>
                          <td>
                            <span className='emi-amt-txt'>{order.package != null && order.package.currency_data != null ? getCurrencySymbol(order.package.currency_data.currency_code,lang) : ''} { getPendingOrderEMis(order.emis).emi_cost }</span>
                          </td>
                          <td />
                        </tr>
                        <tr>
                          <td>
                            <img src={pendingInst} className='img-responsive ordr-inr-icon'/>
                          </td>
                          <td>
                            <span className='emi-txt'>{langContent.total_emis != undefined ? langContent.total_emis :'Total EMIs'} :</span>
                          </td>
                          <td>
                            <span className='emi-amt-txt'>
                              {totalEMI(order.payment_cycle,lang)}
                             
                            </span>
                          </td>
                            <td>
                            <span className='chnge-fqncy-txt cursor' onClick={this.openPopup.bind(this, 'change_frequency')}>
                            {langContent.change_frequency != undefined ? langContent.change_frequency :'Change Frequency'} 
                            </span>
                            </td>
                        </tr>
                        <tr>
                          <td>
                            <img src={duration} className='img-responsive ordr-inr-icon'/>
                          </td>
                          <td>
                            <span className='emi-txt'> {langContent.schedule_date != undefined ? langContent.schedule_date :'Schedule Date'}:</span>
                          </td>
                          <td>
                            <span className='emi-amt-txt'>{moment(order.schedule_date).format("DD/MM/YYYY")}</span>
                          </td>
                          <td>
                              <span className='chnge-fqncy-txt cursor'
                                    onClick={this.openPopup.bind(this, 'change_schedule_date')}>{langContent.change_date != undefined ? langContent.change_date :'Change Date'} </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img src={cardIcon} className='img-responsive ordr-inr-icon'/>
                          </td>
                          <td>
                            <span className='emi-txt'>{langContent.payment_method != undefined ? langContent.payment_method :'Payment Method'} :</span>
                          </td>
                          <td>
                           {order.card != undefined && order.card.number != undefined ? 
                            <span className='emi-amt-txt'>
                              **** **** **** {order.card.number.substr(order.card.number.length - 4)}
                            </span>
                            :''}
                          </td>
                          <td>
                            <span className='chnge-fqncy-txt cursor'
                                  onClick={changeFlag.bind(this, 'payment-option')}>   {langContent.change != undefined ? langContent.change :'Change'}  </span>
                          </td>
                        </tr>
                         {/*  there is 2 option one is buy packake and one is after buy package is uncomment when developer implement this module */}
                        { this.props.match.params.package_id != undefined ? <>
                        <tr>
                          <td>
                              <Form.Group controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" name ="accept_declaimer" isInvalid={ orderErrors.orderValidations != undefined && orderErrors.orderValidations != 1 && !!orderErrors.orderValidations.accept_declaimer } onChange={ this.handleChangeCard.bind(this) } value={this.state.accept_declaimer} checked = {this.state.accept_declaimer == 1 ? true : false} />
                                <Form.Control.Feedback type='invalid'>
                                  { this.state.accept_declaimer == 0 && orderErrors.orderValidations != undefined && orderErrors.orderValidations.accept_declaimer != 1 ?  orderErrors.orderValidations.accept_declaimer : '' }
                                </Form.Control.Feedback>
                              </Form.Group>
                          </td>
                          <td colspan='2'>
                            <span className='emi-txt'>{langContent.accept_disclaimer != undefined ? langContent.accept_disclaimer :'Accept Disclaimer'} </span>
                          </td>
                          <td>
                            <span className='chnge-fqncy-txt' onClick= {this.openPopup.bind(this, 'read_more')}> {langContent.read_more != undefined ? langContent.read_more :'Read More'} </span>
                          </td>
                        </tr>
                        </> : ''}
                        <tr>
                          <td colSpan= {order.status != 4 && order.status != 5 && order.reservation == null ? '2' : '3'} />
                          {order.status != 4 && order.status != 5 && order.reservation == null ?
                          <td>
                            <Link to={getUrl(auth.customer)+order.id+'/create-booking'}><p className='btn btn-primary request-booking-txt'>  { langContent.request_for_booking != undefined ? langContent.request_for_booking :'Request For Booking' } </p></Link>
                          </td>: ''}
                        { isCancelled ? <>
                          <td>
                            <span
                              className='btn btn-danger cncl-order-text' onClick={this.openPopup.bind(this, 'cancel_order')}> {langContent.cancel_order != undefined ? langContent.cancel_order :'Cancel Order'} </span>
                          </td>
                        </> : ''}</tr>
                      </tbody>
                    </Table>
                    { this.props.match.params.package_id != undefined ? <Button className='btn btn-block ordr-buy-btn' onClick={ submitOrder.bind(this) } disabled={disable_btn}>
                      {isPending ? <>
                      <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                      /> {langContent.buy_now != undefined ? langContent.buy_now :'Buy Now'} 
                      </> : langContent.buy_now != undefined ? langContent.buy_now :'Buy Now'}

                    </Button> : ''}
                  </Col>
                  {/* Cancel Order Popup */}
                  <Modal className="custom-model-size" size='lg' show={openPopup} aria-labelledby='example-modal-sizes-title-lg'>
                    <Modal.Header className='scdl-popup-header cancel-popup-hdr'>
                      <i className='fa fa-times pop-close-icon' onClick={this.closePopup.bind(this)}/>
                    </Modal.Header>
                    <Modal.Body className='pad32 order-cancel-popup'>
                      <h2 className='schdle-pop-heading text-center custom-hdr-padding'>
                        { cancellationBody ? langContent.reason_for_cancellation != undefined ? langContent.reason_for_cancellation :'Enter your reason for cancellation' : frequencyBody ? langContent.select_frequency != undefined ? langContent.select_frequency :'Select frequency' : scheduleDateBody  ? langContent.select_schedule_date != undefined ? langContent.select_schedule_date :'Select schedule date' : readMore ? 'Lorem ipsum' : ''}
                      </h2>
                      <Form>
                        <Form.Group>
                          { scheduleDateBody ?
                              <Form className="calendar-form">
                                <Form.Group controlId="exampleForm.ControlSelect1" className='m-b-30 custom-date-width'>
                                  <DatePicker
                                      selected={this.state.scheduledDate}
                                      name='scheduled_date'
                                      onChange={this.handleChange}
                                      className='card-input cstmDate'
                                      placeholderText={langContent.scheduledDate != undefined ? langContent.scheduledDate :'Scheduled Date' }
                                      isInvalid={errors != undefined && errors != null && !!errors.scheduled_date}
                                  />
                                  <Form.Control.Feedback type='invalid'>
                                    {errors != undefined && errors != null && errors.scheduled_date != null ?  errors.scheduled_date : ''}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Form>
                              : ''
                          }
                          { cancellationBody ?
                            <Form.Control as='textarea' name ="reason_for_cancellation" rows='3' placeholder={langContent.type_reason_here != undefined ? langContent.type_reason_here :'Type Your Reason Here'} className="cncl-textarea-text  m-b-30" onChange={this.handleChangeCancelReason.bind(this)}/>
                              : ''
                          }
                          {
                            readMore ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' : ''
                          }
                          {
                            frequencyBody ?
                                <>
                                {lang =='hindi' ?
                                    <Form.Control as="select"  name="package_frequency" className="mar30" placeholder=  {langContent.payment_frequency != undefined ? langContent.payment_frequency :'Payment Frequency'}  defaultValue='' onChange={this.handleChangeFrequency.bind(this)}>
                                      <option value=''>{langContent.payment_frequency != undefined ? langContent.payment_frequency :'Payment Frequency..'}</option>
                                      { Object.keys(order.package.payment_cycle_hindi).map(payment_cycle=> {
                                        return <option key={payment_cycle} value={payment_cycle} >{order.package.payment_cycle_hindi[payment_cycle]}</option>;
                                      }) }
                                    </Form.Control>
                                    :
                                    <Form.Control as="select"  name="package_frequency" className="mar30" placeholder=  {langContent.payment_frequency != undefined ? langContent.payment_frequency :'Payment Frequency'}  defaultValue='' onChange={this.handleChangeFrequency.bind(this)}>
                                      <option value=''>{langContent.payment_frequency != undefined ? langContent.payment_frequency :'Payment Frequency..'}</option>
                                      { Object.keys(order.package.payment_cycle).map(payment_cycle=> {
                                        return <option key={payment_cycle} value={payment_cycle} >{order.package.payment_cycle[payment_cycle]}</option>;
                                      }) }
                                    </Form.Control>
                                }
                                </> : ''
                          }
                        </Form.Group>
                        <Row className="dummy-txt-wrapper">
                          {
                            scheduleDateBody || frequencyBody ? <><Button className='btn btn-block order-cncl-btn' onClick={this.closePopup.bind(this)}>  {langContent.cancel != undefined ? langContent.cancel :'Cancel'}   </Button>
                            <Button type="button" className='btn btn-block order-submit-btn' onClick={this.submitChange.bind(this)}>   {langContent.submit != undefined ? langContent.submit :'Submit'}  </Button></> : ''
                          }
                          {
                          cancellationBody ? <>
                          <Button className='btn btn-block order-cncl-btn' onClick={this.closePopup.bind(this)}> {langContent.cancel != undefined ? langContent.cancel :'Cancel'} </Button>
                          <Button type="button" className='btn btn-block order-submit-btn' onClick={ cancelOrder.bind(this) }> { isPending ? <>
                          <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                          {langContent.submit != undefined ? langContent.submit : 'Submit'}
                          </> : langContent.submit != undefined ? langContent.submit :'Submit'} </Button> </> : ''}
                          {
                            //readMore ? <><Button className='btn btn-block order-cncl-btn' onClick={this.closePopup.bind(this)}>{langContent.close != undefined ? langContent.close :'Close'}  </Button></> : ''
                          }
                        </Row>
                      </Form>
                    </Modal.Body>
                  </Modal>
                  {/* end cancel order Popup  */}

                  {/* request for order booking */}
                </Row>
              </>
            ) : (
              ''
            )}
            {/* End Order Details Box */}
          </Row>
        </Col>
      </Row>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderComponent)