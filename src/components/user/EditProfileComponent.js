import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import styles from '../../Style.css'
import { Row, Col, Table, Container } from 'react-bootstrap'
import {Form, Button, Modal, Spinner} from 'react-bootstrap'
import profileBanner from '../../image/profileBanner.png'
import profile from '../../image/profile.png'
import pencilEdit from '../../image/pencil.svg'
import connect from "react-redux/es/connect/connect";
import { ToastContainer, toast } from 'react-toastify';
import {API_URL, validateString, validateEmail,getUrl } from '../../constants';
import axios from 'axios';
/*import { addCard, handleInputCardChange } from '../actions/AuthAction';*/
import mediaIconCalendar from '../../image/mediaIconCalendar.png';

import selectArrow from '../../image/selectArrow.png';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from "moment";
import { Link } from 'react-router-dom'

/*import {
   setCustomer,
   } from '../../actions/AuthAction';
*/
import { getState,getCountries,getCities,updateClient} from '../../actions/AuthAction';


const mapStateToProps = state => {
    return {
        session: state.session,
        user: state.Auth.user,
        customer: state.Auth.customer,
        cities: state.Auth.stateCities,
        countries: state.Auth.countries,
        states: state.Auth.states,
        langContent: state.Lang.langContent,
        isPending: state.Auth.isPending,
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        getCountries: () => dispatch(getCountries()),
        getState: (id) => dispatch(getState(id)),
        getCities: (id) => dispatch(getCities(id)),
        updateClient: (form) => dispatch(updateClient(form, props))
    };
}

class EditProfileComponent extends Component {
    constructor (props) {
        super(props)
        this.state = {
            formFields: {
                first_name: '',
                last_name: '',
                email: '',
                customer_id: '',
                date_of_birth: '',
                designation: 'e',
                address: '',
                country_id: null,
                state_id: null,
                city_id: null,
                zip_code: '',
                phone_number: '',
                mobile_number: '',
                extension_number: '',
                gender: '',
            },
            dateOfBirth:'',
            errors: {},
            isPending: false,
            btnState: true,
            load:true,
            src: null,
        }
    }
    componentWillMount() {
        this.props.getCountries();

    }

    componentWillReceiveProps(nextProps){
        let load = this.state.load;
       if(nextProps.user != undefined && load && nextProps.user != undefined && nextProps.user.address != undefined && nextProps.user.address.state_id != undefined){
          if(nextProps.user != undefined && nextProps.user.address != undefined && nextProps.user.address != null) {
                this.props.getState(nextProps.user.address.country_id);
                this.props.getCities(nextProps.user.address.state_id);
            }
            let formFields = this.state.formFields;
            formFields.first_name = nextProps.user.first_name != undefined ? nextProps.user.first_name : '';
            formFields.last_name = nextProps.user.last_name != undefined ? nextProps.user.last_name : '';
            formFields.email = nextProps.user.email != undefined ? nextProps.user.email : '';
            formFields.company_name = nextProps.user.customer != undefined ? nextProps.user.customer.company : '';
            formFields.date_of_birth = nextProps.user.date_of_birth != undefined ? moment(nextProps.user.date_of_birth).format('YYYY-MM-DD') : '';
            this.state.dateOfBirth = nextProps.user.date_of_birth != undefined ? moment(nextProps.user.date_of_birth).toDate() : '';
            //formFields.designation = nextProps.user.designation != undefined ? nextProps.user.designation : '';
            formFields.phone_number = nextProps.user.phone_number != undefined ? nextProps.user.phone_number : '';
            formFields.mobile_number = nextProps.user.mobile_number != undefined ? nextProps.user.mobile_number : '';
            formFields.extension_number = nextProps.user.extension_number != undefined ? nextProps.user.extension_number : '';
            formFields.gender = nextProps.user.gender != undefined ? nextProps.user.gender : '';
            formFields.country_id = nextProps.user.address != undefined ? nextProps.user.address.country_id : '';
            formFields.state_id = nextProps.user.address != undefined ? nextProps.user.address.state_id : '';
            formFields.city_id = nextProps.cities != null && nextProps.user.address != undefined ? nextProps.user.address.city_id : '';
            formFields.zip_code = nextProps.user.address != undefined ? nextProps.user.address.pincode : '';
            formFields.address = nextProps.user.address != undefined ? nextProps.user.address.address_line_one : '';
            formFields.customer_id = nextProps.user.customer != undefined ? nextProps.user.customer.id : '';
            let src = nextProps.user.uploads != null ? nextProps.user.uploads.file_name_url : profile;
            this.setState({formFields,src,load:false});
           }
    }

