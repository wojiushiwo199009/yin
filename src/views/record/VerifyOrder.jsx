import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import ajax from '../../api'
import {Form, Input, Button, Row, Col, message, DatePicker, InputNumber} from 'antd'
const FormItem = Form.Item
export class AddOrderForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      noPass: false,
      verifyObj: this.props.verifyObj
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      console.log(values, 'vv')
      if (!err) {
        let params = {
          id: this.state.verifyObj.id,
          status: this.state.noPass ? 8 : 1,
          result: (this.state.noPass ? values.nopass : ''),
          price: values.price || this.state.verifyObj.merchantPrice,
          endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : moment.unix(parseInt(this.state.verifyObj.endTime.toString().slice(0, 10))).format('YYYY-MM-DD HH:mm:ss')
        }
        console.log(params, 'params')
        ajax.getAdminMerchantOrder(params, response => {
          if (response.state.stateCode === 0) {
            this.props.onCancel()
            this.props.getOrder()
          } else {
            message.error(response.state.stateMessage || '审核失败，请重试')
            this.props.getOrder()
          }
        }, error => {
          console.log(error)
          message.error('审核失败，请重试')
          this.props.getOrder()
        })
      }
    })
  }
  NoPass = () => {
    this.setState({
      noPass: true
    })
  }
  handleNoPass = () => {
    console.log('审核不通过')
  }
  handleCancel= () => {
    this.setState({
      noPass: false
    })
  }
  handleNumberChange = (rule, value, callback) => {
    console.log(rule, value)
    if (value) {
      let myreg = /(^[1-9]\d*(\.\d{1,2})?$)|(^ 0(\.\d{1,2}) ? $)/
      if (value && myreg.test(value)) {
        callback()
      } else {
        let validatemobile = '请输入正确的价钱!'
        callback(validatemobile)
      }
    } else {
      callback()
    }
  }
  onChange = (value, dateString) => {
    console.log('Selected Time: ', value)
    console.log('Formatted Selected Time: ', dateString)
    this.setState({
      // endTime: dateString
    })
  }
  onOk = (value) => {
    console.log('onOk: ', value, moment(value).format(('YYYY-MM-DD HH:mm:ss')))
    this.setState({
      endTime: moment(value).format(('YYYY-MM-DD HH:mm:ss'))
    })
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      verifyObj: nextProps.verifyObj
    })
  }
  render () {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      }
    }
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} >
        {
          this.state.noPass ? '' : <FormItem {...formItemLayout} label='定价'>
            {getFieldDecorator('price', {
              initialValue: this.state.verifyObj.merchantPrice,
              rules: [{ required: true, message: '请输入定价!' },
                {
                  validator: this.handleNumberChange
                }
              ]
            })(
              <InputNumber placeholder='请输入定价' style={{width: '174px'}} />
            )}
          </FormItem>
        }
        {
          this.state.noPass ? '' : <FormItem {...formItemLayout} label='截止交稿时间'>
            {getFieldDecorator('endTime', {
              initialValue: this.state.verifyObj.endTime ? moment(moment.unix(parseInt(this.state.verifyObj.endTime.toString().slice(0, 10))).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD') : moment('2018-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss'),
              rules: [{
                required: true, message: '请选择截止交稿时间!'
              }]
            })(
              <DatePicker onChange={this.onChange} onOk={this.onOk} format='YYYY-MM-DD HH:mm:ss' showTime />
            )}
          </FormItem>
        }
        {
          this.state.noPass ? <FormItem {...formItemLayout} label='不通过原因'>
            {getFieldDecorator('nopass', {
              initialValue: '',
              rules: [{
                required: true, message: '请输入不通过原因!'
              }]
            })(
              <Input placeholder='请输入不通过原因' />
            )}

          </FormItem> : ''
        }
        <FormItem>
          <Row>
            <Col span={6} offset={6}>
              {
                this.state.noPass ? <Button onClick={this.handleCancel}>取消</Button> : <Button onClick={this.NoPass}>审核不通过</Button>
              }
            </Col>
            <Col span={6} offset={1}>
              {
                this.state.noPass ? <Button htmlType='submit'>审核不通过</Button> : <Button type='primary' htmlType='submit' className='login-form-button'>审核通过</Button>
              }
            </Col>
          </Row>
        </FormItem>
      </Form>
    )
  }
}
const AddOrder = Form.create()(AddOrderForm)
AddOrderForm.propTypes = {
  form: PropTypes.object,
  onCancel: PropTypes.func
}
export default AddOrder
