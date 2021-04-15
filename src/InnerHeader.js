import React, { Component } from 'react'
import { ListGroup, Col, Dropdown } from 'react-bootstrap/'
import ReactDOM from 'react-dom'
import FormControl from 'react-bootstrap/FormControl'
import { Row,Modal,Button,Spinner } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import $ from 'jquery'
import Container from 'react-bootstrap/Container'
import userHeader from './image/userHeader.png'
import wishListWhite from './image/heart_blk.png'
import notificationWhite from './image/bell_blk.png'
import bookingMgmtWhite from './image/book_new_blk.png'
import orderListWhite from './image/orderListWhiteNew2blk.png'
import searchBlack from './image/searchBlack.png'
import logo from './image/logo.png'
import { Link } from 'react-router-dom'
import connect from "react-redux/es/connect/connect";
import {logout} from './actions/AuthAction';
import { getUrl} from './constants.js'
import {handleChangeLang} from './actions/LangAction';
import authBanner from './image/authBanner.png'
import arrowIcon from './image/arrowicon.png'
import { login, handleInputChange,setCustomer,toggleLogin } from './actions/AuthAction';
import {getCookie,setCookie} from './constants.js'

const mapStateToProps = state => {
  return {
    session: state.session,
    customer: state.Auth.customer,
    placeholder:'',
    lang: state.Lang.lang,
    langContent: state.Lang.langContent,
    login: state.Auth.login,
    errors: state.Auth.errors,
    isPending: state.Auth.isPending,
    displayPopUP:state.Auth.displayPopUp,
    lang: state.Lang.lang,
    langContent: state.Lang.langContent,

  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
     logout: () => dispatch(logout(props)),
     handleChangeLang: (lang) => dispatch(handleChangeLang(lang)),
     login: (status) => dispatch(login(props,status)),
     setCustomer: (customer) => dispatch(setCustomer(customer)),
     toggleLogin: (status) => dispatch(toggleLogin(status)),
     handleInputChange: (event) => {
       return dispatch(
         handleInputChange({ [event.target.name]: event.target.value })
       )
     }
  };
}

