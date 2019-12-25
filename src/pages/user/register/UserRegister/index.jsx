import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Input, Tooltip, Icon, Select, Button } from 'antd';

const { Option } = Select;

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState(state => ({ confirmDirty: state.confirmDirty || !!value }));
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;

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
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>,
    );

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label={formatMessage({ id: 'user-login.email.placeholder' })}>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'user-login.login.password' })} hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'user-login.password.required' }),
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'user-login.confirm-password.placeholder' })}
          hasFeedback
        >
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'user-login.confirm-password.required' }),
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              {formatMessage({ id: 'app.settings.basic.nickname' })}&nbsp;
              <Tooltip title="What do you want others to call you?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('nickname', {
            rules: [
              {
                required: true,
                message: 'Please input your nickname!',
                whitespace: true,
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'app.settings.basic.phone' })}>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            {formatMessage({ id: 'menu.register' })}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

export default () => (
  <div id="components-form-demo-register">
    <WrappedRegistrationForm />
  </div>
);
