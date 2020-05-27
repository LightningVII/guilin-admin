import React, { Component } from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import { connect } from 'dva';
import BaseView from './components/base';
import ChangePassword from './components/ChangePassword';
import BindingView from './components/binding';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import DatasourceView from './components/datasource';
import StaffView from './components/StaffView';
import RoleView from './components/RoleView';
import DeptView from './components/DeptView';
import MenuView from './components/MenuView';

import styles from './style.less';

const { Item } = Menu;

class AccountSettings extends Component {
  main = undefined;

  constructor(props) {
    super(props);
    const menuMap = {
      base: <FormattedMessage id="app.settings.menuMap.basic" defaultMessage="Basic Settings" />,
      changepassword: '修改密码',
      staff: '职员管理列表',
      role: '角色管理列表',
      dept: '部门管理列表',
      // menu: '菜单管理列表',
      /* security: (
        <FormattedMessage id="app.settings.menuMap.security" defaultMessage="Security Settings" />
      ),
      binding: (
        <FormattedMessage id="app.settings.menuMap.binding" defaultMessage="Account Binding" />
      ),
      notification: (
        <FormattedMessage
          id="app.settings.menuMap.notification"
          defaultMessage="New Message Notification"
        />
      ), */ // 数据资源设置
    };

    if (props?.currentUser?.roles?.[0]?.rolecode === 'XTGLY')
      menuMap.datasource = (
        <FormattedMessage
          id="app.settings.menuMap.datasource"
          defaultMessage="New Message Datasource"
        />
      );

    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'base',
    };
  }

  componentDidMount() {
    /* const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    }); */
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = key => {
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }

    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }

      let mode = 'inline';
      const { offsetWidth } = this.main;

      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      this.setState({
        mode,
      });
    });
  };

  renderChildren = () => {
    const { selectKey } = this.state;

    switch (selectKey) {
      case 'base':
        return <BaseView />;

      case 'changepassword':
        return <ChangePassword />;

      case 'staff':
        return <StaffView />;

      case 'dept':
        return <DeptView />;

      case 'role':
        return <RoleView />;

      case 'menu':
        return <MenuView />;

      case 'security':
        return <SecurityView />;

      case 'binding':
        return <BindingView />;

      case 'notification':
        return <NotificationView />;

      case 'datasource':
        return <DatasourceView />;

      default:
        break;
    }

    return null;
  };

  render() {
    const { currentUser } = this.props;

    if (!currentUser.userid) {
      return '';
    }

    const { mode, selectKey } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={ref => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className={styles.leftMenu}>
            <Menu mode={mode} selectedKeys={[selectKey]} onClick={({ key }) => this.selectKey(key)}>
              {this.getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {this.renderChildren()}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AccountSettings);
