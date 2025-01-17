import { IdcardOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        localStorage.removeItem('token');
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    router.push(key);
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {/* {menu && (
          <Menu.Item key="/remote-sensing">
            <ScheduleOutlined />
            <FormattedMessage id="menu.task.center" defaultMessage="account settings" />
          </Menu.Item>
        )} */}
        {menu && (
          <Menu.Item key="/account/center">
            <IdcardOutlined />
            <FormattedMessage id="menu.account.center" defaultMessage="account center" />
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          {/* <Avatar
            size="small"
            className={styles.avatar}
            src="http://47.52.250.238:1337/uploads/a0abf382c5ef4ca58226eb5b194a828c.jpg"
            alt="avatar"
          /> */}
          <UserOutlined /> <span className={styles.name}>{currentUser.username}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
