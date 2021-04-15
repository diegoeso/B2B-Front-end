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
import banner from '../../image/banner.png'
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import tripImgTwo from '../../image/tripImgTwo.jpg';
import tripImgThree from '../../image/tripImgThree.jpg';
import tripImgFour from '../../image/tripImgFour.jpg';
import mediaIconCanclPolicy from '../../image/mediaIconCanclPolicy.png';
import mediaIconTerms from '../../image/mediaIconTerms.png';
import mediaIconPersons from '../../image/family.svg';
import mediaIconCalendar from '../../image/calendar.svg';
import mediaIconExclusion from '../../image/mediaIconExclusion.png';
import mediaIconInclusion from '../../image/mediaIconInclusion.png';
import selectArrow from '../../image/selectArrow.png';
import moment from 'moment';
import noimage from '../../image/no-image.jpeg'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getHotelStart,getCurrencySymbol,returnLanguageText,getPricePerMonth} from "../../constants";
const mapStateToProps = (state) => {
    return {
        package_frequency: state.Auth.package_frequency,
        langContent: state.Lang.langContent,
        lang: state.Lang.lang,
        room_category: state.Auth.room_category,
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
    }
}
class OderMyWishlist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formData:{scheduled_date:'',package_frequency:'',package_id: ''}
        };

    }

    handleChange = (date) => {
        let formData = this.state.formData;
        formData['scheduled_date'] = moment(date).format('YYYY-MM-DD HH:mm:ss');
        
        this.setState({
            startDate: date,
            formData,
            errors:{},
        });
    }

    onChangeInput(event){
        let formData = this.state.formData;
        formData['package_frequency'] =  event.target.value;
        this.setState({formData,errors:{}});
    }

    handleSubmit(id) {
        let formData = this.state.formData;
        let langContent = this.props.langContent;
        formData['package_id'] = id
        let errors ={};
        let flg = true;

        if (formData.package_frequency == '') {
            errors['package_frequency']= langContent.package_frequency_is_required;
            flg = false;
        }
        if (formData.scheduled_date == '') {
            errors['scheduled_date'] = langContent.scheduled_date_is_required;
            flg = false;
        } else if (formData.scheduled_date != '') {
            if (!moment(formData.scheduled_date).isSameOrAfter(moment().format('YYYY-MM-DD'))) {
                errors['scheduled_date'] = langContent.Scheduled_date_equal_today;
                flg = false;
            }
        }

        if(flg) {
             if (typeof this.props.onChange === 'function') {
                    this.props.onChange(formData);
                }

        } else {
            this.setState({errors});
        }

    }

    render() {
        const {package_frequency, removeFromWishList,carts,wish,tripImage,key,langContent,lang,room_category } = this.props;
        const {errors} = this.state;
        return (<Row className="tripimg-col-wrapper splpackage-wrapper animation" key={key}>
                <Col xs={12} sm={12} md={4} lg={4} className="trip-img-col1">
                    <img src={tripImage} className="trip-img-lg"/>
                </Col>
                <Col xs={12} sm={12} md={8} lg={8} className="trip-img-col">
                    <Row className="rating-wrapper">
                        <Col className="rating-info wishlist">
                            <h3 className="wishlist-hotel-Name"><span className="htl-title">{returnLanguageText(carts[wish].package,lang,'title')}</span><span className="amount"> {getCurrencySymbol('',lang)}  {getPricePerMonth(carts[wish].package.total_amount,'monthly', lang)}</span></h3>
                            <Col className="rating-icon-wrapper star">
                                <p className="rating-text"> 
                                {carts[wish].package.package_type !== 1 ? <>{langContent.hotel_category != undefined ? langContent.hotel_category :' '}</> : <>
                                  {langContent.room_category != undefined ? langContent.room_category :'Room Category'} 
                                </>} 
                                </p>
                                
                                {carts[wish].package.package_type !== 1 ? <>

                                    { typeof carts[wish].package.hotel_type == 'string' ? carts[wish].package.hotel_type : (<>
                                    { getHotelStart(carts[wish].package.hotel_type).map((hType, i) => {
                                        return <i className="fa fa-star" aria-hidden="true" key={i}></i>;
                                    }) }
                                    </>)}
                                </> :  <>
                                    { room_category != null ? room_category[lang][carts[wish].package.room_category] : ''}
                                </>}

                               <span className="cldr">
                                <img src={mediaIconCalendar} className="icon-calendar"/>
                                   { carts[wish].package.days != null ? carts[wish].package.days+' '+langContent.days : '' } { carts[wish].package != null && carts[wish].package.nights != null ? ', '+carts[wish].package.nights+' '+langContent.nights : '' }
                              </span>
                                <Col xs={12} sm={12} md={12} lg={12}
                                     className="rating-info wishlist htl-ct1 clearfix">
                                    <p className="family-icon">
                                        <img src={mediaIconPersons} className="icon-family"/>
                                        { carts[wish].package != null && carts[wish].package.adults != null ? carts[wish].package.adults+' '+langContent.adults : '' }
                                        { carts[wish].package != null && carts[wish].package.children != null ? ', '+carts[wish].package.children+' '+langContent.children : '' }
                                        { carts[wish].package != null && carts[wish].package.juniors != null ? ', '+carts[wish].package.juniors+' '+langContent.juniors : '' }
                                    </p>
                                    <Col className="rating-btn-wrapper wishlist-main">
                                        {carts[wish].package != null && carts[wish].package.themes != null ? carts[wish].package.themes.map(theme=> {
                                            return <a className="rating-link" href="#">{lang =='hindi' ? theme.hindi_name : theme.name}</a>;
                                        }) : ''}
                                    </Col>
                                </Col>{/*rating-info htl ends*/}
                            </Col>{/*rating icon wrapper ends*/}

                            <Col className="rating-icon-wrapper emiform-wrapper payment-wrapper cstm-wishlist-wrapper">
                                <p><span className="remove-txt cursor" onClick={ removeFromWishList.bind(this,carts[wish].package.id) }>  {langContent.remove != undefined ? langContent.remove :'Remove'} </span> </p>
                                <Form>
                                    <Form.Group controlId="Form.ControlSelect1">
                                        <Form.Control as="select" placeholderText={langContent.payment_frequency} name="package_frequency" onChange={this.onChangeInput.bind(this)}  isInvalid={errors != undefined && !!errors.package_frequency} defaultValue=''>
                                            <option value=''>  {langContent.payment_frequency != undefined ? langContent.payment_frequency :'Payment Frequency'} </option>
                                            {package_frequency[lang] !=undefined ? Object.keys(package_frequency[lang]).map(payment_cycle=> {
                                                return <option key={payment_cycle} value={payment_cycle} >{package_frequency[lang][payment_cycle]}</option>;
                                            }) : ''}
                                        </Form.Control>
                                         <Form.Control.Feedback type='invalid' className="frcy-invalid">
                                              {errors!= undefined && errors.package_frequency != undefined ?  errors.package_frequency : ''}
                                          </Form.Control.Feedback>
                                    </Form.Group>
                                
                                    <Form.Group controlId="exampleForm.ControlSelect1"
                                                className='m-b-30'>
                                                <DatePicker
                                                    selected={this.state.startDate}
                                                    name='scheduled_date'
                                                    onChange={this.handleChange}
                                                    className='customLoginInput cstmDate custom-pkg-wd scheduled_date_170 wishlist-date'
                                                    placeholderText={langContent.scheduledDate}
                                                    isInvalid={errors != undefined && !!errors.scheduled_date}
                                                />
                                        <Form.Control.Feedback type='invalid' className="invalid-date">
                                              {errors!= undefined && errors.scheduled_date != undefined ?  errors.scheduled_date : ''}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                                <Col xs={12} sm={12} md={12} lg={12} className="payment-btn-wrapper">
                                    <Button variant="outline-info" size="sm"  type="Button" onClick={this.handleSubmit.bind(this,carts[wish].package.id)}>  {langContent.buy_now != undefined ? langContent.buy_now :'Buy Now'} </Button>
                                </Col>
                            </Col>{/*rating icon wrapper ends*/}
                        </Col>{/*rating info ends*/}
                    </Row>{/*rating-wrapper ends*/}
                </Col>{/*trip img col ends*/}
            </Row>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OderMyWishlist)