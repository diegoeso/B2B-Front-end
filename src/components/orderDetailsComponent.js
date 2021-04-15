import React,{ useEffect } from 'react'
import ReactDOM from 'react-dom'
import styles from '../Style.css'
import Responsive from '../Responsive.css'
import classNames from 'classnames'
import DatePicker from 'react-datepicker'
import { Row, Col, Form, Button, Table, Modal, Spinner} from 'react-bootstrap'
import smallArrowLeft from '../image/smallArrowLeft.png'
import paymentCard from '../image/paymentCard.png'
import family from '../image/family.png'
import arrowIcon from '../image/right.svg'
import inr from '../image/inr.png'
import duration from '../image/duration.png'
import emiCalc from '../image/emiCalc.png'
import mediaIconCalendar from '../image/mediaIconCalendar.png'
import payment from '../image/payment.png'
import connect from 'react-redux/es/connect/connect'
import { getProduct } from '../actions/ProductAction';
import { submitOrder, handleChangeCard, handleChangeScheduleDate, handleChangeFrequency, cancelOrder, handleChangeCancelReason, changeFlag} from '../actions/OrderAction';
import { addCard, handleInputCardChange } from '../actions/AuthAction';
import { getHotelStart,returnLanguageText,totalEMI,getCurrencySymbol,API_URL} from "../constants";
import moment from 'moment';
import axios from 'axios';
const mapStateToProps = (state) => {
  return {
    productDetails: state.Product.productDetails,
    form: state.Order.form,
    errors: state.Auth.errors,
    orderErrors: state.Order.errors,
    cards: state.Auth.user.cards,
    user: state.Auth.user,
    isPending: state.Order.isPending,
    authIsPending: state.Auth.isPending,
    disable_btn: state.Order.disableSubmitBtn,
    card_digit: state.Order.card_digit,
    frequency: state.Order.frequency,
    emi_cost: state.Order.emi_cost,
    flagView: state.Order.flagView,
    langContent: state.Lang.langContent,
    lang: state.Lang.lang,
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    getProduct: (id) => dispatch(getProduct(id)),
    addCard: (response,props) => dispatch(addCard(response,props)),
    handleInputCardChange: (data) => dispatch(handleInputCardChange(data)),
    submitOrder: () => dispatch(submitOrder(props)),
    handleChangeCard: (data) => dispatch(handleChangeCard(data)),
    handleChangeScheduleDate: (data) => dispatch(handleChangeScheduleDate(data)),
    handleChangeFrequency: (data) => dispatch(handleChangeFrequency(data)),
    handleChangeCancelReason: (data) => dispatch(handleChangeCancelReason(data)),
    cancelOrder: () => dispatch(cancelOrder(props)),
    changeFlag: (data) => dispatch(changeFlag(data)),
  }
}
class orderDetailsComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      openPopup: false,
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
      tncPopup: false,
      scheduledDate: '',
      errors: {},
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
    this.props.getProduct(id);
    this.props.form.package_id = id;
  }

  componentDidMount() {
    if (this.props.match.params.order_id != undefined) {
     this.setState({ showOrder:true });
    }
    let tncPopup = this.state.accept_declaimer == 1 ? true : false;
    this.setState({ tncPopup });
  }
  handleSubmitOrder() {
   
      this.props.submitOrder();
  
  }

  showAccept_declaimer(){
    this.setState({ tncPopup : true });
  }

  orderShow = (flagView) => {
    if (flagView == 'payment') {
      this.setState({show_order_tab: false});
    }
    this.props.handleInputCardChange({ flagView: flagView });
    //this.setState({ flagView: vl })
  }
  openPopup = (type) => {
    if (type == 'change_frequency') {
      this.setState({frequencyBody: true, scheduleDateBody: false, cancellationBody: false, tncPopup: false});
    } else if (type == 'change_schedule_date') {
      this.setState({frequencyBody: false, scheduleDateBody: true, cancellationBody: false, tncPopup: false});
    } else if (type == 'read_more') {
      this.setState({frequencyBody: false, scheduleDateBody: false, cancellationBody: false, tncPopup: true});
    } else {
      this.setState({frequencyBody: false, scheduleDateBody: false, cancellationBody: true, tncPopup: false});
    }
    this.setState({ openPopup: true })
  }

  closePopup = () => {
    this.setState({ openPopup: false });
  }
  closeTncPopup = () => {
    this.setState({ tncPopup: false, accept_declaimer: 0 });
  }
  handleAcceptTnc = () => {
    this.props.handleChangeCard({ ['accept_declaimer']: 1 });
    this.setState({ tncPopup: false, accept_declaimer: 1 });
  }
  handleInputChange = (event) => {
    if (event.target.name == 'card_number' && event.target.value != '') {
      let maskingCard = event.target.value.split('-').join('');
      event.target.value = maskingCard.match(/.{1,4}/g).join('-');
    } else if (event.target.name == 'expiry_date') {
      event.target.value = event.target.value.replace(/^(\d\d)(\d)$/g, '$1/$2').replace(/[^\d\/]/g, '');
    }
    this.props.handleInputCardChange({ [event.target.name]: event.target.value });
  }
  handleChange = (scheduleDate) => {
    let errors = {...this.state.errors};
    let scheduledDate = moment(scheduleDate).toDate();
    this.setState({selected_scheduled_date: moment(scheduleDate).format('YYYY-MM-DD'), errors, scheduledDate});
  }
  /*handleChangeScheduleDate = (event) => {
    this.setState({selected_scheduled_date: event.target.value});
  }*/
  handleChangeFrequency = (event) => {
    this.setState({selected_frequency: event.target.value});
  }
  submitChange = () => {
    if (this.state.frequencyBody) {
      this.props.handleChangeFrequency({package_frequency: this.state.selected_frequency});
    } else if (this.state.scheduleDateBody) {
      this.props.handleChangeScheduleDate({scheduled_date: this.state.selected_scheduled_date});
    }
    this.setState({openPopup: false});
  }
  handleChangeCancelReason = (event) => {
    this.props.handleChangeCancelReason({ [event.target.name]: event.target.value });
  }
  handleChangeCard = (event) => {
    if (event.target.name == 'accept_declaimer') {
      if (event.target.value == 0)
        event.target.value = 1;
      else
        event.target.value = 0;
      this.setState({accept_declaimer:event.target.value});
    }
    if (event.target.name == 'card_id' && event.target.value != '') {
      this.setState({ show_order_tab: true })
    }
    this.props.handleChangeCard({ [event.target.name]: event.target.value });
  }



  addRazorPay = () => {
    console.log(this.props.user);
    var user = this.props.user;
    var razorpay_order_id = '';
    var paraent = this;
   
     if(user.razorpay_order_id !== null && (user.cards == undefined  || user.cards.length == 0)){
        razorpay_order_id = user.razorpay_order_id;
        paraent.openRazorPaypapup(razorpay_order_id);  
    } else {
        let authToken = user.token;
        axios.post(API_URL + '/order/create/razor-order',{customer_id:user.razorpay_customer_id}, {headers: {'Authorization': 'Bearer ' + authToken}})
        .then(function (response) {
            razorpay_order_id = response.data.order_id;
            paraent.openRazorPaypapup(razorpay_order_id); 
        });
    }
  }

  openRazorPaypapup = (razorpay_order_id) =>{
      var paraent = this;
      var user = this.props.user;
      var options = {
                       "key": "rzp_test_IryxptIqsZ4Agn",
                       "order_id": razorpay_order_id,
                       "customer_id": user.razorpay_customer_id,  //{{ customer_id }}
                       "recurring": 1,    //Important tag for charge_at_will
                       "handler": function (response) {
                        paraent.razorsetResponce(response);
                       },
                       "notes": {
                         "note_key 1": "Beam me up Scotty",
                         "note_key 2": "Tea. Earl Gray. Hot."
                       },
                       "theme": {
                         "color": "#3399cc"
                       }
                   };
         var rzp1 = new window.Razorpay(options);
        rzp1.open();
  }

  razorsetResponce = (response) =>{
         var user = this.props.user;
          let data= {
                'payment_id': response.razorpay_payment_id,
                'order_id': response.razorpay_order_id,
                'signature': response.razorpay_signature,
                'customer_id': user.razorpay_customer_id,
            };
            this.props.addCard(data);
  }




  render () {
    const { productDetails, addCard, form, errors, cards, orderErrors, isPending, disable_btn, card_digit,
        cancelOrder, frequency, emi_cost, authFlagView, authIsPending, changeFlag, flagView,langContent,lang,user} = this.props;
    var showOrder = this.state.showOrder;
    const { frequencyBody, scheduleDateBody, cancellationBody, order_id, tncPopup} = this.state;
    if (productDetails == null) {
      return '';
    }
    return (
      <Row className='width100 comman-wrapper'>
        <Col xs={12} xl={12} lg={12} className='pad50 textLeft cstm-order-details-box'>
          <h2 className='ordr-dtls-head' onClick={this.props.history.goBack}>
            <i className='fa-chevron-left fa m-r-20' />
            {productDetails != null ? returnLanguageText(productDetails,lang,'title') : ''}
       </h2>
          <br clear='all' />
          <Row className='width100 odr-dtls-box custom-tab-pad0'>
            <Col xs={12} xl={12} className='order-dtls-tab-box'>
                  <p className={ flagView == 'payment' ? 'ordr-dtls-tab-text-active' : 'ordr-dtls-tab-text pay-option-txt' }
                     onClick={changeFlag.bind(this, 'payment-option')}>
                     {langContent.payment_option != undefined ? langContent.payment_option :' Payment Option'} 
                  </p>

              { this.state.show_order_tab || this.props.match.params.order_id != undefined ?
                <p className={ flagView == 'order' ? 'ordr-dtls-tab-text-active' : 'ordr-dtls-tab-text order-dtl-txt' }
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
                                onChange={this.handleChangeCard.bind(this)}
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

                    {<h2 className='odr-dtls-add-card hh'  onClick={this.addRazorPay.bind(this)}>  {langContent.add_new_card != undefined ? langContent.add_new_card :'+ Add New Card'} </h2>}
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
                <Col xs={12} sm={6} md={12} lg={6} xl={6} className='add-card-box'>
                  <h2>   {langContent.fill_card_details != undefined ? langContent.fill_card_details:'Fill Card Details'}  </h2>
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
                    <Row className='add-card-input-box custom-validation-wrapper custom-mar-card'>
                      <Col xs={12} sm={12} lg={6} md={6} xl={6} className='p-l-0'>
                        <Form.Group>
                          <label className="card-title">  {langContent.card_no != undefined ? langContent.card_no :'Card No.'} </label>
                          <Form.Control type='text' placeholder={langContent.card_no != undefined ? langContent.card_no :'Card No.'}  className='card-input no-rounded' name="card_number" onChange={this.handleInputChange.bind(this)} isInvalid={errors.card_error != undefined && !!errors.card_error.card_number}/>
                          <Form.Control.Feedback type='invalid'>
                            {errors.card_error != undefined && errors.card_error.card_number != undefined ?  errors.card_error.card_number : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={12} lg={6} md={6} xl={6} className='p-l-0'>
                        <Form.Group>
                        <label className="card-title">  {langContent.expiry_month != undefined ? langContent.expiry_month :'Expiry MM/YYYY'}  </label>
                          <Form.Control type='text' placeholder='MM/YYYY' className='card-input cstmDate no-rounded'
                                        name="expiry_date"
                                        onChange={this.handleInputChange.bind(this)}
                                        isInvalid={errors.card_error != undefined && errors.card_error != null && !!errors.card_error.expiry_date}/>
                          {/*<Form.Control type='date' placeholder='MM/YYYY' className='card-input cstmDate no-rounded' name="expiry_date" onChange={this.handleInputChange.bind(this)} isInvalid={errors.card_error != undefined && errors.card_error != null && !!errors.card_error.expiry_date}/>*/}
                          <Form.Control.Feedback type='invalid'>
                            {errors.card_error != undefined && errors.card_error.expiry_date != undefined ?  errors.card_error.expiry_date : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={12} lg={6} md={6} xl={6} className='p-l-0'>
                        <Form.Group>
                        <label className="card-title">  {langContent.name_on_card != undefined ? langContent.name_on_card :'Name On Card'} </label>
                          <Form.Control type='text' placeholder={langContent.name_on_card != undefined ? langContent.name_on_card :'Name On Card'} className='card-input no-rounded' name="holder_name" onChange={this.handleInputChange.bind(this)} isInvalid={errors.card_error != undefined && errors.card_error != null && !!errors.card_error.holder_name}/>
                          <Form.Control.Feedback type='invalid'>
                            {errors.card_error != undefined && errors.card_error.holder_name != undefined ?  errors.card_error.holder_name : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={12} lg={6} md={6} xl={6} className='p-l-0'>
                        <Form.Group>
                        <label className="card-title">  {langContent.cvv != undefined ? langContent.cvv :'CVV'} </label>
                          <Form.Control type='text' placeholder={langContent.cvv != undefined ? langContent.cvv :'CVV'} className='card-input no-rounded' name="cvv" onChange={this.handleInputChange.bind(this)} isInvalid={errors.signup != undefined && !!errors.signup.cvv}/>
                          <Form.Control.Feedback type='invalid'>
                            {errors.card_error != undefined && errors.card_error.cvv != undefined ?  errors.card_error.cvv : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={12} lg={12} md={12} xl={12} className='p-l-0'>
                        <Form.Group className="proceed-btn-wrapper">
                          <Button type='button' className='add-card-sbmt-btn btn btn-block' onClick={ addCard.bind(this) }>
                            {authIsPending ? <>
                            <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>  {langContent.submit != undefined ? langContent.submit :' Submit'} 
                            </> : langContent.proceed != undefined ? langContent.proceed :'Proceed'}
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
                    <h2>{ productDetails != null ? returnLanguageText(productDetails,lang,'title') : '' }</h2>
                    <br clear='all' />
                    <Row>
                      <Col xs={12} sm={6} lg={6} xl={5} className='m-b-30 custom-htl-mar'>
                        <span className='htl-cat-text'> 
                       
                        {productDetails.package_type !== 1 ? <>{langContent.hotel_category != undefined ? langContent.hotel_category :' '}</> : <>
                          {langContent.room_category != undefined ? langContent.room_category :'Room Category'} 
                        </>}

                        </span>
                        <span className='htl-rate-star'>
                         {productDetails.package_type !== 1 ? <>
                            { typeof productDetails.hotel_type == 'string' ? productDetails.hotel_type : (<>
                              { getHotelStart(productDetails.hotel_type).map((hType, i) => {
                                return <i className="fa fa-star" aria-hidden="true" key={i}></i>;
                              }) }
                              </>)}
                          </> :  <>
                               { productDetails != null ? productDetails.room_categories[lang][productDetails.room_category] : ''}
                          </>}


                        </span>
                      </Col>
                      <Col xs={12} sm={6} lg={6} xl={6} className='m-b-30 padl0'>
                        {productDetails != null ? productDetails.themes.map(theme=> {
                          return <span className='ordr-dtl-tag-btn' key={theme.id}>{lang =='hindi' ? theme.hindi_name : theme.name}</span>;
                        }) : ''}
                      </Col>
                      <Col xs={12} sm={6} lg={6} xl={4} className='m-b-30 padl0'>
                        <img src={duration} class='img responsive ordr-dtls-tym-img '/>
                        <span className='ordr-dtls-day-txt'>
                           {productDetails.days != undefined && productDetails.days != null ? <>{productDetails.days}   {langContent.days != undefined ? langContent.days :'Days'} </>: ''}
                                 {productDetails.nights != undefined && productDetails.nights != null ? <> {productDetails.nights}   {langContent.night != undefined ? langContent.night :'Night'}  </>: ''}

                        </span>
                      </Col>
                      <Col xs={12} sm={6} lg={6} xl={6} className='m-b-30 padl0'>
                        <img src={family} class='img responsive ordr-dtls-tym-img'/>
                        <span className='ordr-dtls-day-txt'>
                          {productDetails.adults != undefined && productDetails.adults != null ? <> {productDetails.adults}  {langContent.adults != undefined ? langContent.adults :'Adults'}  </>: ''}
                          {productDetails.children != undefined && productDetails.children != null ? <> , {productDetails.children}   {langContent.children != undefined ? langContent.children :'Children'} </>: ''}
                          {productDetails.juniors != undefined && productDetails.juniors != null ? <> , {productDetails.juniors}   {langContent.juniors != undefined ? langContent.juniors :'Juniors'} </>: ''}
                        </span>
                      </Col>
                      <br clear='all' />
                      <Col xs={12} xl={12} className='pkg-des-box padl0'>
                        <h2 className='pkg-incd-txt'>
                        {langContent.package_include != undefined ? langContent.package_include :'Package Include'} 
                          <img src={arrowIcon} className='img-responsive pkg-arrow-icon'/>
                        </h2>
                        <p className='pkg-des-txt padl0'>
                          {returnLanguageText(productDetails,lang,'description')}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={12} lg={12} xl={5} className='pkg-rgt-box'>
                    <span className='lft-pkg-cost-txt'>   {langContent.package_cost != undefined ? langContent.package_cost :'Package Cost'}  </span>
                    <span className='lft-pkg-cost'>{getCurrencySymbol('',lang)} {productDetails != null ? productDetails.total_amount : ''}/-</span>
                    <Table responsive className='order-dtls-table custom-order-tbl'>
                      <tbody>
                        <tr>
                          <td>
                            <img src={inr} className='img-responsive ordr-inr-icon'/>
                          </td>
                          <td>
                            <span className='emi-txt'>  {langContent.emi_cost != undefined ? langContent.emi_cost :'EMI Cost'} :</span>
                          </td>
                          <td>
                            <span className='emi-amt-txt'> {totalEMI(form.package_frequency,lang)}</span>
                          </td>
                          <td />
                        </tr>
                        <tr>
                          <td>
                            <img src={emiCalc} className='img-responsive ordr-inr-icon'/>
                          </td>
                          <td>
                            <span className='emi-txt'>  {langContent.total_emis != undefined ? langContent.total_emis :'Total EMIs'} :</span>
                          </td>
                          <td>
                            <span className='emi-amt-txt'>
                              {totalEMI(form.package_frequency,lang)}
                            </span>
                          </td>
                          { this.props.match.params.package_id != undefined ?
                            <td>
                            <span className='chnge-fqncy-txt cursor' onClick={this.openPopup.bind(this, 'change_frequency')}>
                            {langContent.change_frequency != undefined ? langContent.change_frequency :'Change Frequency'} 
                            </span>
                            </td> : ''
                          }
                        </tr>
                        <tr>
                          <td>
                            <img src={duration} className='img-responsive ordr-inr-icon'/>
                          </td>
                          <td>
                            <span className='emi-txt'>   {langContent.schedule_date != undefined ? langContent.schedule_date :'Schedule Date'} :</span>
                          </td>
                          <td>
                            <span className='emi-amt-txt'>{moment(form.scheduled_date).format("DD/MM/YYYY")}</span>
                          </td>
                          { this.props.match.params.package_id != undefined ?
                              <td>
                                <span className='chnge-fqncy-txt cursor'
                                      onClick={this.openPopup.bind(this, 'change_schedule_date')}>  {langContent.change_date != undefined ? langContent.change_date :'Change Date'} </span>
                              </td> : ''
                          }
                        </tr>
                        <tr>
                          <td>
                            <img src={payment} className='img-responsive ordr-inr-icon'/>
                          </td>
                          <td>
                            <span className='emi-txt'>  {langContent.payment_method != undefined ? langContent.payment_method :'Payment Method'} :</span>
                          </td>
                          <td>
                            <span className='emi-amt-txt'>
                              **** **** **** {card_digit}
                            </span>
                          </td>
                          { this.props.match.params.package_id != undefined ?
                              <td>
                                <span className='chnge-fqncy-txt cursor'
                                      onClick={changeFlag.bind(this, 'payment-option')}>   {langContent.change != undefined ? langContent.change :'Change'}  </span>
                              </td> : ''
                          }
                        </tr>
                         {/*  there is 2 option one is buy packake and one is after buy package is uncomment when developer implement this module */}

                        { this.props.match.params.order_id != undefined ? <><tr>
                          <td colSpan='3' />
                          <td>
                            <span
                              className='cncl-order-text' onClick={this.openPopup.bind(this, 'cancel_order')}>  {langContent.cancel_order != undefined ? langContent.cancel_order :'Cancel Order'} </span>
                          </td>
                        </tr></> : ''}
                      </tbody>
                    </Table>
                    { this.props.match.params.package_id != undefined ? <Button className='btn btn-block ordr-buy-btn custom-odr-btn' onClick={ this.showAccept_declaimer.bind(this) } disabled={disable_btn}>
                      {isPending ? <>
                      <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>  {langContent.buy_now != undefined ? langContent.buy_now :'Buy Now'} 
                      </> : langContent.buy_now != undefined ? langContent.buy_now :'Buy Now'}

                    </Button> : ''}
                  </Col>
                  {/* Cancel Order Popup */}

                  <Modal className="custom-model-size" size='lg' show={this.state.openPopup} aria-labelledby='example-modal-sizes-title-lg'>
                    <Modal.Header className='scdl-popup-header'>
                      <i className='fa fa-times pop-close-icon' onClick={this.closePopup.bind(this)}/>
                    </Modal.Header>
                    <Modal.Body className='pad32 order-cancel-popup selectfreq-popup'>
                      <h2 className='schdle-pop-heading text-center custom-hdr-padding'>
                        { cancellationBody ? langContent.reason_for_cancellation != undefined ? langContent.reason_for_cancellation :'Enter your reason for cancellation' : frequencyBody ? langContent.select_frequency != undefined ? langContent.select_frequency :'Select frequency' : scheduleDateBody  ? langContent.select_schedule_date != undefined ? langContent.select_schedule_date :'Select schedule date' : ''}
                      </h2>

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
                            <Form.Control as='textarea' name ="reason_for_cancellation" rows='3' placeholder=  {langContent.type_reason_here != undefined ? langContent.type_reason_here :'Type Your Reason Here'}  className="cncl-textarea-text  mar30 m-b-30" onChange={this.handleChangeCancelReason.bind(this)}/>
                              : ''
                          }
                          {
                            frequencyBody ?
                            <>
                            {lang =='hindi' ?
                              <Form.Control as="select"  name="package_frequency" className="mar30" placeholder=  {langContent.payment_frequency != undefined ? langContent.payment_frequency :'Payment Frequency'}  defaultValue='' onChange={this.handleChangeFrequency.bind(this)}>
                              <option value=''>{langContent.payment_frequency != undefined ? langContent.payment_frequency :'Payment Frequency..'}</option>
                              { Object.keys(productDetails.payment_cycle_hindi).map(payment_cycle=> {
                                return <option key={payment_cycle} value={payment_cycle} >{productDetails.payment_cycle_hindi[payment_cycle]}</option>;
                              }) }
                            </Form.Control>
                            : 
                            <Form.Control as="select"  name="package_frequency" className="mar30" placeholder=  {langContent.payment_frequency != undefined ? langContent.payment_frequency :'Payment Frequency'}  defaultValue='' onChange={this.handleChangeFrequency.bind(this)}>
                              <option value=''>{langContent.payment_frequency != undefined ? langContent.payment_frequency :'Payment Frequency..'}</option>
                              { Object.keys(productDetails.payment_cycle).map(payment_cycle=> {
                                return <option key={payment_cycle} value={payment_cycle} >{productDetails.payment_cycle[payment_cycle]}</option>;
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
                          <Button type="button" className='btn btn-block order-submit-btn' onClick={ cancelOrder.bind(this) }> {langContent.submit != undefined ? langContent.submit :'Submit'} </Button> </> : ''}
                        </Row>
                    </Modal.Body>
                  </Modal>

                  <Modal className="terms-popup custom-model-size" size='lg' show={ isPending == false ? tncPopup : true } aria-labelledby='example-modal-sizes-title-lg'>
                    <Modal.Header className='scdl-popup-header'>
                      <i className='fa fa-times pop-close-icon' onClick={this.closeTncPopup.bind(this)}/>
                    </Modal.Header>
                    <Modal.Body className='pad32 order-cancel-popup terms-condition'>
                      <h2 className='schdle-pop-heading text-center custom-hdr-padding'>
                      {langContent.cerms_conditions != undefined ? langContent.cerms_conditions :'Terms & Condition'} 
                      </h2>
                      <Form.Group className="privacy-policy">
                        {
                          <><p className="mar30 text-left">{returnLanguageText(productDetails,lang,'terms_and_conditions')} </p>
                          <h2 className='schdle-pop-heading text-center custom-hdr-padding'>
                          {langContent.cancellation_policy != undefined ? langContent.cancellation_policy :'Cancellation Policy'}    
                          </h2>
                          <p className="mar30 text-left">{returnLanguageText(productDetails,lang,'cancellation_policy')} </p>
                          </>
                        }
                      </Form.Group>
                      <Row className="dummy-txt-wrapper">
                        <Button className='btn btn-block order-cncl-btn' onClick={this.closeTncPopup.bind(this)}>  {langContent.cancel != undefined ? langContent.cancel :'Cancel'}   </Button>
                        <Button type="button" className='btn btn-block order-submit-btn' onClick={ this.handleSubmitOrder.bind(this) }>  {isPending ==true ? <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/> : ''} {langContent.accept != undefined ? langContent.accept :'Accept'}  </Button>
                      </Row>
                    </Modal.Body>
                  </Modal>
                  {/* end cancel order Popup  */}
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

export default connect(mapStateToProps, mapDispatchToProps)(orderDetailsComponent)