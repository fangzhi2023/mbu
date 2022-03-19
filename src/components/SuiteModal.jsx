import { Component, createRef } from "react"
import { Modal, Form, Input, Select } from 'antd'
import { createSuiteInfo, updateSuiteInfo } from "../services/suite"
import { editors } from "../editors/index"

export default class SuiteModal extends Component {

  constructor(props) {
    super()

    this.formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    }

    this.form = createRef()
    this.state = {
      title: props.suite?.id ? "编辑模块" : "创建模块",
      loading: false
    }
  }

  handleOk = async () => {
    try {
      const values = await this.form.current.validateFields();
      const { parentId, nodeId, suite = {} } = this.props
      let request
      if (suite.id) {
        request = updateSuiteInfo({
          ... suite,
          ... values
        })
      } else {
        request = createSuiteInfo({
          parentId,
          nodeId,
          ...values
        })
      }
      this.setState(() => ({ loading: true }))
      const { id } = await request 
      this.setState(() => ({ loading: false }))
      this.props.onOk(id)
    } catch (err) {
      this.setState(() => ({ loading: false }))
      console.error(err)
    }
  }

  handleCancel = () => {
    this.props.onCancel()
  }

  render() {
    return (
        <Modal
          title={this.state.title}
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
          confirmLoading={this.state.loading}
          width={400}
        >
          <Form
              name="basic"
              ref={this.form}
              {...this.formItemLayout}
              >
              <Form.Item
                  label="标题"
                  name="title"
                  rules={[{ required: true, message: '请输入标题' }]}
              >
                  <Input placeholder="请输入标题" />
              </Form.Item>
              <Form.Item 
                label="类型" 
                name="type"
                rules={[{ required: true, message: '请选择类型' }]}>
                <Select disabled={this.state.suite?.id}>
                  {
                    editors.map(editor => (
                      <Select.Option value={editor.id} key={editor.id}>{editor.name}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item
                  label="描述"
                  name="description"
              >
                  <Input.TextArea rows={6} maxLength={12} placeholder="输入结点描述内容" />
              </Form.Item>
          </Form>
        </Modal>
    );
  }
}
