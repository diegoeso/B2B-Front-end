/**
 * Created by azim on 6/7/20.
 */
import React from 'react'
import ReactDOM from 'react-dom'
import styles from '../../Style.css'
import classNames from 'classnames'
import connect from 'react-redux/es/connect/connect'
import {Row, Col, Form, Button, Table, Modal, Spinner} from 'react-bootstrap'
import { addCard, handleInputCardChange } from '../../actions/CardAction';
import moment from 'moment';
const mapStateToProps = (state) => {
    return {
        errors: state.Card.errors,
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        addCard: (props) => dispatch(addCard(props)),
        handleInputCardChange: (data) => dispatch(handleInputCardChange(data)),
    }
}
class AddCardComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    handleInputChange = (event) => {
        this.props.handleInputCardChange({ [event.target.name]: event.target.value });
    }

    render() {
        const {addCard, errors} = this.props;
        return (
            <>
            <Row className='width100 comman-wrapper'>
                <Col xs={12} xl={12} lg={12} className='pad50 textLeft cstm-order-details-box'>
                    <h2 className='ordr-dtls-head'>
                        <i className='fa-chevron-left fa m-r-20' />
                    </h2>
                    <br clear='all' />
                    </Col>

            <Col xs={12} md={12} lg={6} xl={5}>
                <h2> Fill Card Details </h2>
                <Form className='pad25'>
                    <span className='card-name'>Debit Card</span>
                    <Form.Group>
                        <Form.Check type='radio' name='type' value="1" inline
                                    onChange={this.handleInputChange.bind(this)}
                                    isInvalid={errors != undefined && !!errors.type}/>
                        <span className='card-name'>Credit Card</span>
                        <Form.Check type='radio' label='' name='type' value="2" inline
                                    onChange={this.handleInputChange.bind(this)}
                                    isInvalid={errors.errors != undefined && !!errors.errors.type}/>
                        <Form.Control.Feedback type='invalid'>
                            {errors.errors != undefined && errors.errors.type != undefined ? errors.errors.type : ''}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Row xs={12} xl={12} className='width100 add-card-input-box'>
                        <Col xs={12} sm={12} lg={6} md={6} xl={6} className='p-l-0'>
                            <Form.Group>
                                <Form.Control type='text' placeholder='Card No.' className='card-input'
                                              name="card_number" onChange={this.handleInputChange.bind(this)}
                                              isInvalid={errors.errors != undefined && !!errors.errors.card_number}/>
                                <Form.Control.Feedback type='invalid'>
                                    { errors.errors != undefined && errors.errors.card_number != undefined ? errors.errors.card_number : '' }
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} lg={6} md={6} xl={6} className='p-l-0'>
                            <Form.Group>
                                <Form.Control type='date' placeholder='Expiry mm/yy' className='card-input cstmDate'
                                              name="expiry_date" onChange={this.handleInputChange.bind(this)}
                                              isInvalid={errors.errors != undefined && errors.errors != null && !!errors.errors.expiry_date}/>
                                <Form.Control.Feedback type='invalid'>
                                    {errors.errors != undefined && errors.errors.expiry_date != undefined ? errors.errors.expiry_date : ''}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} lg={6} md={6} xl={6} className='p-l-0'>
                            <Form.Group>
                                <Form.Control type='text' placeholder='Name On Card' className='card-input'
                                              name="holder_name" onChange={this.handleInputChange.bind(this)}
                                              isInvalid={errors.errors != undefined && errors.errors != null && !!errors.errors.holder_name}/>
                                <Form.Control.Feedback type='invalid'>
                                    {errors.errors != undefined && errors.errors.holder_name != undefined ? errors.errors.holder_name : ''}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} lg={6} md={6} xl={6} className='p-l-0'>
                            <Form.Group>
                                <Form.Control type='text' placeholder='CVV' className='card-input' name="cvv"
                                              onChange={this.handleInputChange.bind(this)}
                                              isInvalid={errors.signup != undefined && !!errors.signup.cvv}/>
                                <Form.Control.Feedback type='invalid'>
                                    {errors.errors != undefined && errors.errors.cvv != undefined ? errors.errors.cvv : ''}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} lg={12} md={12} xl={12} className='p-l-0'>
                            <Form.Group>
                                <Button type='button' className='add-card-sbmt-btn btn btn-block'
                                        onClick={ addCard.bind(this) }>
                                    Submit
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Col>
                </Row>
            </>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddCardComponent)