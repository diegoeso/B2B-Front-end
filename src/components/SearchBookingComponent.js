import React from 'react'
import styles from '../Style.css'

import classNames from 'classnames'
import { Row, Col, Container,Button } from 'react-bootstrap'
import romantic from '../image/romantic.png'
import bookingUser from '../image/bookingUser.png'
import duration from '../image/calender.png'
import bookingLocation from '../image/bookingLocation.png'
import filter from '../image/filter.png'
import family from '../image/family.png'
import { Link } from 'react-router-dom'
class SearchBookingComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <Container className='cstm-home-container'>
        <section className='comman-wrapper cstm-bookinglist-wrapper'>
          <Row className='width100'>
            <Col xs={12} lg={12} xl={12} className='pad55 mob-pad20 m-t-65'>
              <h2 className='cstm-left-heading'>Search</h2>
              

              <Col xs={12} sm={12} xl={12} className='row cstm-order-box'>
                <Col xs={12} md={4} lg={3} sm={4} xl={4} className='pad0'>
                  <img
                    src={romantic}
                    className='img-responsive cstm-order-img'
                    alt='optucorp'
                  />
                </Col>
                <Col xs={12} md={8} lg={9} sm={8} xl={8} className='pad10'>
                  <Row>
                    <Col xs={12} md={12} lg={12} xl={12}>
                   <Col xs={12} md={12} lg={6} className="cstm-search-hdr-wrapper">
                    <Link to={"/"}>
                            <h2 className='search-hdr'>
                            Goa Friends Special Package
                            </h2>
                            </Link>
                            <Link to={"/"}>
                              <p className='start-pack-txt'>
                               INR 6,000/M
                              </p>
                            </Link>
                            </Col>
                      <Row xs={12} xl={12} className='textLeft m-t-20'>
                        <Col
                          xs={12}
                          md={12}
                          lg={10}
                          className='row cstm-booking-details-wrapper'
                        >
                          <Col
                            xs={12}
                            sm={12}
                            md={12}
                            lg={6}
                            className='m-b-20 book-order-info-box'
                          ><span className='htl-cat-text'> Hotel Category </span>
                          <span className='htl-rate-star'>
                            <i class='fa fa-star' />
                            <i class='fa fa-star' />
                            <i class='fa fa-star' />
                            <i class='fa fa-star' />
                          </span>
                          </Col>
                          <Col
                            xs={12}
                            sm={12}
                            md={12}
                            lg={6}
                            className='m-b-20 book-order-info-box'
                          >
                              <img
                          src={duration}
                          class='img responsive ordr-dtls-tym-img'
                          alt='optucorp'
                        />
                        <span className='ordr-dtls-day-txt'>
                          7 Days, 8 Nights
                        </span>
                          </Col>
                          <Col
                            xs={12}
                            sm={12}
                            md={12}
                            lg={6}
                            className='m-b-20 book-order-info-box book-order-info-box'
                          >
                             <img
                          src={family}
                          class='img responsive ordr-dtls-tym-img'
                          alt='optucorp'
                        />
                        <span className='ordr-dtls-day-txt'>
                          2 Adults, 1 children
                        </span>
                          </Col>
                          <Col
                            xs={12}
                            sm={12}
                            md={12}
                            lg={6}
                            className='m-b-20 book-order-info-box'
                          >
                              <span className='search-tag'>Beach</span>
                        <span className='search-tag'>Honeymoon</span>
                          </Col>
                        </Col>
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={2}
                          className='m-b-20 pad0 buy-btn-wrapper'
                        >
                          <Button variant="outline-info" className="search-buy-pkg-btn">Buy Now</Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Col>
           </Col>
          </Row>
        </section>
      </Container>
    )
  }
}

export default SearchBookingComponent
