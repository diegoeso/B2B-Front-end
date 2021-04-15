import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import banner from '../image/banner.png'
import headingIcon from '../image/headingIcon.png'
import aeroplane from '../image/plane_home.svg'
import arrowIcon from '../image/right.svg'
import himachal from '../image/himachal.png'
import kashmir from '../image/kashmir.png'
import delhi from '../image/newdelhi.png'
import indulgeOne from '../image/indulgeone.png'
import romantic from '../image/romantic.png'
import adventure from '../image/adventure.png'
import cruise from '../image/cruise.png'
import japan from '../image/japan.png'
import italy from '../image/italy.png'
import bali from '../image/bali.png'
import PopularDestinations from './PopularDestinations';
import connect from "react-redux/es/connect/connect";
import {
    getHomeData, getCustomerInfo,
} from '../actions/HomeAction';
import Cruise1 from '../image/CruiseImg.jpg'
import Cruise2 from '../image/cruiseImg2.jpg'
import DelhiImg from '../image/DelhiImg.jpg'
import GoaImg from '../image/GoaPackage.jpg'
import lakshyDeep from '../image/lakshyDeep.png'
import kochiPackage from '../image/kochiPackage.cms'
import KashmirImg from '../image/kashmirImg.jpg';
import $ from 'jquery'
import { Link } from 'react-router-dom'
import { convertToSlug,getUrl,returnLanguageText,getDataFromArray,getPricePerMonth,getCurrencySymbol,getWelcomeMassage} from '../constants.js'
import {
   setCustomer,
   getVarifyEmail,
} from '../actions/AuthAction';
const mapStateToProps = state => {
  return {
    user: state.Auth.user,
    homeData: state.HomeData.homeData,
    customerInfo: state.HomeData.customerInfo,
    customer: state.Auth.customer,
    langContent: state.Lang.langContent,
    lang:state.Lang.lang,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getHomeData: (customer) => dispatch(getHomeData(customer)),
    setCustomer: (customer) => dispatch(setCustomer(customer)),
    getVarifyEmail: (token) => dispatch(getVarifyEmail(token)),
    getCustomerInfo: (customer) => dispatch(getCustomerInfo(customer)),
  };
}

class HomeComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  
  componentWillMount() {
    let customer = this.props.match.params.customer;
    if (this.props.user.token != undefined) {
      customer = this.props.match.params.customer;
    }
    let customerLink = '';
    if (this.props.match.params.customer != '') {
      customerLink = this.props.match.params.customer;
    }
    this.props.getHomeData(customer);
    this.props.setCustomer(customer);
    this.props.getCustomerInfo(customerLink);
    if(this.props.location !=undefined && this.props.location.search !=undefined) {
      let param = new URLSearchParams(this.props.location.search);
      if(param.get('verify-token') != undefined && param.get('verify-token') !='') {
        this.props.getVarifyEmail(param.get('verify-token'));
      }
    }
  }

 getthumnelOfimage = (uploads,classIMG='customPoplarDestintion') => {
    if(uploads != undefined && uploads.length >0 ) {
        let uploadss = uploads.filter(upload => upload.thumbnail_active == 1);
        if(uploadss.length>0) {
          return uploads.map((upload, key) => {
            if(upload.thumbnail_active == 1) {
              return <img src={upload.thumbnail_url} className={classIMG}/>
            }
          });
        } else{
          return <img src={uploads[0].thumbnail_url} className={classIMG}/>
        }
    } else {
       return <img src={GoaImg} className={classIMG}/>
    }
 
}

  getPricePerMonth = (price) =>{
    let perMonth = Math.round(price/12);

    return perMonth+'/m';
  }

  render () {
    const { homeData, customer, customerInfo,langContent,lang} = this.props;
   
    return (
      <>
        {/* Header Section and Home Banner   */}
        <Container className="cstm-home-container">
        <section>
          <Row className='width100'>            
            <Row className='customHomeBannerBox width100'>
              <img src={banner} className='img-responsive customHomeBanner' />
            </Row>
            <Row className='width100 '>
              <Col xs={12} lg={12} sm={12} className='customBannerHeadingBox'>
                {
                  customerInfo != undefined && customerInfo.uploads != null && customerInfo.uploads.file_name != null ?
                    <img src={ customerInfo.uploads.file_name_url } className='headingicon welcome-logo home-welcome-logo-img'/> : ''
                }
                <h2 className='customBannerHeadingOne welcome-mess clearfix'>
                  { getWelcomeMassage(customerInfo,lang)}
                </h2>
                <br clear='all' />
                <h2 className='customBannerHeadingTwo'>
                {langContent.home_banner_heading_one != undefined ? langContent.home_banner_heading_one :'Encouraging travel within'}     <br clear='all' /> {langContent.home_banner_heading_two != undefined ? langContent.home_banner_heading_two :'your own country & abroad'}  
                </h2>
                <br clear='all' />
                <img src={aeroplane} className='headingicon' />
                <h2 className='customBannerHeadingThree'>
               {langContent.home_banner_heading_three != undefined ? langContent.home_banner_heading_three :'Book Now, Pay later'}     
                  <span className='cstm-bnr-esca-txt'> !</span>
                </h2>
              </Col>

              {/* Popular destination section */}
              {homeData.popular_packages != undefined && homeData.popular_packages.packages != undefined && homeData.popular_packages.packages.length >0 ? 
                <section className='width100' id="popular_destinations">
                  <Col xs={12} lg={12} sm={12} className='customPopularDestinationBox  populatDestinationWrapper'>
                    <h2 className='customPopularDestinationHeadingOne hoverlink mob-title'>
                    {langContent.popular_destination_heading != undefined ? langContent.popular_destination_heading :'Popular Destinations'}  
                      <img src={arrowIcon} className='customArrowIcon' />
                    </h2>
                  <Link to={getUrl(customer)+"product/"+convertToSlug('Popular Destinations')}> 
                    <h2 className='customPopularDestinationHeadingtwo hoverlink mob-title1 mob-title'>
                      {langContent.see_all != undefined ? langContent.see_all :''}
                    </h2> </Link> 
                    <Row className='customPopularBox'>
                      { homeData.popular_packages.packages.map((pak,index) => 
                        <Col xs={12} md={4} lg={4} key={index}>
                        
                          <Col className='customImageBox homeanimation'>
                            <Link to={getUrl(customer)+pak.id+"/"+convertToSlug(pak.title)}>
                              {this.getthumnelOfimage(pak.uploads,'customPoplarDestintion')}
                              <p className='customPopularDestinationCityNameLatest'>
                                {returnLanguageText(pak,lang,'title')}
                               
                              </p>
                            </Link>

                            <Link to={getUrl(customer)+pak.id+"/"+convertToSlug(pak.title)}>
                            <p className='customPackageStartBtn'>
                            {langContent.starting_from_text != undefined ? langContent.starting_from_text :'Starting from '} - {getCurrencySymbol(pak.currency_data.currency_code,lang)} {getPricePerMonth(pak.total_amount,'monthly',lang)}
                            </p>
                           </Link>
                          </Col>
                        </Col>
                      )}
                    </Row>
                    </Col>
                    <Row>
                      <Col xs={12} sm={12} md={12} className='customDestinationPopularBox customPoplarDestinationColorBoxNew'>
                        <h2 className='customPopularDestinationHeadingOne m-t-40 newbox-title'>
                        {langContent.popular_destinations_description != undefined ? langContent.popular_destinations_description :'Description of Poplar Destinations'}    
                        </h2>
                        <p className='customPopularDestinationText' id="customPopularDestinationText newbox-desc">
                         {getDataFromArray(homeData.popular_packages.description, lang)}
                        </p>
                      </Col>
                    </Row>
            
                  
                </section>
              : '' }
              {/* End Popular Destination */}

              {/* Popular Beach section */}
              {homeData.beach_destination != undefined && homeData.beach_destination.packages != undefined && homeData.beach_destination.packages.length >0 ? 
              <section className='width100'>
                <Col xs={12} lg={12} sm={12} className='customPopularDestinationBox beachbox'>
                  <h2 className='customPopularDestinationHeadingOne hoverlink mob-title'>
                  {langContent.beach_destination_heading != undefined ? langContent.beach_destination_heading :'Beach destinations'} 
                    <img src={arrowIcon} className='customArrowIcon' />
                  </h2>
                  <Link to={getUrl(customer)+"product/"+convertToSlug('theme destinations')}>  
                    <h2 className='customPopularDestinationHeadingtwo hoverlink mob-title mob-title1'>
                    {langContent.see_all != undefined ? langContent.see_all :'See All'}
                    </h2> 
                  </Link>
                  <Row className='customPopularBox beachrow'>
                   {homeData.beach_destination != undefined && homeData.beach_destination.packages != undefined ? 
                      homeData.beach_destination.packages.map((pak,index) =>
                           <Col className="mob-btm-mar" xs={12} md={4} lg={4} key={index}>
                              <Col className='customImageBox homeanimation'>
                                <Link to={getUrl(customer)+pak.id+"/"+convertToSlug(pak.title)}>
                                {this.getthumnelOfimage(pak.uploads,'customPoplarDestintion')}
                                  <p className='customPopularDestinationCityNameLatest'> {returnLanguageText(pak,lang,'title')} </p>
                                  </Link>
                                  <Link to={getUrl(customer)+pak.id+"/"+convertToSlug(pak.title)}>
                                    <p className='customPackageStartBtn'>
                                    {langContent.starting_from_text != undefined ? langContent.starting_from_text :'Starting from'} - {getCurrencySymbol(pak.currency_data.currency_code,lang)} {getPricePerMonth(pak.total_amount,'monthly',lang)}
                                    </p>
                                  </Link>
                              </Col>
                             
                            </Col>
                        )
                    : ''}
                    
                  </Row>
                  </Col>
                  <Row>
                    <Col xs={12} sm={12} md={12} className='customDestinationPopularBox customBeachColorBoxNew'>
                      <h2 className='customPopularDestinationHeadingOne m-t-40 mob-desc-title'>
                      {langContent.beach_destinations_description != undefined ? langContent.beach_destinations_description :'Description of Beach Destinations'}  
                      </h2>
                      <p className='customPopularDestinationText'>
                        {getDataFromArray(homeData.beach_destination.description, lang)}
                      </p>
                    </Col>
                  </Row>
                
               
              </section>
              : '' }
              {/* End Beach Destination */}
              {/* All Inclusive destination section */}
              {homeData.all_inclusive != undefined && homeData.all_inclusive.packages != undefined && homeData.all_inclusive.packages.length >0 ? 
                <section className='width100'>
                  <Col xs={12} lg={12} sm={12} className='customPopularDestinationBox all-inclusive'>
                    <h2 className='customPopularDestinationHeadingOne mob-title'>
                    {langContent.all_inclusive_heading != undefined ? langContent.all_inclusive_heading :' All Inclusive Packages'}  
                      <img src={arrowIcon} className='customArrowIcon' />
                    </h2>
                    <Link to={getUrl(customer)+"product/"+convertToSlug('All Inclusive Packages')}> 
                    <h2 className='customPopularDestinationHeadingtwo hoverlink mob-title mob-title1'>
                    {langContent.see_all != undefined ? langContent.see_all :'See All'}
                    </h2>
                    </Link>
                    <Row className='customPopularBox'>
                      {homeData.all_inclusive.packages.map((pak,index) =>
                        <Col xs={12} md={4} lg={4} key={index}>
                            <Col className='customImageBox homeanimation'>
                              <Link to={getUrl(customer)+pak.id+"/"+convertToSlug(pak.title)}>
                                {this.getthumnelOfimage(pak.uploads,'customPoplarDestintion')}
                             
                              <p className='customPopularDestinationCityNameLatest'>
                                 {returnLanguageText(pak,lang,'title')}
                              </p>
                              </Link>
                              <Link to={getUrl(customer)+pak.id+"/"+convertToSlug(pak.title)}>
                              <p className='customPackageStartBtn'>
                              {langContent.starting_from_text != undefined ? langContent.starting_from_text :' Starting from'}  - {getCurrencySymbol(pak.currency_data.currency_code,lang)} {getPricePerMonth(pak.total_amount,'monthly',lang)}
                              </p>
                              </Link>
                            </Col>
                          
                        </Col>
                      )}
                    </Row>
                    </Col>
                    <Row>
                      <Col xs={12} sm={12} md={12} className='customDestinationPopularBox customAllInclusiveColorBoxNew'>
                        <h2 className='customPopularDestinationHeadingOne m-t-40 mob-desc-title'>
                        {langContent.all_inclusive_packages_description != undefined ? langContent.all_inclusive_packages_description :'Description of All Inclusive Packages'}   
                        </h2>
                        <p className='customPopularDestinationText'>
                         {getDataFromArray(homeData.all_inclusive.description, lang)}
                        </p>
                      </Col>
                    </Row>
              
                </section> 
                : '' }

              {/* End All Inclusive Destination */}
              {/* indulge Your self section */}
              {homeData.indulge_destination != undefined && homeData.indulge_destination.packages != undefined && homeData.indulge_destination.packages.length >0 ? 
                <section className='width100'>
                  <Col xs={12} lg={12} sm={12} className='customPopularDestinationBox p-b-20 indulge-wrapper' >
                    <h2 className='customPopularDestinationHeadingOne hoverlink mob-title'>
                    {langContent.indulge_heading != undefined ? langContent.indulge_heading :'Indulge Yourself'}  
                      <img src={arrowIcon} className='customArrowIcon' />
                    </h2>
                    <Link to={getUrl(customer)+"product/"+convertToSlug('Indulge Yourself')}> 
                    <h2 className='customPopularDestinationHeadingtwo hoverlink mob-title mob-title1'>
                    {langContent.see_all != undefined ? langContent.see_all :'See All'}
                    </h2>
                    </Link>
                    <Row className='customIndulgeBox'>
                      {homeData.indulge_destination.packages[0] != undefined ? 
                        <Col xs={12} md={5} lg={5} className='customAllIndulgeBoxOne full-image-wrapper' >
                          <Link to={"/"+homeData.indulge_destination.packages[0].id+"/"+convertToSlug(homeData.indulge_destination.packages[0].title)}>
                            <Col className='customAllIndulgeImgBoxOne custom-fullimage'>
                                {this.getthumnelOfimage(homeData.indulge_destination.packages[0].uploads,'customAllIndulgeImg homeanimation2 col-img-full')}
                                
                              <p className='customIndulgeName'>
                                {returnLanguageText(homeData.indulge_destination.packages[0],lang,'title')}
                                
                              </p>
                            </Col>
                          </Link>
                        </Col>
                      : ''}
                      <Col xs={12} md={4} lg={6} className='customAllIndulgeBoxTwo'>
                      {homeData.indulge_destination.packages.splice(1).map((pak,index) => 
                        <Col xs={12} md={12} lg={12} className="cstm-indluge-wrapper" key ={index}>
                         <Link to={getUrl(customer)+pak.id+"/"+convertToSlug(pak.title)}>
                          <Col className='customAllIndulgeImgBoxTwo'>
                          {this.getthumnelOfimage(pak.uploads,'customAllIndulgeImg homeanimation2')}
                            
                            <p className='customIndulgeName'>
                              {returnLanguageText(pak,lang,'title')}
                            </p>
                          </Col>
                          </Link>
                        </Col>
                      )}
                      </Col>
                    </Row>
                  </Col>
                </section>
              : '' }

              {/* End Include Your self */}
              {/* Sail together section */}
              {homeData.sail_together != undefined && homeData.sail_together.packages != undefined && homeData.sail_together.packages.length >0 ?
                <section className='width100 '>
                  <Col xs={12} lg={12} sm={12} className='customPopularDestinationBox p-t-0 p-b-0 sailTogetherWrapperBox'>
                    <h2 className='customPopularDestinationHeadingOne hoverlink mob-title'>
                    {langContent.sail_together_heading != undefined ? langContent.sail_together_heading :'Sail Together'}  
                      <img src={arrowIcon} className='customArrowIcon' />
                    </h2>
                    <Link to={getUrl(customer)+"product/"+convertToSlug('Sail Together')}> 
                    <h2 className='customPopularDestinationHeadingtwo hoverlink mob-title mob-title1'>
                    {langContent.see_all != undefined ? langContent.see_all :'See All'}
                    </h2>
                    </Link>
                    <Row className='customIndulgeBox'>
                      {homeData.sail_together.packages.map((pak,index) => 
                        <Row className='customSailTogetherBox  cstm-sail-together-wrapper animation' key={index}>
                          <Col xs={12} sm={4} md={4} lg={3} className='customSailTogetherImgBox' >
                          <Link to={getUrl(customer)+pak.id+"/"+convertToSlug(pak.title)}>
                          {this.getthumnelOfimage(pak.uploads,'customSailTogetherImg')}  
                          </Link>
                          </Col>
                          <Col xs={12} sm={8} lg={8} className='customSailTogetherDescriptionBox'>
                           <Link to={getUrl(customer)+pak.id+"/"+convertToSlug(pak.title)}>
                            <h2 className='customSailTogetherShipName'>
                             {returnLanguageText(pak,lang,'title')}
                            </h2>
                            </Link>
                            <Link to={getUrl(customer)+pak.id+"/"+convertToSlug(pak.title)}>
                              <p className='customSailTogetherStartingFrom'>
                              {langContent.starting_from_text != undefined ? langContent.starting_from_text :'Starting from'}    - {getCurrencySymbol(pak.currency_data.currency_code,lang)} {getPricePerMonth(pak.total_amount,'monthly',lang)}
                              </p>
                            </Link>
                            <p className='customPortName'>
                              <span> {langContent.start_port_text != undefined ? langContent.start_port_text :'Start Port'} - {returnLanguageText(pak,lang,'leaving_from')}</span>
                             
                              <span className='customMarginLeft10'>
                              {langContent.end_port_text != undefined ? langContent.end_port_text :'End Port'} - {returnLanguageText(pak,lang,'destination')}
                              </span>
                              
                            </p>
                            <p className='customSailTogetherDescription'>
                              {returnLanguageText(pak,lang,'description').length >= 200 ? returnLanguageText(pak,lang,'description').substring(0, 200) + '...' : returnLanguageText(pak,lang,'description') }
                              
                            </p>
                          </Col>
                        </Row>
                      )}
                      
                    </Row>
                  </Col>
                </section>
              : '' }
              {/* End Include Your self */}
              {/* All Special Package */}
              {homeData.special_package != undefined && homeData.special_package.packages != undefined && homeData.special_package.packages.length >0 ?
                <section className='width100 '>
                  <Col xs={12} lg={12} sm={12} className='customPopularDestinationBox p-t-20 special-pkg-box mob'>
                    <h2 className='customPopularDestinationHeadingOne hoverlink spl-pkg-title mob-title'>
                    {langContent.special_package_heading != undefined ? langContent.special_package_heading :'Special Package Only For You'}  
                      <img src={arrowIcon} className='customArrowIcon' />
                    </h2>
                    <Link to={getUrl(customer)+"product/"+convertToSlug('Special Package Only For You')}>
                    <h2 className='customPopularDestinationHeadingtwo hoverlink mob-title1'>
                    {langContent.see_all != undefined ? langContent.see_all :'See All'}
                    </h2>
                    </Link>
                    <Row className='customPopularBox'>
                      { homeData.special_package.packages.map((pak,index) =>
                        <Col xs={12} md={4} lg={4} key={index}>
                          <Col className='customImageBox homeanimation'>
                              <Link to={getUrl(customer)+pak.id+"/"+convertToSlug(pak.title)}>
                              {this.getthumnelOfimage(pak.uploads,'customPoplarDestintion')}
                              
                            </Link>
                             <Link to={getUrl(customer)+pak.id+"/"+convertToSlug(pak.title)}>
                              <p className='customPopularDestinationCityNameLatest'>
                                {returnLanguageText(pak,lang,'title')}
                              </p>
                              </Link>
                            <Link to={getUrl(customer)+pak.id+"/"+convertToSlug(pak.title)}>
                            <p className='customPackageStartBtn'>
                            {langContent.starting_from_text != undefined ? langContent.starting_from_text :'Starting from'} - {getCurrencySymbol(pak.currency_data.currency_code,lang)} {getPricePerMonth(pak.total_amount,'monthly',lang)}
                            </p>
                            </Link>
                          </Col>
                        </Col>
                      )}
                    </Row>
                    </Col>
                    <Row>
                      <Col xs={12} sm={12} md={12} className='customDestinationPopularBox customSpecialPackageColorBoxNew'>
                        <h2 className='customPopularDestinationHeadingOne m-t-40 mob-desc-title'>
                        {langContent.special_package_only_for_you_description != undefined ? langContent.special_package_only_for_you_description :' Description of Special Package'} 
                        </h2>
                        <p className='customPopularDestinationText'>
                        {getDataFromArray(homeData.special_package.description, lang)}
                        </p>
                      </Col>
                    </Row>
                  
                </section>
              : '' }
              {/* End All  Special Package */}
            </Row>
          </Row>
        </section>
        </Container>
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)((HomeComponent));
