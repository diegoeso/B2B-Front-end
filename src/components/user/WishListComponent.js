import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import connect from 'react-redux/es/connect/connect'
import styles from "../../Style.css";
import responsive from "../../Responsive.css";
import classNames from "classnames";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form'
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import noimage from '../../image/no-image.jpeg'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getHotelStart} from "../../constants";
import OderMyWishlist from './OderMyWishlist';

import {
    getWishList, removeFromWishList, buyNowWishList,
} from '../../actions/AuthAction';
import {addToOrderByWishlist} from '../../actions/OrderAction';
const mapStateToProps = (state) => {
    return {
        mywishlist: state.Auth.mywishlist,
        package_frequency: state.Auth.package_frequency,
        token: state.session.token,
        langContent: state.Lang.langContent,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        removeFromWishList: (id) => dispatch(removeFromWishList(id, props)),
        getWishList: () => dispatch(getWishList()),
        buyNowWishList: (id) => dispatch(buyNowWishList(id, props)),
        addToOrderByWishlist: (data) => dispatch(addToOrderByWishlist(data, props)),
    }
}
class WishListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {};

    }
    componentWillMount() {
        this.props.getWishList();
    }

    handleChange = (date) => {
        //this.props.handleDatetChange ({'scheduled_date':moment(date).format('YYYY-MM-DD HH:mm:ss')});
        this.setState({
            startDate: date
        });
    }
    handleSubmit(formData) {
        this.props.addToOrderByWishlist(formData);
    }
    render() {
        const { mywishlist, package_frequency, removeFromWishList, buyNowWishList,langContent } = this.props;
        return (<>
            {/*section 1 starts*/}
            <Container fluid className="cstm-wish-wrapper">
                <section className="width100 wishlist-wrapper full-height">
                    <Row className="splpackage-wrapper">
                        <Col xs={12} sm={12} md={12} lg={12} className="trip-img-col1">
                            <h3>  {langContent.my_wishlist != undefined ? langContent.my_wishlist :'My Wishlist'} </h3>
                        </Col>
                        { mywishlist != null && mywishlist.carts != null && mywishlist.carts != undefined && mywishlist.carts.length>0 ? Object.keys(mywishlist.carts).map((wish,index)=> {
                            let tripImage = mywishlist.carts[wish].package.uploads.length > 0 ? mywishlist.carts[wish].package.uploads[0].thumbnail_url : noimage;
                            return <OderMyWishlist key={index}  tripImage={tripImage} wish={wish} carts={mywishlist.carts} langContent={langContent}  onChange={this.handleSubmit.bind(this)} removeFromWishList={removeFromWishList}/>
                        }) : <>


                             <Col xs={12} sm={12} md={12} lg={12} className="error-wrapper">

                                <h2 className='odr-dtls-no-info'>  {langContent.no_record_available != undefined ? langContent.no_record_available :'No Record Available'}   </h2>

                              </Col>
                               <Col xs={12} sm={12} md={12} lg={12} className="no-record-found" ></Col>
                              
                          
                            </>}



                    </Row>{/*last row wrapper ends*/}
                </section>
            </Container>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WishListComponent)