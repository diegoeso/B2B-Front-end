import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../Style.css";
import responsive from "../../Responsive.css";
import classNames from "classnames";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form'
import banner from '../../image/banner.png'
import headingIcon from '../../image/headingIcon.png'
import aeroplane from '../../image/aeroplane.png'
import arrowIcon from '../../image/arrowicon.png'
import himachal from '../../image/himachal.png';
import kashmir from '../../image/kashmir.png';
import delhi from '../../image/newdelhi.png';
import indulgeOne from '../../image/indulgeone.png';
import romantic from '../../image/romantic.png';
import adventure from '../../image/adventure.png';
import cruise from '../../image/cruise.png';
import japan from '../../image/japan.png';
import italy from '../../image/italy.png';
import bali from '../../image/bali.png';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import tripImgOne from '../../image/tripImgOne.jpg';
import tripImgTwo from '../../image/tripImgTwo.jpg';
import tripImgThree from '../../image/tripImgThree.jpg';
import tripImgFour from '../../image/tripImgFour.jpg';
import mediaIconCanclPolicy from '../../image/mediaIconCanclPolicy.png';
import mediaIconTerms from '../../image/mediaIconTerms.png';
import mediaIconPersons from '../../image/family.png';
import mediaIconCalendar from '../../image/calendar_blk.png';
import mediaIconExclusion from '../../image/mediaIconExclusion.png';
import mediaIconInclusion from '../../image/mediaIconInclusion.png';
import cruiseTitle from '../../image/cruise_title.png';
import cruiseLiner from '../../image/cruise_liner.png';
import leavingFrom from '../../image/leaving_from.png';
import destination from '../../image/destination.png';
import destination1 from '../../image/destination1.png';
import airportTransport from '../../image/airportTransport.png';
import roomCategory from '../../image/room_category.png';
import sitesee from '../../image/find.png';
import roadtransport from '../../image/taxi_road.svg';
import airport from '../../image/taxi.png';
import flight from '../../image/plane.svg';
import meals from '../../image/meal.svg';
import dummy from '../../image/dummy.jpg';
import selectArrow from '../../image/selectArrow.png';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import connect from 'react-redux/es/connect/connect'
import { getProduct } from '../../actions/ProductAction';
import { addToOrder,handleInputChange } from '../../actions/OrderAction';
import {getHotelStart,getUrl,getEMIPrice,getPrice,getPricePerMonth,returnLanguageText,getCurrencySymbol} from "../../constants";
import moment from 'moment';
import { Link } from 'react-router-dom'
import { setCustomer, addToWishList, removeWishList, getWishList,toggleLogin } from '../../actions/AuthAction';
import ViewAllImageComponent from '../../components/booking/ViewAllImageComponent';
const mapStateToProps = (state) => {
  return {
    session: state.session,
    customer: state.Auth.customer,
    wishlist: state.Auth.wishlist,
    productDetails: state.Product.productDetails,
    order: state.Order.order,
    errors: state.Order.errors,
    isFavourite : state.Product.isFavourite,
    langContent: state.Lang.langContent,
    lang: state.Lang.lang,
    
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    getProduct: (id) => dispatch(getProduct(id)),
    addToWishList: (id) => dispatch(addToWishList(id)),
    removeWishList: (id) => dispatch(removeWishList(id)),
    setCustomer: (customer) => dispatch(setCustomer(customer)),
    addToOrder: () => dispatch(addToOrder(props)),
    toggleLogin: (status) => dispatch(toggleLogin(status)),
    handleInputChange: (event) => {
      return dispatch(
          handleInputChange({ [event.target.name]: event.target.value })
      )
    },
    handleDatetChange: (data) => {
          return dispatch(
              handleInputChange(data)
          )
      },
    getWishList: () => dispatch(getWishList()),
  }
}


class PackageComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startDate:'',
      hotel_type:[],
      emi_cost: '',
      frequency:1,
    };
    
  }

  componentWillMount() {
    let id = this.props.match.params.id;
    this.props.getProduct(id);
    this.props.setCustomer(this.props.match.params.customer);
    this.props.getWishList();
  
    
  }


  handleChange = (date) => {
      this.props.handleDatetChange ({'scheduled_date':moment(date).format('YYYY-MM-DD HH:mm:ss')});
    this.setState({
      startDate: date,
     
    });
  }

  handleFrequencyChange = (event) => {
      let frequency = event.target.value;
      let total_amount = this.props.productDetails.total_amount;
      let lang = this.props.lang;
      let emi_cost = getEMIPrice(total_amount, frequency, lang);
      this.setState({frequency,emi_cost});
      this.props.handleInputChange(event);
  }

  handleClick = () => {
   
      this.props.toggleLogin(true)
  }

  closePopup = (flag = false) => {
    this.setState({ openPopup: flag });
  }



  render() {

      const {session,productDetails,addToWishList,wishlist,removeWishList,customer, addToOrder,handleInputChange, errors, isFavourite,langContent,lang} = this.props;
      const { emi_cost,frequency } = this.state;

      if(productDetails == null) {
        return <div> </div>;
      }

      return (<>
         {/*section 1 starts  */}
         <section className = "width100 m-t-80 package-main-wrapper cust-nomar">
            <Container fluid>
              <Row className="breadcrumb-wrapper custom-breadcrumb">
                  <Col xs={11} sm={11} md={11} lg={11} className="custom-padding">
                     <Breadcrumb>
                        {this.props.match.params.catagary != undefined ?
                          <Breadcrumb.Item href="#">{this.props.match.params.catagary} </Breadcrumb.Item>
                        : ''}

                        <Breadcrumb.Item active href="#">{returnLanguageText(productDetails,lang,'title')} </Breadcrumb.Item>
                     </Breadcrumb>
                  </Col>
                  <Col className="heart-icon-wrapper" xs={1} sm={1} md={1} lg={1}>
                    { wishlist.includes(productDetails.id) || isFavourite == productDetails.id ?
                      <i className="fa fa-heart remove remove-wishlist" aria-hidden="true"  onClick={removeWishList.bind(this,productDetails.id)}></i>
                    :
                      <i className="fa fa-heart-o add add-wishlist" aria-hidden="true"  onClick={addToWishList.bind(this,productDetails.id)}></i>
                    }
                  </Col>
               </Row> {/*section 1 ends*/}
            </Container>{/*container ends*/}
         </section> {/*section 1 ends*/}

         {/*section 2 starts*/}
         <section className = "width100">
            <Container fluid>
               <Row className="splpackage-wrapper">
                  <Col xs={12} sm={6} md={6} lg={6} className = "trip-img-col1">

                    {productDetails.uploads[0] != undefined ?
                      <img src={productDetails.uploads[0].file_name_url} className = "trip-img-lg" />
                      :
                      <img src={dummy} className = "trip-img-lg" />
                    }

                  </Col>
                  <Col xs={12} sm={6} md={6} lg={6} className = "trip-img-col2">
                     <Row className="spl-packimg-col2">
                      {productDetails.uploads != undefined ? productDetails.uploads.slice(1, 5).map(upload => {
                        return <Col xs={12} sm={12} md={6} lg={6} className = "trip-img-col trip-col1" key={upload.id}>
                                <img src={upload.file_name_url} className = "trip-img  trip-img-sml" />
                               </Col>
                      }) : ''}
                       {  productDetails != null  && productDetails.uploads.length > 4 ? <> <Col xs={12} sm={6} md={6} lg={6} xl={6}> </Col> <Col xs={12} sm={6} md={6} lg={6} xl={6} className='book-view-inner-banner-box show-all'> <span  className="show-txt" onClick={this.closePopup.bind(this,true)}> Show all </span></Col> </> : ''}
        
                     </Row>{/*spl-packimg-col2 row ends*/}
                  </Col>
               </Row>{/*splpackage-wrapper ends*/}
            </Container>{/*container fluid ends*/}
         </section>{/*section 2 ends*/}
         {/*section 3 starts*/}
         <section className = "width100">
            <Container fluid>
               <Row className="package-details">
                  <Col xs={12} sm={6} md={6} lg={6} className = "customPopularDestinationBox1">
                     <Row className="rating-wrapper meals-detail">
                        <Col xs={12} sm={12} md={12} lg={12} className = "rating-info">
                            <p>  
                            {productDetails.package_type !== 1 ? <>{langContent.hotel_category != undefined ? langContent.hotel_category :' '}</> : <>
                              {langContent.room_category != undefined ? langContent.room_category :'Room Category'} 
                            </>} 
                           </p>
                           
                           <Col xs={4} sm={4} md={4} lg={2} className="rating-icon-wrapper">
                           {productDetails.package_type !== 1 ? <>
                          { typeof productDetails.hotel_type == 'object' ? productDetails.hotel_type[lang] : (<>

                            {getHotelStart(productDetails.hotel_type).map((hType,i) => {
                              return <i className="fa fa-star" aria-hidden="true" key={i}></i>;
                            })

                            }

                          </>)}
                          </> :  <>
                             { productDetails != null ? productDetails.room_categories[lang][productDetails.room_category] : ''}
                          </>}

                           </Col>{/*rating icon wrapper ends*/}
                           <Col xs={12} sm={8} md={8} lg={10} className="rating-btn-wrapper">
                           {productDetails.themes.length > 0 ? productDetails.themes.map(theme => {
                             return <Button variant="primary" className="rating-btn" size="sm" key={theme.id}>{lang =='hindi' ? theme.hindi_name : theme.name}</Button>;
                           }) : ''}


                           </Col>
                        </Col>{/*rating info ends*/}
                        <Col xs={12} sm={12} md={12} lg={12} className = "rating-info htl-ct1">
                           <p>
                               <span><img src={mediaIconCalendar} className="icon-calendar" /></span>
                                 {productDetails.days != undefined && productDetails.days != null ? <>{productDetails.days}   {langContent.days != undefined ? langContent.days :'Days'} </>: ''}
                                 {productDetails.nights != undefined && productDetails.nights != null ? <> {productDetails.nights}   {langContent.night != undefined ? langContent.night :'Night'}  </>: ''}

                           </p>
                           <p>
                              <span><img src={mediaIconPersons} className="icon-family" /></span>
                                {productDetails.adults != undefined && productDetails.adults != null ? <> {productDetails.adults}  {langContent.adults != undefined ? langContent.adults :'Adults'}  </>: ''}
                                {productDetails.children != undefined && productDetails.children != null ? <> , {productDetails.children}   {langContent.children != undefined ? langContent.children :'Children'} </>: ''}
                                {productDetails.juniors != undefined && productDetails.juniors != null ? <> , {productDetails.juniors}   {langContent.juniors != undefined ? langContent.juniors :'Juniors'} </>: ''}
                           </p>
                        </Col>{/*rating-info htl ends*/}
                     </Row>{/*rating-wrapper ends*/}

                      { productDetails.package_type == 1 ? <>
                      <section className='user-info-box'>
                          <Row className="package-meal-wrapper">
                              <Col xs={12} sm={12} md={12} lg={12} className = "facility-info no-desc">
                                  <Col className="cat-wrapper clearfix">
                                      <p>
                                          <span className="cat-icon clearfix"><img src={cruiseTitle} className="icon-calendar meal" /></span>
                                      </p>
                                  </Col>
                                  <Col className="meal-desc clearfix" >
                                      <span className="cat-name clearfix">   {langContent.cruise_title != undefined ? langContent.cruise_title :'Cruise Title'}  : { productDetails != null ? returnLanguageText(productDetails,lang,'title') : ''}</span>
                                  </Col>
                              </Col>
                              <Col xs={12} sm={12} md={12} lg={12} className = "facility-info no-desc">
                                  <Col className="cat-wrapper clearfix">
                                      <p>
                                          <span className="cat-icon clearfix"><img src={cruiseLiner} className="icon-calendar meal" /></span>
                                      </p>
                                  </Col>
                                  <Col className="meal-desc clearfix" >
                                      <span className="cat-name clearfix">   {langContent.cruise_liner != undefined ? langContent.cruise_liner :'Cruise Liner'}  : { productDetails != null ? returnLanguageText(productDetails,lang,'cruise_liner') : ''}</span>
                                  </Col>
                              </Col>
                              <Col xs={12} sm={12} md={12} lg={12} className = "facility-info no-desc">
                                  <Col className="cat-wrapper clearfix">
                                      <p>
                                          <span className="cat-icon clearfix"><img src={leavingFrom} className="icon-calendar meal" /></span>
                                      </p>
                                  </Col>
                                  <Col className="meal-desc clearfix" >
                                      <span className="cat-name clearfix">   {langContent.leaving_from != undefined ? langContent.leaving_from :'Leaving From'}  : { productDetails != null ? returnLanguageText(productDetails,lang,'leaving_from') : ''}</span>
                                  </Col>
                              </Col>
                              <Col xs={12} sm={12} md={12} lg={12} className = "facility-info no-desc">
                                  <Col className="cat-wrapper clearfix">
                                      <p>
                                          <span className="cat-icon clearfix"><img src={destination} className="icon-calendar meal" /></span>
                                      </p>
                                  </Col>
                                  <Col className="meal-desc clearfix" >
                                      <span className="cat-name clearfix">   {langContent.destination != undefined ? langContent.destination :'Destination'}  : { productDetails != null ? returnLanguageText(productDetails,lang,'destination') : ''}</span>
                                  </Col>
                              </Col>
                              {/*
                              <Col xs={12} sm={12} md={12} lg={12} className = "facility-info no-desc">
                                  <Col className="cat-wrapper clearfix">
                                      <p>
                                          <span className="cat-icon clearfix"><img src={roomCategory} className="icon-calendar meal" /></span>
                                      </p>
                                  </Col>
                                  <Col className="meal-desc clearfix" >
                                      <span className="cat-name clearfix">   {langContent.room_category != undefined ? langContent.room_category :'Room Category'}  : { productDetails != null ? productDetails.room_categories[lang][productDetails.room_category] : ''}</span>
                                  </Col>
                              </Col>
                               */}
                          </Row>
                      </section>
                      </> : '' }
                    {/*new content added*/}
                    {productDetails.package_type != 1 ? <>
                    <Row className="package-meal-wrapper">
                        <Col xs={12} sm={12} md={12} lg={12} className = "facility-info no-desc">
                              <Col className="cat-wrapper clearfix">
                                <p>
                                  <span className="cat-icon clearfix"><img src={meals} className="icon-calendar meal" /></span>
                                </p>
                              </Col>
                              <Col className="meal-desc clearfix" >
                                <span className="cat-name clearfix">   {langContent.meals != undefined ? langContent.meals :'Meals'}  : {productDetails.is_meal_included[lang]}</span>
                              </Col>
                        </Col>
                  </Row>
                    <Row className="package-meal-wrapper">
                        { productDetails != null && productDetails.package_type == 4 && productDetails.country != null ? <>
                        <Col xs={12} sm={12} md={12} lg={12} className = "facility-info no-desc">
                            <Col className="cat-wrapper clearfix">
                                <p>
                                    <span className="cat-icon clearfix"><img src={meals} className="icon-calendar meal" /></span>
                                </p>
                            </Col>
                            <Col className="meal-desc clearfix" >
                                <span className="cat-name clearfix">   {langContent.destination != undefined ? langContent.destination : 'Destination'}  : { productDetails.country.country}</span>
                            </Col>
                        </Col>
                        </> : <>
                        <Col xs={12} sm={12} md={12} lg={12} className = "facility-info no-desc">
                            <Col className="cat-wrapper clearfix">
                                <p>
                                    <span className="cat-icon clearfix"><img src={destination1} className="icon-calendar meal" /></span>
                                </p>
                            </Col>
                            <Col className="meal-desc clearfix" >
                                <span className="cat-name clearfix">   {langContent.destination != undefined ? langContent.destination : 'Destination'}  : { returnLanguageText(productDetails,lang,'destination')}</span>
                            </Col>
                        </Col>
                        </>
                        }
                        </Row>
                  <Row className="package-meal-wrapper">
                        <Col xs={12} sm={12} md={12} lg={12} className={productDetails.is_flight_included ==1 ? 'facility-info' : 'facility-info no-desc'}>
                            <Col className="cat-wrapper clearfix">
                                <p>
                                  <span className="cat-icon clearfix"><img src={flight} className="icon-calendar flight" /></span>
                                </p>
                            </Col>
                            <Col className="meal-desc clearfix">
                               <span className="cat-name clearfix">  {langContent.flights != undefined ? langContent.flights :'Flights'} : {productDetails.is_flight_included ==1 ? langContent.yes : langContent.no}</span>
                               {productDetails.is_flight_included ==1 ? <p className="transport-description">{returnLanguageText(productDetails,lang,'flight_description')}</p> : ''}
                               
                           </Col>
                      </Col>
                  </Row>
                  <Row className="package-meal-wrapper">
                       <Col xs={12} sm={12} md={12} lg={12} className={productDetails.is_airport_included ==1 ? 'facility-info' : 'facility-info no-desc'}>
                           <Col className="cat-wrapper clearfix">
                              <p>
                                <span className="cat-icon clearfix"><img src={airportTransport} className="icon-calendar airport" /></span>
                              </p>
                            </Col>
                            <Col className="meal-desc clearfix">
                              <span className="cat-name clearfix"> {langContent.airport_transport != undefined ? langContent.airport_transport :'Airport Transport '} : {productDetails.is_airport_included ==1 ? langContent.yes : langContent.no}</span>
                              {productDetails.is_airport_included ==1 ? <p className="transport-description"> {returnLanguageText(productDetails,lang,'airport_transfer_description')} </p> : ''}
                            </Col>
                       </Col>
                  </Row>
                  <Row className="package-meal-wrapper">
                       <Col xs={12} sm={12} md={12} lg={12} className={productDetails.is_road_transport ==1 ? 'facility-info' : 'facility-info no-desc'}>
                          <Col className="cat-wrapper clearfix">
                              <p>
                                 <span className="cat-icon clearfix"><img src={roadtransport} className="icon-calendar transport" /></span>
                                </p>
                          </Col>
                          <Col className="meal-desc clearfix">
                              <span className="cat-name clearfix">   {langContent.road_transport != undefined ? langContent.road_transport :'Road Transport'} : {productDetails.is_road_transport ==1 ? langContent.yes : langContent.no}</span>
                              {productDetails.is_road_transport ==1 ? <p className="transport-description">{returnLanguageText(productDetails,lang,'road_transport_description')}</p> : ''}
                          </Col>
                      </Col>
                  </Row>
                  {productDetails.package_type == 2 || productDetails.package_type == 4?
                    <Row className="package-meal-wrapper">
                         <Col xs={12} sm={12} md={12} lg={12} className={productDetails.is_sightseeing_included ==1 ? 'facility-info' : 'facility-info no-desc'}>
                            <Col className="cat-wrapper clearfix">
                                <p>
                                   <span className="cat-icon clearfix"><img src={sitesee} className="icon-calendar site-see" /></span>
                                  </p>
                            </Col>
                            <Col className="meal-desc clearfix">
                                <span className="cat-name clearfix">  {langContent.sightseeing != undefined ? langContent.sightseeing :'Sightseeing'}   : {productDetails.is_sightseeing_included ==1 ? langContent.yes : langContent.no}</span>
                                {productDetails.is_sightseeing_included ==1 ? <p className="transport-description">{returnLanguageText(productDetails,lang,'sightseeing_description')}</p> : ''}
                            </Col>
                        </Col>
                    </Row> : ''}

                  </>: ''}

                   {/* new content ends */}

                  <Row className="detail-main-wrapper customtitledesc">
                  <h4 className = "arrow-title"> {returnLanguageText(productDetails,lang,'title')}  {langContent.includes != undefined ? langContent.includes :'Includes'} 
                     <img src={arrowIcon} className = "customArrowIcon cust-trip-arrow" />
                  </h4>
                  <p>{returnLanguageText(productDetails,lang,'description')}</p>
               </Row>
               {/*detail main wrapper ends*/}
               <Row className = "custompackageBox" >{/*custom package starts*/}
                    {productDetails.inclusion != '' ?
                      <Row className="package-info">{/*package info starts*/}
                          <Col xs={12} sm={12} lg={12} className="trip-icon inclusion">
                             <img src={mediaIconInclusion} className="icon-inclusion" />
                            <h4 className="customSailTogetherShipName">   {langContent.inclusion != undefined ? langContent.inclusion :'Inclusion'}   </h4>
                             <p className="customSailTogetherDescription">{returnLanguageText(productDetails,lang,'inclusion')}</p>
                          </Col>
                      </Row>
                    : ''}
                    {/*package info ends*/}
                    {productDetails.exclusion != '' ?
                      <Row className="package-info">{/*package info starts*/}
                          <Col xs={12} sm={12} lg={12} className="trip-icon exclusion">
                             <img src={mediaIconExclusion} className="icon-exclusion" />
                             <h4 className="customSailTogetherShipName">   {langContent.exclusion != undefined ? langContent.exclusion :'Exclusion'}  </h4>
                             <p className="customSailTogetherDescription">{returnLanguageText(productDetails,lang,'exclusion')}</p>
                          </Col>
                       </Row>
                    : ''}
                     {/*package info ends*/}
                 

                   

                   {/*package info ends*/}
                  </Row>
                {/*custom package ends*/}
               </Col>

               <Col xs={12} sm={6} md={6} lg={6} className = "payment-details">
                  <Row className="payment-wrapper">
                     <Col xs={12} sm={12} md={12} lg={12} className = "emiText">
                        <p>
                        {parseInt(productDetails.discount_price) >0 ? <span className="grey-del">{getPrice(productDetails,'regular_price')} </span> : '' }
                        
                        <span className="inr-txt"> {getPrice(productDetails)}</span>
                        
                        {parseInt(productDetails.discount_price) >0 ? <span className="save-txt"> {getPrice(productDetails,'save' ,lang)}</span> : '' }
                        </p>
                        <p>  {langContent.emi != undefined ? langContent.emi :'EMI'}  :: { emi_cost != "" ? productDetails != null && productDetails.currency_data != null ? getCurrencySymbol(productDetails.currency_data.currency_code,lang) + ' ' + emi_cost : '' + emi_cost :  getCurrencySymbol(productDetails.currency_data.currency_code,lang)+' '+getPricePerMonth(this.props.productDetails.total_amount,'monthly', lang) } </p>
                     </Col>
               <Col xs={12} sm={12} md={6} lg={6} className = "emiform-wrapper">
                  <Form className="emi-form">
                     <Form.Group controlId="exampleForm.ControlSelect1">
                       {lang =='hindi' ?
                        <Form.Control as="select"  name="package_frequency" placeholder="Payment Frequency" onChange={this.handleFrequencyChange} isInvalid={errors.orderValidations != undefined && !!errors.orderValidations.package_frequency} defaultValue={frequency}>
                            <option value=''>  {langContent.choose_option != undefined ? langContent.choose_option :'Choose your option..'}</option>
                            { Object.keys(productDetails.payment_cycle_hindi).map(payment_cycle=> {
                                return <option key={payment_cycle} value={payment_cycle} >{productDetails.payment_cycle_hindi[payment_cycle]}</option>;
                            }) }

                        </Form.Control>
                        : 
                        <Form.Control as="select"  name="package_frequency" placeholder="Payment Frequency" onChange={this.handleFrequencyChange} isInvalid={errors.orderValidations != undefined && !!errors.orderValidations.package_frequency} defaultValue={frequency}>
                            <option value=''>  {langContent.choose_option != undefined ? langContent.choose_option :'Choose your option..'}</option>
                            { Object.keys(productDetails.payment_cycle).map(payment_cycle=> {
                                return <option key={payment_cycle} value={payment_cycle} >{productDetails.payment_cycle[payment_cycle]}</option>;
                            }) }

                        </Form.Control>
                        }
                         <Form.Control.Feedback type='invalid'>
                             {errors.orderValidations != undefined && errors.orderValidations.package_frequency != null ?  errors.orderValidations.package_frequency : ''}
                         </Form.Control.Feedback>
                     </Form.Group>
                  </Form>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} className = "calendar-form-wrapper">
                  <Form className="calendar-form">
                     <Form.Group controlId="exampleForm.ControlSelect1" className='m-b-30 custom-date-width'>
                          <DatePicker
                            selected={this.state.startDate}
                            name='scheduled_date'
                            onChange={this.handleChange}
                            className='customLoginInput cstmDate custom-pkg-wd'
                            placeholderText={langContent.scheduledDate != undefined ? langContent.scheduledDate :'Scheduled Date' }
                            isInvalid={errors.orderValidations != undefined && errors.orderValidations != null && !!errors.orderValidations.scheduled_date}
                          />
                         <Form.Control.Feedback type='invalid'>
                             {errors.orderValidations != undefined && errors.orderValidations != null && errors.orderValidations.scheduled_date != null ?  errors.orderValidations.scheduled_date : ''}
                         </Form.Control.Feedback>
                      </Form.Group>
                   </Form>
               </Col>
            </Row>
          <Col xs={12} sm={12} md={12} lg={12} className = "payment-btn-wrapper package">
         {session.authenticated ==true ? <> <Button  variant="outline-info" size="sm" onClick={ addToOrder.bind(this) }>   {langContent.buy_now != undefined ? langContent.buy_now :'Buy Now'}  </Button> </>
         :<> <Button  variant="outline-info" size="sm" onClick={this.handleClick.bind(this)}>   {langContent.buy_now != undefined ? langContent.buy_now :'Buy Now'}  </Button></> }
         </Col>
            </Col>
         </Row>
         </Container>{/*fluid container ends*/}
          <ViewAllImageComponent langContent={langContent} openPopup={this.state.openPopup} onClick={this.closePopup.bind(this)} uploads={productDetails.uploads}/>
     
      </section>{/*main section ends*/}

        </>
        );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackageComponent)