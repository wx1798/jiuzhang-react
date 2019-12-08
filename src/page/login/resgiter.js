import React from 'react'
import { render } from 'react-dom'
import axios from "axios";

import { Form, Input, Tooltip, Icon, Modal, Checkbox, Button} from 'antd';
import {Link} from "react-router";
const FormItem = Form.Item;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
      visible: false,
      data:null,
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        axios.post('http://127.0.0.1:8000/api/v1/register/',
            {'username': values.nickname, 'password': values.password, 'email': values.email, 'checkCode': values.checkCode},
            'http://127.0.0.1:8000/api/v1/login/',{Headers: {"Access-Control-Allow-Headers":"Content-Type"}}).then(response => {
            const result = response.data
            if (result.code === 1000){
                this.props.router.push("/login");
            }
        });

      }
    });
  };
  sendCode = (e) => {
      e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            axios.post('http://127.0.0.1:8000/api/v1/send/', {'username': values.nickname, 'email': values.email}, 'http://127.0.0.1:8000/api/v1/login/',{Headers: {"Access-Control-Allow-Headers":"Content-Type"}}).then(response => {
                const result = response.data;
                if (result.code === 1000){
                    this.setState({
                      visible: true,
                        data:result.data
                    });
                }else{
                    this.setState({
                      visible: true,
                        data:result.data
                    });
                }
            });

          }
        });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const getBtn = getFieldDecorator('prefix', {
    })(
      <button style={{ width: 100 }}  onClick={this.sendCode}>
        获取验证码
      </button>
    );
    return (
        <div style={{paddingRight:'20%', marginTop:'150px'}}>
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                {...formItemLayout}
                label={(
                    <span>
                    用户名&nbsp;
                    <Tooltip title="What do you want others to call you?">
                        <Icon type="question-circle-o" />
                    </Tooltip>
                    </span>
                )}
                >
                {getFieldDecorator('nickname', {
                    rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
                })(
                    <Input />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="密码"
                >
                {getFieldDecorator('password', {
                    rules: [{
                    required: true, message: 'Please input your password!',
                    }, {
                    validator: this.validateToNextPassword,
                    }],
                })(
                    <Input type="password" />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="确认密码"
                >
                {getFieldDecorator('confirm', {
                    rules: [{
                    required: true, message: 'Please confirm your password!',
                    }, {
                    validator: this.compareToFirstPassword,
                    }],
                })(
                    <Input type="password" onBlur={this.handleConfirmBlur} />
                )}
                </FormItem>
               <FormItem
                {...formItemLayout}
                label="邮箱"
                >
                {getFieldDecorator('email', {
                    rules: [{
                    type: 'email', message: '邮箱不正确!',
                    }, {
                    required: true, message: '请输入正确邮箱号!',
                    }],
                })(
                    <Input />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="验证码"
                >
                    {getFieldDecorator('checkCode', {
                    rules: [{
                    type: 'checkCode', message: '请输入验证码!',
                    }, {
                    required: true, message: '请输入正确的验证码!',
                    }],
                })(
                    <Input  addonAfter={getBtn} style={{ width: '100%' }}/>

                )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                {getFieldDecorator('agreement', {
                    valuePropName: 'checked',
                })(
                    <Checkbox>记住密码<Link to="/login">去登录</Link></Checkbox>
                )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>

                <Button type="primary" htmlType="submit">注册</Button>
                </FormItem>
            </Form>
              <Modal
              title="重要提示"
              visible={this.state.visible}
            >
              <p>{this.state.data}</p>
            </Modal>
        </div>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default WrappedRegistrationForm;