import React, { Component } from 'react'
import classNames from 'classnames'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import connect from "react-redux/es/connect/connect";
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
const mapStateToProps = state => {
  return {
    user: state.session.user,
    lang: state.Lang.lang,
    langContent: state.Lang.langContent,
  }
}
class Footer extends Component {
  constructor (props) {
    super(props)
  }
  scrollToId() {
    var element = document.getElementById("popular_destinations");
    element.scrollIntoView();
  }

  render () {
    const { user,lang,langContent} = this.props;
    return (
      <Container className='cstm-home-container'>
        <Row className='customFooterSection'>
          <Col xs={12} md={4} sm={4} lg={4} className="custom-col">
            <span className='customFootertext'> {langContent.contact_us_text !=undefined ? langContent.contact_us_text : 'Contact Us' } customerservice@optucorp.com </span>
          </Col>
          <Col xs={12} md={4} sm={4} lg={4} className="custom-col">
            <span className='customFootertext'> {langContent.all_rights_reserved_text !=undefined ? langContent.all_rights_reserved_text : '&copy; 2020 Optucorp. All Rights Reserved.' } </span>
           <span className='customFootertext designedText'> {langContent.developed_by !=undefined ? langContent.developed_by : 'Developed By:' } <a href="https://surmountsoft.com/" target="_blank" className="footerdevelopedlink"> Surmountsoft</a></span>
          </Col>
        
            <Col xs={12} md={4} sm={4} lg={4} className="custom-col custom-login text-right">
            { Object.keys(user).length == 0 ?<>
              <Link to={'/login'}><span className='customFootertext m-r-40'> {langContent.footer_login_text !=undefined ? langContent.footer_login_text : 'Login' } </span></Link>
              <span className='customFootertext cursor' onClick={ this.scrollToId.bind(this) }> {langContent.buy_package_text !=undefined ? langContent.buy_package_text : 'Buy you Package' } </span>
             </> : <> <span className='customFootertext cursor' onClick={ this.scrollToId.bind(this) }> {langContent.buy_package_text !=undefined ? langContent.buy_package_text : 'Buy you Package' } </span> </>  } </Col> 
        
          <Col xs={12} md={4} sm={4} lg={4} className='custom-col cstm-buy-package-box'>
          
          </Col>
        </Row>
      </Container>
    )
  }
}
export default connect(mapStateToProps)((Footer));
