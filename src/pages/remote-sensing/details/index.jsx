import { Button, Card, Row, Col, Statistic, Descriptions, Steps, Table, message } from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';
import { statusEnum } from '@/constants/basicEnum';
import { feedbackListColumns } from '@/constants/columns';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';

import DistributeModal from '../components/DistributeModal';
import ApprovalModal from '../components/ApprovalModal';
import ImagesPreview from '../components/ImagesPreview';
import TimelineAlternate from './TimelineAlternate';
import styles from './style.less';

const processingAction = item => (
  <>
    <Fragment>{item?.username}</Fragment>
    <div>{moment(item?.time).format('YYYY-MM-DD')}</div>
  </>
);

const { Step } = Steps;
// const ButtonGroup = Button.Group;
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

const action = (handleApprovalClick, tbbm) => (
  <Fragment>
    {/* <ButtonGroup> */}
    <Button
      type="primary"
      onClick={() => router.push(`/remote-sensing/details/arcgis-show/${tbbm}`)}
    >
      进入地图
    </Button>
    <Button type="danger" onClick={handleApprovalClick}>
      分发
    </Button>
    {/* <Button>归档</Button> */}
    {/* </ButtonGroup> */}
    {/* <Button type="primary">填写反馈报告</Button> */}
  </Fragment>
);

const extra = item => (
  <div className={styles.moreInfo}>
    <Statistic title="状态" value={statusEnum[item?.state]?.text} />
    <Statistic title="批次" value={item?.batch} />
  </div>
);
const description = item => (
  <RouteContext.Consumer>
    {() => (
      <Descriptions key={1} className={styles.headerList} size="small" column={2}>
        <Descriptions.Item key={1} label="前时相">
          {item?.qsx}
        </Descriptions.Item>
        <Descriptions.Item key={2} label="前时相地类名称">
          {item?.qsxdlmc}
        </Descriptions.Item>
        <Descriptions.Item key={3} label="后时相">
          {item?.hsx}
        </Descriptions.Item>
        <Descriptions.Item key={4} label="后时相地类名称">
          {item?.hsxdlmc}
        </Descriptions.Item>
        <Descriptions.Item key={5} label="变化类型">
          {item?.bhlx}
        </Descriptions.Item>
        <Descriptions.Item key={6} label="前时相变化地类">
          {item?.qsxbhdl}
        </Descriptions.Item>
        <Descriptions.Item key={7} label="区县">
          {item?.county}
        </Descriptions.Item>
        <Descriptions.Item key={8} label="后时相变化地类">
          {item?.hsxbhdl}
        </Descriptions.Item>
        <Descriptions.Item key={9} label="位置">
          {item?.location}
        </Descriptions.Item>
        <Descriptions.Item key={10} label="面积（亩）">
          {item?.area}
        </Descriptions.Item>
      </Descriptions>
    )}
  </RouteContext.Consumer>
);

// let implementId;

