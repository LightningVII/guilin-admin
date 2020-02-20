import { Button, Card, Statistic, Descriptions, Steps, Table } from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';
import { statusEnum, implementationEnum } from '@/constants/basicEnum';
import { feedbackListColumns } from '@/constants/columns';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';

import ApprovalModal from '../components/ApprovalModal';
import TimelineAlternate from './TimelineAlternate';
import styles from './style.less';

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

const action = (handleApprovalClick, TBBM) => (
  <Fragment>
    <ButtonGroup>
      <Button onClick={() => router.push(`/remote-sensing/details/arcgis-show/${TBBM}`)}>
        进入地图
      </Button>
      <Button onClick={handleApprovalClick}>分发</Button>
      <Button>归档</Button>
    </ButtonGroup>
    <Button type="primary">填写反馈报告</Button>
  </Fragment>
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

class Details extends Component {
  state = {
    visible: false,
    radioValue: 0,
  };

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
    const { visible, radioValue } = this.state;
    const { remoteSensingDetails, match, feedback } = this.props;
    const { remoteSensingDetail } = remoteSensingDetails;
    const { properties } = remoteSensingDetail || {};
    const feedbackList = feedback?.feedbackTBBM?.filter(r => r.TBBM === match?.params?.TBBM);

    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        breadcrumb={{
          routes,
          itemRender,
        }}
        title={`单号：${properties?.TBBM}`}
        extra={action(v => this.setState({ visible: v }), match?.params?.TBBM)}
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
        <ApprovalModal
          visible={visible}
          setVisible={v => this.setState({ visible: v })}
          radioValue={radioValue}
          setRadioValue={r => this.setState({ radioValue: r })}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ remoteSensingDetails, feedback }) => ({
  remoteSensingDetails,
  feedback,
}))(Details);
