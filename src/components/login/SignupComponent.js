import React from 'react'
import ReactDOM from 'react-dom'
import styles from '../../Style.css'
import classNames from 'classnames'
import { Row, Col, Container, InputGroup, Form, Button,Spinner,Modal } from 'react-bootstrap'
import authBanner from '../../image/authBanner.png'
import arrowIcon from '../../image/arrowicon.png'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import logo from '../../image/logo.png'
import cicleTick from '../../image/media-icon-green-tick.png'
import { signup, handleInputChangeSignup,createAccountNext,handleInputDate,getState,getCountries,getCity,setCustomer} from '../../actions/AuthAction';
import {validateEmail} from '../../constants';
import connect from 'react-redux/es/connect/connect'
import moment from "moment";
import { addDays } from "date-fns";
import { subYears } from "date-fns";
import { getUrl} from '../../constants.js'
const mapStateToProps = (state) => {
  return {
    signup: state.Auth.signup,
    errors: state.Auth.errors,
    flag: state.Auth.flag,
    countries: state.Auth.countries,
    states: state.Auth.states,
    cities: state.Auth.cities,
    customer: state.Auth.customer,
    isPending: state.Auth.isPending,
    langContent: state.Lang.langContent,
    lang: state.Lang.lang,
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    ClientSignup: () => dispatch(signup(props)),
    getCountries: () => dispatch(getCountries()),
    getState: (id) => dispatch(getState(id)),
    getCity: (id) => dispatch(getCity(id)),
    setCustomer: (customer) => dispatch(setCustomer(customer)),
    createAccountNext: () => dispatch(createAccountNext(props)),
    
    handleInputChangeSignup: (event) => {
      return dispatch(
        handleInputChangeSignup({ [event.target.name]: event.target.value })
      )
    },
    handleInputDate: (date) => {
      return dispatch(
        handleInputDate(date)
      )
    }
  }
}


class SignupComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      flag: '',
      startDate: '',
      openPopup:false,
      typemodel:1,
    }
  }
  
  onSelectCountry(event){
    this.props.getState(event.target.value);
  }
  getCity(event){
    this.props.getCity(event.target.value);
  }

  componentWillMount(){
    this.props.getCountries();
    this.props.setCustomer(this.props.match.params.customer);
  }

  handleChange = (date) => {
    let dob  = moment(date).format('YYYY-MM-DD');
    this.props.handleInputDate({ ['date_of_birth']: dob });
    this.setState({
      startDate: date,
      
    })
  }
  termsPopupOpen = (typemodel) => {
    this.setState({openPopup:true,typemodel})
  }
  termsPopupClose = () => {
    this.setState({openPopup:false})
  }

  handleTermAndCondition = (event) => {
    if(this.props.signup.accept_term != '')
      this.props.handleInputDate({ 'accept_term': ''});
    else
      this.props.handleInputDate({ 'accept_term': 'on'});

  }

  render () {
    const {typemodel} = this.state;
    const { lang,flag,signup,handleInputChangeSignup,customer, errors,createAccountNext,handleInputDate,ClientSignup,countries,states,cities,isPending,langContent} = this.props
    return (
      <Container className='cstm-home-container'>
        <section>
          {/* Login Section */}
          <Row>
            <Row className='width100'>
              <Col
                xs={12}
                sm={6}
                lg={5}
                xl={5}
                md={6}
                className='auth-side-box'
              >
                <img
                  src={authBanner}
                  className='img-responsive customAuthBanner signup-banner'
                />
                <Col className='cstm-cmpny-dtl-bx'>
                  <Link to={getUrl(customer)}>
                    <img src={logo} className='img-responsive auth-logo' />
                  </Link>
                  <p className='auth-left-banner-text'>
                  {langContent.signup_banner_heading_one != undefined ? langContent.signup_banner_heading_one :'Make account with My Travel Benefits and'} 
                  </p>
                  
                </Col>
              </Col>
              <Col xs={12} sm={6} lg={7} xl={7} md={6}>
                {/* Auth Header Section */}
                <Col xs={12} sm={12} lg={12} className='customAuthHeader'>
                  <Link to={getUrl(customer)+'login'} className='cscustomNewAcnt-hdr'>
                  {langContent.already_have_account != undefined ? langContent.already_have_account :'Already Have Account?'}   
                  </Link>
                  <Link to={getUrl(customer)+'login'}>
                    <Button className='CustomSignUpBtn'>  {langContent.sign_in != undefined ? langContent.sign_in :'Sign In'}  </Button>
                  </Link>
                </Col>
                {/* End Auth Header Section */}
                {/* Start Login Form */}
                <Col xs={12} sm={12} lg={11} xl={11} className='customLoginBox'>
                  <h2 className='customLoginText'>
                  {langContent.create_account != undefined ? langContent.create_account :'Create Account'}      
                    <img
                      src={arrowIcon}
                      className='img-responsive customArrowIcon'
                    />
                  </h2>
                  <Form className='CustomAuthFormBox login-form-main'>
                   {flag != 'success' ? (<>


                    {flag == '' ? (
                      <>
                        <Form.Group className='m-b-30 cstm-signup-input-wrapper'>
                        <label class="login-txt">  {langContent.customer_email != undefined ? langContent.customer_email :'Customer Email'}  </label>
                          <Form.Control
                            type='email'
                            name='email'
                            placeholder={langContent.customer_mail_address != undefined ? langContent.customer_mail_address :'Customer Mail Address'} 
                            className='customLoginInput'
                            onChange={handleInputChangeSignup.bind(this)}
                            isInvalid={errors.signup != undefined && !!errors.signup.email}
                          />
                          {validateEmail(signup.email) ? 
                              <p className='valid-email-adrs'>
                                <img src={cicleTick} className='img-responsive' />
                                <span>   {langContent.valid_emaill_address != undefined ? langContent.valid_emaill_address :'Valid Emaill Address'}  </span>
                              </p>
                          : ''}
                          <Form.Control.Feedback type='invalid'>
                            {errors.signup != undefined && errors.signup.email != undefined ?  errors.signup.email : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                        {validateEmail(signup.email) ? <>
                            <Form.Group
                              
                              className='m-b-30 cstm-signup-input-wrapper'
                            >
                            <label class="login-txt">  {langContent.password != undefined ? langContent.password :'Password'}  </label>
                              <Form.Control
                                type='password'
                                name='password'
                                placeholder={langContent.enter_password != undefined ? langContent.enter_password :'Enter Password'}
                                className='customLoginInput'
                                onChange={handleInputChangeSignup.bind(this)}
                                isInvalid={errors.signup != undefined && !!errors.signup.password}
                              />
                              <Form.Control.Feedback type='invalid'>
                                {errors.signup != undefined && errors.signup.password != undefined ?  errors.signup.password : ''}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                              
                              className='m-b-30 cstm-signup-input-wrapper'
                            >
                            <label class="login-txt">  {langContent.confirm_password != undefined ? langContent.confirm_password :'Confirm Password'}  </label>
                              <Form.Control
                                type='password'
                                name='confirm_password'
                                placeholder={langContent.re_enter_password != undefined ? langContent.re_enter_password :'Re Enter Password'}
                                className='customLoginInput'
                                onChange={handleInputChangeSignup.bind(this)}
                                isInvalid={errors.signup != undefined && !!errors.signup.confirm_password}
                              />
                               <Form.Control.Feedback type='invalid'>
                                {errors.signup != undefined && errors.signup.confirm_password != undefined ?  errors.signup.confirm_password : ''}
                              </Form.Control.Feedback>

                            </Form.Group>

                            <Button
                              variant='outline-primary'
                              className='customLoginSub-btn btn btn-default btn-block'
                              onClick={createAccountNext.bind(this)}
                            >
                             {langContent.next != undefined ? langContent.next:'Next'}    
                            </Button>
                         </> : ''}
                      </>
                    ) : (
                      ''
                    )}
                    {flag == 'personal' ? (
                      <>
                        <Form.Group className='m-b-30 cstm-signup-input-personal-wrapper login-form-main'>
                          <label class="login-txt">   {langContent.first_name != undefined ? langContent.first_name :'First Name'}  </label>
                          <Form.Control
                            type='text'
                            name='first_name'
                            placeholder={langContent.first_name != undefined ? langContent.first_name :'First Name'} 
                            className='customLoginInput'
                             onChange={handleInputChangeSignup.bind(this)}
                            isInvalid={errors.signup != undefined && !!errors.signup.first_name}
                          />
                           <Form.Control.Feedback type='invalid'>
                              {errors.signup != undefined && errors.signup.first_name != undefined ?  errors.signup.first_name : ''}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='m-b-30 cstm-signup-input-personal-wrapper'>
                        <label class="login-txt">  {langContent.last_name != undefined ? langContent.last_name :'Last name'}  </label>
                          <Form.Control
                            type='text'
                            placeholder={langContent.last_name != undefined ? langContent.last_name :'Last name'}
                            name='last_name'
                            className='customLoginInput'
                             onChange={handleInputChangeSignup.bind(this)}
                            isInvalid={errors.signup != undefined && !!errors.signup.last_name}
                          />
                          <Form.Control.Feedback type='invalid'>
                              {errors.signup != undefined && errors.signup.last_name != undefined ?  errors.signup.last_name : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='m-b-30 cstm-signup-input-personal-wrapper'>
                        <label class="login-txt">  {langContent.date_of_birth != undefined ? langContent.date_of_birth :'Date Of Birth'}  </label>
                     {   console.log(this.maxDate, "date")}
                          <DatePicker
                            selected={this.state.startDate}
                            name='date_of_birth'
                             onChange={this.handleChange}
                            className='customLoginInput cstmDate'
                            placeholderText={langContent.date_of_birth != undefined ? langContent.date_of_birth :'Date Of Birth'}
                            isInvalid={errors.signup != undefined && !!errors.signup.date_of_birth}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={subYears(new Date(), 18)}
                         />
                          <Form.Control.Feedback type='invalid'>
                              {errors.signup != undefined && errors.signup.date_of_birth != undefined ?  errors.signup.date_of_birth : ''}
                          </Form.Control.Feedback>

                        </Form.Group>
                      {/*<Form.Group className='m-b-30 cstm-signup-input-personal-wrapper'>
                        <label class="login-txt">  {langContent.designation != undefined ? langContent.designation :'Designation'}  </label>
                          <Form.Control
                            type='text'
                            placeholder= {langContent.designation != undefined ? langContent.designation :'Designation'}
                            className='customLoginInput'
                            name='designation'
                            onChange={handleInputChangeSignup.bind(this)}
                            isInvalid={errors.signup != undefined && !!errors.signup.designation}
                          />
                          <Form.Control.Feedback type='invalid'>
                              {errors.signup != undefined && errors.signup.designation != undefined ?  errors.signup.designation : ''}
                          </Form.Control.Feedback>
                        </Form.Group>*/}
                        
                        <Form.Group className='m-b-30 cstm-signup-input-personal-wrapper'>
                        <label class="login-txt">  {langContent.country != undefined ? langContent.country :'Country'}  </label>
                        <Form.Control
                            as='select'
                            name='country'
                            className='custom-Signup-Select '
                            onChange={this.onSelectCountry.bind(this)}
                            isInvalid={errors.signup != undefined && !!errors.signup.country}
                          >
                            <option value=''>  {langContent.select_your_country != undefined ? langContent.select_your_country :'Select your Country'}  </option>
                            {countries.map((country,index) =>
                                <option key={index} value={country.id}>{country.country}</option>
                              )}
                          
                          </Form.Control>
                         <Form.Control.Feedback type='invalid'>
                              {errors.signup != undefined && errors.signup.country != undefined ?  errors.signup.country : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='m-b-30 cstm-signup-input-personal-wrapper'>
                        <label class="login-txt">  {langContent.state != undefined ? langContent.state :'State'}  </label>
                        <Form.Control
                            as='select'
                            name='state'
                            className='custom-Signup-Select'
                            onChange={this.getCity.bind(this)}
                            isInvalid={errors.signup != undefined && !!errors.signup.state}

                          >
                            <option value=''>  {langContent.select_your_state != undefined ? langContent.select_your_state :'Select your State'}  </option>
                           {states.map((state,index) =>
                                <option key={index} value={state.id}>{state.region}</option>
                              )}
                          </Form.Control>
                          <Form.Control.Feedback type='invalid'>
                              {errors.signup != undefined && errors.signup.state != undefined ?  errors.signup.state : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='m-b-30 cstm-signup-input-personal-wrapper'>
                        <label class="login-txt">  {langContent.city != undefined ? langContent.city :'City'}  </label>
                        <Form.Control
                            as='select'
                            name='city'
                            className='custom-Signup-Select'
                            onChange={handleInputChangeSignup.bind(this)}
                            isInvalid={errors.signup != undefined && !!errors.signup.city}
                          >
                            <option value='' >  {langContent.select_your_city != undefined ? langContent.select_your_city :'Select your City'} </option>
                            {cities.map((city,index) =>
                                <option key={index} value={city.id}>{city.city}</option>
                              )}
                          </Form.Control>
                          <Form.Control.Feedback type='invalid'>
                              {errors.signup != undefined && errors.signup.city != undefined ?  errors.signup.city : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='m-b-30 cstm-signup-input-personal-wrapper'>
                        <label class="login-txt">  {langContent.address != undefined ? langContent.address :'Address'}  </label>
                          <Form.Control
                            type='text'
                            placeholder={langContent.full_address != undefined ? langContent.full_address :'Full Address'}
                            name='full_address'
                            className='customLoginInput'
                            onChange={handleInputChangeSignup.bind(this)}
                            isInvalid={errors.signup != undefined && !!errors.signup.full_address}
                          />
                          <Form.Control.Feedback type='invalid'>
                              {errors.signup != undefined && errors.signup.full_address != undefined ?  errors.signup.full_address : ''}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='m-b-30 cstm-signup-input-personal-wrapper'>
                        <label class="login-txt">  {langContent.zip_code != undefined ? langContent.zip_code :'Zip Code'}  </label>
                          <Form.Control
                            type='text'
                            placeholder={langContent.zip_code != undefined ? langContent.zip_code :'Zip Code'}
                            name='zipcode'
                            className='customLoginInput'
                            onChange={handleInputChangeSignup.bind(this)}
                            isInvalid={errors.signup != undefined && !!errors.signup.zipcode}
                          />
                          <Form.Control.Feedback type='invalid'>
                              {errors.signup != undefined && errors.signup.zipcode != undefined ?  errors.signup.zipcode : ''}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='m-b-30 cstm-signup-input-personal-wrapper'>
                        <label class="login-txt">   {langContent.mobile_number != undefined ? langContent.mobile_number :'Mobile Number'}  </label>
                          <Form.Control
                            type='text'
                            placeholder={langContent.mobile_number != undefined ? langContent.mobile_number :'Mobile Number'} 
                             name='mobile_number'
                            className='customLoginInput'
                            onChange={handleInputChangeSignup.bind(this)}
                            isInvalid={errors.signup != undefined && !!errors.signup.mobile_number}
                          />
                          <Form.Control.Feedback type='invalid'>
                              {errors.signup != undefined && errors.signup.mobile_number != undefined ?  errors.signup.mobile_number : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='m-b-30 cstm-signup-input-personal-wrapper'>
                        <label class="login-txt">  {langContent.phone_number_optional != undefined ? langContent.phone_number_optional :'Phone Number(Optional)'}  </label>
                          <Form.Control
                            type='text'
                            placeholder={langContent.phone_number_optional != undefined ? langContent.phone_number_optional :'Phone Number(Optional)'}
                            name='phone_number'
                            className='customLoginInput'
                            onChange={handleInputChangeSignup.bind(this)}
                            isInvalid={errors.signup != undefined && !!errors.signup.phone_number}
                          />
                          <Form.Control.Feedback type='invalid'>
                              {errors.signup != undefined && errors.signup.phone_number != undefined ?  errors.signup.phone_number : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='m-b-30 cstm-signup-input-personal-wrapper'>
                        <label class="login-txt">  {langContent.extension_number_optional != undefined ? langContent.extension_number_optional :'Extension Number(Optional)'}  </label>
                          <Form.Control
                            type='text'
                            placeholder={langContent.extension_number_optional != undefined ? langContent.extension_number_optional :'Extension Number(Optional)'}
                            name='extension_number'
                            className='customLoginInput'
                            onChange={handleInputChangeSignup.bind(this)}
                            isInvalid={errors.signup != undefined && !!errors.signup.extension_number}
                          />
                          <Form.Control.Feedback type='invalid'>
                              {errors.signup != undefined && errors.signup.extension_number != undefined ?  errors.signup.extension_number : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <div>
                        <Form.Label className='checkbox-button'>
                          <input
                            type='radio'
                            className='checkbox-button-input'
                            name='gender'
                            value = '1'
                            onChange={handleInputChangeSignup.bind(this)}
                          />
                          <span className='checkbox-button-control' />
                          <span className='checkbox-button__label'>  {langContent.male != undefined ? langContent.male :'Male'}  </span>
                        </Form.Label>
                        <Form.Label className='checkbox-button cstm-chkbox-2'>
                          <input
                            type='radio'
                            className='checkbox-button-input'
                            name='gender'
                             value = '2'
                            onChange={handleInputChangeSignup.bind(this)}
                          />
                          <span className='checkbox-button-control' />
                          <span className='checkbox-button__label'>  {langContent.female != undefined ? langContent.female :'Female'} </span>
                              
                        </Form.Label>
                        {errors.signup != undefined && errors.signup.gender != undefined ?  <p className="error invalid-feedback"> {errors.signup.gender} </p> : ''}

                        </div>
                        <Form.Group className='m-b-30 '>
                          <Form.Label className='checkbox-button'>
                            <input
                              type='checkbox'
                              className='checkbox-button-input'
                              name='accept_term'
                              onClick={this.handleTermAndCondition.bind(this)}
                            />
                            <span className='checkbox-button-control' />
                            <span className='checkbox-button__label'   onClick={this.termsPopupOpen.bind(this,1)}>
                            {langContent.accept_term_and_condition != undefined ? langContent.accept_term_and_condition :'Accept Term and condition'}   
                            </span>
                            <span className='checkbox-button__label'   onClick={this.termsPopupOpen.bind(this,2)}>
                            {langContent.privacy_policy != undefined ? langContent.privacy_policy :'Privacy Policy'}
                            </span>
                          </Form.Label>
                          {errors.signup != undefined && errors.signup.accept_term != undefined ?  <p className="error invalid-feedback"> {errors.signup.accept_term} </p> : ''}
                        </Form.Group>
                        <Button
                          type='button'
                          variant='outline-primary'
                          className='customLoginSub-btn btn btn-default btn-block m-t-20 cstm-finish-btn'
                          onClick={ClientSignup.bind(this)}
                        >
                        {isPending ? <>
                            <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            />
                           {langContent.sign_up_here != undefined ? langContent.sign_up_here :'Sign Up Here'}   ...
                          </> :  langContent.sign_up_here != undefined ? langContent.sign_up_here :'Sign Up Here'}
                         
                          
                        </Button>
                      </>
                    ) : (
                      ''
                    )}
                  
                   </>) : (<p className='success-singnup'>
                   {langContent.email_verification_link_has_been_sent_address != undefined ? langContent.email_verification_link_has_been_sent_address :'Email verification link has been sent address'}     "{signup.email}"
                   </p>)}
                  </Form>
                </Col>
              </Col>
            </Row>
          </Row>
        </section>

                  <Modal className="custom-model-size" size='lg' show={this.state.openPopup} aria-labelledby='example-modal-sizes-title-lg'>
                    <Modal.Header className='scdl-popup-header cancel-popup-hdr'>
                      <i className='fa fa-times pop-close-icon'   onClick={this.termsPopupClose.bind(this)} />
                    </Modal.Header>
                    <Modal.Body className='pad32 order-cancel-popup '>
                      {typemodel == 1 ? <>
                           <h3>  
                           {lang =='en' ? 'MY TRAVEL BENEFITS TERMS AND CONDITIONS.': 'मेरे यात्रा के नियम और शर्तें।'} 
                           </h3>
                     
                  <hr/>
                    <Col className="cstmTermsPopupWrapper">
                     {lang =='en' ? 
                      <p className="cstmTermsText">
                      1. All our Vacation offers are valid for the selected number of nights and days based on double
                      occupancy for standard Hotel and Cruise accommodations for destinations where Participants Hotel
                      Chains and cruises itineraries apply. 
                      <br/><br/>
                      2. All bookings are subject to space availability and variations during holiday seasons, recognized federal
                      official holidays and special events in selected locations. The customer must request a booking with the
                      required anticipation time from the travel date through our website by logging in with the registered email
                      address and password and selecting one of the registered orders on his/her account.<br/>
                      My Travel Benefits will be in touch with the customer within five business after it has been requested.
                      <br/><br/>
                      3. All Vacation offers are valid for two adults, 18 years of age or older with a major credit card. Additional
                      guests included will depend on the type of Vacation Plan that has been acquired.<br/>
                      When available, meals and drinks can be included in a specific vacation plan. There is an additional
                      charge per day for extra guests.
                      <br/><br/>
                      4. No pets allowed, unless confirmed by My Travel Benefits in writing.
                      <br/><br/>
                      5. Additional nights may be requested at discounted rates, subject to availability.
                      <br/><br/>
                      6. Vacation plans cannot be used in conjunction with any other Vacation Plan unless authorized in writing
                      by My Travel Benefits.
                      <br/><br/>
                      7. Vacation plans are eligible including adults of 18 years of age or older, but not limited to sex, race,
                      marital status, group association, residency or geographic limitations.
                      <br/><br/>
                      8. The Price of the selected My Travel Benefits Vacation Plan constitutes the Customer’s total financial
                      obligation for the purchase of a My Travel Benefits Vacation Plan.
                      <br/><br/>
                      9. The Customer will not be subject to any additional seasonal or booking charges by the Participating
                      Hotel or Cruise; however, the Customer acknowledges and agrees that he/she may be charged for
                      upgrades from the amenities offered in a standard room requested by the Customer at the time of
                      check-in or during his/her stay as charged by the Participating Hotel or Cruise, including additional beds,
                      pillows, room service and the like. The Customer is also free to request room upgrades before the travel
                      date directly to My Travel Benefits and My Travel Benefits will charge the Customer an additional fee
                      established by the Participant Hotel or Cruise depending on the upgrade requested. My Travel Benefits is
                      not responsible for any request or payment made directly to the Hotel or Cruise. My Travel Benefits does
                      not offer any recreational services and thus no recreational charges will be applied.
                      <br/><br/>

                      10. Vacation plans do not include or cover any additional expenses of travel not associated with a My
                      Travel Benefits Hotel Stay, including but not limited to: 
                      <br/><br/>
                      i. Travel Expenses;<br/>
                      ii. Destination Expenses;<br/>
                      iii. Ground Transportation Expenses;<br/>
                      iv. Meal’s Expenses; other than any that is furnished without charge by the Participating Hotel or Cruise;<br/>
                      v. Tips and gratuities; and,<br/>
                      vi. Any and all incidental or other expenses arising from or related to the My Travel Benefits Hotel Stay.<br/><br/>
                      11. The first installment of the Price shall be charged to the designated Card on the selected first payment
                      date.<br/><br/>
                      12. All vacation plan offers are solely valid for Twelve (12) Months from the first payment date, unless an
                      extension has been authorized by My Travel Benefits.<br/><br/>
                      13. Unless the Customer is granted an extension of time by My Travel Benefits:
                      <br/>
                      The My Travel Benefits Vacation Plan shall expire, and thereafter become and void, unless the
                      Customer uses or redeems the My Travel Benefits Vacation Plan, and fully completes his/her travel within
                      Twelve (12) Months from the first payment date. In such an event, the Customer further acknowledges
                      and agrees that My Travel Benefits will no longer have any obligation to honor the My Travel Benefits
                      Vacation Certificate.
                      <br/><br/>
                      14. At the sole discretion of My Travel Benefits, and for good cause shown by the Customer, My Travel
                      Benefits may extend the expiration date of any Vacation Plan for a period of time up to Six (6) Months
                      from the original expiration date of any My Travel Benefits Vacation Plan.
                      <br/><br/>
                      In the event My Travel Benefits grants an extension of the expiration date of a Vacation Plan at the
                      request of the Customer, the Customer further acknowledges and agrees that:
                      <br/><br/>
                      a.) Any Booking made during the Agreed Extension Period may only be used for Travel Dates occurring
                      during the Travel Off-Season, and shall be subject to additional surcharges according to adjusted rates at
                      the time of travel and the destination chosen; and,<br/>
                      b.) Notwithstanding any language to the contrary contained herein, the Customer shall not be entitled to
                      any refund of any of the amounts actually paid to My Travel Benefits in the event the Customer cancels
                      the Agreement for any reason during the Agreed Extension Period.

                      <br/><br/>

                      15. Customers may only use a My Travel Benefits Vacation Plan once they have paid the total amount of
                      the Price. The Customer may accelerate the payment of the remaining balance of the Price of a Vacation
                      Plan at any time.
                      <br/><br/>
                      16. Once you have formally requested your booking for the use of a Vacation Plan and My Travel Benefits
                      confirms the booking in writing, you may proceed with your transportation plans. We recommend not to
                      book your means of transportation until your booking has been validated for the date and destination of
                      your choice and you have received a confirmation code in writing via email.
                      <br/><br/>
                      17. Whenever possible we try our best to accommodate your first requested booking dates. All booking
                      requests must comply with the established booking process in order to receive the confirmation.
                      <br/><br/>
                      18. My Travel Benefits will notify the customer for any change of destinations offered.
                      <br/><br/>

                      19. Quality of any Assigned Hotel can vary from one geographical location to another. My Travel Benefits
                      is not responsible for any variations in quality of the Assigned Hotel at the Chosen Destination.
                      <br/><br/>
                      20. All Vacation offers are valid for accommodations only. You will be responsible for transportation,
                      service charges and incidental expenses, unless confirmed and authorized in writing by My Travel
                      Benefits.
                      <br/><br/>
                      21. Vacation plans cannot be exchanged for cash, any monetary consideration, resold nor be reproduced.
                      There are no refunds of unused portions of a Vacation Plan and it expires 12 (twelve) months from the
                      first payment due date. Therefore, all travel must be completed before the expiration date.
                      <br/><br/>
                      22. Vacation Plans are fully transferable at all times, should you use it as a gift, subject to all Terms and
                      Conditions. The Customer shall request in writing to transfer the Vacation Certificate to any person, with
                      the only restriction of that person being 18 years of age or older and to be subject to the terms and
                      conditions of a Vacation Plan with My Travel Benefits.
                      <br/><br/>
                      23. While on vacation you may be offered exciting vacation opportunities by one of our hosting resorts in
                      the hopes that you will vacation with them in the future. My Travel Benefits is not affiliated with such
                      offers, and bears no responsibility or liability for any claims or representations made in such offers, nor is
                      attending any presentation a requirement of any Vacation Plan.
                      <br/><br/>
                      24. Your check-in confirmation code and valid photo identification (Passport or Driver’s License) shall be
                      required on check-in, and most hotels and Cruises will require a valid major credit card to be presented to
                      cover incidental charges. This is a standard procedure and no charge should be applied to your credit
                      card unless otherwise specified by the hotel at the moment of your check-out. Check-in and continued
                      occupancy shall at all times be subject to all requirements of participating hotels and applicable laws.
                      <br/><br/>
                      25. T​ he Customer may cancel a My Travel Benefits Vacation Plan for any personal reason. For any
                      cancelation requested after the first payment date, My Travel Benefits will only refund Twenty Percent
                      (20%) of the amount actually paid to My Travel Benefits. Refunds will not apply after the expiration date.
                      <br/><br/>
                      26. When any type of meal is included at the Participant Hotel or Cruise, amount and quality may vary.
                      <br/><br/>
                      27. Hotels located in destinations with beaches, oceans, rivers, lakes, etc, may be located away from
                      them.
                      <br/><br/>
                      28. All bookings are subject to availability of rooms at any destination.
                      <br/><br/>
                      29. My Travel Benefits is not to be held responsible for any inconvenience, delay, disappointment,
                      frustration, accident, injury, loss of employment, or damage to persons, any whether physical or emotional
                      distress, or any act of God, terrorism, or any liability whatsoever arising from or in conjunction with the
                      services provided, or any other circumstances beyond its control which may cause the travel
                      arrangements to become unavailable. In the event that a destination becomes unavailable, My Travel
                      Benefits will use commercially reasonable efforts to offer a substitute destination.
                      <br/><br/>
                      30. All My Travel Benefits vacation plans are void where prohibited by law. All federal, state and local
                      laws apply. No other representations, oral or otherwise, are valid in conjunction with any Vacation Plan.
                      <br/><br/>
                      31. Under no circumstances the use of discounts or complimentary coupons or tickets will apply.
                      <br/><br/>
                      32. ​In the event the Customer requests a hotel booking in less than Sixty (60) Days in advance of the
                      Travel Date, the Customer may not book a destination during the Travel High-Season.
                      <br/><br/>

                      33. For bookings during the Travel Off-Season, My Travel Benefits agrees it shall fully refund 100% of the
                      Price paid by the Customer in the event My Travel Benefits fails to provide the requested booking at the
                      Selected Destination with a Participating Hotel, provided the intended booking was timely requested in
                      accordance with the terms and conditions for the use of a Vacation Plan. All approved refunds shall be
                      paid to the Customer through the credit or debit card used by the Customer. All approved refunds shall be
                      made within Thirty (30) Days of My Travel Benefits’s receipt of a Customer’s request for a refund.
                      <br/><br/>
                      34. Payment of the Price entitles the Customer to use a My Travel Benefits Vacation Plan and enjoy its
                      benefits throughout the calendar year; however, the Customer Acknowledges and agrees that during
                      Holiday Seasons and/or Special Dates, bookings will be subject to availability at Participant Hotels, and if
                      the booking is granted, it may be subject to limitations on the number of nights and/or other conditions
                      imposed or required by the Participant Hotel, depending on the destination selected.
                      <br/><br/>
                      35. Any violation of these Terms and Conditions or a Vacation Plan contract will result in any Vacation
                      Plan becoming and void.
                      </p>
                      : 
                      <p className="cstmTermsText">
                      1. हमारे सभी अवकाश ऑफ़र डबल के आधार पर रातों और दिनों की चयनित संख्या के लिए मान्य हैं
                        प्रतिभागी होटल के लिए मानक होटल और क्रूज आवास के लिए स्थान
                        चेन और परिभ्रमण यात्रा कार्यक्रम लागू होते हैं।
                      <br/><br/>
                      2. सभी बुकिंग अवकाश उपलब्धता, मान्यता प्राप्त संघीय के दौरान स्थान की उपलब्धता और विविधताओं के अधीन हैं
                          आधिकारिक अवकाश और चयनित स्थानों में विशेष कार्यक्रम। ग्राहक को बुकिंग के साथ बुकिंग का अनुरोध करना चाहिए
                          पंजीकृत ईमेल से लॉग इन करके हमारी वेबसाइट के माध्यम से यात्रा की तारीख से प्रत्याशित समय
                          पता और पासवर्ड और उसके खाते पर पंजीकृत आदेशों में से एक का चयन करना।<br/>
                         मेरा यात्रा लाभ अनुरोध किए जाने के बाद पांच व्यवसाय के भीतर ग्राहक के संपर्क में रहेगा।
                      <br/><br/>
                      3. सभी अवकाश ऑफ़र दो वयस्कों के लिए मान्य हैं, 18 वर्ष या उससे अधिक उम्र के प्रमुख क्रेडिट कार्ड के साथ। अतिरिक्त
                          शामिल किए गए मेहमान अवकाश योजना के प्रकार पर निर्भर होंगे जिसे हासिल कर लिया गया है। <br/>
                          जब उपलब्ध हो, भोजन और पेय को एक विशिष्ट अवकाश योजना में शामिल किया जा सकता है। एक अतिरिक्त है
                          अतिरिक्त मेहमानों के लिए प्रति दिन का शुल्क।
                      <br/><br/>
                      4. जब तक माई ट्रैवल बेनिफिट्स द्वारा लिखित रूप में पुष्टि नहीं की जाती है, तब तक किसी भी पालतू जानवर की अनुमति नहीं है।
                      <br/><br/>
                      5. उपलब्धता के अधीन, अतिरिक्त रातों को रियायती दरों पर अनुरोध किया जा सकता है।
                      <br/><br/>
                      6. ब तक लिखित में अधिकृत नहीं किया जाता है, तब तक किसी भी अन्य अवकाश योजना के साथ संयोजन में अवकाश योजनाओं का उपयोग नहीं किया जा सकता है
                      मेरी यात्रा से लाभ
                      <br/><br/>
                      7. अवकाश योजना 18 वर्ष या उससे अधिक उम्र के वयस्कों सहित पात्र हैं, लेकिन सेक्स, दौड़, वैवाहिक स्थिति, समूह संघ, निवास या भौगोलिक सीमाओं तक सीमित नहीं हैं।
                      <br/><br/>
                      8. चयनित मेरी यात्रा लाभ अवकाश योजना की कीमत ग्राहक की कुल वित्तीय है मेरी यात्रा लाभ अवकाश योजना की खरीद के लिए दायित्व।
                      <br/><br/>
                      9. प्रतिभागी द्वारा ग्राहक किसी भी अतिरिक्त मौसमी या बुकिंग शुल्क के अधीन नहीं होगा
                          होटल या क्रूज; हालाँकि, ग्राहक स्वीकार करता है और सहमत है कि उसके लिए शुल्क लिया जा सकता है
                          ग्राहक द्वारा अनुरोध किए गए मानक कमरे में दी गई सुविधाओं से उन्नयन
                          चेक-इन या उसके दौरान, भाग लेने वाले होटल या क्रूज द्वारा चार्ज किए गए रहने के दौरान, अतिरिक्त बेड सहित,
                          तकिए, कमरे की सेवा और पसंद है। ग्राहक यात्रा से पहले कमरे के उन्नयन का अनुरोध करने के लिए स्वतंत्र है
                          मेरी यात्रा के लाभों और मेरी यात्रा के लाभों के लिए सीधे ग्राहक से अतिरिक्त शुल्क लिया जाएगा
                          अनुरोध किए गए नवीनीकरण के आधार पर प्रतिभागी होटल या क्रूज द्वारा स्थापित। मेरा यात्रा लाभ है
                          सीधे होटल या क्रूज के लिए किए गए किसी भी अनुरोध या भुगतान के लिए जिम्मेदार नहीं है। मेरा यात्रा लाभ
                          किसी भी मनोरंजक सेवाओं की पेशकश न करें और इस तरह कोई मनोरंजक शुल्क लागू नहीं किया जाएगा।
                      <br/><br/>

                      10. अवकाश योजनाओं में शामिल नहीं है या यात्रा के किसी भी अतिरिक्त खर्च को कवर नहीं करता है माय से जुड़ा हुआ है यात्रा के लाभ होटल में रहें, लेकिन इन तक सीमित नहीं:
                      <br/><br/>
                      i. यात्रा व्यय;<br/>
                      ii. गंतव्य व्यय;<br/>
                      iii. ग्राउंड ट्रांसपोर्टेशन खर्च;<br/>
                      iv. भोजन के व्यय; प्रतिभागी होटल या क्रूज द्वारा बिना शुल्क के सुसज्जित किसी भी अन्य से;<br/>
                      v. टिप्स और ग्रेच्युटी; तथा,<br/>
                      vi. मेरा यात्रा लाभ होटल स्टे से या उससे संबंधित कोई भी और सभी आकस्मिक या अन्य खर्च।<br/><br/>
                      11. मूल्य की पहली किस्त चयनित पहली भुगतान तिथि पर नामित कार्ड से ली जाएगी।<br/><br/>
                      12. सभी छुट्टी योजना के प्रस्ताव पहली भुगतान तिथि से बारह (12) महीने के लिए पूरी तरह से मान्य हैं, जब तक कि मेरा यात्रा लाभ द्वारा कोई एक्सटेंशन अधिकृत नहीं किया गया हो।<br/><br/>
                      13. जब तक ग्राहक को मेरे यात्रा लाभ द्वारा समय का विस्तार नहीं दिया जाता है:
                        <br/>
                          माई ट्रैवल बेनिफिट्स वेकेशन प्लान की समय सीमा समाप्त हो जाएगी और उसके बाद और शून्य हो जाएगी
                          ग्राहक माई ट्रैवल बेनिफिट्स वेकेशन प्लान का उपयोग करता है या उसे फिर से तैयार करता है, और अपनी यात्रा को पूरी तरह से पूरा करता है
                          पहली भुगतान तिथि से बारह (12) महीने। ऐसी घटना में, ग्राहक आगे स्वीकार करता है
                          और इस बात से सहमत हैं कि मेरी यात्रा के लाभों को अब मेरे यात्रा लाभ का सम्मान करने की कोई बाध्यता नहीं होगी
                          अवकाश प्रमाणपत्र।
                        <br/><br/>
                      14. मेरे यात्रा लाभ के एकमात्र विवेक पर, और ग्राहक द्वारा दिखाए गए अच्छे कारण के लिए, मेरी यात्रा
                          लाभ छह (6) महीने तक की अवधि के लिए किसी भी अवकाश योजना की समाप्ति तिथि बढ़ा सकते हैं
                          किसी भी मेरी यात्रा लाभ अवकाश योजना की मूल समाप्ति तिथि से।
                      <br/><br/>
                      इस घटना में माई ट्रैवल बेनिफिट्स में एक वेकेशन प्लान की समाप्ति तिथि का विस्तार दिया गया है
                      ग्राहक का अनुरोध, ग्राहक आगे मानता है और सहमत है कि:
                      <br/><br/>
                     ए।) एग्रिड एक्सटेंशन पीरियड के दौरान की गई कोई भी बुकिंग केवल ट्रैवल डेट्स के लिए हो सकती है
                      यात्रा ऑफ-सीज़न के दौरान, और समायोजित दरों के अनुसार अतिरिक्त अधिभार के अधीन होगा
                      यात्रा का समय और चुना हुआ गंतव्य; तथा,<br/>
                    ख। इसमें निहित किसी भी भाषा के बावजूद, ग्राहक इसके हकदार नहीं होंगे
                      ग्राहक कैंसिल होने की स्थिति में वास्तव में माय ट्रैवल बेनिफिट्स को भुगतान की गई राशि में से किसी का भी रिफंड
                      सहमत विस्तार अवधि के दौरान किसी भी कारण से समझौता।

                      <br/><br/>

                      15. एक बार जब वे कुल राशि का भुगतान कर चुके हों, तो ग्राहक केवल मेरे यात्रा लाभ अवकाश योजना का उपयोग कर सकते हैं
                          कीमत। ग्राहक छुट्टी की कीमत के शेष राशि के भुगतान में तेजी ला सकता है
                          किसी भी समय योजना।
                      <br/><br/>
                      16. एक बार जब आप अवकाश योजना और मेरी यात्रा लाभ के उपयोग के लिए औपचारिक रूप से अपनी बुकिंग का अनुरोध करते हैं
                          लिखित रूप में बुकिंग की पुष्टि करता है, आप अपनी परिवहन योजनाओं के साथ आगे बढ़ सकते हैं। हम सलाह देते हैं कि नहीं
                          जब तक आपकी बुकिंग तारीख और गंतव्य के लिए मान्य नहीं हो जाती है, तब तक परिवहन के साधनों को बुक करें
                          आपकी पसंद और आपको ईमेल के माध्यम से लिखित रूप में एक पुष्टिकरण कोड मिला है।
                      <br/><br/>
                      17. जब भी संभव हो हम अपनी पहली अनुरोधित बुकिंग की तारीखों को समायोजित करने की पूरी कोशिश करते हैं। सभी बुकिंग
                          पुष्टि प्राप्त करने के लिए अनुरोधों को स्थापित बुकिंग प्रक्रिया का अनुपालन करना चाहिए।
                      <br/><br/>
                      18. मेरे यात्रा लाभ किसी भी प्रस्तावित गंतव्य के परिवर्तन के लिए ग्राहक को सूचित करेंगे।
                      <br/><br/>

                      19. किसी भी असाइन किए गए होटल की गुणवत्ता एक भौगोलिक स्थान से दूसरे स्थान पर भिन्न हो सकती है। मेरी यात्रा के लाभ
                        चुना गंतव्य पर असाइन किए गए होटल की गुणवत्ता में किसी भी बदलाव के लिए जिम्मेदार नहीं है।
                      <br/><br/>
                      20. सभी अवकाश ऑफ़र केवल आवास के लिए मान्य हैं। आप परिवहन के लिए जिम्मेदार होंगे,
                          सेवा शुल्क और आकस्मिक व्यय, जब तक कि मेरी यात्रा द्वारा लिखित रूप में पुष्टि और अधिकृत नहीं किया जाता है
                          लाभ।
                      <br/><br/>
                      21. अवकाश की योजनाओं को नकद, किसी भी मौद्रिक विचार, फिर से शुरू और न ही पुन: प्रस्तुत किया जा सकता है।
                        एक वेकेशन प्लान के अप्रयुक्त भागों के रिफंड नहीं होते हैं और यह 12 (बारह) महीनों में से समाप्त हो जाता है
                        पहला भुगतान देय तिथि। इसलिए, सभी यात्रा समाप्ति तिथि से पहले पूरी होनी चाहिए।
                      <br/><br/>
                      22. अवकाश योजनाएं हर समय पूरी तरह से हस्तांतरणीय हैं, क्या आपको इसे सभी शर्तों के अधीन एक उपहार के रूप में उपयोग करना चाहिए
                        शर्तेँ। ग्राहक लिखित प्रमाण पत्र को किसी भी व्यक्ति को, साथ में अवकाश प्रमाणपत्र हस्तांतरित करने का अनुरोध करेगा
                        उस व्यक्ति का 18 वर्ष या उससे अधिक आयु का एकमात्र प्रतिबंध और शर्तों के अधीन हो My Travel Benefits के साथ एक अवकाश योजना की शर्तें।
                      <br/><br/>
                      23. छुट्टी पर रहते हुए आपको हमारे होस्टिंग रिसॉर्ट्स में से एक द्वारा रोमांचक छुट्टी के अवसर प्रदान किए जा सकते हैं
                          आशा है कि आप भविष्य में उनके साथ छुट्टियां मनाएंगे। मेरा यात्रा लाभ इस तरह से संबद्ध नहीं है
                          ऑफ़र, और ऐसे प्रस्तावों में किए गए किसी भी दावे या अभ्यावेदन के लिए कोई जिम्मेदारी या दायित्व नहीं है, न ही है
                          किसी भी प्रस्तुति को किसी भी छुट्टी योजना की आवश्यकता में भाग लेना।
                      <br/><br/>
                      24. आपका चेक-इन पुष्टिकरण कोड और वैध फोटो पहचान (पासपोर्ट या ड्राइवर का लाइसेंस) होगा
                        चेक-इन पर और अधिकांश होटल और क्रूज़ पर आवश्यक वैध क्रेडिट कार्ड प्रस्तुत करना होगा
                        आकस्मिक शुल्क को कवर करें। यह एक मानक प्रक्रिया है और आपके क्रेडिट पर कोई शुल्क नहीं लगाया जाना चाहिए
                        कार्ड जब तक अन्यथा आपके चेक-आउट के समय होटल द्वारा निर्दिष्ट नहीं किया जाता है। चेक-इन और जारी रखा
                        अधिभोग हर समय भाग लेने वाले होटल और लागू कानूनों की सभी आवश्यकताओं के अधीन होना चाहिए।
                        <br/><br/>
                      25. ग्राहक किसी भी व्यक्तिगत कारण से माय ट्रैवल बेनिफिट्स वेकेशन प्लान रद्द कर सकता है। किसी के लिए
                          पहली भुगतान तिथि के बाद अनुरोध रद्द करने पर, मेरा यात्रा लाभ केवल बीस प्रतिशत वापस कर देगा
                          (२०%) वास्तव में माई ट्रैवल बेनिफिट्स को भुगतान की गई राशि। समाप्ति तिथि के बाद धनवापसी लागू नहीं होगी।
                          <br/><br/>
                      26. जब प्रतिभागी होटल या क्रूज में किसी भी प्रकार का भोजन शामिल किया जाता है, तो राशि और गुणवत्ता भिन्न हो सकती है।
                      <br/><br/>
                      27. समुद्र तटों, महासागरों, नदियों, झीलों, आदि के साथ गंतव्यों में स्थित होटल दूर से स्थित हो सकते हैं उन्हें।
                      <br/><br/>
                      28. सभी बुकिंग किसी भी स्थान पर कमरों की उपलब्धता के अधीन हैं।
                      <br/><br/>
                      29. किसी भी असुविधा, देरी, निराशा के लिए मेरा यात्रा लाभ जिम्मेदार नहीं होना है,
                          निराशा, दुर्घटना, चोट, रोजगार की हानि, या व्यक्तियों को नुकसान, चाहे वह शारीरिक हो या भावनात्मक
                          संकट, या ईश्वर का कोई कृत्य, आतंकवाद, या किसी भी दायित्व के साथ या साथ मिलकर उत्पन्न होने वाला
                          प्रदान की गई सेवाएं, या इसके नियंत्रण से परे किसी भी अन्य परिस्थिति जो यात्रा का कारण हो सकती है
                          अनुपलब्ध होने की व्यवस्था। इस घटना में कि कोई गंतव्य अनुपलब्ध है, मेरी यात्रा
                          लाभ एक स्थानापन्न गंतव्य की पेशकश करने के लिए व्यावसायिक रूप से उचित प्रयासों का उपयोग करेगा।
                                                <br/><br/>
                      30. मेरे सभी यात्रा लाभ अवकाश की योजनाएँ शून्य हैं जहाँ कानून द्वारा निषिद्ध है। सभी संघीय, राज्य और स्थानीय
                          कानून लागू होते हैं। मौखिक या अन्यथा कोई अन्य प्रतिनिधित्व किसी भी अवकाश योजना के साथ संयोजन के रूप में मान्य नहीं हैं।
                          <br/><br/>
                      31. किसी भी परिस्थिति में छूट या मानार्थ कूपन या टिकट का उपयोग लागू नहीं होगा।
                      <br/><br/>
                      32. ​यदि ग्राहक पहले से साठ (60) दिनों से कम समय में होटल बुकिंग का अनुरोध करता है
                          यात्रा की तारीख, ग्राहक यात्रा के उच्च-सीजन के दौरान गंतव्य बुक नहीं कर सकता है।
                          <br/><br/>

                      33. ट्रैवल ऑफ-सीज़न के दौरान बुकिंग के लिए, मेरा यात्रा लाभ इससे सहमत है कि यह 100% पूरी तरह से वापस कर देगा
                          ग्राहक द्वारा भुगतान की जाने वाली कीमत मेरी यात्रा के लाभों के लिए अनुरोधित बुकिंग प्रदान करने में विफल रहती है
                          एक प्रतिभागी होटल के साथ चयनित गंतव्य, बशर्ते इच्छित बुकिंग समय पर अनुरोध किया गया था
                          अवकाश योजना के उपयोग के लिए नियम और शर्तों के अनुसार। सभी स्वीकृत रिफंड होंगे
                          ग्राहक द्वारा उपयोग किए गए क्रेडिट या डेबिट कार्ड के माध्यम से ग्राहक को भुगतान किया जाता है। सभी स्वीकृत रिफंड होंगे
                          वापसी के लिए ग्राहक के अनुरोध के तीस (30) दिनों के भीतर मेरी यात्रा के लाभ की प्राप्ति।
                          <br/><br/>
                      34. मूल्य का भुगतान ग्राहक को माई ट्रैवल बेनिफिट्स वेकेशन प्लान का उपयोग करने और इसके आनंद के लिए प्रदान करता है
                          कैलेंडर वर्ष में लाभ; हालाँकि, ग्राहक स्वीकार करता है और उस दौरान सहमत होता है
                          हॉलिडे सीजन्स और / या स्पेशल डेट्स, बुकिंग पार्टिसिपेंट होटल्स में उपलब्धता के अधीन होगी, और यदि हो
                          बुकिंग दी गई है, यह रातों की संख्या और / या अन्य स्थितियों की सीमाओं के अधीन हो सकती है
                          चुने गए गंतव्य के आधार पर, प्रतिभागी होटल द्वारा लगाया या आवश्यक है।
                          <br/><br/>
                      35. इन नियमों और शर्तों या अवकाश योजना अनुबंध के किसी भी उल्लंघन का परिणाम किसी भी अवकाश में होगा बनने की योजना और शून्य।
                      </p>}
                    </Col>
                    </> : <>

                          <h3>  
                             {lang =='en' ? 'Privacy Policy and Terms': 'गोपनीयता नीति और शर्तें'} 
                             </h3>
                             <hr/>
                             <Col className="cstmTermsPopupWrapper">
                               {lang =='en' ? 
                                 <p className="cstmTermsText"> 
                                    Collection of personal information from site users of our website
                                    will be collected directly from our members/customers. Generally we will collect this
                                    when you deal with us either by telephone, letter, email or when you visit our
                                    website.<br/>
                                    My Travel Benefits will only collect personal information that is relevant for the purposes for
                                    which it is to be used. We will take reasonable steps to ensure that data is reliable
                                    for its intended use, accurate, complete, and current.<br/><br/>
                                    We will use personal information with any of the following purposes:<br/>
                                    a) To inform our members about account information.<br/>
                                    b) To provide prompt and effective customer service.<br/>
                                    c) To provide information about our services and updates.<br/><br/>
                                    All personal information including name, address, credit card numbers, phone and
                                    email address will be only used to tailor our products and services to better suit the
                                    interests of all our customers/members.<br/><br/>
                                    My Travel Benefits will not sell or disclose any personal information to organizations or
                                    companies known to collect such information expressly for the purposes of
                                    delivering unsolicited email or illicit materials. Personal information may be
                                    divulged when required by law, when protecting the legal rights and/or property of
                                    My Travel Benefits or when required for the use of a Vacation Plan.<br/>
                                    My Travel Benefits does not use cookies at the moment for functional purposes. The use of
                                    cookies is an industry standard, and many major websites use them to provide
                                    better service to their customers. <br/><br/>
                                    If you have any questions or concerns, please feel free to email us at customerservice@optucorp.com
                                  
                                 </p> 
                                 :  
                                  <p className="cstmTermsText"> 
                                    हमारी वेबसाइट के साइट उपयोगकर्ताओं से व्यक्तिगत जानकारी का संग्रह
                                    सीधे हमारे सदस्यों / ग्राहकों से एकत्र किया जाएगा। आम तौर पर हम इसे इकट्ठा करेंगे
                                    जब आप हमारे साथ टेलीफोन, पत्र, ईमेल या जब आप हमारी यात्रा करते हैं
                                    वेबसाइट।<br/>
                                    मेरा यात्रा लाभ केवल व्यक्तिगत जानकारी एकत्र करेगा जो कि प्रयोजनों के लिए प्रासंगिक है
                                    जिसका उपयोग किया जाना है। हम यह सुनिश्चित करने के लिए उचित कदम उठाएंगे कि डेटा विश्वसनीय है
                                    इसके इच्छित उपयोग के लिए, सटीक, पूर्ण और वर्तमान।<br/><br/>
                                    हम निम्नलिखित में से किसी भी उद्देश्य के साथ व्यक्तिगत जानकारी का उपयोग करेंगे:<br/>
                                    a) हमारे सदस्यों को खाता जानकारी के बारे में सूचित करने के लिए। <br/>
                                    b) शीघ्र और प्रभावी ग्राहक सेवा प्रदान करने के लिए।<br/>
                                    c) हमारी सेवाओं और अद्यतनों के बारे में जानकारी प्रदान करने के लिए।<br/><br/>
                                    नाम, पता, क्रेडिट कार्ड नंबर, फोन और सहित सभी व्यक्तिगत जानकारी
                                    ईमेल पता केवल हमारे उत्पादों और सेवाओं को बेहतर बनाने के लिए इस्तेमाल किया जाएगा
                                    हमारे सभी ग्राहकों / सदस्यों के हित।<br/><br/>
                                    मेरा यात्रा लाभ किसी भी व्यक्तिगत जानकारी को संगठनों को नहीं बेचेगा और न ही बताएगा
                                    कंपनियों के उद्देश्यों के लिए स्पष्ट रूप से इस तरह की जानकारी एकत्र करने के लिए जाना जाता है
                                    अवांछित ईमेल या अवैध सामग्री पहुंचाना। व्यक्तिगत जानकारी हो सकती है
                                    कानूनी अधिकारों और / या की संपत्ति की रक्षा करते समय, कानून द्वारा आवश्यक होने पर विभाजित
                                    मेरी यात्रा लाभ या जब एक अवकाश योजना के उपयोग के लिए आवश्यक हो।<br/>
                                   
                                    मेरे यात्रा लाभ फिलहाल कार्यात्मक उद्देश्यों के लिए कुकीज़ का उपयोग नहीं करते हैं। का उपयोग
                                    कुकीज़ एक उद्योग मानक है, और कई प्रमुख वेबसाइटें उन्हें प्रदान करने के लिए उपयोग करती हैं
                                    अपने ग्राहकों को बेहतर सेवा। <br/><br/>
                                    यदि आपके कोई प्रश्न या चिंताएँ हैं, तो कृपया हमें customerervice@optucorp.com पर ईमेल करें
                                 </p>}

                             </Col>
                           </>  
                         }
                    </Modal.Body>
                  </Modal>
                  {/* end cancel order Popup  */}
      </Container>
      
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupComponent)
