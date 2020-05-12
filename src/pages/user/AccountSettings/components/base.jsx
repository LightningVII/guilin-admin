import { Button, Input, Form } from 'antd';
import React from 'react';
import { connect } from 'dva';

const BaseView = ({ currentUser, dispatch }) => {
  const [form] = Form.useForm();

  const onFinish = values => {
    dispatch({
      type: 'user/fetchUserSave',
      payload: { userid: currentUser.userid, ...values },
    });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      style={{ width: '50%', marginTop: '50px' }}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      name="basic"
      initialValues={currentUser}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item label="账号" name="usercode">
        <Input />
      </Form.Item>
      <Form.Item label="职工姓名" name="username">
        <Input />
      </Form.Item>
      <Form.Item label="联系方式" name="phone">
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

/* class BaseView extends Component {
  view = undefined;

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;

    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  getViewDom = ref => {
    this.view = ref;
  };

  handlerSubmit = event => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields(err => {
      if (!err) {
        message.success(
          formatMessage({
            id: 'userandaccountsettings.basic.update.success',
          }),
        );
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const [form] = Form.useForm();
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <Form layout="vertical" hideRequiredMark>
          <Form.Item label="账户名称" name="usercode">
            <Input />
          </Form.Item>
          <FormItem
            label={formatMessage({
              id: 'userandaccountsettings.basic.nickname',
            })}
          >
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: formatMessage(
                    {
                      id: 'userandaccountsettings.basic.nickname-message',
                    },
                    {},
                  ),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            label={formatMessage({
              id: 'userandaccountsettings.basic.phone',
            })}
          >
            {getFieldDecorator('phone')(<Input />)}
          </FormItem>
          <Button type="primary" onClick={this.handlerSubmit}>
            <FormattedMessage
              id="userandaccountsettings.basic.update"
              defaultMessage="Update Information"
            />
          </Button>
        </Form>
      </div>
    );
  }
} */

export default connect(({ user }) => ({
  currentUser: user?.currentUser,
}))(BaseView);
