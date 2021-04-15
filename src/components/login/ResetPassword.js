import React from 'react'
import ReactDOM from 'react-dom'
import styles from '../../Style.css'
import classNames from 'classnames'
import { Row, Col, Container, InputGroup, Form, Button,Spinner} from 'react-bootstrap'
import authBanner from '../../image/authBanner.png'
import arrowIcon from '../../image/arrowLeft.png'
import arrowIconRight from '../../image/arrowicon.png'
import logo from '../../image/logo.png'
import { Link } from 'react-router-dom'
import { resetPassword,handleInputSetPassword,setCustomer } from '../../actions/AuthAction';
import {validateEmail} from '../../constants';
import connect from 'react-redux/es/connect/connect'
import { toast } from 'react-toastify';
import { getUrl} from '../../constants.js'
const mapStateToProps = (state) => {
  return {
    signup: state.Auth.signup,
    errors: state.Auth.errors,
    flag: state.Auth.flag,
    customer: state.Auth.customer,
    isPending: state.Auth.isPending,
    langContent: state.Lang.langContent,
    lang: state.Lang.lang,
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    resetPassword: () => dispatch(resetPassword(props)),
    setCustomer: (customer) => dispatch(setCustomer(customer)),
    
    handleInputSetPassword: (event) => {
      return dispatch(
        handleInputSetPassword({ [event.target.name]: event.target.value })
      )
    },
  }
}
class ResetPassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentWillMount() {
    this.props.setCustomer(this.props.match.params.customer);
  }
  render () {
     const { signup,handleInputSetPassword, errors,resetPassword,customer,isPending,langContent,lang } = this.props
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
                      Make account with optucorp and
                    </p>
                    <p className='auth-left-banner-text'>
                      enjoy traveling
                    </p>
                  </Col>
                </Col>
                <Col xs={12} sm={6} lg={7} xl={7} md={6}>
                  {/* Auth Header Section */}

                  <Col xs={12} sm={12} lg={12} className='customAuthHeader'>
                    <h2 className='customHeaderLoginText'>
                      <img
                        src={arrowIcon}
                        className='img-responsive customLeftArrowIcon'
                      />
                      <Link to={getUrl(customer)+'login'} >
                        {langContent.login_text != undefined ? langContent.login_text :'Log In'}   
                        </Link>
                      
                    </h2>
                    
                    <Link to={getUrl(customer)+'signup'} className='cscustomNewAcnt-hdr'>
                    {langContent.create_new_account != undefined ? langContent.create_new_account :'Create New Account'}   
                    </Link>
                    <Link to={getUrl(customer)+'signup'}>
                      <Button className='CustomSignUpBtn'>  {langContent.signup_text != undefined ? langContent.signup_text :'Sign Up'} </Button>
                    </Link>

                  </Col>
                  {/* End Auth Header Section */}
                  {/* Start Login Form */}
                  <Col xs={12} sm={12} lg={6} className='customLoginBox'>
                    <h2 className='customLoginText'>
                      {langContent.reset_password}
                      <img
                        src={arrowIconRight}
                        className='img-responsive customArrowIcon'
                      />
                    </h2>
                    <Form className='CustomAuthFormBox login-form-main'>
                      <Form.Group
                        controlId='formBasicPassword'
                        className='m-b-30'
                      >
                      <label class="login-txt">{langContent.enter_new_password}</label>
                        <Form.Control
                          type='password'
                          placeholder={langContent.enter_new_password}
                          className='customLoginInput'
                          name='password'
                          onChange={handleInputSetPassword.bind(this)}
                          isInvalid={errors.reset_passwor != undefined && !!errors.reset_passwor.password}
                        />
                        <Form.Control.Feedback type='invalid'>
                              {errors.reset_passwor != undefined && errors.reset_passwor.password != undefined ?  errors.reset_passwor.password : ''}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        controlId='formBasicPassword'
                        className='m-b-30'
                      >
                      <label class="login-txt">{langContent.re_enter_new_password}</label>
                        <Form.Control
                          type='password'
                          placeholder={langContent.re_enter_new_password}
                          className='customLoginInput'
                          name='confirm_password'
                          onChange={handleInputSetPassword.bind(this)}
                          isInvalid={errors.reset_passwor != undefined && !!errors.reset_passwor.confirm_password}
                        />
                        <Form.Control.Feedback type='invalid'>
                              {errors.reset_passwor != undefined && errors.reset_passwor.confirm_password != undefined ?  errors.reset_passwor.confirm_password : ''}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Button
                        type='button'
                        variant='outline-primary'
                        className='customLoginSub-btn btn btn-default btn-block'
                        onClick={resetPassword.bind(this)}
                      >
                        {isPending ? <>
                              <Spinner
                              as="span"
                              animation="grow"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              />
                             {langContent.reset_password} ...
                          </> : langContent.reset_password }
                        
                      </Button>
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
)(ResetPassword) 
