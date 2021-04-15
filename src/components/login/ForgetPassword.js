import React from 'react'
import ReactDOM from 'react-dom'
import styles from '../../Style.css'
import classNames from 'classnames'
import { Row, Col, Container, InputGroup, Form, Button,Spinner} from 'react-bootstrap'
import authBanner from '../../image/authBanner.png'
import arrowIcon from '../../image/arrowLeft.png'
import { Link } from 'react-router-dom'
import logo from '../../image/logo.png'
import connect from 'react-redux/es/connect/connect'
import { forgotPassword, handleInputChange } from '../../actions/AuthAction';
import { getUrl,getCookie} from '../../constants.js'
import {handleChangeLang} from '../../actions/LangAction';
const mapStateToProps = (state) => {
  return {
    forgotPasswordSuccess: state.Auth.forgotPassword,
    errors: state.Auth.errors,
    customer: state.Auth.customer,
    isPending: state.Auth.isPending,
    langContent: state.Lang.langContent,
    lang: state.Lang.lang,
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    forgotPassword: () => dispatch(forgotPassword(props)),
    handleChangeLang: (lang) => dispatch(handleChangeLang(lang)),
    handleInputChange: (event) => {
      return dispatch(
        handleInputChange({ [event.target.name]: event.target.value })
      )
    }
  }
}
class ForgetPassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentWillMount() {
     let selectLang = getCookie('selectLang');
     this.setState({selectLang:selectLang});
    this.props.handleChangeLang(selectLang);
  }
  render () {
    const {
      handleInputChange,
      forgotPassword,
      errors,
      forgotPasswordSuccess,
      customer,
      isPending,langContent,lang
    } = this.props
    return (
      <>
        {/* Login Section */}
        <Container className='cstm-home-container'>

          <section>
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
                    className='img-responsive customAuthBanner'
                  />
                  <Col className='cstm-cmpny-dtl-bx'>

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
                  <Col xs={12} sm={12} lg={12} className='customAuthHeader'>
                    <h2 className='customHeaderLoginText'>
                      <Link to={getUrl(customer)+'login'}>
                        <img
                          src={arrowIcon}
                          className='img-responsive customLeftArrowIcon'
                        />
                       {langContent.login_text != undefined ? langContent.login_text :'Log In'}  
                      </Link>
                    </h2>
                    {customer.trim() !='' ? (<>
                    <Link to={getUrl(customer)+'signup'} className='cscustomNewAcnt-hdr'>
                    {langContent.create_new_account != undefined ? langContent.create_new_account :'Create New Account'}   
                    </Link>
                    <Link to={getUrl(customer)+'signup'}>
                      <Button className='CustomSignUpBtn'> {langContent.signup_text != undefined ? langContent.signup_text :'Sign Up'}</Button>
                    </Link>
                    </>) : ''}
                  </Col>
                  {/* End Auth Header Section */}
                  {/* Start Login Form */}
                  <Col xs={12} sm={12} lg={8} xl={6} className='customLoginBox'>
                    
                        <h2 className='customLoginText'> {langContent.login_forget_password_text != undefined ? langContent.login_forget_password_text :'Forget password ?'} </h2>
                        <Form className='CustomAuthFormBox login-form-main'>
                          <Form.Group className='m-b-30'>
                          <label class="login-txt">  {langContent.foget_email_id_text != undefined ? langContent.foget_email_id_text :'Entered registered email'}  </label>
                            <Form.Control
                              type='email'
                              placeholder={langContent.forget_email_id_placeholder != undefined ? langContent.forget_email_id_placeholder :'Registered Email Address'} 
                              className='customLoginInput'
                              name='email'
                              onChange={handleInputChange.bind(this)}
                               isInvalid={!!errors.forgotMessage}
                            />
                            <Form.Control.Feedback type='invalid'>
                              {errors.forgotMessage != undefined ? (
                                  <>{errors.forgotMessage[lang] !=undefined ? errors.forgotMessage[lang] : errors.forgotMessage }</>
                                ) : (
                                  ''
                                )}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Button
                            type='button'
                            variant='outline-primary'
                            className='customLoginSub-btn btn btn-default btn-block'
                            onClick={forgotPassword.bind(this)}
                          >
                            
                            {isPending ? <>
                              <Spinner
                              as="span"
                              animation="grow"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              />
                               {langContent.forget_resend_password_btn_text != undefined ? langContent.forget_resend_password_btn_text :'Send Password Reset Link'}   ...
                          </> : langContent.forget_resend_password_btn_text != undefined ? langContent.forget_resend_password_btn_text :'Send Password Reset Link'}
                          </Button>
                        </Form>
                     </Col>
                    <Col xs={12} sm={12} lg={12} xl={12} className='customLoginBox custom-chk-wrapper'>
                         {forgotPasswordSuccess != '' ? (
                          <p className='pswd-sent-text custom-chk'>
                          <i class="fa fa-check"></i> {forgotPasswordSuccess[lang] !=undefined ? forgotPasswordSuccess[lang] : forgotPasswordSuccess}
                        </p>
                        ) :''}
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
)(ForgetPassword)