    handleChange = (dateOfBirth) => {
        let langContent = this.props.langContent;
        let formFields = {...this.state.formFields};
        let errors = {...this.state.errors};
        let years = moment().diff(moment(dateOfBirth).format('YYYY-MM-DD'), 'years');
         if (years < 18) {
            errors['date_of_birth'] = langContent.the_date_of_birth_must_be_18_year_old;
         }
        formFields['date_of_birth'] = moment(dateOfBirth).format('YYYY-MM-DD');
        this.setState({ formFields, dateOfBirth, errors });
    }

    previewImg(e) {
        let langContent = this.props.langContent;
        let errors = this.state.errors;
        delete errors.image;
        let image = document.getElementById("image").files[0];
        if (image != undefined) {
            let size = image.size / 1024;
            if (image.type == "image/svg" || image.type == "image/png" || image.type == "image/jpeg" ||
                image.type == "image/jpg") {
            } else {
                errors['image'] = langContent.allowed_file_extensions;
            }
            if (size > 2000) {
                errors['image'] = langContent.max_file_size_allowed;
            }
        }
        this.setState({src: e.target.files[0] != undefined ? URL.createObjectURL(e.target.files[0]) : null, errors});
    }
    inputChangeHandler(event) {
        let langContent = this.props.langContent;
        let errors = {};
        let formFields = {...this.state.formFields};
        var field = {
            'first_name': {'type': 'string', 'min': 4, 'max': 50},
            'last_name': {'type': 'string', 'min': 4, 'max': 50},
            'email': {'type': 'email', 'max': 50},
            'extension_number' : {'type':'number', 'min': 2,'max':10},
            'phone_number' : {'type':'number', 'min': 4,'max':15},
            'mobile_number' : {'type':'number', 'min': 10,'max':10},
            'designation': {'type': 'string', 'max': 50},
            'zip_code' : {'type':'number', 'min': 4,'max':8},
        };
        let name = event.target.name;
        let eventValue = event.target.value;

        if (name == 'first_name' || name == 'last_name'|| name == 'designation' && eventValue != '') {
            if (field[name]['type'] == 'string') {
                if (!validateString(eventValue)) {
                    errors[name] = langContent.the+' ' + langContent[name] + ' '+langContent.field_must_be_string;
                }
            } else if (field[name]['max'] < eventValue.length) {
                errors[name] = langContent.the+' '+langContent[name]+' '+langContent.maximum+' ' + field[name]['max'] + ' '+langContent.characters_required;
            }
        } else if (name == 'zip_code' || name == 'phone_number' || name == 'mobile_number' || name == 'extension_number' && eventValue != '') {
            if(isNaN(eventValue)){
                errors[name] = langContent.the+' ' + langContent[name] + ' '+langContent.field_must_be_number;
            } else if(eventValue != '' && field[name]['min'] > eventValue.length) {
                errors[name] = langContent.the+' '+langContent[name]+' '+langContent.minimum+' ' + field[name]['min'] + ' '+langContent.characters_required;
            } else if(eventValue != '' && field[name]['max'] < eventValue.length) {
                errors[name] = langContent.the+' '+langContent[name]+' '+langContent.maximum+' ' + field[name]['max'] + ' '+langContent.characters_required;
            }
        } else if(name == 'email' && eventValue != '' && !validateEmail(eventValue)) {
            errors[name] = langContent.the+' '+langContent[name]+' '+langContent.must_valid_email_address;
        } else if (name == 'country_id' || name == 'state_id' && eventValue != '') {
            if (name == 'country_id') {
                this.props.getState(eventValue);
                formFields['state_id'] = '';
                formFields['city_id'] = '';
            } else if (name == 'state_id') {
                this.props.getCities(eventValue);
                formFields['city_id'] = '';
            }
        }
        formFields[name] = eventValue;
        this.setState({ formFields, errors });
    }
    handleSubmit() {
         let langContent = this.props.langContent;
        let token = this.props.session.user.token;
        if (token != '') {
            let flag = true;
            let errors = this.state.errors;
            let form = new FormData();
            let items = this.state.formFields;
            delete errors.image;
            let image = document.getElementById("image").files[0];
            if (image != undefined) {
                let size = image.size / 1024;
                if (image.type == "image/svg" || image.type == "image/png" || image.type == "image/jpeg" ||
                    image.type == "image/jpg") {
                } else {
                    errors['image'] = langContent.allowed_file_extensions;
                }
                if (size > 2000) {
                    errors['image'] = langContent.max_file_size_allowed;
                }
                form.image = image;
                form.append('files[]', image, image.name);
            }
            Object.keys(items).map(key => {
                    if (typeof items[key] != 'number' && items[key] != null) {
                        if (items[key].trim() == '') {
                            if (key != 'extension_number' && key != 'phone_number') {
                                errors[key] = langContent.the + ' ' + langContent[key] + ' ' + langContent.field_is_required;
                                flag = false;
                            }
                        }
                    } else if (items[key] == null || items[key] == '') {
                        errors[key] = langContent.the+' ' + langContent[key] + ' '+langContent.field_is_required;
                        flag = false;
                    }
            });

            if (Object.keys(errors).length == 0 && flag) {
                form.append('first_name', items.first_name);
                form.append('last_name', items.last_name);
                form.append('email', items.email);
                form.append('date_of_birth', moment(items.date_of_birth).format('YYYY-MM-DD'));
                form.append('designation', items.designation);
                form.append('address', items.address);
                form.append('country_id', items.country_id);
                form.append('state_id', items.state_id);
                form.append('city_id', items.city_id);
                form.append('zip_code', items.zip_code);
                form.append('phone_number', items.phone_number);
                form.append('mobile_number', items.mobile_number);
                form.append('extension_number', items.extension_number);
                form.append('gender', items.gender);
                this.props.updateClient(form);
            } else {
                this.setState({errors});
            }
        } else {
            toast.error(langContent.please_login_first, {
                hideProgressBar:true,
            });
        }
    }
  render () {
    const { user,cities,countries,states,langContent,isPending } = this.props;
    const { errors, formFields,src,load } = this.state;
    if(user!= undefined && user!= null && user.id !=undefined && load==false)
    {


    return (
      <>
        <Container className='cstm-home-container'>
          <section className='width100 comman-wrapper '>
            {/* Start Banner Section */}

            <Row>
              <img
                src={profileBanner}
                className='img-responsive cstm-profile-banner'
              />
            </Row>

            {/* End Banner section */}
            {/* Start Profile Info section */}
            <section className='width100 user-profile-wrapper m-b-40'>
              <Row>
                {/* Profile Image and Name Section */}
                <Col xl={12} xs={12} className='text-left user-profile-img-box editprofile'>
                    { src != null ?
                        <img id="display-img" src={src} className='img-responsive profile-img'/>
                        : ''}
                  <h4 className='user-name-text profile-name upload-txt'>
                      <Form.Group>
                          <Form.File id="image" name="image" accept="image/*" onChange={this.previewImg.bind(this)}/>
                          {langContent.upload_profile_picture != undefined ? langContent.upload_profile_picture :'  Upload Profile Picture'}
                          <Form.Control.Feedback type='invalid'>
                              {errors.image != undefined ? errors.image : ''}
                          </Form.Control.Feedback>
                      </Form.Group>

                  </h4>

                </Col>
                {/* End PRofile image and name section */}
                {/* Start Personal and card details info */}
                <section className='width100'>
                  <Row className='personal-card-detail-box edit-card-wrapper user-profile'>
                    {/*  Start personal inf0 */}
                    <Col sm={12} xl={12} lg={12} xs={12} className='pad0'>
                      <p className='prsnl-hdr'>
                          <i className='fa-chevron-left fa m-r-20 cursor' onClick={this.props.history.goBack}/>
                          {langContent.edit_personal_information != undefined ? langContent.edit_personal_information :'Edit Personal Information'}
                        <Button type='button' variant='primary' className='cust-save-btn btn btn-default btn-block' onClick={ this.handleSubmit.bind(this) }>
                            {isPending ? <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/> {langContent.save != undefined ? langContent.save :'Save'}</> : langContent.save != undefined ? langContent.save :'Save'}
                        </Button>
                      </p>
                    </Col>
                    {/* End Personal Info */}
                    {/* Edit card Info */}
                    <Row className='add-card-input-box custom-validation-wrapper custom-card-information editprofile1'>
                      <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                        <Form.Group>
                          <label className="card-title">  {langContent.first_name != undefined ? langContent.first_name :'First Name'}</label>
                            <Form.Control type='text' placeholder={langContent.first_name != undefined ? langContent.first_name :'First Name'} className='card-input'
                                          name="first_name"
                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                          value={formFields.first_name}
                                          isInvalid={errors != undefined && !!errors.first_name}/>
                            <Form.Control.Feedback type='invalid'>
                                {errors.first_name != undefined ? errors.first_name : ''}
                            </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                        <Form.Group>
                          <label className="card-title">  {langContent.last_name != undefined ? langContent.last_name :'Last Name'} </label>
                            <Form.Control type='text' placeholder={langContent.last_name != undefined ? langContent.last_name :'Last Name'} className='card-input'
                                          name="last_name"
                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                          value={formFields.last_name}
                                          isInvalid={errors != undefined && !!errors.last_name}/>
                            <Form.Control.Feedback type='invalid'>
                                {errors.last_name != undefined ? errors.last_name : ''}
                            </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                        <Form.Group>
                          <label className="card-title">  {langContent.login_email_id_text != undefined ? langContent.login_email_id_text :'Email Address'} </label>
                             <Form.Control type='email' placeholder={langContent.login_email_id_text != undefined ? langContent.login_email_id_text :'Email Address'}  className='card-input'
                                           name="email"
                                           readOnly
                                           onChange={(e) => this.inputChangeHandler.call(this, e)}
                                           value={formFields.email}
                                           isInvalid={errors != undefined && !!errors.email}/>
                             <Form.Control.Feedback type='invalid'>
                                 {errors.email != undefined ? errors.email : ''}
                             </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                        <Form.Group>
                          <label className="card-title">  {langContent.employer != undefined ? langContent.employer :'Employer'}  </label>
                            <Form.Control type='text' placeholder={langContent.employer != undefined ? langContent.employer :'Employer'} className='card-input'
                                          name="company_name"
                                          readOnly
                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                          value={formFields.company_name}
                                          isInvalid={errors != undefined && !!errors.company_name}/>
                            <Form.Control.Feedback type='invalid'>
                                {errors.company_name != undefined ? errors.company_name : ''}
                            </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                          <Form className="calendar-form">
                              <Form.Group controlId="exampleForm.ControlSelect1" className='m-b-30'>
                                  <label className="card-title">  {langContent.dob != undefined ? langContent.dob :'DOB'} :</label>
                                  <DatePicker
                                      selected={ this.state.dateOfBirth }
                                      name="date_of_birth"
                                      onChange={this.handleChange}
                                      className='card-input form-control'
                                      placeholderText={langContent.date_of_birth != undefined ? langContent.date_of_birth :'Date Of Birth' }
                                      isInvalid={errors != undefined && !!errors.date_of_birth}
                                  />
                                  <Form.Control.Feedback type='invalid'>
                                      {errors.date_of_birth != undefined ? errors.date_of_birth : ''}
                                  </Form.Control.Feedback>
                              </Form.Group>
                          </Form>
                      </Col>
                     {/* <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                        <Form.Group>
                          <label className="card-title">  {langContent.designation != undefined ? langContent.designation :'Designation'} </label>
                            <Form.Control type='text' placeholder={langContent.designation != undefined ? langContent.designation :'Designation'} className='card-input'
                                          name="designation"
                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                          value={formFields.designation}
                                          isInvalid={errors != undefined && !!errors.designation}/>
                            <Form.Control.Feedback type='invalid'>
                                {errors.designation != undefined ? errors.designation : ''}
                            </Form.Control.Feedback>
                        </Form.Group>
                      </Col>*/ }
                      <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                        <Form.Group>
                          <label className="card-title">  {langContent.address != undefined ? langContent.address :'Address'}</label>
                            <Form.Control type='text' placeholder={langContent.address != undefined ? langContent.address :'Address'} className='card-input'
                                          name="address"
                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                          value={formFields.address}
                                          isInvalid={errors != undefined && !!errors.address}/>
                            <Form.Control.Feedback type='invalid'>
                                {errors.address != undefined ? errors.address : ''}
                            </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                        <Form.Group>
                          <label className="card-title">  {langContent.country != undefined ? langContent.country :'Country'} </label>
                          <Form.Control as="select"  name="country_id" placeholder={langContent.country != undefined ? langContent.country :'Country'}  onChange={this.inputChangeHandler.bind(this)}  isInvalid={errors != undefined && !!errors.country_id} defaultValue={formFields.country_id}>
                              { countries != null ? countries.map((country, index)=> {
                                return <option key={country.id} value={country.id}  >{country.country}</option>;
                              }) : ''}
                          </Form.Control>
                          <Form.Control.Feedback type='invalid'>
                              {errors != undefined && errors.country_id != undefined ? errors.country_id : ''}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                        <Form.Group>
                          <label className="card-title">  {langContent.state != undefined ? langContent.state :'State'} </label>
                           <Form.Control as="select"  name="state_id" placeholder={langContent.state != undefined ? langContent.state :'State'} onChange={this.inputChangeHandler.bind(this)}  isInvalid={errors != undefined && !!errors.state_id} defaultValue={formFields.state_id}>
                               { states != null ? states.map((state, index)=> {
                                    return <option key={state.id} value={state.id} >{state.region}</option>;

                               }) : ''}
                          </Form.Control>
                            <Form.Control.Feedback type='invalid'>
                                {errors!= undefined && errors.state_id != undefined ?  errors.state_id : ''}
                            </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                        <Form.Group>
                          <label className="card-title">  {langContent.city != undefined ? langContent.city :'City'}</label>
                          <Form.Control as="select"  name="city_id" placeholder={langContent.city != undefined ? langContent.city :'City'} onChange={this.inputChangeHandler.bind(this)} defaultValue={formFields.city_id}>
                              { cities != null ? cities.map((city, index)=> {
                                  return <option key={city.id} value={city.id} >{city.city}</option>;
                              }) : ''}
                          </Form.Control>
                            <Form.Control.Feedback type='invalid'>
                                {errors!= undefined && errors.city_id != undefined ?  errors.city_id : ''}
                            </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                        <Form.Group>
                          <label className="card-title">  {langContent.zip_code != undefined ? langContent.zip_code :'Zip Code'} </label>
                            <Form.Control type='text' placeholder={langContent.zip_code != undefined ? langContent.zip_code :'Zip Code'} className='card-input'
                                          name="zip_code"
                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                          value={formFields.zip_code}
                                          isInvalid={errors != undefined && !!errors.zip_code}/>
                            <Form.Control.Feedback type='invalid'>
                                {errors.zip_code != undefined ? errors.zip_code : ''}
                            </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                        <Form.Group>
                          <label className="card-title">  {langContent.phone_number != undefined ? langContent.phone_number :'Phone Number'} </label>
                            <Form.Control type='text' placeholder={langContent.phone_number != undefined ? langContent.phone_number :'Phone Number'} className='card-input'
                                          name="phone_number"
                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                          value={formFields.phone_number}
                                          isInvalid={errors != undefined && !!errors.phone_number}/>
                            <Form.Control.Feedback type='invalid'>
                                {errors.phone_number != undefined ? errors.phone_number : ''}
                            </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                        <Form.Group>
                          <label className="card-title">  {langContent.mobile_number != undefined ? langContent.mobile_number :'Mobile Number'} </label>
                            <Form.Control type='text' placeholder={langContent.mobile_number != undefined ? langContent.mobile_number :'Mobile Number'} className='card-input'
                                          name="mobile_number"
                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                          value={formFields.mobile_number}
                                          isInvalid={errors != undefined && !!errors.mobile_number}/>
                            <Form.Control.Feedback type='invalid'>
                                {errors.mobile_number != undefined ? errors.mobile_number : ''}
                            </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                        <Form.Group>
                          <label className="card-title">  {langContent.extension_umber != undefined ? langContent.extension_umber :'Extension Number'} </label>
                            <Form.Control type='text' placeholder={langContent.extension_umber != undefined ? langContent.extension_umber :'Extension Number'} className='card-input'
                                          name="extension_number"
                                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                                          value={formFields.extension_number}
                                          isInvalid={errors != undefined && !!errors.extension_number}/>
                            <Form.Control.Feedback type='invalid'>
                                {errors.extension_number != undefined ? errors.extension_number : ''}
                            </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6} lg={5} md={5} xl={5} className='p-l-0'>
                        <Form.Group className="gender-wrapper">
                          <Form.Control type='radio' placeholder='' className='card-input card-cust-radio' name="gender" value="1" isInvalid={errors.gender != undefined && !!errors.gender} onChange={(e) => this.inputChangeHandler.call(this, e)} checked= {formFields.gender == 1 ? 'checked' : ''}/>
                            <label className='cust-radio-label'>
                            {langContent.male != undefined ? langContent.male :'Male'}
                            </label>
                           <Form.Control type='radio' placeholder='' className='card-input card-cust-radio' name="gender" value="2" isInvalid={errors.gender != undefined && !!errors.gender} onChange={(e) => this.inputChangeHandler.call(this, e)} checked= {formFields.gender == 2 ? 'checked' : ''}/>
                             <label className='cust-radio-label'>
                             {langContent.female != undefined ? langContent.female :'Female'}
                             </label>
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
} else{
        return " ";
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)((EditProfileComponent));
