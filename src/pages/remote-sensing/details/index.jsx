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
} from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';
import { statusEnum, implementationEnum } from '@/constants/basicEnum';
import { feedbackListColumns } from '@/constants/columns';
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

class Details extends Component {
  state = {};

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'remoteSensingDetails/findRemoteSensingDetail',
      payload: match?.params,
    });
    dispatch({
      type: 'feedback/fetchFeedbackTBBM',
      payload: match?.params,
    });
    console.log('Details  this.props :', match.params);
  }

  render() {
    // const { operationKey, tabActiveKey } = this.state;
    // const { remoteSensingDetails, loading } = this.props;
    const { remoteSensingDetails, match, feedback } = this.props;
    const { remoteSensingDetail } = remoteSensingDetails;
    const { properties } = remoteSensingDetail || {};
    console.log('feedback :', feedback);
    const feedbackList = feedback?.feedbackTBBM?.filter(r => r.TBBM === match?.params?.TBBM);

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
                    current={remoteSensingDetail?.status}
                  >
                    {statusEnum.map(({ text, status }, index) => (
                      <Step
                        key={status}
                        title={text}
                        description={
                          remoteSensingDetail?.status >= index
                            ? implementationEnum[index](remoteSensingDetail)
                            : ''
                        }
                      />
                    ))}
                  </Steps>
                )}
              </RouteContext.Consumer>
            </Card>
            <Card bordered={false} style={{ marginBottom: 24 }}>
              <TimelineAlternate TBBM={match?.params?.TBBM} />
            </Card>
            <Card
              bodyStyle={{ padding: 0 }}
              title="反馈报告"
              style={{ marginBottom: 24 }}
              bordered={false}
            >
              <Table
                pagination={false}
                dataSource={feedbackList}
                rowKey="id"
                columns={feedbackListColumns()}
              />
            </Card>
            <Card title="反馈人信息" style={{ marginBottom: 24 }} bordered={false}>
              <Descriptions>
                <Descriptions.Item label="姓名">
                  {remoteSensingDetail?.executor.username}
                </Descriptions.Item>
                <Descriptions.Item label="联系方式">
                  {remoteSensingDetail?.executor.phone}
                </Descriptions.Item>
                <Descriptions.Item label="联系地址">
                  {remoteSensingDetail?.executor.address}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </GridContent>
        </div>
      </PageHeaderWrapper>
    );
  }
}
connect(({ feedback }) => ({ feedback }));
export default connect(({ remoteSensingDetails, feedback }) => ({
  remoteSensingDetails,
  feedback,
}))(Details);
