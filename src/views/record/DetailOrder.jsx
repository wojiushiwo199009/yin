import React, { Component } from 'react'
// import Cookies from 'js-cookie'
import { Row, Col, Table, Divider, Button, message, Modal, Form, Input } from 'antd'
import PropTypes from 'prop-types'
import moment from 'moment'
import ajax from '../../api'
import { axiosUrl } from '../../api/axios'
import SeePic from '../writer/SeePic'
import VertifyResult from './VertifyResult'
import './detailOrder.scss'
const FormItem = Form.Item
export class detailOrderForm extends Component {
  state = {
    selectedRowKeys: [],
    idArr: [],
    picVisable: false,
    vertifyVisable: false,
    verifyStatus: '',
    userType: '',
    fileName: '',
    orderCode: '',
    require: '',
    essayTotal: 1,
    merchantPrice: '200',
    essayType: 1,
    orderTitle: 'ss',
    originalLevel: '2',
    picture: 2,
    type: 1,
    endTime: '2018-03-08',
    wordCount: 3000,
    columns: [
      {
        title: '文章标题',
        dataIndex: 'essayTitle'
      }, {
        title: '文章名称',
        dataIndex: 'essayFile'
      }, {
        title: '原创度',
        dataIndex: 'originalLevel'
      }, {
        title: '图片数量',
        dataIndex: 'pictureTotal'
      }, {
        title: '状态',
        dataIndex: 'status',
        render: (text, record) => {
          return (
            <div>
              {
                text === 0 ? <span>待管理员审核</span> : (text === 1) ? <span>商家退稿</span> : (text === 2) ? <span>收稿成功</span> : (text === 3) ? <span>商家已打款</span> : (text === 4) ? <span>待商家审核</span> : (text === 5) ? <span>管理员不通过</span> : (text === 6) ? <span>管理员已打款</span> : ''
              }
            </div>
          )
        }
      },
      {
        title: '审核结果',
        dataIndex: 'result'
      },
      {
        title: '操作',
        dataIndex: 'oprate',
        render: (text, record) => {
          return (
            <div>
              {
                ((this.state.userType === 2 || this.state.userType === 3) && (record.status === 0 || record.status === 4)) ? <a href='javascript:;' onClick={() => this.verify(record)}>审核<Divider type='vertical' /></a> : ''
              }
              <a href='javascript:;' onClick={() => this.downLoad(record)}>下载<Divider type='vertical' /></a>
              <a href='javascript:;' onClick={() => this.seePic(record)}>查看图片</a>
            </div>
          )
        }
      }
    ],
    orderEssayRecords: [
      {
        key: '1',
        id: '',
        essayTitle: 'John Brown',
        essayFile: '',
        originalLevel: 32,
        pictureTotal: 32,
        status: 'New York No. 1 Lake Park',
        result: 'lll'
      }]

  }

  handlePicCancel = () => {
    this.setState({
      picVisable: false
    })
  }
  seePic = (record) => {
    this.setState({
      orderEssayId: record.id,
      picVisable: true
    })
  }
  downLoad = (record) => {
    window.open(axiosUrl + '/order/essay/download?fileName=' + record.essayFile, '_self')
  }
  verify=(record) => {
    this.setState({
      orderEssayId: record.id,
      verifyStatus: record.status,
      vertifyVisable: true
    })
  }
  handleVertifyCancel = () => {
    this.setState({
      orderEssayId: '',
      verifyStatus: '',
      vertifyVisable: false
    })
  }

