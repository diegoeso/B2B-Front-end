import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../Style.css";
import responsive from "../Responsive.css";
import classNames from "classnames";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form'
import banner from '../image/banner.png'
import headingIcon from '../image/headingIcon.png'
import aeroplane from '../image/aeroplane.png'
import arrowIcon from '../image/arrowicon.png'
import himachal from '../image/himachal.png';
import kashmir from '../image/kashmir.png';
import delhi from '../image/newdelhi.png';
import indulgeOne from '../image/indulgeone.png';
import romantic from '../image/romantic.png';
import adventure from '../image/adventure.png';
import cruise from '../image/cruise.png';
import japan from '../image/japan.png';
import italy from '../image/italy.png';
import bali from '../image/bali.png';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import tripImgOne from '../image/tripImgOne.jpg';
import tripImgTwo from '../image/tripImgTwo.jpg';
import tripImgThree from '../image/tripImgThree.jpg';
import tripImgFour from '../image/tripImgFour.jpg';
import mediaIconCanclPolicy from '../image/mediaIconCanclPolicy.png';
import mediaIconTerms from '../image/mediaIconTerms.png';
import mediaIconPersons from '../image/mediaIconPersons.png';
import mediaIconCalendar from '../image/mediaIconCalendar.png';
import mediaIconExclusion from '../image/mediaIconExclusion.png';
import mediaIconInclusion from '../image/mediaIconInclusion.png';
import selectArrow from '../image/selectArrow.png';
import breadcrumbArrow from '../image/breadcrumbArrow.png';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'


class PackageComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    
  }
  render() {
      return (<>
         {/*section 1 starts  */}
         <section className = "width100 m-t-80 package-main-wrapper cust-nomar">
            <Container fluid>
              <Row className="breadcrumb-wrapper custom-breadcrumb">
                  <Col xs={11} sm={11} md={11} lg={11} className="custom-padding">
                     <Breadcrumb>
                        <Breadcrumb.Item href="#">All Package in Goa </Breadcrumb.Item>
                        <Breadcrumb.Item active href="#">Goa Friends Special Package </Breadcrumb.Item>
                     </Breadcrumb>
                  </Col>
                  <Col className="heart-icon-wrapper" xs={1} sm={1} md={1} lg={1}>
                     <i class="fa fa-heart-o" aria-hidden="true"></i>
                  </Col>
               </Row> {/*section 1 ends*/}
            </Container>{/*container ends*/}
         </section> {/*section 1 ends*/}

         {/*section 2 starts*/}
         <section className = "width100">
            <Container fluid>
               <Row className="splpackage-wrapper">
                  <Col xs={12} sm={6} md={6} lg={6} className = "trip-img-col1">
                     <img src={tripImgOne} className = "trip-img-lg" / >
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={6} className = "trip-img-col2">
                     <Row className="spl-packimg-col2">
                        <Col xs={12} sm={12} md={6} lg={6} className = "trip-img-col trip-col1">
                           <img src={tripImgTwo} className = "trip-img  trip-img-sml" / >
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} className = "trip-img-col trip-col2">
                           <img src={tripImgThree} className = "trip-img trip-img-sml" / >
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} className = "trip-img-col trip-col3">
                           <img src={tripImgFour} className = "trip-img trip-img-sml" / >
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} className = "trip-img-col trip-col4">
                           <a className="trip-link" href="#">
                              <img src={tripImgThree} className = "trip-img trip-img-sml" / >
                                 <h4>Show all</h4>
                           </a>
                        </Col>
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
                     <Row className="rating-wrapper">
                        <Col xs={12} sm={12} md={12} lg={12} className = "rating-info">
                           <p>Hotel Category</p>
                           <Col xs={2} sm={2} md={2} lg={1} className="rating-icon-wrapper">
                               <i className="fa fa-star" aria-hidden="true"></i>
                               <i className="fa fa-star" aria-hidden="true"></i>
                               <i className="fa fa-star" aria-hidden="true"></i>
                               <i className="fa fa-star" aria-hidden="true"></i>
                           </Col>{/*rating icon wrapper ends*/}
                           <Col xs={10} sm={10} md={10} lg={11} className="rating-btn-wrapper">
                             <Button variant="primary" className="rating-btn" size="sm">Beach</Button>
                             <Button variant="primary" className="rating-btn" size="sm">Honeymoon</Button>
                           </Col>
                        </Col>{/*rating info ends*/}
                        <Col xs={12} sm={12} md={12} lg={12} className = "rating-info htl-ct1">
                           <p>
                              <img src={mediaIconCalendar} class="icon-calendar" />
                                 7 Days 8 Night
                           </p>
                           <p>
                              <img src={mediaIconPersons} class="icon-family" />
                                 2 Adults, 1 Children
                           </p>
                        </Col>{/*rating-info htl ends*/}
                     </Row>{/*rating-wrapper ends*/}
                  <Row className="detail-main-wrapper customtitledesc">
                  <h4 className = "arrow-title"> Goa Friends Special Package Includes
                     <img src={arrowIcon} className = "customArrowIcon" />
                  </h4>
                  <p>
                     Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                     Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                  </p> 
               </Row>{/*detail main wrapper ends*/}
               <Row className = "custompackageBox" >{/*custom package starts*/}
                     <Row className="package-info">{/*package info starts*/}
                        <Col xs={12} sm={12} lg={12} className="trip-icon inclusion">
                           <img src={mediaIconInclusion} class="icon-inclusion" />
                          <h4 className="customSailTogetherShipName"> Inclusion </h4>
                           <p className="customSailTogetherDescription">
                              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                           </p>
                        </Col>
                    </Row>{/*package info ends*/}
                    <Row className="package-info">{/*package info starts*/}
                        <Col xs={12} sm={12} lg={12} className="trip-icon exclusion">
                           <img src={mediaIconExclusion} class="icon-exclusion" />
                           <h4 className="customSailTogetherShipName"> Exclusion </h4>
                           <p className="customSailTogetherDescription">
                                 Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                           </p>
                        </Col>
                     </Row>{/*package info ends*/}
                     <Row className="package-info">
                        <Col xs={12} sm={12} lg={12} className="trip-icon terms">
                           <img src={mediaIconTerms} class="icon-terms" />
                            <h4 className="customSailTogetherShipName"> Terms & Conditions </h4>
                             <p className="customSailTogetherDescription">
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                             </p>
                        </Col>
                     </Row>
                     <Row className="package-info">
                        <Col xs={12} sm={12} lg={12} className="trip-icon cancel">
                           <img src={mediaIconCanclPolicy} class="icon-policy" />
                              <h4 className="customSailTogetherShipName"> Cancellation Policy </h4>
                                 <p className="customSailTogetherDescription"> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a</p>
                        </Col>
                     </Row>{/*package info ends*/}
                  </Row>{/*custom package ends*/}
               </Col> 

               <Col xs={12} sm={6} md={6} lg={6} className = "payment-details">
                  <Row className="payment-wrapper">
                     <Col xs={12} sm={12} md={12} lg={12} className = "emiText">
                        <p>EMI : 3750/M </p>
                     </Col>
               <Col xs={12} sm={12} md={6} lg={6} className = "emiform-wrapper">
                  <Form className="emi-form">
                     <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control as="select" placeholder="Payment Frequency">
                            <option class="selected custom-option" selected>Payment Frequency</option>
                            <option>1 Month</option>
                            <option>3 Month</option>
                            <option>6 Month</option>
                            <option>4</option>
                            <option>5</option>
                        </Form.Control>
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
                            placeholderText='Scheduled Date'
                            
                          />
                      </Form.Group>

                   </Form>
               </Col>
            </Row>
          <Col xs={12} sm={12} md={12} lg={12} className = "payment-btn-wrapper package">
            <Button variant="outline-info" size="sm">Buy Now</Button>
         </Col>
            </Col> 
         </Row>
         </Container>{/*fluid container ends*/}
      </section>{/*main section ends*/}

        </>
        );
  }
}



export default PackageComponent;