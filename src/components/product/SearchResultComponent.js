import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import connect from 'react-redux/es/connect/connect'
import styles from "../../Style.css";
import responsive from "../../Responsive.css";
import classNames from "classnames";
import {Row,Col,Container,Form,Button,Spinner} from 'react-bootstrap';
import mediaIconPersons from '../../image/mediaIconPersons.png';
import mediaIconCalendar from '../../image/mediaIconCalendar.png';
import noimage from '../../image/no-image.jpeg'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getHotelStart} from "../../constants";
import { getSearch } from '../../actions/SearchAction';
import { Link } from 'react-router-dom'
import GoaImg from '../../image/GoaPackage.jpg'
import { convertToSlug,getUrl,returnLanguageText,getCurrencySymbol,getPricePerMonth} from '../../constants.js'
const mapStateToProps = (state) => {
    return {
        result: state.Search.result,
        isPending: state.Search.isPending,
        customer: state.Auth.customer,
        totalCount:state.Search.totalCount,
        langContent: state.Lang.langContent,
        lang: state.Lang.lang,
        room_category: state.Search.room_category,
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        getSearch: (keyword, limit) => dispatch(getSearch(keyword,limit)),
    }
}
class SearchResultComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            limit:5,
        };
        this.handleScroll = this.handleScroll.bind(this);
    }
    componentWillMount() {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let keyword = params.get('keyword');
        let limit = this.state.limit;
         if(keyword.trim()!= '') {
          this.setState({keyword});
          this.props.getSearch(keyword,limit);
        }
    }
    componentWillReceiveProps(nextProps){
       let params = new URLSearchParams(nextProps.location.search);
       let keyword = params.get('keyword');
       let limit = 5;
       if(keyword.trim()!= '' && keyword != this.state.keyword) {
         this.props.getSearch(keyword,limit);
         this.setState({keyword,limit});
       }

    }
    componentDidMount() {
        // test
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll(event) {
        let limit =  this.state.limit;
        let totalCount = this.props.totalCount;
        if(limit < totalCount) {

          let isPending = this.props.isPending;
          let height= event.target.scrollingElement.offsetHeight-event.target.documentElement.clientHeight;
          let scrollHeight = window.scrollY;
          let keyword = this.state.keyword;
    
          if(scrollHeight >= height-365) {
              if(isPending == false) { 
                 limit = limit+10;
                 this.setState({limit});
                 this.props.getSearch(keyword, limit);
              }
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
       return <img src={noimage} className={classIMG}/>
    }
 
  }
    render() {
        const { result,customer,isPending,totalCount,langContent,lang,room_category } = this.props;
        const { keyword } = this.state;
        if(result == null) {
            return '';
        }
        return (<>
            {/*section 1 starts*/}
            <Container fluid>
                <section className="width100 wishlist-wrapper">
                    <Row className="splpackage-wrapper">
                        <Col xs={12} sm={12} md={12} lg={12} className="trip-img-col1">
                            <h3>{langContent.search_result} "{keyword}"</h3>
                        </Col>
                        
                        { result.length != 0 ? result.map((wish,index)=> {
                            
                            return <><Row className="tripimg-col-wrapper splpackage-wrapper" key={index}>
                            <Col xs={12} sm={12} md={6} lg={4} className="trip-img-col1">
                                
                                {this.getthumnelOfimage(wish.uploads,'trip-img-lg')}
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={8} className="trip-img-col">
                                <Row className="rating-wrapper">
                                    <Col className="rating-info wishlist">
                                        <h3><span className="search-title">{returnLanguageText(wish,lang,'title')}</span><span className="amount">{getCurrencySymbol(wish,lang)+' '+getPricePerMonth(wish.total_amount,'monthly', lang)}</span></h3>
                                        <Col className="rating-icon-wrapper star">
                                            <p>
                                               {wish.package_type !== 1 ? <>{langContent.hotel_category != undefined ? langContent.hotel_category :' '}</> : <>
                                                  {langContent.room_category != undefined ? langContent.room_category :'Room Category'} 
                                                </>} 
                                            </p>
                                          {wish.package_type !== 1 ? <>

                                            { typeof wish.hotel_type == 'string' ? wish.hotel_type : (<>
                                            { getHotelStart(wish.hotel_type).map((hType, i) => {
                                                return <i className="fa fa-star" aria-hidden="true" key={i}></i>;
                                            }) }
                                            </>)}
                                            
                                          </> :  <>
                                             { room_category != null ? room_category[lang][wish.room_category] : ''}
                                          </>}
                                           <span className="cldr">
                                            <img src={mediaIconCalendar} className="icon-calendar"/>
                                               { wish.days != null ? wish.days+' '+langContent.days : '' } { wish != null && wish.nights != null ? ', '+wish.nights+' '+langContent.night : '' }
                                           
                                          </span>
                                            <Col xs={12} sm={12} md={12} lg={12}
                                                 className="rating-info wishlist htl-ct1 clearfix">
                                                <p className="family-icon">
                                                    <img src={mediaIconPersons} className="icon-family"/>
                                                    { wish != null && wish.adults != null ? wish.adults+' '+langContent.adults : '' }
                                                    { wish != null && wish.children != null ? ', '+wish.children+' '+langContent.children : '' }
                                                    { wish != null && wish.juniors != null ? ', '+wish.juniors+' '+langContent.juniors : '' }
                                                </p>
                                                <Col className="rating-btn-wrapper">
                                                    {wish != null ? wish.themes.map((theme,i)=> {
                                                        return <a className="rating-link" href="#" key={i}>{lang =='hindi' ? theme.hindi_name : theme.name}</a>;
                                                    }) : ''}
                                                </Col>
                                            </Col>{/*rating-info htl ends*/}
                                        </Col>{/*rating icon wrapper ends*/}

                                        <Col className="rating-icon-wrapper emiform-wrapper payment-wrapper">
                                            <Col xs={12} sm={12} md={12} lg={12} className="payment-btn-wrapper search-payment">
                                               <Link to={getUrl(customer)+wish.id+"/"+convertToSlug(wish.title)}> <Button variant="outline-info search-buy-btn" size="sm" >{langContent.buy_now}</Button> </Link>
                                            </Col>
                                        </Col>{/*rating icon wrapper ends*/}
                                    </Col>{/*rating info ends*/}
                                </Row>{/*rating-wrapper ends*/}
                            </Col>{/*trip img col ends*/}
                        </Row></>
                        }) : <>

                             <Col xs={12} sm={12} md={12} lg={12} className="error-wrapper">

                                <h2 className='odr-dtls-no-info'> {langContent.no_record_found} </h2>

                              </Col>
                              <Col xs={12} sm={12} md={12} lg={12} className="no-record-found" ></Col>
                              </>

                      }
                        
                        {isPending ? 
                       <Col className="div-Spinner">
                          <Spinner animation="grow" variant="primary" />
                          <Spinner animation="grow" variant="secondary" />
                          <Spinner animation="grow" variant="success" />
                       </Col>
                       : ''}
                    </Row>{/*last row wrapper ends*/}
                </section>
            </Container>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultComponent)