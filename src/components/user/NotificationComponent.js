import React from 'react'
import styles from '../../Style.css'

import classNames from 'classnames'
import { Row, Col, Container,Modal,Button } from 'react-bootstrap'
import romantic from '../../image/romantic.png'
import bookingUser from '../../image/bookingUser.png'
import duration from '../../image/duration.png'
import bookingLocation from '../../image/bookingLocation.png'
import filter from '../../image/filter.png'
import deleteNoti from '../../image/trash.png'
import { Link } from 'react-router-dom'
import connect from 'react-redux/es/connect/connect'
import {getNotifications,removeNotification} from '../../actions/AuthAction';
import moment from 'moment';
const mapStateToProps = (state) => {
  return {
    notification: state.Auth.notification,
    auth: state.Auth,
    langContent: state.Lang.langContent,
    lang: state.Lang.lang,
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    removeNotification: (id) => dispatch(removeNotification(id, props)),
    getNotifications: () => dispatch(getNotifications()),
  }
}
class NotificationComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    notification:'',
    openPopup:false,
    deleteId:'',
    currentIndex:''
    }
  }
componentDidMount() {
  this.props.getNotifications();
}
deletePopup = (id,i) => {
  this.setState({openPopup:true,deleteId:id,currentIndex:i})
}
deletePopupclose = () => {
  this.setState({openPopup:false})
}
deleteData =(id,i) => {
  this.props.removeNotification(id,i);
  this.deletePopupclose();
}
  render () {
     const {notification,langContent,removeNotification,lang} = this.props;
    return (

      <Container className='cstm-home-container'>
        <section className='comman-wrapper cstm-bookinglist-wrapper notification-wrapper'>
          <Row className='width100'>
            <Col xs={12} lg={12} xl={12} className='pad55 mob-pad20 m-t-65'>
              <h2 className='cstm-left-heading'>  {langContent.notification_text != undefined ? langContent.notification_text :'Notifications'} </h2>
              { notification != null && notification != undefined && notification.length > 0 ? notification.map((notification,i) => {
             return<> <Row xs={12} sm={12} xl={12} className='cstm-order-box pad30 animation'>
               <Col xs={12} lg={10} md={9} sm={12} className="notification-wrapper">
               <Row>
              <Col md={1} lg={1} xs={1} lg={1} className="mob-pad-0 pad0 noti-bullet-wrapper">
              {notification.is_read !=0 ?<>  <span className="fa fa-circle lgt-color-bullet"> </span></>:<> <span className="fa fa-circle noti-cstm-bullet"> </span></>}</Col>
               <Col md={11} lg={11} sm={11} xs={11}  className="mob-pad-0 pad0">
               <span className="cstm-noti-txt">  {lang =='en'? notification.message_english !=null && notification.message_english !=undefined ? notification.message_english :'' :notification.message_hindi !=null && notification.message_hindi !=undefined ? notification.message_hindi :''  } </span>
               </Col>
              </Row>
               </Col>
               <Col xs={12} lg={2} md={3} sm={12} className="noti-date-wrapper">
               <span className="noti-date-txt"> {notification.created_at !=null && notification.created_at !=undefined ?  moment(notification.created_at).format("MM/DD/YYYY") :''  } </span>
               <img src={deleteNoti} className="img-responsive delete-icon"  onClick={this.deletePopup.bind(this,notification.id,i)}  />
               </Col>
                
              </Row>
             
           </>   }) :

           <Col xs={6} sm={6} md={6} lg={6} className="error-wrapper">

                 <h2 className='odr-dtls-no-info'> {langContent.no_record_found} </h2>

          </Col>
          
         }
             
            </Col>
          </Row>
          <Modal className="" size='md' show={this.state.openPopup} aria-labelledby='example-modal-sizes-title-lg'>
                    <Modal.Header className='scdl-popup-header cancel-popup-hdr'>
                      <i className='fa fa-times pop-close-icon' onClick={this.deletePopupclose.bind(this)} />
                    </Modal.Header>
                    <Modal.Body className='pad32 order-cancel-popup'>
                   
                      <h2 className="deletePopupText">{langContent.are_you_sure_you_want_to_delete}</h2>
                      <Button className="btn btn-default cancel-Popup-Btn" onClick={this.deletePopupclose.bind(this)}>{langContent.cancel}</Button>
                      <Button className="btn btn-danger submit-Popup-Btn" onClick={ this.deleteData.bind(this,this.state.deleteId,this.state.currentIndex) }>{langContent.submit}</Button>
                    </Modal.Body>
                  </Modal>
        </section>
      </Container>
      
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NotificationComponent)
