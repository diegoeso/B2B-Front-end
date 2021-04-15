import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import styles from '../../Style.css'
import {Row, Col, Table, Container} from 'react-bootstrap'
import {Form, Button, Modal, Spinner} from 'react-bootstrap'
import profileBanner from '../../image/profileBanner.png'
import profile from '../../image/profile.png'
import connect from "react-redux/es/connect/connect";
import { ToastContainer, toast } from 'react-toastify';
import { pushOrUpdateCard } from '../../actions/AuthAction';
import { cardValidator } from '../../validations/card';
import moment from "moment";
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom'

const mapStateToProps = (state) => {
    return {
        session: state.session,
        user: state.Auth.user,
        customer: state.Auth.customer,
        disable_btn: state.Order.disableSubmitBtn,
        langContent: state.Lang.langContent,

    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        pushOrUpdateCard: (card, isCreate) => dispatch(pushOrUpdateCard(card, isCreate, props))
    };
}

class AddUserCardComponent extends Component {
    constructor(props) {
        super(props);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.state = {
            formFields: {
                type: 1,
                card_number: '',
                holder_name: '',
                expiry_date: '',
                cvv: '',
            },
            errors: {},
            isPending: false,
            btnState: true,
        }
    }

    inputChangeHandler(event) {
        let formFields = {...this.state.formFields};
        let langContent = this.props.langContent;
        let lang = this.props.lang;
        let errors = this.state.errors;

        if (event.target.name == 'card_number' && event.target.value != '') {
              let maskingCard = event.target.value.split('-').join('');
              event.target.value = maskingCard.match(/.{1,4}/g).join('-');
        }
        if (event.target.name == 'expiry_date') {
            event.target.value = event.target.value.replace(/^(\d\d)(\d)$/g,'$1/$2').replace(/[^\d\/]/g,'');
        }
        errors = cardValidator(event, errors,lang,langContent);
        formFields[event.target.name] = event.target.value;
        this.setState({errors, formFields});
    }

    handleSubmit() {
        let token = this.props.session.user.token;
        let langContent = this.props.langContent;
        let props = this.props;
        let flag = true;
        let errors = {};
        this.setState({errors});
        let form = new FormData();
        let items = this.state.formFields;
        if (token != undefined && token != '') {
            Object.keys(items).map(key => {
                if (key != "type") {
                    if (items[key].trim() == '') {
                        errors[key] = langContent.the+' '+langContent[key]+' '+langContent.field_is_required;
                        flag = false;
                    }
                }
            });
            this.setState({errors});
            if (Object.keys(errors).length == 0 && flag) {
                form.append('card_number', items.card_number);
                form.append('holder_name', items.holder_name);
                form.append('cvv', items.cvv);
                form.append('type', items.type);
                form.append('expiry_date', items.expiry_date);
                props.pushOrUpdateCard(form, true)
            } else {
                this.setState({errors});
            }
        } else {
            toast.error(langContent.please_login_first, {
                hideProgressBar:true,
            });
        }
    }

    render() {
        const {user,langContent} = this.props;
        const {errors} = this.state;
        if (user == undefined && user == null) {
            return " ";
        }
        return (
            <>
            <Container className='cstm-home-container'>
                <section className='width100 comman-wrapper '>
                    {/* Start Banner Section */}

                    <Row> <img src={profileBanner} className='img-responsive cstm-profile-banner'/></Row>

                    {/* End Banner section */}
                    {/* Start Profile Info section */}
                    <section className='width100 user-profile-wrapper m-b-40'>
                        <Row>
                            {/* Profile Image and Name Section */}
                            <Col xl={12} xs={12} className='text-left user-profile-img-box addusercard'>

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
                                            {langContent.new_card_information != undefined ? langContent.new_card_information :'New Card Information'}  

                                            
                                            <Button type='button' variant='primary' type='submit'
                                                    className='cust-save-btn btn btn-default btn-block'
                                                    onClick={ this.handleSubmit.bind(this) }
                                                    disabled={!this.state.btnState}>  {langContent.add_card != undefined ? langContent.add_card :'Add Card'} </Button>

                                            
                                        </p>


                                    </Col>


                                    {/* End Personal Info */}

                                    {/* Add card Info */}
                                    <Row
                                        className='add-card-input-box custom-validation-wrapper custom-card-information addcard1'>
                                        <Col xs={12} sm={5} lg={5} md={5} xl={5} className='p-l-0'>
                                            <Form.Group>
                                                <label className="card-title">  {langContent.card_number != undefined ? langContent.card_number :'Card Number'} </label>
                                                <Form.Control type='text' placeholder='xxxx-xxxx-xxxx-xxxx'
                                                              className='card-input cust-card-info' name="card_number"
                                                              onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                              value={this.state.formFields.card_number}
                                                              isInvalid={errors != undefined && !!errors.card_number}/>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.card_number != undefined ? errors.card_number : ''}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={5} lg={5} md={5} xl={5} className='p-l-0'>
                                            <Form.Group>
                                                <label className="card-title">  {langContent.name_on_card != undefined ? langContent.name_on_card :'Name On Card'} </label>
                                                <Form.Control type='text' placeholder={langContent.name_on_card != undefined ? langContent.name_on_card :'Name On Card'} className='card-input'
                                                              name="holder_name"
                                                              onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                              value={this.state.formFields.holder_name}
                                                              isInvalid={errors != undefined && !!errors.holder_name}/>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.holder_name != undefined ? errors.holder_name : ''}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={5} lg={5} md={5} xl={5} className='p-l-0'>
                                            <Form.Group>
                                                <label className="card-title">  {langContent.expiry_date != undefined ? langContent.expiry_date :'Expiry Date'} </label>
                                                <Form.Control type='text' placeholder='MM/YYYY' className='card-input'
                                                              name="expiry_date"
                                                              onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                              value={this.state.formFields.expiry_date}
                                                              isInvalid={errors != undefined && !!errors.expiry_date}/>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.expiry_date != undefined ? errors.expiry_date : ''}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={5} lg={5} md={5} xl={5} className='p-l-0'>
                                            <Form.Group>
                                                <label className="card-title">  {langContent.cvv_Number != undefined ? langContent.cvv_Number :'CVV Number'}  </label>
                                                <Form.Control type='text' placeholder={langContent.cvv != undefined ? langContent.cvv :'CVV'} className='card-input'
                                                              name="cvv"
                                                              onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                              value={this.state.formFields.cvv}
                                                              isInvalid={errors != undefined && !!errors.cvv}/>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.cvv != undefined ? errors.cvv : ''}
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

export default connect(mapStateToProps, mapDispatchToProps)((AddUserCardComponent));