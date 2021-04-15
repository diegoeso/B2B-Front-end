/**
 * Created by azim on 7/5/20.
 */
import React from 'react';
import arrowIcon from '../image/arrowicon.png'
import himachal from '../image/himachal.png'
import kashmir from '../image/kashmir.png'
import delhi from '../image/newdelhi.png'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
class PopularDestinations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <>
                <section className='width100'>
                <Col xs={12} lg={12} sm={12} className='customPopularDestinationBox customMarginTop200'>
                    <h2 className='customPopularDestinationHeadingOne'>
                        Popular Destinations  <img src={arrowIcon} className='customArrowIcon' />
                    </h2>
            <h2 className='customPopularDestinationHeadingtwo'> See All </h2>
            <Row className='customPopularBox'>
                <Col xs={12} sm={4} md={4} lg={4}>
                    <Col className='customImageBox'>
                        <img src={himachal} className='customPoplarDestintion'/>
                        <p className='customPopularDestinationCityName'> himachal </p>
                        <p className='customPackageStartBtn'> Starting from - Rs 8000 / m </p>
                    </Col>
                </Col>
                <Col xs={12} md={4} lg={4}>
                    <Col className='customImageBox'>
                        <img src={kashmir} className='customPoplarDestintion' />
                        <p className='customPopularDestinationCityName'>
                            Jammu Kashmir
                        </p>
                        <p className='customPackageStartBtn'>
                            Starting from - Rs 8000 / m
                        </p>
                    </Col>
                </Col>
                <Col xs={12} md={4} lg={4}>
                    <Col className='customImageBox'>
                        <img src={delhi} className='customPoplarDestintion' />
                        <p className='customPopularDestinationCityName'>
                            New Delhi
                        </p>
                        <p className='customPackageStartBtn'>
                            Starting from - Rs 8000 / m
                        </p>
                    </Col>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={12} className='customDestinationPopularBox'>
                    <h2 className='customPopularDestinationHeadingOne'>
                        Description of Poplar Destinations
                    </h2>
                <p className='customPopularDestinationText'>
                        simply dummy text of the printing and typesetting
                    industry.Lorem Ipsum has been the industry 's standard
                    dummy text ever since the 1500s, when an unknown printer
                    took a galley of type and scrambled it to make a type
                    specimen book. It has survived not only five centuries,
                </p>
                </Col>
            </Row>
        </Col>
        <Col className='customPoplarDestinationColorBox' />
            </section>
                </>
        );
    }
}
export default PopularDestinations;