  getMerchantDetail=() => {
    let params = {
      id: location.hash.split('=')[1]
    }
    ajax.getMerchantDetail(params, response => {
      if (response.state.stateCode === 0) {
        let resData = response.data
        resData.orderEssayRecords.map((item, index) => {
          item.key = index + 1 + ''
        })
        this.setState({
          orderEssayRecords: resData.orderEssayRecords,
          orderCode: resData.orderRecord.orderCode,
          essayTotal: resData.orderRecord.essayTotal,
          merchantPrice: resData.orderRecord.merchantPrice,
          essayType: resData.orderRecord.essayType,
          orderTitle: resData.orderRecord.orderTitle,
          originalLevel: resData.orderRecord.originalLevel,
          picture: resData.orderRecord.picture,
          type: resData.orderRecord.type === 1 ? '养号文' : '流量文',
          endTime: resData.orderRecord.endTime ? moment.unix(parseInt(resData.orderRecord.endTime.toString().slice(0, 10))).format('YYYY-MM-DD HH:mm:ss') : '--',
          wordCount: resData.orderRecord.wordCount,
          userId: resData.orderRecord.userId,
          require: resData.orderRecord.require
        })
      } else {
        message.error('请求失败，请稍后再试')
      }
    }, error => {
      console.log(error)
    })
  }
  getAdminMerchantDetail=() => {
    let params = {
      id: location.hash.split('=')[1]
    }
    ajax.getAdminMerchantDetail(params, response => {
      if (response.state.stateCode === 0) {
        let resData = response.data
        resData.orderEssayRecords.map((item, index) => {
          item.key = index + 1 + ''
        })
        this.setState({
          orderEssayRecords: resData.orderEssayRecords,
          orderCode: resData.orderRecord.orderCode,
          essayTotal: resData.orderRecord.essayTotal,
          merchantPrice: resData.orderRecord.merchantPrice,
          essayType: resData.orderRecord.essayType,
          orderTitle: resData.orderRecord.orderTitle,
          originalLevel: resData.orderRecord.originalLevel,
          picture: resData.orderRecord.picture,
          type: resData.orderRecord.type === 1 ? '养号文' : '流量文',
          endTime: moment.unix(parseInt(resData.orderRecord.endTime.toString().slice(0, 10))).format('YYYY-MM-DD HH:mm:ss'),
          wordCount: resData.orderRecord.wordCount,
          userId: resData.orderRecord.userId,
          require: resData.orderRecord.require
        })
      } else {
        message.error('请求失败，请稍后再试')
      }
    }, error => {
      console.log(error)
    })
  }
  getWriterDetail=() => {
    ajax.getWriterDetail({id: location.hash.split('=')[1]}, response => {
      if (response.state.stateCode === 0) {
        let resData = response.data
        this.setState({
          orderEssayRecords: resData.orderEssayRecords,
          orderCode: resData.orderCode,
          essayTotal: resData.essayTotal,
          merchantPrice: resData.merchantPrice,
          essayType: resData.essayType,
          orderTitle: resData.orderTitle,
          originalLevel: resData.originalLevel,
          picture: resData.picture,
          type: resData.type === 1 ? '养号文' : '流量文',
          endTime: moment.unix(parseInt(resData.endTime.toString().slice(0, 10))).format('YYYY-MM-DD HH:mm:ss'),
          wordCount: resData.wordCount,
          userId: resData.userId,
          require: resData.require
        })
      } else {
        message.error('请求失败，请稍后再试')
      }
    }, error => {
      console.log(error)
    })
  }