class InnerHeader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showPopup:false
    }
  }
  componentWillMount(){
    this.changePlaceholder();
     let selectLang = getCookie('selectLang');
     this.setState({selectLang:selectLang});
     this.props.handleChangeLang(selectLang);
  }
  openMenu = () => {
    $(this.refs['menu-box']).toggle('')
  }
  changePlaceholder=()=>{
    let screenWidth = window.innerWidth;
  
    if(screenWidth < 767) {
      this.setState({placeholder:'Search'});

    }
    else{
      this.setState({placeholder:'Search by location or vacation type'});
    }
  }

  handleClick = () => {
      this.props.toggleLogin(false)
  }

  enterPressed(event) {
    let strValue = event.target.value;
    if (event.key === 'Enter' && strValue.trim()!= '') {
      this.props.history.push(getUrl(this.props.customer)+"packages/search?keyword="+strValue);
    } 
 }

 handleChangeLang(event){
  let selectLang = event.target.value;
  this.props.handleChangeLang(selectLang);
  setCookie('selectLang',selectLang, 10);
  this.setState({selectLang:selectLang});
 }
 
  render () {
    const {session,customer,logout,lang,langContent,login,isPending,errors,handleInputChange,displayPopUP} = this.props;
 
    return (
      <Container className='cstm-home-container'>
        <Row>
        
          <Col xs={12} sm={12} lg={12} className={session.authenticated ? 'customHeaderBlock menu-bg-white logged-in-inner' : 'customHeaderBlock menu-bg-white' } >
            <Col xs={3} md={2} lg={2} xl={2} className='customFloatLeft'>
              <Link to={getUrl(customer)} style={{ color: '#000', textDecoration: 'none' }}>
                <img src={logo} className='img-responsive cstm-logo' />{' '}
              </Link>
            </Col>
            <Col xs={8} md={7} lg={7} xl={4} className='customFloatLeft lgt-search-box p-l-5p'>
              <img src={searchBlack} className='cstm-hdr-search-icon inner-cstm-hdr-search-icon' />
              <Form.Control
                type='text'
                placeholder= {langContent.header_search_text != undefined ? langContent.header_search_text :"Search by location or vacation type"}
                className='customSearchInput search-font-clr-dark inner-customSearchInput'
                onKeyPress={this.enterPressed.bind(this)}
              />
            </Col>
            <Col xs={1} md={2} lg={2} xl={5} className='customFloatRight'>
              <i className='fa fa-bars cstm-mob-menu-icon' onClick={this.openMenu.bind(this)} style={{ color: '#333' }}/>
              <Form className='dsply-none-mob lang langinner'>
                <Form.Group controlId='exampleForm.SelectCustom' className='inner-custom-lang-trns-box custom-lang-trns-box'>
                  <Form.Control as='select' custom className='custom-Header-select-dark'  onChange={this.handleChangeLang.bind(this)}
                   defaultValue={this.state.selectLang} >
                    <option value="en" className="lang-en language">{langContent.english}</option>
                    <option value="hindi" className="lang-hnd language">{langContent.hindi}</option>
                  </Form.Control>
                </Form.Group>
              </Form>

              {/* This section is used when user login. */}
               {!session.authenticated ? <> 
                  <Link to={getUrl(customer)+'login'} className='CustomLogin-inner dsply-none-mob'>
                    {langContent.footer_login_text != undefined ? langContent.footer_login_text :'Login'}    
                  </Link>
                  <Link to={getUrl(customer)+'signup'} className='customSignUp-inner dsply-none-mob'>
                     {langContent.signup != undefined ? langContent.signup :'Sign Up'}      
                  </Link>
              </> : <>
              <Dropdown className='inner-user-dropdown-box user-dropdown-box'>
                <Dropdown.Toggle className='cstm-header-drop-down-btn'>
                {session.user.uploads != undefined && session.user.uploads.thumbnail_url != undefined ?   <img src={session.user.uploads.thumbnail_url} className='img-responsive header-user-icon'/>
                  :
                   <img src={userHeader} className='img-responsive header-user-icon'/>
               }
                 
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item className="lang-link"><Link to={getUrl(customer)+"user-profile"}>{langContent.account != undefined ? langContent.account :'Account'}</Link></Dropdown.Item>
                  <Dropdown.Item className="lang-link"><Link to={getUrl(customer)+"change-password"}>{langContent.change_password != undefined ? langContent.change_password :'Change Password'}</Link></Dropdown.Item>
                  <Dropdown.Item className="lang-link" href='#' onClick={logout.bind(this)}>{langContent.logout != undefined ? langContent.logout :'Logout'}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              </>}

              {/* <Link to={getUrl(customer)+'wishlist'}><img src={wishListWhite}  className='img-responsive header-icon dsply-none-mob' /></Link>
              <Link to="#"><img src={notificationWhite} className='img-responsive header-icon  dsply-none-mob' /></Link>
              <Link to={getUrl(customer)+'booking'} ><img src={bookingMgmtWhite} className='img-responsive header-icon dsply-none-mob' /></Link>
              <Link to={getUrl(customer)+'order'} ><img src={orderListWhite} className='img-responsive header-icon dsply-none-mob' /></Link>   */}
              {/* For Inner header */}
              <Row className='main-hdr-icon-box'>
               { session.authenticated ? <> 
                <Col lg={2} className='hdr-icon-box'>
              
                  <Link to={getUrl(customer)+'order'}>
                    <img
                      src={orderListWhite}
                      className='img-responsive header-icon dsply-none-mob'
                    />{' '}
                  </Link>
                </Col>
                <Col lg={2} className='hdr-icon-box'>
                  <Link to={getUrl(customer)+'bookings'} >
                    <img
                      src={bookingMgmtWhite}
                      className='img-responsive header-icon  dsply-none-mob'
                    />
                  </Link>
                </Col>
                <Col lg={2} className='hdr-icon-box'>
                  <Link to={getUrl(customer)+'notification'} >
                    <img
                      src={notificationWhite}
                      className='img-responsive header-icon dsply-none-mob'
                    />
                  </Link>
                </Col>
                <Col lg={2} className='hdr-icon-box'>
                  <Link to={getUrl(customer)+'wishlist'} >
                    <img
                      src={wishListWhite}
                      className='img-responsive header-icon dsply-none-mob'
                    />
                  </Link>
                </Col>
                </> : ''}
              </Row>
              {/* Inner Header Section */}
            </Col>
            <Col xs={12} xl={12} ref='menu-box' className='cstm-mob-menu-box'>
              <ListGroup onClick={this.openMenu.bind(this)}>

              {!session.authenticated ? <> 
              <ListGroup.Item >
                
               
                <Link to={getUrl(customer)+'signup'} className='customSignUp-inner'>
                    {langContent.signup != undefined ? langContent.signup :'Sign Up'} 
                  </Link>

                </ListGroup.Item>

               

                <ListGroup.Item >

                <Link to={getUrl(customer)+'login'} className='CustomLogin-inner'>
                    {langContent.footer_login_text != undefined ? langContent.footer_login_text :'Login'} 
                  </Link>

                </ListGroup.Item>
                  </>: <>
              <ListGroup.Item >
                <Link to={getUrl(customer)+'wishlist'} >
                {langContent.wishlist_text != undefined ? langContent.wishlist_text :'WishList'}    </Link>
                </ListGroup.Item>
                <ListGroup.Item>
                <Link to={getUrl(customer)+'notification'}>
                {langContent.notification_text != undefined ? langContent.notification_text :'Notification'}    </Link>
                </ListGroup.Item>
                <ListGroup.Item>
                <Link to={getUrl(customer)+'bookings'}>
                {langContent.booking_mangement != undefined ? langContent.booking_mangement :' Booking Management'}    </Link>
                </ListGroup.Item>
                <ListGroup.Item>
                <Link to={getUrl(customer)+'order'}>
                {langContent.order_list != undefined ? langContent.order_list :'Order Listing'}     </Link>
                </ListGroup.Item>
                </>}
              </ListGroup>
            </Col>
          </Col>
        </Row>
        {/* start Comman Login Modal  */}

        <Modal className="custom-model-size mt50" size='lg' show={this.props.displayPopUP} aria-labelledby='example-modal-sizes-title-lg'>
                  
                    <Modal.Body className='pad0 order-cancel-popup'>
                    <section>

            <span aria-hidden="true" className='close-button' onClick={this.handleClick.bind(this)}>&times;</span>

            <Row className='login-comman-wrapper'>
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
                    className='img-responsive logincustomAuthBanner'
                  />
                  <Col className='login-cstm-cmpny-dtl-bx'>
                    <Link to={getUrl(customer)}>
                      <img src={logo} className='img-responsive auth-logo' />
                    </Link>
                    <p className='auth-left-banner-text'>
                    {langContent.login_banner_heading_one != undefined ? langContent.login_banner_heading_one :'Make account with optucorp and'}   
                    </p>
                    <p className='auth-left-banner-text'>
                    {langContent.login_banner_heading_two != undefined ? langContent.login_banner_heading_two :'enjoy traveling'}   
                    </p>
                  </Col>
                </Col>
                <Col xs={12} sm={6} lg={7} xl={7} md={6}>
                  {/* Auth Header Section */}
                 
                  {/* End Auth Header Section */}
                  {/* Start Login Form */}
                  <Col xs={12} sm={12} lg={12} xl={12} className='mt50'>
                    <h2 className='customLoginText'>
                    {langContent.login_text != undefined ? langContent.login_text :'Log In'}    
                      <img
                        src={arrowIcon}
                        className='img-responsive customArrowIcon'
                      />
                    </h2>
                    <Form className='CustomAuthFormBox login-form-main text-left'>
                      {errors.message != undefined ? (
                        <p className='error'>{errors.message}</p>
                      ) : (
                        ''
                      )}
                      <Form.Group
                        controlId='validationFormik03'
                        className='m-b-20'
                      >
                      <label class="login-txt">  {langContent.login_email_id_text != undefined ? langContent.login_email_id_text :'Email Address'} </label>
                        <Form.Control
                          type='email'
                          name='email'
                          placeholder={langContent.login_email_placeholder != undefined ? langContent.login_email_placeholder :'Email Address'}
                          className='customLoginInput'
                          onChange={handleInputChange.bind(this)}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.email != undefined ? errors.email : ''}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group
                        controlId='formBasicPassword'
                        className='m-b-30'
                      >
                      <label class="login-txt">  {langContent.login_password_text != undefined ? langContent.login_password_text :'Password'} </label>
                        <Form.Control
                          type='password'
                          placeholder= {langContent.login_password_text != undefined ? langContent.login_password_text :'Password'}
                          className='customLoginInput'
                          name='password'
                          onChange={handleInputChange.bind(this)}
                          isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.password != undefined ? errors.password : ''}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Button
                        type='button'
                        variant='outline-primary'
                        className='customLoginSub-btn btn btn-default btn-block'
                        onClick={login.bind(this,1)}
                      >
                        {isPending ? <>
                            <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            />
                            {langContent.login_text != undefined ? langContent.login_text :' Log In'}   ...
                          </> :  langContent.login_text != undefined ? langContent.login_text :' Log In'}
                        
                      </Button>
                      <Link to={getUrl(customer)+'signup'} className='customFrgtPsdtxt'>
                    {langContent.create_new_account != undefined ? langContent.create_new_account :'Create New Account'}   
                    </Link><br/>
                      <Link to={getUrl(customer)+'forget'} className='customFrgtPsdtxt'>
                      {langContent.login_forget_password_text != undefined ? langContent.login_forget_password_text :'Forget password ?'} 
                      </Link>
                    </Form>
                  </Col>
                </Col>
              </Row>
            </Row>
          </section>
                    </Modal.Body>
                  </Modal>
        {/* end comman login modal */}
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)((InnerHeader)); 
