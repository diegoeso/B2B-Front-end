import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import styles from '../../Style.css'
import {Row, Col, Table, Container} from 'react-bootstrap'
import {Form, Button, Modal, Spinner} from 'react-bootstrap'
import profileBanner from '../../image/profileBanner.png'
import profile from '../../image/profile.png'
import connect from "react-redux/es/connect/connect";
import { ToastContainer, toast } from 'react-toastify';
import { changePassword,setErrorschangePassword } from '../../actions/AuthAction';
import { changePasswordValidator } from '../../validations/user';
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom'

const mapStateToProps = (state) => {
    return {
        user: state.session.user,
        customer: state.Auth.customer,
        isPending: state.Auth.isPending,
        errors: state.Auth.errors,
        langContent: state.Lang.langContent,
        lang: state.Lang.lang,
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        changePassword: (form) => dispatch(changePassword(form, props)),
        setErrorschangePassword:(errors) => dispatch(setErrorschangePassword(errors)),
    };
}

class ChangePasswordComponent extends Component {
    constructor(props) {
        super(props);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.state = {
            formFields: {
                old_password: '',
                new_password: '',
                confirm_password: '',
            },
            errors: {},
            isPending: false,
            btnState: true,
        }
    }

    inputChangeHandler(event) {
        let formFields = {...this.state.formFields};
        let langContent = this.props.langContent;
        let errors = this.state.errors;
        errors = changePasswordValidator(event, errors,langContent);
        if(Object.keys(errors).length>0  ){
            this.props.setErrorschangePassword(errors);
        }
        formFields[event.target.name] = event.target.value;
        this.setState({errors, formFields});
    }
    handleSubmit() {
        let token = this.props.user.token;
        let props = this.props;
        let errors = this.state.errors;
        this.setState({errors});
        let form = new FormData();
        let items = this.state.formFields;
        form.append('old_password', items.old_password);
        form.append('new_password', items.new_password);
        form.append('confirm_password', items.confirm_password);
        let flg = true;
        let langContent = this.props.langContent;
        
        Object.keys(items).map(ke => {
            if(items[ke].trim() =='' ){
                flg =false;
                errors[ke] = langContent.the+' '+langContent[ke]+' '+langContent.field_is_required;
            }
        })


        if (token != undefined && token != '' && flg) {
            props.changePassword(form);
        } else {
            if(Object.keys(errors).length >0  ){
                this.props.setErrorschangePassword(errors);
            }
            //console.log(errors);
            this.setState({errors});
        }
    }

    render() {
        const {user,langContent,lang,errors} = this.props;
        const {formFields } = this.state;
        console.log(errors);
        if (user == undefined && user == null) {
            return " ";
        }
    
        return (
            <>
            <Container className='cstm-home-container'>
                <section className='width100 comman-wrapper'>
                    {/* Start Banner Section */}

                    <Row> <img src={profileBanner} className='img-responsive cstm-profile-banner'/></Row>

                    {/* End Banner section */}
                    {/* Start Profile Info section */}
                    <section className='width100 user-profile-wrapper m-b-40'>
                        <Row>
                            {/* Profile Image and Name Section */}
                            <Col xl={12} xs={12} className='text-left user-profile-img-box changepass col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6'>

                                {user.uploads != undefined && user.uploads.file_name_url != undefined ?
                                    <img src={user.uploads.file_name_url} className='img-responsive profile-img'/>
                                    :
                                    <img src={profile} className='img-responsive profile-img'/>
                                }
                                <h2 className='user-name-text profile-name'>
                                    {user.full_name}
                                    <br clear='all'/>
                                    <span className='user-sx user-gender custom-user-pt30'> {user.gender == 1 ? langContent.male != undefined ? langContent.male :'Male' : langContent.female != undefined ? langContent.female :'Female'} </span>
                                </h2>
                            </Col>
                            {/* End PRofile image and name section */}
                            {/* Start Personal and card details info */}
                            <section className='width100'>
                                <Row className='personal-card-detail-box edit-card-wrapper'>
                                    {/*  Start personal inf0 */}
                                    <Col sm={12} xl={12} lg={12} xs={12} className='pad0'>
                                        <p className='prsnl-hdr'>
                                            <i className='fa-chevron-left fa m-r-20 cursor' onClick={this.props.history.goBack}/>
                                            {langContent.change_password != undefined ? langContent.change_password :'Change Password'}   

                                            
                                            <Button type='button' variant='primary' type='submit'
                                                    className='cust-save-btn btn btn-default btn-block'
                                                    onClick={ this.handleSubmit.bind(this) }
                                                    disabled={!this.state.btnState}>  {langContent.save != undefined ? langContent.save :'Save'} </Button>

                                            
                                        </p>
                                    </Col>
                                    {/* End Personal Info */}

                                    {/* Add card Info */}
                                    <Row className='add-card-input-box custom-validation-wrapper custom-card-information old-pass-wrapper'>
                                        <Col xs={12} sm={5} lg={5} md={5} xl={5} className='p-l-0'>
                                            <Form.Group>
                                                <label className="card-title">  {langContent.old_password != undefined ? langContent.old_password :'Old Password'} </label>
                                                <Form.Control type='password' placeholder={langContent.old_password != undefined ? langContent.old_password :'Old Password'} className='card-input'
                                                              name="old_password"
                                                    //          id="old_password"
                                                              onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                              value={formFields.old_password}
                                                              isInvalid={errors != undefined && !!errors.old_password}/>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.old_password != undefined ? <>
                                                    { errors.old_password[lang] !=undefined ? errors.old_password[lang] : errors.old_password }
                                                    </> :''}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        </Row>
                                    <Row className='add-card-input-box custom-validation-wrapper pass-wrapper custom-card-information'>
                                        <Col xs={12} sm={5} lg={5} md={5} xl={5} className='p-l-0'>
                                            <Form.Group>
                                                <label className="card-title">  {langContent.new_password != undefined ? langContent.new_password :'New Password'} </label>
                                                <Form.Control type='password' placeholder={langContent.new_password != undefined ? langContent.new_password :'New Password'} className='card-input'
                                                              name="new_password"
                                                      //        id="new_password"
                                                              onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                              value={formFields.new_password}
                                                              isInvalid={errors != undefined && !!errors.new_password}/>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.new_password != undefined ? errors.new_password[lang] !=undefined ? errors.new_password[lang] : errors.new_password : ''}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={5} lg={5} md={5} xl={5} className='p-l-0'>
                                            <Form.Group>
                                                <label className="card-title">  {langContent.re_enter_new_password != undefined ? langContent.re_enter_new_password :'Re-Enter New Password'} </label>
                                                <Form.Control type='password' placeholder={langContent.re_enter_new_password != undefined ? langContent.re_enter_new_password :'Re-Enter New Password'} className='card-input'
                                                              name="confirm_password"
                                                        //      id="confirm_password"
                                                              onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                              value={formFields.confirm_password}
                                                              isInvalid={errors != undefined && !!errors.confirm_password}/>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.confirm_password != undefined ? errors.confirm_password : ''}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Row>
                            </section>
                            {/* end personal and card details info */}
                        </Row>
                    </section>
                    {/* End Profile Info section */}
                </section>
            </Container>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)((ChangePasswordComponent));