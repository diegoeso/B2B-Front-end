import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import styles from '../../Style.css'
import { Row, Col, Table, Container, Modal, Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import profileBanner from '../../image/profileBanner.png'
import profile from '../../image/profile.png'
import pencilEdit from '../../image/pencil.svg'
import { getUrl,API_URL} from '../../constants'
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import { Link } from 'react-router-dom'
import {
   setCustomer,getState,getCountries,getCity,toggleDeleteCardPopup, deleteCard,addCard
   } from '../../actions/AuthAction';
import axios from 'axios';

const mapStateToProps = state => {
  return {
    user: state.Auth.user,
    customer: state.Auth.customer,
    countries: state.Auth.countries,
    states: state.Auth.states,
    cities: state.Auth.cities,
    langContent: state.Lang.langContent,
    deleteCardPopup: state.Auth.deleteCardPopup,

  }
}
const mapDispatchToProps = (dispatch) => {
  return {
     setCustomer: (customer) => dispatch(setCustomer(customer)),
     getCountries: () => dispatch(getCountries()),
     getState: (id) => dispatch(getState(id)),
     getCity: (id) => dispatch(getCity(id)),
     toggleDeleteCardPopup: (status) => dispatch(toggleDeleteCardPopup(status)),
     deleteCard: (card) => dispatch(deleteCard(card)),
     addCard: (response,props) => dispatch(addCard(response,props)),
  };
}


class UserProfileComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cardDetail: null,
    }
  }

  componentWillMount() {
        this.props.getCountries();
        
        if(this.props.user != undefined && this.props.user.address != undefined && this.props.user.address != null) {
            this.props.getState(this.props.user.address.country_id);
            this.props.getCity(this.props.user.address.state_id);
        }
  }

  toggleDeleteCardPopup = (card) => {
    this.state.cardDetail = card;
    this.props.toggleDeleteCardPopup(!this.props.deleteCardPopup);
  }
  deleteCard = () => {
    this.props.deleteCard(this.state.cardDetail);
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
    const {user, customer,langContent, deleteCardPopup, deleteCard} = this.props;
    const { cardDetail } = this.state;
    if(user==undefined && user==null)
    {
    return " ";
    }
    
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
            <section className='width100 user-profile-wrapper main-user m-b-40'>
              <Row>
                {/* Profile Image and Name Section */}
                <Col xl={6} xs={6} sm={6} md={6} lg={6} className='text-left user-profile-img-box userinfo'>
                  
                  {user.uploads != undefined && user.uploads.file_name_url != undefined?
                            <img src={user.uploads.file_name_url} className='img-responsive profile-img'/> 
                            : 
                            <img src={profile} className='img-responsive profile-img' />
                          }
                  <h2 className='user-name-text profile-name'>
                    {user.full_name}
                    <br clear='all' />
                    <span className='user-sx user-gender custom-user-pt30'> {user.gender == 1 ? langContent.male != undefined ? langContent.male :'Male' : langContent.female != undefined ? langContent.female :'Female'} </span>
                  </h2>
                </Col>

                <Col xl={6} xs={6} sm={6} md={6} lg={6} className=' user-profile-img-box'>
                  <Link to={getUrl(customer)+"change-password"}><span className='cstm-change-pass-txt'>  {langContent.change_password != undefined ? langContent.change_password :'Change Password'}  </span></Link>
                </Col>

                {/* End PRofile image and name section */}
                {/* Start Personal and card details info */}
                <section className='width100'>
                  <Row className='personal-card-detail-box user-info-wrapper'>
                    {/*  Start personal inf0 */}
                    <Col xl={5} lg={5} xs={12} className='pad0'>
                      <p className='prsnl-hdr'>
                        <i className='fa-chevron-left fa m-r-20 cursor' onClick={this.props.history.goBack}/>
                        {langContent.personal_information != undefined ? langContent.personal_information :'Personal Information'}
                        <Link to={getUrl(customer)+"edit-profile"}><img src={pencilEdit} className='img-responsive  prsnl-edit-icon'/></Link>
                      </p>
                      <Col xl={12} className='prsnl-info-box user-box'>
                        <Table responsive className='prsnl-dtls-table'>
                          <tbody>
                            <tr>
                              <td>
                                <span className='prsnl-dtl-table-hdr'>
                                {langContent.login_email_id_text != undefined ? langContent.login_email_id_text :'Email Address'} :
                                </span>
                              </td>
                              <td>
                                
                                <span className='prsnl-dtl-table-txt'>
                                  {user.email}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                
                                <span className='prsnl-dtl-table-hdr'>
                                {langContent.employer != undefined ? langContent.employer :'Employer'} :
                                </span>
                              </td>
                              <td>
                                
                                <span className='prsnl-dtl-table-txt'>
                                  {user.customer !=undefined && user.customer.company !=undefined ? user.customer.company : ''}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                
                                <span className='prsnl-dtl-table-hdr'>
                                {langContent.dob != undefined ? langContent.dob :'DoB'}  :
                                </span>
                              </td>
                              <td>
                                
                                <span className='prsnl-dtl-table-txt'>
                                 {moment(user.date_of_birth).format("DD/MM/YYYY")}
                                 
                                </span>
                              </td>
                            </tr>
                           { /*<tr>
                              <td>
                                
                                <span className='prsnl-dtl-table-hdr'>
                                {langContent.designation != undefined ? langContent.designation :'Designation'}  :
                                </span>
                              </td>
                              <td>
                                
                                <span className='prsnl-dtl-table-txt'>
                                  {user.designation}
                                </span>
                              </td>
                            </tr>*/}
                            <tr>
                              <td>
                                
                                <span className='prsnl-dtl-table-hdr'>
                                {langContent.address != undefined ? langContent.address :'Address'}  :
                                </span>
                              </td>
                              <td>
                                
                                <span className='prsnl-dtl-table-txt'>
                                  {user.address != undefined && user.address.address_line_one != undefined ? user.address.address_line_one : " "}

                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                
                                <span className='prsnl-dtl-table-hdr'>
                                {langContent.country != undefined ? langContent.country :'Country'}   :
                                </span>
                              </td>
                              <td>
                                
                                <span className='prsnl-dtl-table-txt'>
                                
                                  {user.countryName != undefined && user.countryName.country != undefined ? user.countryName.country : " "}

                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                
                                <span className='prsnl-dtl-table-hdr'>
                                {langContent.state != undefined ? langContent.state :'State'}  :
                                </span>
                              </td>
                              <td>
                                
                                <span className='prsnl-dtl-table-txt'>
                                  {user.stateName != undefined && user.stateName.region != undefined ? user.stateName.region : " "}

                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                
                                <span className='prsnl-dtl-table-hdr'>
                                {langContent.city != undefined ? langContent.city :'City'}  :
                                </span>
                              </td>
                              <td>
                                
                                <span className='prsnl-dtl-table-txt'>
                                  {user.cityName != undefined && user.cityName.city != undefined ? user.cityName.city : " "}

                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                
                                <span className='prsnl-dtl-table-hdr'>
                                {langContent.zip_code != undefined ? langContent.zip_code :'Zip Code'}   :
                                </span>
                              </td>
                              <td>
                                
                                <span className='prsnl-dtl-table-txt'>
                                  {user.address != undefined && user.address.pincode != undefined ? user.address.pincode : " "}

                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                
                                <span className='prsnl-dtl-table-hdr'>
                                {langContent.phone_number != undefined ? langContent.phone_number :'Phone Number'}    :
                                </span>
                              </td>
                              <td>
                                
                                <span className='prsnl-dtl-table-txt'>
                                  {user.phone_number}

                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                
                                <span className='prsnl-dtl-table-hdr'>
                                {langContent.mobile_number != undefined ? langContent.mobile_number :'Mobile Number'}    :
                                </span>
                              </td>
                              <td>
                                
                                <span className='prsnl-dtl-table-txt'>
                                 {user.mobile_number}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                
                                <span className='prsnl-dtl-table-hdr'>
                                {langContent.extension_umber != undefined ? langContent.extension_umber :'Extension Number'}      :
                                </span>
                              </td>
                              <td>
                                
                                <span className='prsnl-dtl-table-txt'>
                                  {user.extension_number}

                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                    </Col>
                    {/* End Personal Info */}
                    {/* Start Card Details Section */}
                    <Col xl={7} lg={7} xs={12} className='pad0'>
                      <p className='prsnl-hdr'>
                        
                      {langContent.cards_details != undefined ? langContent.cards_details :'Cards Details'}   

                        {/*<img
                          src={pencilEdit}
                          className='img-responsive  prsnl-edit-icon'
                        />*/}
                        <Link to="#" onClick={this.addRazorPay.bind(this)}><span className='cstm-add-card-txt add'>   {langContent.add_card != undefined ? langContent.add_card :'Add Card'}   </span></Link>
                      </p>

                      { user.cards != undefined ? user.cards.map(card => 
                      <Row xl={12} className='card-info-box'>
                        {/* Card Details section */}
                        <Col xs={12} md={12} lg={6} xl={6} className='pad0'>
                          <Col xl={12}>
                            <p className='card-number-box'>
                              <span className='card-number'>
                                
                               {card.number.match(/.{1,4}/g).join('-')}
                              </span>
                              <span className='card-type'>  {langContent.visa_card != undefined ? langContent.visa_card :'Visa Card'} </span>
                            </p>
                            <Table responsive className='cstm-card-dtls-table'>
                              <tbody>
                                <tr>
                                  <td>
                                    
                                    <span className='card-table-hdr'>
                                      
                                    {langContent.name_on_card != undefined ? langContent.name_on_card :' Name on card'}  
                                    </span>
                                  </td>
                                  <td>
                                    <span className='card-table-txt'>
                                      
                                      {card.holder_name}
                                    </span>
                                  </td>
                                </tr>
                                {/*<tr>
                                  <td>
                                    
                                    <span className='card-table-hdr'>
                                      
                                    {langContent.expiry_date != undefined ? langContent.expiry_date :'Expiry Date'}  

                                    </span>
                                  </td>
                                  <td>
                                    <span className='card-table-txt'>
                                      
                                      {moment(card.expiry_date).format("MM/YYYY")}
                                    </span>
                                  </td>
                                </tr>*/}
                              </tbody>
                            </Table>
                          </Col>
                        </Col>
                        {/* End Card Details section */}
                        {/* Start  Edit Card option  */}
                       {/* <Col xs={12} md={12} lg={6} xl={6} className='pad0'>
                          <Col xl={12}>
                            {Object.keys(user.cards).length > 1 ?
                                <span className='req-book-text cursor'
                                      onClick={this.toggleDeleteCardPopup.bind(this, card)}>  {langContent.delete_card != undefined ? langContent.delete_card : 'Delete Card'} </span>
                            : ''}
                         <Link to={getUrl(customer)+card.id+"/edit-card"}><span className='cstm-add-card-txt edit'>  {langContent.edit_card != undefined ? langContent.edit_card :'Edit Card'}   </span></Link>
                          </Col>
                        </Col>*/}
                        {/* End Edit card option  */}
                      </Row>) : ''}
                      
                    </Col>
                    {/* End card details section */}
                  </Row>
                </section>
                {/* end personal and card details info */}
                <Modal className="custom-model-size" size='lg' show={deleteCardPopup} aria-labelledby='example-modal-sizes-title-lg'>
                  <Modal.Header className='scdl-popup-header'>
                    <i className='fa fa-times pop-close-icon' onClick={this.toggleDeleteCardPopup.bind(this)}  />
                  </Modal.Header>
                  <Modal.Body className='pad32 order-cancel-popup'>
                    <h2 className='schdle-pop-heading text-center custom-hdr-padding'>
                      {langContent.delete_card != undefined ? langContent.delete_card :'Delete Card'}
                    </h2>

                    <Form.Group>

                      <label className="card-title">  {langContent.are_you_sure_to_delete_this_card != undefined ? langContent.are_you_sure_to_delete_this_card :'Are you sure to delete this card?'}  </label>
                      <br/><label className="card-title">  {deleteCardPopup && cardDetail != null? cardDetail.number.match(/.{1,4}/g).join('-') : ''}  </label>
                    </Form.Group>
                    <Row className="dummy-txt-wrapper">
                      <Button className='btn btn-block order-cncl-btn' onClick={this.toggleDeleteCardPopup.bind(this)}>   {langContent.cancel != undefined ? langContent.cancel :'Cancel'}  </Button>
                      <Button type="button" className='btn btn-block order-submit-btn' onClick={this.deleteCard.bind(this)}>   {langContent.yes != undefined ? langContent.yes :'Yes'}  </Button>
                    </Row>
                  </Modal.Body>
                </Modal>
              </Row>
            </section>
            {/* End Profile Info section */}
          </section>
        </Container>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)((UserProfileComponent));
