import {
  Badge,
  Button,
  Card,
  Statistic,
  Descriptions,
  Dropdown,
  Icon,
  Menu,
  Popover,
  Steps,
  Table,
  Tooltip,
  Empty,
} from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { statusEnum } from '@/constants/basic';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import styles from './style.less';
import TimelineAlternate from './TimelineAlternate';

const { Step } = Steps;
const ButtonGroup = Button.Group;
const routes = [
  {
    path: '',
    breadcrumbName: '首页',
  },
  {
    path: '../remote-sensing',
    breadcrumbName: '监测列表',
  },
  {
    breadcrumbName: '监测详情',
  },
];

function itemRender(route, params, routeList, paths) {
  const last = routeList.indexOf(route) === routeList.length - 1;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
  );
}

const mobileMenu = (
  <Menu>
    <Menu.Item key="1">操作一</Menu.Item>
    <Menu.Item key="2">操作二</Menu.Item>
    <Menu.Item key="3">选项一</Menu.Item>
    <Menu.Item key="4">选项二</Menu.Item>
    <Menu.Item key="">选项三</Menu.Item>
  </Menu>
);
const action = (
  <RouteContext.Consumer>
    {({ isMobile }) => {
      if (isMobile) {
        return (
          <Dropdown.Button
            type="primary"
            icon={<Icon type="down" />}
            overlay={mobileMenu}
            placement="bottomRight"
          >
            主操作
          </Dropdown.Button>
        );
      }

      return (
        <Fragment>
          <ButtonGroup>
            <Button onClick={() => router.push('/remote-sensing/details/arcgis-show')}>
              进入地图
            </Button>
            <Button>分发</Button>
            <Button>归档</Button>
          </ButtonGroup>
          <Button type="primary">填写反馈报告</Button>
        </Fragment>
      );
    }}
  </RouteContext.Consumer>
);
const extra = item => (
  <div className={styles.moreInfo}>
    <Statistic title="状态" value={statusEnum[item?.status]?.text} />
    <Statistic title="批次" value={item?.properties?.BATCH} />
  </div>
);
const description = item => (
  <RouteContext.Consumer>
    {({ isMobile }) => (
      <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
        <Descriptions.Item label="前时相">{item?.properties?.QSX}</Descriptions.Item>
        <Descriptions.Item label="前时相地类名称">{item?.properties?.QSXDLMC}</Descriptions.Item>
        <Descriptions.Item label="后时相">{item?.properties?.HSX}</Descriptions.Item>
        <Descriptions.Item label="后时相地类名称">{item?.properties?.HSXDLMC}</Descriptions.Item>
        <Descriptions.Item label="变化类型">{item?.properties?.BHLX}</Descriptions.Item>
        <Descriptions.Item label="前时相变化地类">{item?.properties?.QSXBHDL}</Descriptions.Item>
        <Descriptions.Item label="区县">{item?.properties?.COUNTY}</Descriptions.Item>
        <Descriptions.Item label="后时相变化地类">{item?.properties?.HSXBHDL}</Descriptions.Item>
        <Descriptions.Item label="位置">{item?.properties?.LOCATION}</Descriptions.Item>
        <Descriptions.Item label="面积（亩）">{item?.properties?.AREA}</Descriptions.Item>
      </Descriptions>
    )}
  </RouteContext.Consumer>
);
const desc1 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    <Fragment>
      曲丽丽
      <Icon
        type="dingding-o"
        style={{
          marginLeft: 8,
        }}
      />
    </Fragment>
    <div>2016-12-12 12:32</div>
  </div>
);
const desc2 = (
  <div className={styles.stepDescription}>
    <Fragment>
      周毛毛
      <Icon
        type="dingding-o"
        style={{
          color: '#00A0E9',
          marginLeft: 8,
        }}
      />
    </Fragment>
    <div>
      <a href="">催一下</a>
    </div>
  </div>
);
const popoverContent = (
  <div
    style={{
      width: 160,
    }}
  >
    吴加号
    <span
      className={styles.textSecondary}
      style={{
        float: 'right',
      }}
    >
      <Badge
        status="default"
        text={
          <span
            style={{
              color: 'rgba(0, 0, 0, 0.45)',
            }}
          >
            未响应
          </span>
        }
      />
    </span>
    <div
      className={styles.textSecondary}
      style={{
        marginTop: 4,
      }}
    >
      耗时：2小时25分钟
    </div>
  </div>
);

