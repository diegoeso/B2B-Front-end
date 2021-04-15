import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import connect from 'react-redux/es/connect/connect'
import styles from "../../Style.css";
import responsive from "../../Responsive.css";
import classNames from "classnames";
import {Row,Col,Spinner} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form'
import banner from '../../image/banner.png'
import headingIcon from '../../image/headingIcon.png'
import aeroplane from '../../image/aeroplane.png'
import arrowIcon from '../../image/arrowicon.png'
import GoaImg from '../../image/GoaImg.png';
import kochiImg from '../../image/kochiImg.png';
import lakshyDeep from '../../image/lakshyDeep.png';
import indulgeOne from '../../image/indulgeone.png';
import romantic from '../../image/romantic.png';
import adventure from '../../image/adventure.png';
import cruise from '../../image/cruise.png';
import japan from '../../image/japan.png';
import italy from '../../image/italy.png';
import bali from '../../image/bali.png';
import Button from 'react-bootstrap/Button';
import tripImgOne from '../../image/tripImgOne.jpg';
import tripImgTwo from '../../image/tripImgTwo.jpg';
import tripImgThree from '../../image/tripImgThree.jpg';
import tripImgFour from '../../image/tripImgFour.jpg';
import selectArrow from '../../image/selectArrow.png';
import beachDestiBanner from '../../image/beachDestiBanner.jpg';
import ProductsDescription from './ProductsDescription';
import ProductsList from './ProductsList';
import {replaceAll,getPricePerMonth,getCurrencySymbol,getWelcomeMassage} from "../../constants";
import {
   getProducts,
   getThemes
} from '../../actions/ProductAction';

const mapStateToProps = (state) => {
  return {
    customer: state.Auth.customer,
    products: state.Product.products,
    isPending: state.Product.isPending,
    themes: state.Product.themes,
    langContent: state.Lang.langContent,
    total: state.Product.total,
    customerInfo: state.HomeData.customerInfo,
    lang: state.Lang.lang,
  }
  
}
const mapDispatchToProps = (dispatch, props) => {
  return {
   getProducts: (type, limit, themeId) => dispatch(getProducts(type, limit, themeId)),
   getThemes: () => dispatch(getThemes()),
   
  }
}

class ProductsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            limit:9,
            active:'',
            productType:'',
            nameofType:'',
        };
        this.handleScroll = this.handleScroll.bind(this);
    }
    componentWillMount() {
       let limit = this.state.limit;
       this.props.getThemes();
        let productType = this.state.productType;
        if(this.props.match.params != undefined) {
            productType = this.props.match.params.product_type;;
        }
        
        if(this.props.themes != undefined && this.props.themes != null && this.props.themes[0] != undefined){
          this.setState({active: this.props.themes[0].id});
        }

        this.setState({nameofType: replaceAll(productType,'-','_'),productType});
        let active = this.state.active;
        this.props.getProducts(productType, limit, active);
    }

    getThemeData() {
       
    }

    componentDidMount() {
        // test
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll(event) {
        let active = this.state.active;
        let limit =  this.state.limit;
        let total = this.props.total;
        let isPending = this.props.isPending;
        let productType = this.state.productType;
        let height= event.target.scrollingElement.offsetHeight-event.target.documentElement.clientHeight;
        let scrollHeight = window.scrollY;
        if(scrollHeight >= height-100) {
            if(isPending == false && total > limit ) { 
               limit = limit+9;
               this.props.getProducts(productType, limit, active);
               this.setState({limit});
            }
        }
    }

    changeTabe(active){
      let productType = this.state.productType;
      let limit = 9;
      this.setState({limit});
      if(this.props.match.params != undefined) {
          productType = this.props.match.params.product_type;;
      }
      this.props.getProducts(productType, limit, active);
    }

    render() {
        const {match,products,customer,themes, langContent, isPending,customerInfo,lang} = this.props;
        const {nameofType} = this.state;
        
        if(products == null) {
            return <section> <Row className="innerbg-wrapper"></Row></section>
        }
        return (<>
         {/*section 1 starts  */}
         <section className = "width100"> 
            <Row className="innerbg-wrapper">
              <Col xs={12} sm={12} md={12} lg={12} className='customBannerHeadingBox'>
                {
                  customerInfo != undefined && customerInfo.uploads != null && customerInfo.uploads.file_name != null ?
                    <img src={ customerInfo.uploads.file_name_url } className='headingicon welcome-logo'/> : ''
                }
                
                  <h2 className='customBannerHeadingOne welcome-mess clearfix'>
                  { getWelcomeMassage(customerInfo,lang)} 
                  </h2>
                  <br clear='all' />
                  <h2 className='customBannerHeadingTwo'>
                    {langContent[nameofType] != undefined ? langContent[nameofType] : ''} <br clear='all' />   {langContent.product_banner_heading_two != undefined ? langContent.product_banner_heading_two :'Selected for You'}  
                  </h2>
                  <br clear='all' />
              </Col>
            </Row> {/*section 1 ends*/} 
        </section> {/*section 1 ends*/}
        {/*section 2 starts */}
        <ProductsDescription products={products} product_type={match.params.product_type} customer={customer} themes={themes}  langContent={langContent} changeTabe={this.changeTabe.bind(this)} nameofType={nameofType} lang={lang}/>
        {/*section 2 ends*/}
        {/*section 3 starts*/}
        <ProductsList products={products} customer={customer} langContent={langContent} lang={lang} />
        
        {/* section 3 ends */}
        </>
        );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsComponent)