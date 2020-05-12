import React, { useState } from 'react';
import { Steps, Button, Input, Alert, message } from 'antd';
import { connect } from 'dva';

const { Step } = Steps;

const ChangePassword = ({ currentUser, dispatch }) => {
  const [current, setCurrent] = useState(0);
  const [oriPassword, setOriPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [newAgainPassword, setNewAgainPassword] = useState(null);

  const goToLogin = () => {
    localStorage.removeItem('token');
    dispatch({
      type: 'login/logout',
    });
  };

  const nextActions = [
    () =>
      dispatch({
        type: 'login/checkLogin',
        payload: oriPassword,
      }).then(res => {
        if (res.content) setCurrent(current + 1);
        else message.error('原密码不正确, 请重新填写');
      }),
    () => {
      if (newPassword) setCurrent(current + 1);
      else message.error('请输入新密码');
    },
    () => {
      if (newPassword === newAgainPassword)
        dispatch({
          type: 'login/updatePassword',
          payload: {
            userid: currentUser.userid,
            newpassword: newPassword,
          },
        }).then(res => {
          if (res.code === 200) {
            setCurrent(current + 1);
            setTimeout(() => goToLogin(), 3000);
          } else message.error(res.message || '密码修改失败');
        });
      else message.error('两次输入的密码不一致, 请重新输入');
    },
  ];
  const next = () => {
    nextActions[current]();
  };

  const steps = [
    {
      title: '请输入原密码',
      content: (
        <Input.Password
          style={{ margin: '50px 0', width: '200px' }}
          onChange={e => setOriPassword(e.currentTarget.value)}
          placeholder="请输入原密码"
          value={oriPassword}
        />
      ),
    },
    {
      title: '请输入新密码',
      content: (
        <Input.Password
          style={{ margin: '50px 0', width: '200px' }}
          onChange={e => setNewPassword(e.currentTarget.value)}
          placeholder="请输入新密码"
          value={newPassword}
        />
      ),
    },
    {
      title: '再次输入新密码',
      content: (
        <Input.Password
          style={{ margin: '50px 0', width: '200px' }}
          onChange={e => setNewAgainPassword(e.currentTarget.value)}
          placeholder="再次输入新密码"
          value={newAgainPassword}
        />
      ),
    },
    {
      title: '修改成功',
      content: (
        <Alert
          style={{ margin: '50px 0' }}
          message="修改成功"
          description="您已成功修改密码，正在前往重新登陆"
          type="success"
          showIcon
        />
      ),
    },
  ];

  return (
    <div>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current !== 3 ? (
          <Button type="primary" onClick={() => next()}>
            下一步
          </Button>
        ) : (
          <Button type="primary" onClick={goToLogin}>
            前往登陆
          </Button>
        )}
      </div>
    </div>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(ChangePassword);