const customDot = (dot, { status }) => {
  if (status === 'process') {
    return (
      <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
        {dot}
      </Popover>
    );
  }

  return dot;
};
const columns = [
  {
    title: '操作类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '操作人',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '执行结果',
    dataIndex: 'status',
    key: 'status',
    render: text => {
      if (text === 'agree') {
        return <Badge status="success" text="成功" />;
      }

      return <Badge status="error" text="驳回" />;
    },
  },
  {
    title: '操作时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: '备注',
    dataIndex: 'memo',
    key: 'memo',
  },
];

class Details extends Component {
  state = {};

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'remoteSensingDetails/findRemoteSensingDetail',
      payload: match?.params,
    });
    console.log('Details  this.props :', match.params);
  }

  render() {
    // const { operationKey, tabActiveKey } = this.state;
    // const { remoteSensingDetails, loading } = this.props;
    const { remoteSensingDetail } = this.props.remoteSensingDetails;
    console.log('remoteSensingDetail :', remoteSensingDetail);
    const { properties } = remoteSensingDetail || {};

    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        breadcrumb={{
          routes,
          itemRender,
        }}
        title={`单号：${properties?.TBBM}`}
        extra={action}
        className={styles.pageHeader}
        content={description(remoteSensingDetail)}
        extraContent={extra(remoteSensingDetail)}
      >
        <div className={styles.main}>
          <GridContent>
            <Card bordered={false} title="流程进度" style={{ marginBottom: 24 }}>
              <RouteContext.Consumer>
                {({ isMobile }) => (
                  <Steps
                    direction={isMobile ? 'vertical' : 'horizontal'}
                    progressDot={customDot}
                    current={1}
                  >
                    <Step title="接收任务" description={desc1} />
                    <Step title="任务下发" description={desc2} />
                    <Step title="执行" />
                    <Step title="关闭" />
                  </Steps>
                )}
              </RouteContext.Consumer>
            </Card>
            <Card bordered={false}>
              <TimelineAlternate />
            </Card>
            <Card title="用户信息" style={{ marginBottom: 24 }} bordered={false}>
              <Descriptions style={{ marginBottom: 24 }}>
                <Descriptions.Item label="用户姓名">付小小</Descriptions.Item>
                <Descriptions.Item label="会员卡号">32943898021309809423</Descriptions.Item>
                <Descriptions.Item label="身份证">3321944288191034921</Descriptions.Item>
                <Descriptions.Item label="联系方式">18112345678</Descriptions.Item>
                <Descriptions.Item label="联系地址">
                  曲丽丽 18100000000 浙江省杭州市西湖区黄姑山路工专路交叉路口
                </Descriptions.Item>
              </Descriptions>
              <Descriptions style={{ marginBottom: 24 }} title="信息组">
                <Descriptions.Item label="某某数据">725</Descriptions.Item>
                <Descriptions.Item label="该数据更新时间">2017-08-08</Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      某某数据
                      <Tooltip title="数据说明">
                        <Icon
                          style={{
                            color: 'rgba(0, 0, 0, 0.43)',
                            marginLeft: 4,
                          }}
                          type="info-circle-o"
                        />
                      </Tooltip>
                    </span>
                  }
                >
                  725
                </Descriptions.Item>
                <Descriptions.Item label="该数据更新时间">2017-08-08</Descriptions.Item>
              </Descriptions>
            </Card>
            <Card title="反馈报告" style={{ marginBottom: 24 }} bordered={false}>
              <Empty />
            </Card>
            <Card className={styles.tabsCard} bordered={false}>
              <Table
                pagination={false}
                // loading={loading}
                // dataSource={advancedOperation1}
                columns={columns}
              />
            </Card>
          </GridContent>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ remoteSensingDetails }) => ({
  remoteSensingDetails,
}))(Details);