class Details extends Component {
  state = {
    visible: false,
    approvalShow: false,
    deptid: undefined,
    userIds: undefined,
    selectedImages: [],
    imagesViewShow: false,
    approvalContent: '',
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'remoteSensing/fetchRemoteSensingDetail',
      payload: match?.params,
    });
  }

  render() {
    const {
      approvalContent,
      approvalShow,
      userIds,
      visible,
      deptid,
      selectedImages,
      imagesViewShow,
    } = this.state;
    const { remoteSensing, match, dispatch, user } = this.props;
    const { changespot, procedureInfo, procedureList = [], spotImplements } = remoteSensing;
    const setSelectedImages = images => this.setState({ selectedImages: images });
    const setImagesViewShow = show => this.setState({ imagesViewShow: show });
    // const feedbackList = feedback?.feedbackTBBM?.filter(r => r.tbbm === match?.params?.tbbm);

    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        breadcrumb={{
          routes,
          itemRender,
        }}
        title={`单号：${changespot?.tbbm}`}
        extra={action(() => this.setState({ visible: true }), match?.params?.tbbm)}
        className={styles.pageHeader}
        content={description(changespot)}
        extraContent={extra(changespot)}
      >
        <div className={styles.main}>
          <GridContent>
            <Card bordered={false} title="流程进度" style={{ marginBottom: 24 }}>
              <RouteContext.Consumer>
                {({ isMobile }) => (
                  <Steps
                    direction={isMobile ? 'vertical' : 'horizontal'}
                    current={changespot?.state}
                  >
                    {procedureList.map((item, index) => (
                      <Step
                        key={item?.status}
                        title={item.text}
                        description={changespot?.state >= index ? processingAction(item) : ''}
                      />
                    ))}
                  </Steps>
                )}
              </RouteContext.Consumer>
            </Card>
            <Row gutter={16}>
              <Col span={8}>
                <Card bordered={false} style={{ marginBottom: 24 }}>
                  <TimelineAlternate tbbm={match?.params?.tbbm} logsInfo={procedureInfo} />
                </Card>
              </Col>
              <Col span={16}>
                <Card
                  bodyStyle={{ padding: 0 }}
                  title="执行报告"
                  style={{ marginBottom: 24 }}
                  bordered={false}
                >
                  <Table
                    pagination={false}
                    dataSource={spotImplements}
                    rowKey="implementid"
                    columns={feedbackListColumns(
                      images => {
                        setSelectedImages(images);
                        setImagesViewShow(true);
                      },
                      () => {
                        this.setState({
                          approvalShow: true,
                          approvalContent: '',
                        });
                        // implementId = r.implementid;
                      },
                    )}
                  />
                </Card>
              </Col>
              {/* <Card title="反馈人信息" style={{ marginBottom: 24 }} bordered={false}>
              <Descriptions>
                <Descriptions.Item label="姓名">{changespot?.username}</Descriptions.Item>
                <Descriptions.Item label="联系方式">{changespot?.phone}</Descriptions.Item>
                <Descriptions.Item label="联系地址">{changespot?.address}</Descriptions.Item>
              </Descriptions>
            </Card> */}
            </Row>
          </GridContent>
        </div>
        <DistributeModal
          visible={visible}
          handleOkClick={() => {
            dispatch({
              type: 'remoteSensing/fetchChangespotIssue',
              payload: {
                spotIds: [changespot.spotid],
                deptId: deptid === 'customdeptid' ? null : deptid,
                userIds,
                userid: user.currentUser.userid,
              },
            }).then(res => {
              if (res?.code === 200) {
                dispatch({
                  type: 'remoteSensing/fetchRemoteSensingDetail',
                  payload: match?.params,
                });
                this.setState({ visible: false });
                message.success('审批成功');
              } else {
                message.warning(res?.message || '数据异常');
              }
            });
          }}
          handleCloseClick={() => this.setState({ visible: false })}
          deptid={deptid}
          setDeptid={r => this.setState({ deptid: r })}
          userIds={userIds}
          setUserIds={r => this.setState({ userIds: r })}
        />
        <ImagesPreview
          images={selectedImages}
          visible={imagesViewShow}
          handleCloseClick={() => setImagesViewShow(false)}
        />
        <ApprovalModal
          visible={approvalShow}
          handleYesClick={() => {
            dispatch({
              type: 'remoteSensing/fetchChangespotApproval',
              payload: {
                spjg: 1,
                spyj: approvalContent,
                spr: user.currentUser.userid,
                tbbm: changespot?.tbbm,
              },
            }).then(res => {
              if (res?.code === 200) {
                dispatch({
                  type: 'remoteSensing/fetchRemoteSensingDetail',
                  payload: match?.params,
                });
                this.setState({ approvalShow: false });
                message.success('审批成功');
              } else {
                message.warning(res?.message || '数据异常');
              }
            });
          }}
          handleNoClick={() => {
            dispatch({
              type: 'remoteSensing/fetchChangespotApproval',
              payload: {
                spjg: 2,
                spyj: approvalContent,
                spr: user.currentUser.userid,
                tbbm: changespot?.tbbm,
              },
            }).then(res => {
              if (res?.code === 200) {
                dispatch({
                  type: 'remoteSensing/fetchRemoteSensingDetail',
                  payload: match?.params,
                });
                this.setState({ approvalShow: false });
                message.success('审批成功');
              } else {
                message.warning(res?.message || '数据异常');
              }
            });
            console.log('不通过 ---------------:');
            // setApprovalShow(false);
          }}
          handleCloseClick={() => this.setState({ approvalShow: false })}
          handleChange={e => this.setState({ approvalContent: e.target.value })}
          content={approvalContent}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ remoteSensing, feedback, user }) => ({
  remoteSensing,
  feedback,
  user,
}))(Details);