  getUserInfo = () => {
    ajax.getUserInfo({}, response => {
      if (response.state.stateCode === 0) {
        this.setState({
          userType: response.data.type
        }, () => {
          if (this.state.userType === 3) {
            this.getMerchantDetail()
          } else if (this.state.userType === 2) {
            this.getAdminMerchantDetail()
          } else if (this.state.userType === 4) {
            this.getWriterDetail()
          }
        })
      } else {
        message.error('请求失败，请稍后再试')
      }
    }, error => {
      console.log(error)
    })
  }
  getOrderSearch = () => {
    let params = {
      fileName: this.state.fileName
    }
    ajax.getOrderSearch({params}, response => {
      if (response.state.stateCode === 0) {
        let resData = response.data
        resData.orderEssayRecords.length > 0 && resData.orderEssayRecords.map((item, index) => {
          item.key = index + 1 + ''
        })
        this.setState({
          orderEssayRecords: resData.orderEssayRecords,
          orderCode: resData.orderRecord.orderCode,
          essayTotal: resData.orderRecord.essayTotal,
          merchantPrice: resData.orderRecord.merchantPrice,
          essayType: resData.orderRecord.essayType,
          orderTitle: resData.orderRecord.orderTitle,
          originalLevel: resData.orderRecord.originalLevel,
          picture: resData.orderRecord.picture,
          type: resData.orderRecord.type === 1 ? '养号文' : '流量文',
          endTime: moment.unix(parseInt(resData.orderRecord.endTime.toString().slice(0, 10))).format('YYYY-MM-DD HH:mm:ss'),
          wordCount: resData.orderRecord.wordCount,
          userId: resData.orderRecord.userId,
          require: resData.require
        })
      } else {
        message.error('请求失败，请稍后再试')
      }
    }, error => {
      console.log(error)
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getOrderSearch()
      }
    })
  }
  InpChange = (e) => {
    this.setState({
      fileName: e.target.value
    })
  }
  getOrderDownLoad = () => {
    let params = {
      id: this.state.idArr.join(',')
    }
    window.open(axiosUrl + '/order/essay/downloads?id=' + params.id, '_self')
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
    let paramArr = []
    if (selectedRowKeys.length >= 0) {
      selectedRows.map((item, index) => {
        paramArr.push(item.id)
      })
      this.setState({
        selectedRowKeys,
        idArr: paramArr
      })
      console.log(this.state.idArr)
    }
    this.state.selectedRowKeys.push(selectedRows.id)
  }

  componentDidMount () {
    this.getUserInfo()
  }
  render () {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }
    const hasSelected = selectedRowKeys.length > 0
    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 6 }
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 15 }
    //   }
    // }
    // const { getFieldDecorator } = this.props.form
    return (
      <div className='detail-order' >
        {/* {
          (this.state.userType === 2 || this.state.userType === 3) ? <div style={{overflow: 'hidden', marginBottom: '20px'}}><Form layout='inline' onSubmit={this.handleSubmit} className='record-form' style={{float: 'right'}}>
            <FormItem
              {...formItemLayout}
              label=''
            >
              {getFieldDecorator('fileName', { initialValue: '' })(
                <Input placeholder='请输入压缩文件名称' onChange={this.InpChange} style={{width: '260px'}} />
              )}
            </FormItem>
            <FormItem>
              <Button
                type='primary'
                htmlType='submit'
              >
                查询
              </Button>
            </FormItem>
          </Form></div> : ''
        } */}
        <div className='title'>
          <h3>订单号:{this.state.orderCode}</h3>
          <Row>
            <Col span={8}>订单标题:{this.state.orderTitle}</Col>
            <Col span={8}>商户定价:{this.state.merchantPrice}</Col>
            <Col span={8}>文章领域:{this.state.essayType}</Col>
          </Row>
          <Row>
            <Col span={8}>文章数量:{this.state.essayTotal}</Col>
            <Col span={8}>原创度要求:{this.state.originalLevel}</Col>
            <Col span={8}>图片数量要求:{this.state.picture}</Col>
          </Row>
          <Row>
            <Col span={8}>字数要求:{this.state.wordCount}</Col>
            <Col span={8}>文章类型:{this.state.type}</Col>
            <Col span={8}>截止交稿时间:{this.state.endTime}</Col>
          </Row>
          <Row>
            <Col span={8}>订单要求:{this.state.require}</Col>
          </Row>
        </div>
        {
          this.state.userType === 4 ? '' : <div className='content'>
            <Button type='primary' disabled={!hasSelected} onClick={this.getOrderDownLoad} sytle={{marginBottom: '20px'}}>批量下载</Button>
            <Table columns={this.state.columns} dataSource={this.state.orderEssayRecords} pagination={false} rowSelection={rowSelection} />
          </div>
        }
        <Modal title={null}
          visible={this.state.vertifyVisable}
          onCancel={this.handleVertifyCancel}
          footer={null}
          destroyOnClose
        >
          <VertifyResult verifyStatus={this.state.verifyStatus} orderEssayId={this.state.orderEssayId} onCancel={this.handleVertifyCancel} userId={this.state.userId} getUserInfo={this.getUserInfo} />
        </Modal>
        <Modal title={null}
          visible={this.state.picVisable}
          onCancel={this.handlePicCancel}
          footer={null}
          width={800}
          height={460}
          destroyOnClose
          bodyStyle={{ 'background': '#1f2630', color: 'red' }}
        >
          <SeePic orderEssayId={this.state.orderEssayId} onCancel={this.handlePicCancel} />
        </Modal>
      </div>
    )
  }
}
const detailOrder = Form.create()(detailOrderForm)
detailOrderForm.propTypes = {
  form: PropTypes.object
}
export default detailOrder
