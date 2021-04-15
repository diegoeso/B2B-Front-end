import React from 'react'
import ReactDOM from 'react-dom'
import styles from '../../Style.css'
import classNames from 'classnames'
import { Row, Col, Container, InputGroup, Form, Button,Spinner} from 'react-bootstrap'
import authBanner from '../../image/authBanner.png'
import arrowIcon from '../../image/arrowicon.png'
import { Link } from 'react-router-dom'
import logo from '../../image/logo.png'
import connect from 'react-redux/es/connect/connect'
import { login, handleInputChange,setCustomer} from '../../actions/AuthAction';
import {handleChangeLang} from '../../actions/LangAction';
import { getUrl,getCookie} from '../../constants.js'
const mapStateToProps = (state) => {
  return {
    login: state.Auth.login,
    errors: state.Auth.errors,
    customer: state.Auth.customer,
    isPending: state.Auth.isPending,
    langContent: state.Lang.langContent,
    lang: state.Lang.lang,
    
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    login: () => dispatch(login(props)),
    setCustomer: (customer) => dispatch(setCustomer(customer)),
     handleChangeLang: (lang) => dispatch(handleChangeLang(lang)),
    handleInputChange: (event) => {
      return dispatch(
        handleInputChange({ [event.target.name]: event.target.value })
      )
    }
  }
}
class LoginComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentWillMount() {
    this.props.setCustomer(this.props.match.params.customer);
     let selectLang = getCookie('selectLang');
     this.setState({selectLang:selectLang});
    this.props.handleChangeLang(selectLang);
  }

   handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.login();
    }
  }

  render () {
    const { handleInputChange,customer, login, errors,isPending,langContent,lang } = this.props
    return (
      <>
        {/* Login Section */}
        <Container className='cstm-home-container'>
          <section>
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
                    className='img-responsive customAuthBanner'
                  />
                  <Col className='cstm-cmpny-dtl-bx'>
                    <Link to={getUrl(customer)}>
                      <img src={logo} className='img-responsive auth-logo' />
                    </Link>
                    <p className='auth-left-banner-text'>
                    {langContent.login_banner_heading_one != undefined ? langContent.login_banner_heading_one :'Continue to your account'}   
                    </p>
                    
                  </Col>
                </Col>
                <Col xs={12} sm={6} lg={7} xl={7} md={6}>
                  {/* Auth Header Section */}
                  <Col xs={12} sm={12} lg={12} className='customAuthHeader'>
                    {customer.trim() !='' ? (<>
                    <Link to={getUrl(customer)+'signup'} className='cscustomNewAcnt-hdr'>
                    {langContent.create_new_account != undefined ? langContent.create_new_account :'Create New Account'}   
                    </Link>
                    <Link to={getUrl(customer)+'signup'}>
                      <Button className='CustomSignUpBtn'>  {langContent.signup_text != undefined ? langContent.signup_text :'Sign Up'} </Button>
                    </Link>
                    </>) : '' }
                  </Col>
                  {/* End Auth Header Section */}
                  {/* Start Login Form */}
                  <Col xs={12} sm={12} lg={8} xl={6} className='customLoginBox'>
                    <h2 className='customLoginText'>
                    {langContent.login_text != undefined ? langContent.login_text :'Log In'}    
                      <img
                        src={arrowIcon}
                        className='img-responsive customArrowIcon'
                      />
                    </h2>
                    <Form className='CustomAuthFormBox login-form-main'>
                      {errors.message != undefined ? (
                        <p className='error'>{errors.message[lang] != undefined ? errors.message[lang] :  errors.message}</p>
                      ) : (
                        ''
                      )}
                      <Form.Group
                        controlId='validationFormik03'
                        className='m-b-30'
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
                          onKeyPress={this.handleKeyPress}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.password != undefined ? errors.password : ''}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Button
                        type='button'
                        variant='outline-primary'
                        className='customLoginSub-btn btn btn-default btn-block'
                        onClick={login.bind(this)}
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

                      <Link to={getUrl(customer)+'forget'} className='customFrgtPsdtxt'>
                      {langContent.login_forget_password_text != undefined ? langContent.login_forget_password_text :'Forget password ?'} 
                      </Link>
                    </Form>
                  </Col>
                </Col>
              </Row>
            </Row>
          </section>
        </Container>
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent)
