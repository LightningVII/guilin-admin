import { Alert } from 'antd';
import React from 'react';
import { connect } from 'dva';
import LoginFrom from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Submit } = LoginFrom;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = props => {
  const { userLogin = {}, submitting } = props;
  const { status } = userLogin;
  // const [autoLogin, setAutoLogin] = useState(true);

  const handleSubmit = payload => {
    const { dispatch } = props;
    dispatch({ type: 'login/login', payload });
  };

  return (
    <div className={styles.main}>
      <LoginFrom activeKey="account" onSubmit={handleSubmit}>
        <Tab key="account" tab="账户密码登录">
          {status === 'error' && !submitting && (
            <LoginMessage content="账户或密码错误（admin/ant.design）" />
          )}

          <UserName
            name="username"
            placeholder="用户名: "
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码: "
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>
        <Submit loading={submitting}>登录</Submit>
      </LoginFrom>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
