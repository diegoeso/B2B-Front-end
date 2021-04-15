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
import GoaImg from '../image/GoaImg.png';
import kochiImg from '../image/kochiImg.png';
import lakshyDeep from '../image/lakshyDeep.png';
import indulgeOne from '../image/indulgeone.png';
import romantic from '../image/romantic.png';
import adventure from '../image/adventure.png';
import cruise from '../image/cruise.png';
import japan from '../image/japan.png';
import italy from '../image/italy.png';
import bali from '../image/bali.png';
import Button from 'react-bootstrap/Button';
import selectArrow from '../image/selectArrow.png';
import beachDestiBanner from '../image/beachDestiBanner.jpg';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TabContainer from 'react-bootstrap/TabContainer';
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane';
import {Card,ListGroup} from 'react-bootstrap';


class ThemeDestinationComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    
  }
  render() {
      return (<>
         {/*section 1 starts  */}
         <section className = "width100">
            <Row className="innerbg-wrapper">
              <Col xs={12} sm={12} md={12} lg={12} className='customBannerHeadingBox'>
                <img src={headingIcon} className='headingicon' />
                  <h2 className='customBannerHeadingOne welcome-mess clearfix'>
                    Welcome message for optucorp company
                  </h2>
                  <br clear='all' />
                  <h2 className='customBannerHeadingTwo'>
                     Popular Theme Destination <br clear='all' /> Selected for You
                  </h2>
                  <br clear='all' />
              </Col>
            </Row> {/*section 1 ends*/} 
        </section> {/*section 1 ends*/}
        {/*section 2 starts */}
        <section className="width100">
          <Container>
            <Row className="beachDesc-wrapper">
              <Col xs={12} sm={12} md={12} className='customDestinationPopularBox customBeachColorBox tab-wrapper'>
                      <h2 className='customPopularDestinationHeadingOne beach-desc-title'>
                        Description of Popular Theme Destinations
                      </h2>
                      <div className="data">
                        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#beach">
                          <Row>
                            <Col sm={12}>
                              <Tabs defaultActiveKey="beach" id="destination-tab">
                                <Tab eventKey="beach" title="Beach">
                                  <p>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                                    Ipsum has been the industry's standard dummy text ever since the 1500s, g, remaining
                                    essentially unchanged. It was popularised in the 1960s with the release of Letraset
                                    sheets containing Lorem Ipsum passages, and more recently with desktop publishing
                                    software like Aldus PageMaker including versions of Lorem Ipsum is simply dummy text
                                  </p>
                                </Tab>
                                <Tab eventKey="honeymoon" title="Honeymoon">
                                  <p>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                                    Ipsum has been the industry's standard dummy text ever since the 1500s, g, remaining
                                    essentially unchanged. It was popularised in the 1960s with the release of Letraset
                                    sheets containing Lorem Ipsum passages, and more recently with desktop publishing
                                    software like Aldus PageMaker including versions of Lorem Ipsum is simply dummy text
                                  </p>
                                </Tab>
                                <Tab eventKey="adventure" title="Adventure">
                                  <p>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                                    Ipsum has been the industry's standard dummy text ever since the 1500s, g, remaining
                                    essentially unchanged. It was popularised in the 1960s with the release of Letraset
                                    sheets containing Lorem Ipsum passages, and more recently with desktop publishing
                                    software like Aldus PageMaker including versions of Lorem Ipsum is simply dummy text
                                  </p>
                                </Tab>
                                <Tab eventKey="escape" title="Escape">
                                  <p>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                                    Ipsum has been the industry's standard dummy text ever since the 1500s, g, remaining
                                    essentially unchanged. It was popularised in the 1960s with the release of Letraset
                                    sheets containing Lorem Ipsum passages, and more recently with desktop publishing
                                    software like Aldus PageMaker including versions of Lorem Ipsum is simply dummy text
                                  </p>
                                </Tab>
                                <Tab eventKey="kids&family" title="Kids & Family">
                                  <p>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                                    Ipsum has been the industry's standard dummy text ever since the 1500s, g, remaining
                                    essentially unchanged. It was popularised in the 1960s with the release of Letraset
                                    sheets containing Lorem Ipsum passages, and more recently with desktop publishing
                                    software like Aldus PageMaker including versions of Lorem Ipsum is simply dummy text
                                  </p>
                                </Tab>
                              </Tabs>
                            </Col>
                          </Row>
                        </Tab.Container>
                       </div>
                </Col>
           </Row>
          </Container>
        </section>{/*section 2 ends*/}
        {/*section 3 starts*/}
         <section className='width100'>
           <Container>
             <Row className="custdesti-wrapper">
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  className='customPopularDestinationBox custdestibox'
                >
                  <Row className='customPopularBox'>{/*custom popular box starts*/}
                    <Col xs={12} sm={4} md={4} lg={4}>
                      <Col className='customImageBox desti-imagebox'>
                        <img
                          src={GoaImg}
                          className='customPoplarDestintion custom-shadow'
                        />
                        <p className='custom-overlay-city'>
                          {' '}
                          Goa{' '}
                        </p>
                        <p className='customPackageStartBtn'>
                          {' '}
                          Starting from - Rs 8000 / m{' '}
                        </p>
                      </Col>
                    </Col>
                    <Col xs={12} sm={4} md={4} lg={4}>
                      <Col className='customImageBox desti-imagebox'>
                        <img src={kochiImg} className='customPoplarDestintion custom-shadow' />
                        <p className='custom-overlay-city'>
                          {' '}
                          Kochi{' '}
                        </p>
                        <p className='customPackageStartBtn'>
                          {' '}
                          Starting from - Rs 8000 / m{' '}
                        </p>
                      </Col>
                    </Col>
                    <Col xs={12} sm={4} md={4} lg={4}>
                      <Col className='customImageBox desti-imagebox'>
                        <img src={lakshyDeep} className='customPoplarDestintion custom-shadow' />
                        <p className='custom-overlay-city'>
                          {' '}
                          Lakshey Daweep{' '}
                        </p>
                        <p className='customPackageStartBtn'>
                          {' '}
                          Starting from - Rs 8000 / m{' '}
                        </p>
                      </Col>
                    </Col>
                  </Row>{/* custom popular box ends */}
                  <Row className='customPopularBox'>{/* custom popular box starts*/ }
                    <Col xs={12} sm={4} md={4} lg={4}>
                      <Col className='customImageBox desti-imagebox'>
                        <img
                          src={GoaImg}
                          className='customPoplarDestintion custom-shadow'
                        />
                        <p className='custom-overlay-city'>
                          {' '}
                          Goa{' '}
                        </p>
                        <p className='customPackageStartBtn'>
                          {' '}
                          Starting from - Rs 8000 / m{' '}
                        </p>
                      </Col>
                    </Col>
                    <Col xs={12} sm={4} md={4} lg={4}>
                      <Col className='customImageBox'>
                        <img src={kochiImg} className='customPoplarDestintion custom-shadow' />
                        <p className='custom-overlay-city'>
                          {' '}
                          Kochi{' '}
                        </p>
                        <p className='customPackageStartBtn'>
                          {' '}
                          Starting from - Rs 8000 / m{' '}
                        </p>
                      </Col>
                    </Col>
                    <Col xs={12} sm={4} md={4} lg={4}>
                      <Col className='customImageBox desti-imagebox'>
                        <img src={lakshyDeep} className='customPoplarDestintion custom-shadow' />
                        <p className='custom-overlay-city'>
                          {' '}
                          Lakshey Daweep{' '}
                        </p>
                        <p className='customPackageStartBtn'>
                          {' '}
                          Starting from - Rs 8000 / m{' '}
                        </p>
                      </Col>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container> 
          </section>
              {/* section 3 ends */}
        </>
        );
  }
}



export default ThemeDestinationComponent;