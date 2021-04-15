import React from 'react'
import ReactDOM from 'react-dom'
import styles from '../../Style.css'
import Responsive from '../../Responsive.css'
import classNames from 'classnames'
import { Row, Col, Form, Button, Table, Modal, Spinner} from 'react-bootstrap'
import inr from '../../image/inr.png'

class ViewAllImageComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
     
    }
  }

  closePopup = () => {
    this.props.onClick();
    this.setState({ openPopup: false });
  }

  render () {
   
    return (
  
            <Modal className="custom-model-view-image" size='lg' show={this.props.openPopup} aria-labelledby='example-modal-sizes-title-lg'>
              <Modal.Header className='scdl-popup-header'>
                <i className='fa fa-times pop-close-icon' onClick={this.closePopup.bind(this)} />
              </Modal.Header>
              <Modal.Body className='pad32 order-cancel-popup terms-condition'>
               {this.props.uploads != undefined && this.props.uploads.length > 0 ? this.props.uploads.map((imgae,i) =>  <Col xs={12} sm={12} md={12} lg={12} xl={12} className='trip-img-col1 book-view-all-banner-box'>
                    <img src={ imgae.file_name_url } className='trip-img-lg img-responsive' alt='b2b' />
                    </Col>) : ''}
              </Modal.Body>
            </Modal>
      )
    }
  }

export default ViewAllImageComponent