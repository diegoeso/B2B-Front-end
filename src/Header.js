import React, { Component } from 'react'
import { ListGroup, Col } from 'react-bootstrap/'
import ReactDOM from 'react-dom'
import FormControl from 'react-bootstrap/FormControl'
import { Row,Dropdown } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import $ from 'jquery'
import Container from 'react-bootstrap/Container'
import userHeader from './image/userHeader.png'
import wishListWhite from './image/heart.png'
import notificationWhite from './image/bell_new.png'
import bookingMgmtWhite from './image/book_new.png'
import orderListWhite from './image/orderListWhiteNew2.png'
import searchWhite from './image/searchWhite.png'
import logo from './image/logo.png'
import { Link } from 'react-router-dom'
import connect from "react-redux/es/connect/connect";
import { getUrl,getCookie,setCookie} from './constants.js'
import {Redirect} from 'react-router-dom';
import {logout,setCustomer} from './actions/AuthAction';

import {handleInputChange, submitSearch} from './actions/SearchAction';
import {getCustomerInfo} from './actions/HomeAction';
import {handleChangeLang} from './actions/LangAction';

const mapStateToProps = state => {
  return {
    session: state.session,
    customer: state.Auth.customer,
    lang: state.Lang.lang,
    langContent: state.Lang.langContent,
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    handleInputChange: (data) => dispatch(handleInputChange(data)),
    logout: () => dispatch(logout(props)),
    submitSearch: () => dispatch(submitSearch(props)),
    setCustomer: (customer) => dispatch(setCustomer(customer)),
    getCustomerInfo: (customer) => dispatch(getCustomerInfo(customer)),
    handleChangeLang: (lang) => dispatch(handleChangeLang(lang)),
  };
}

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      customer: '',
      selectLang:'en',
    }

  }
  componentWillMount() {
    let customer = '';
    
    if (this.props.history != undefined && this.props.history.location != undefined && this.props.history.location.pathname != undefined) {
      customer = this.props.history.location.pathname;
      customer = customer.replace('/','');
      this.props.setCustomer(customer);
      this.props.getCustomerInfo(customer); 
    }
     let selectLang = getCookie('selectLang');
     this.setState({selectLang:selectLang});
    this.props.handleChangeLang(selectLang);
  
  }

  handleInputChange = (event) => {
    this.props.handleInputChange({ [event.target.name]: event.target.value });
  }
  openMenu = () => {
    $(this.refs['menu-box']).toggle('')
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

    const {session,customer,logout, submitSearch,lang,langContent} = this.props;
    return (
      <Container className='cstm-home-container'>

        <Row className='width100'>
          <Col xs={12} sm={12} lg={12} className={session.authenticated ? 'customHeaderBlock homepage logged-in' : 'customHeaderBlock homepage' }>
            <Col xs={3} md={2} lg={2} xl={2} className='customFloatLeft'>
              <Link to={getUrl(customer)} style={{ color: '#000', textDecoration: 'none' }}>
                <img src={logo} className='img-responsive cstm-logo' />
              </Link>
            </Col>
            
            <Col xs={8} md={7} lg={7} xl={4} className= 'customFloatLeft p-l-5p lgt-search-box search-mob home'>
              <img src={searchWhite} className='cstm-hdr-search-icon cstm-hdr-home-icon' onClick={ submitSearch.bind(this) }/>
              <Form.Control type='text' name="keyword" placeholder= {langContent.header_search_text != undefined ? langContent.header_search_text :"Search by location or vacation type"} className='customSearchInput' onKeyPress={this.enterPressed.bind(this)} />
            </Col>
            <Col xs={4} md={2} lg={2} xl={6} className='customFloatRight'>
              {!session.authenticated ? <> 
                  <Link to={getUrl(customer)+'login'} className='CustomLogin dsply-none-mob'>
                  {langContent.footer_login_text != undefined ? langContent.footer_login_text :'Login'}     
                  </Link>
                  {customer.trim() !='' ? 
                      <Link to={getUrl(customer)+'signup'} className='customSignUp dsply-none-mob'>
                         {langContent.signup != undefined ? langContent.signup :'Sign Up'}  
                      </Link>
                  : ''}
              </> : <> 
              <Form className='dsply-none-mob m-t-5 lang'>
                <Form.Group
                  controlId='exampleForm.SelectCustom'
                  className='custom-lang-trns-box'
                >
                <Col>
                  <Form.Control
                    as='select'
                    custom
                    className='custom-Header-select'
                    onChange={this.handleChangeLang.bind(this)}
                    defaultValue={this.state.selectLang}
                  >
                    <option value="en" className="lang-en language">{langContent.english}</option>
                    <option value="hindi" className="lang-hnd language">{langContent.hindi}</option>
                  </Form.Control>
                  </Col>
                </Form.Group>
              </Form>
              <Dropdown className='user-dropdown-box'>
                <Dropdown.Toggle className='cstm-header-drop-down-btn'>
                {session.user.uploads != undefined && session.user.uploads.thumbnail_url != undefined ?   <img src={session.user.uploads.thumbnail_url} className='img-responsive header-user-icon home-header'/>
                  :
                   <img src={userHeader} className='img-responsive header-user-icon '/>
               }
                 
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item className="lang-link"><Link to={getUrl(customer)+"user-profile"}>{langContent.account != undefined ? langContent.account :'Account'} </Link></Dropdown.Item>
                  <Dropdown.Item className="lang-link"><Link to={getUrl(customer)+"change-password"}> {langContent.change_password != undefined ? langContent.change_password :'Change Password'}</Link></Dropdown.Item>
                  <Dropdown.Item className="lang-link" href='#' onClick={logout.bind(this)}>  {langContent.logout != undefined ? langContent.logout :'Logout'} </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

             <Link to={getUrl(customer)+'wishlist'}><img src={wishListWhite}  className='img-responsive header-icon dsply-none-mob custom-sidelink' /></Link>
              <Link to={getUrl(customer)+'notification'} >
              
               <img src={notificationWhite}  className='img-responsive header-icon  dsply-none-mob custom-sidelink' />
              </Link>
              <Link to={getUrl(customer)+'bookings'}><img src={bookingMgmtWhite} className='img-responsive header-icon dsply-none-mob custom-sidelink' /></Link>
              <Link to={getUrl(customer)+'order'}><img src={orderListWhite} className='img-responsive header-icon dsply-none-mob custom-sidelink' /></Link>  
              
              </> }

              <i
                className='fa fa-bars cstm-mob-menu-icon'
                onClick={this.openMenu.bind(this)}
              />
               {!session.authenticated ? <> 
              <Form className='dsply-none-mob lang'>
                <Form.Group 
                  controlId='exampleForm.SelectCustom'
                  className='custom-lang-trns-box'
                >
                  <Form.Control
                    as='select'
                    custom
                    className='custom-Header-select' size='60'
                    onChange={this.handleChangeLang.bind(this)}
                     defaultValue={this.state.selectLang}
                  >
                    <option value="en" className="lang-en language">{langContent.english}</option>
                    <option value="hindi" className="lang-hnd language">{langContent.hindi}</option>
                  </Form.Control>
                </Form.Group>
              </Form></>
              :''}

              {/* This section is used when user login.     */}
              {/* <Dropdown className='user-dropdown-box'>
                <Dropdown.Toggle className='cstm-header-drop-down-btn'>
                  <img
                    src={userHeader}
                    className='img-responsive header-user-icon'
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href='/user-profile'>Acount</Dropdown.Item>
                  <Dropdown.Item href='#'>Change Password</Dropdown.Item>
                  <Dropdown.Item href='#'>Setting</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

             <Link to="/wishlist"><img src={wishListWhite}  className='img-responsive header-icon dsply-none-mob' /></Link>
              <Link to="#"><img src={notificationWhite} className='img-responsive header-icon  dsply-none-mob' /></Link>
              <Link to="/booking"><img src={bookingMgmtWhite} className='img-responsive header-icon dsply-none-mob' /></Link>
              <Link to="/order"><img src={orderListWhite} className='img-responsive header-icon dsply-none-mob' /></Link>   */}
              
              {/* For Inner header */}

              {/* Inner Header Section */}
            </Col>
            <Col xs={12} xl={12} ref='menu-box' className='cstm-mob-menu-box'>
              <ListGroup onClick={this.openMenu.bind(this)}>
               {!session.authenticated ? <>
                <ListGroup.Item>
                  <Link to={getUrl(customer)+'login'}>  {langContent.login_text != undefined ? langContent.login_text :' Log In'}  </Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Link to={getUrl(customer)+'signup'}>   {langContent.signup_text != undefined ? langContent.signup_text :'Sign Up'}  </Link>
                </ListGroup.Item>
                </> : <>
                <ListGroup.Item>
                <Link to={getUrl(customer)+'wishlist'}>
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
                </ListGroup.Item> </> }
              </ListGroup>
            </Col>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)((Header)); 
