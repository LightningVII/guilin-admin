import React, { useState, useEffect } from 'react';

import {
  CopyOutlined,
  DownloadOutlined,
  DownOutlined,
  FileExcelOutlined,
  FileOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from '@ant-design/icons';

import { Card, Table, Tabs, Button, Divider, Dropdown, Input, Menu, Row, Col, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getTimeDistance } from '@/utils/utils';

import RangeDataSelectDistance from '@/components/RangeDataSelectDistance';
import { remoteSensingListColumns } from '@/constants/columns';
import { TabsEnum } from '@/constants/basicEnum';
import DistributeModal from '../components/DistributeModal';
// import FeedbackList from '../components/FeedbackList';
// import ImagesPreview from '../components/ImagesPreview';
import ApprovalModal from '../components/ApprovalModal';

const { TabPane } = Tabs;
const initRangPickerValue = getTimeDistance('year');
const defaultPageSize = 10;
// let inputValue = '';

const menu = (
  <Menu>
    <Menu.Item key="1">
      <PrinterOutlined />
      打印
    </Menu.Item>
    <Menu.Item key="2">
      <CopyOutlined />
      复制
    </Menu.Item>
    <Menu.Item key="3">
      <FileExcelOutlined />
      Excel格式
    </Menu.Item>
    <Menu.Item key="4">
      <FileOutlined />
      CSV格式
    </Menu.Item>
    <Menu.Item key="5">
      <FilePdfOutlined />
      PDF格式
    </Menu.Item>
  </Menu>
);
// let implementId;
const TableList = props => {
  const [spotIds, setSpotIds] = useState([]);
  // const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [approvalContent, setApprovalContent] = useState('');

  const [approvalShow, setApprovalShow] = useState(false);

  // const [imagesViewShow, setImagesViewShow] = useState(false);
  const [deptid, setDeptid] = useState(null);
  const [userIds, setUserIds] = useState();
  const [searchParams, setSearchParams] = useState({
    current: 1,
    pageSize: defaultPageSize,
    status: '全部',
    rangePickerValue: initRangPickerValue,
    keywords: '',
  });
  const { totalCount, data, user, dispatch } = props; // feedback,

  const fetchRemoteData = (params = {}) => {
    if (dispatch) {
      setLoading(true);
      const payload = {
        ...searchParams,
        ...params,
      };
      setSearchParams(payload);
      dispatch({
        type: 'remoteSensing/fetchRemoteData',
        payload,
      }).then(() => setLoading(false));
    }
  };

  // , filters, sorter
  const handleTableChange = ({ total, ...params }) => fetchRemoteData(params);

  useEffect(() => {
    fetchRemoteData({ current: 1 });
    // dispatch({ type: 'feedback/fetchFeedbackData' });
  }, []);

  const rowSelection = {
    spotIds,
    onChange: (keys, selectedRows) => {
      console.log(`keys: ${spotIds}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected) => {
      setSpotIds(
        selected ? [...spotIds, record.spotid] : spotIds.filter(spotid => spotid !== record.spotid),
      );
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      setSpotIds(
        selected
          ? [...spotIds, ...changeRows.map(i => i.spotid)]
          : spotIds.filter(spotid => !changeRows.map(i => i.spotid).includes(spotid)),
      );
    },
  };

  // content="获取到的遥感数据, 功能分发（市操作员、县操作员），
  // 查看详情（市操作员、县操作员），查看地图（市操作员、县操作员），查看反馈报告（市操作员、县操作员、具体勘查人员），归档（市操作员、县操作员），
  // reopen（市操作员、县操作员），填写反馈报告（具体勘查人员）"

  return (
    <PageHeaderWrapper title={false}>
      <Card bordered={false} style={{ marginBottom: '24px' }}>
        <Row>
          <Col span={6}>
            <Input.Search
              loading={loading}
              placeholder="查询..."
              onSearch={keywords => fetchRemoteData({ current: 1, keywords })}
              onPressEnter={({ target: { value: keywords } }) =>
                fetchRemoteData({ current: 1, keywords })
              }
            />
          </Col>
          <Col span={10} offset={8} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              disabled={
                !spotIds?.length &&
                ['XTGLY', 'ZFDDZ'].includes(user?.currentUser?.roles?.[0]?.rolecode)
              }
              onClick={() => setVisible(true)}
            >
              任务分发
            </Button>
            <Divider type="vertical" />
            <Button
              type="danger"
              disabled={
                !spotIds?.length &&
                ['XTGLY', 'ZFDDZ'].includes(user?.currentUser?.roles?.[0]?.rolecode)
              }
              onClick={() => setApprovalShow(true)}
            >
              {formatMessage({ id: 'remote-sensing.approval' })}
            </Button>
            <Divider type="vertical" />
            <Dropdown overlay={menu}>
              <Button icon={<DownloadOutlined />}>
                导出 <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
        </Row>
      </Card>

      <Card bordered={false}>
        <Tabs
          tabBarExtraContent={
            <RangeDataSelectDistance
              initRangPickerValue={initRangPickerValue}
              handleRangePickerChange={rangeValue =>
                fetchRemoteData({ current: 1, rangePickerValue: rangeValue })
              }
            />
          }
          onChange={activeKey => fetchRemoteData({ current: 1, status: TabsEnum[+activeKey].tab })}
        >
          {TabsEnum.map(tabs => (
            <TabPane tab={tabs.tab} key={tabs.index} />
          ))}
        </Tabs>
        <Table
          loading={loading}
          rowKey={({ spotid }) => spotid}
          rowSelection={rowSelection}
          pagination={{
            current: searchParams.current,
            defaultPageSize,
            total: totalCount,
          }}
          columns={remoteSensingListColumns()}
          dataSource={data}
          onChange={handleTableChange}
        />
      </Card>
      <DistributeModal
        visible={visible}
        handleOkClick={() => {
          dispatch({
            type: 'remoteSensing/fetchChangespotIssue',
            payload: {
              spotIds,
              deptId: deptid === 'customdeptid' ? null : deptid,
              userIds,
              userid: user.currentUser.userid,
            },
          }).then(res => {
            if (res?.code === 200) {
              fetchRemoteData();
              setVisible(false);
              message.success('审批成功');
            } else {
              message.warning(res?.message || '数据异常');
            }
          });
        }}
        handleCloseClick={() => setVisible(false)}
        deptid={deptid}
        setDeptid={setDeptid}
        userIds={userIds}
        setUserIds={setUserIds}
      />
      {/* <ImagesPreview
        images={selectedImages}
        visible={imagesViewShow}
        handleCloseClick={() => setImagesViewShow(false)}
      /> */}
      <ApprovalModal
        visible={approvalShow}
        handleYesClick={() => {
          dispatch({
            type: 'remoteSensing/fetchChangespotApproval',
            payload: {
              spjg: 1,
              spyj: approvalContent,
              spr: user.currentUser.userid,
              tbbm: data.filter(item => spotIds.includes(item.spotid)).map(({ tbbm }) => tbbm),
            },
          }).then(res => {
            if (res?.code === 200) {
              fetchRemoteData();
              setApprovalShow(false);
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
              tbbm: data.filter(item => spotIds.includes(item.spotid)).map(({ tbbm }) => tbbm),
            },
          }).then(res => {
            if (res?.code === 200) {
              fetchRemoteData();
              setApprovalShow(false);
              message.success('审批成功');
            } else {
              message.warning(res?.message || '数据异常');
            }
          });
        }}
        handleCloseClick={() => setApprovalShow(false)}
        handleChange={e => setApprovalContent(e.target.value)}
        content={approvalContent}
      />
    </PageHeaderWrapper>
  );
};

export default connect(({ remoteSensing, user, feedback }) => {
  const { totalCount, data } =
    remoteSensing && remoteSensing.remoteSensingData ? remoteSensing.remoteSensingData : {};
  return {
    totalCount,
    data,
    user,
    feedback,
  };
})(TableList);
