import { Button, Card, Statistic, Descriptions, Steps, Table, message } from 'antd';
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

const action = (handleApprovalClick, tbbm) => (
  <Fragment>
    <ButtonGroup>
      <Button onClick={() => router.push(`/remote-sensing/details/arcgis-show/${tbbm}`)}>
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
    <Statistic title="状态" value={statusEnum[item?.state]?.text} />
    <Statistic title="批次" value={item?.batch} />
  </div>
);
const description = item => (
  <RouteContext.Consumer>
    {() => (
      <Descriptions className={styles.headerList} size="small" column={2}>
        <Descriptions.Item label="前时相">{item?.qsx}</Descriptions.Item>
        <Descriptions.Item label="前时相地类名称">{item?.qsxdlmc}</Descriptions.Item>
        <Descriptions.Item label="后时相">{item?.HSX}</Descriptions.Item>
        <Descriptions.Item label="后时相地类名称">{item?.hsxdlmc}</Descriptions.Item>
        <Descriptions.Item label="变化类型">{item?.BHLX}</Descriptions.Item>
        <Descriptions.Item label="前时相变化地类">{item?.qsxbhdl}</Descriptions.Item>
        <Descriptions.Item label="区县">{item?.COUNTY}</Descriptions.Item>
        <Descriptions.Item label="后时相变化地类">{item?.hsxbhdl}</Descriptions.Item>
        <Descriptions.Item label="位置">{item?.location}</Descriptions.Item>
        <Descriptions.Item label="面积（亩）">{item?.area}</Descriptions.Item>
      </Descriptions>
    )}
  </RouteContext.Consumer>
);

let implementId;

class Details extends Component {
  state = {
    visible: false,
    approvalShow: false,
    deptid: 0,
    userIds: 0,
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
    /* dispatch({
      type: 'feedback/fetchFeedbackTBBM',
      payload: match?.params,
    }); */
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
            <Card bordered={false} style={{ marginBottom: 24 }}>
              <TimelineAlternate tbbm={match?.params?.tbbm} logsInfo={procedureInfo} />
            </Card>
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
                  r => {
                    this.setState({
                      approvalShow: true,
                      approvalContent: '',
                    });
                    implementId = r.implementid;
                  },
                )}
              />
            </Card>
            {/* <Card title="反馈人信息" style={{ marginBottom: 24 }} bordered={false}>
              <Descriptions>
                <Descriptions.Item label="姓名">{changespot?.username}</Descriptions.Item>
                <Descriptions.Item label="联系方式">{changespot?.phone}</Descriptions.Item>
                <Descriptions.Item label="联系地址">{changespot?.address}</Descriptions.Item>
              </Descriptions>
            </Card> */}
          </GridContent>
        </div>
        <DistributeModal
          visible={visible}
          handleOkClick={() => this.setState({ visible: false })}
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
                implementId,
                spjg: 1,
                spbz: approvalContent,
                spr: user.currentUser.userid,
              },
            }).then(res => {
              if (res?.code === 200) {
                dispatch({
                  type: 'remoteSensing/fetchRemoteSensingDetail',
                  payload: match?.params,
                });
                this.setState({ approvalShow: false });
              } else {
                message.warning('数据异常');
              }
            });
          }}
          handleNoClick={() => {
            dispatch({
              type: 'remoteSensing/fetchChangespotApproval',
              payload: {
                implementId,
                spjg: 2,
                spbz: approvalContent,
                spr: user.currentUser.userid,
              },
            }).then(res => {
              if (res?.code === 200) {
                dispatch({
                  type: 'remoteSensing/fetchRemoteSensingDetail',
                  payload: match?.params,
                });
                this.setState({ approvalShow: false });
              } else {
                message.warning('数据异常');
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
