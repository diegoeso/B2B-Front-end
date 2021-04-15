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
import dummy from '../../image/dummy.jpg';
import {getPricePerMonth,getUrl,convertToSlug,getCurrencySymbol,returnLanguageText} from "../../constants";

import { Link } from 'react-router-dom';
class ProductsList extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    
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

  render() {
      const {product_type,products,customer,langContent,lang} = this.props;
      return (
         <section className='width100'>
           <Container className="theme-destination-wrapper">
             <Row className="custdesti-wrapper cstm-theme-img-wrapper">
                <Col
                  xs={12}
                  lg={12}
                  sm={12}
                  className='customPopularDestinationBox custdestibox'
                >
                  <Row className='customPopularBox'>
                    {products.products.map((product,index) => {
                      return  <Col xs={12} sm={4} md={4} lg={4} key={index}>
                          <Col className='customImageBox'>
                            <Link to={getUrl(customer)+product.id+"/"+convertToSlug(product.title)}>
                              {this.getthumnelOfimage(product.uploads,'customPoplarDestintion custom-shadow homeanimation')}
                              <p className='custom-overlay-city product-list-title'>{returnLanguageText(product,lang,'title')}</p>
                              
                              <p className='customPackageStartBtn'>{' '}  {langContent.starting_from_Rs != undefined ? langContent.starting_from_Rs :'Starting from '} {getCurrencySymbol('',lang)} {getPricePerMonth(product.total_amount,'',lang)} {' '}</p>
                            </Link>
                          </Col>
                        </Col>
                      })}
                  </Row>
                </Col>
             </Row>
            </Container> 
          </section>
        );
  }
}



export default ProductsList;