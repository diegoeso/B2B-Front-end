import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../Style.css";
import responsive from "../../Responsive.css";
import classNames from "classnames";
import {Col,Container,Row,Tabs} from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import TabContainer from 'react-bootstrap/TabContainer';
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane';
import Dropdown from 'react-bootstrap/Dropdown'
import arrowDown from '../../image/selectArrow.png';
import {replaceAll,getDataFromArray} from "../../constants";

class ProductsDescription extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active:0,
      tabName:''
    };
    
  }

  componentWillMount() {
    if(this.props.themes != undefined && this.props.themes != null && this.props.themes[0] != undefined){
      this.setState({active: this.props.themes[0].id});
    }
     
  }

  changeTabe(id,name,type){
    this.setState({active: id});
    this.props.changeTabe(id);
    if(type == 'child'){
    this.setState({tabName: name})
    }
    else{
      this.setState({tabName: ''})
    }
  }

  
  render() {
      const {product_type,products,themes,langContent,nameofType,lang} = this.props;
      if(product_type == 'theme-destinations') {
        return (<section className="width100">
          <Container className="theme-destination-wrapper">
            <Row className="beachDesc-wrapper ">
              <Col xs={12} sm={12} md={12} className='customDestinationPopularBox customBeachColorBox tab-wrapper cstm-tab-bg-clr'>
                      <h2 className='customPopularDestinationHeadingOne beach-desc-title'>
                      {langContent.description_of_popular_theme_destinations != undefined ? langContent.description_of_popular_theme_destinations :'  Description of Popular Theme Destinations'} 
                      </h2>
                      <div className="data text-left">
                        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#beach">
                          <Row>
                            <Col sm={12} className="p-l-0"><p className="product-description-text-wrapper">{getDataFromArray(products.description,lang)}</p></Col>

                              {themes != undefined && themes != null && themes.slice(0, 5).map( (theme,index) => <Col className={this.state.active == theme.id ? 'theme-tab active-theme' : 'theme-tab'} onClick={this.changeTabe.bind(this,theme.id,theme.name,'parent')} key={theme.id} >
                                 <p> {lang == 'hindi' ? theme.hindi_name : theme.name}  </p>  
                           
                                </Col>
                               )}
                               {themes != undefined && themes != null && themes.length >5 ? 
                               <>
                              <p className="" className={this.state.tabName !=''  ? 'cstm-tab-name' : ''}>  {lang == 'hindi' ? this.state.tabName.hindi_name : this.state.tabName.name} </p>
                                <Dropdown>
                                  <Dropdown.Toggle  id="dropdown-basic" className="cstm-theme-destination-button">
                                  {langContent.more} <img src={arrowDown} className="img-responsive product-arrow-down-btn"/>
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                  {themes != undefined && themes != null && themes.slice(5).map( (theme,index) => <Dropdown.Item onClick={this.changeTabe.bind(this,theme.id,theme,'child')} key={theme.id}> {lang == 'hindi' ? theme.hindi_name : theme.name}     </Dropdown.Item>
                                    )}
                                  </Dropdown.Menu>
                            </Dropdown>   
                            </>
                            :''}

                          </Row>
                        </Tab.Container>
                       </div>
                </Col>
           </Row>
          </Container>
        </section>)
      } else {
          return (
                <section className="width100">
                  <Container className="theme-destination-wrapper">
                    <Row className="beachDesc-wrapper popularDesc-wrapper allInclu-wrapper splPkg-wrapper">
                      <Col xs={12} sm={12} md={12} className='customDestinationPopularBox popular-dest-inner all-inclus-inner spl-pkg-inner customBeachColorBox'>
                              <h2 className='customPopularDestinationHeadingOne'>
                              {langContent[nameofType+'_description'] != undefined ? langContent[nameofType+'_description'] : ''}
                              </h2>
                              <p className='customPopularDestinationText'>{getDataFromArray(products.description,lang)}</p>
                      </Col>
                   </Row>
                  </Container>
                </section>
            );
      }
  }
}

export default ProductsDescription;