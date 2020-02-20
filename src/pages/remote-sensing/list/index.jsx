import React, { useState, useEffect } from 'react';
import { Card, Table, Tabs, Button, Divider, Dropdown, Input, Icon, Menu, Row, Col } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getTimeDistance } from '@/utils/utils';

import RangeDataSelectDistance from '@/components/RangeDataSelectDistance';
import { remoteSensingListColumns } from '@/constants/columns';
import { TabsEnum } from '@/constants/basicEnum';
import FeedbackList from '../components/FeedbackList';
import ApprovalModal from '../components/ApprovalModal';
import ImagesPreview from '../components/ImagesPreview';

const { TabPane } = Tabs;
const initRangPickerValue = getTimeDistance('year');
const defaultPageSize = 10;
// let inputValue = '';

const menu = (
  <Menu>
    <Menu.Item key="1">
      <Icon type="printer" />
      打印
    </Menu.Item>
    <Menu.Item key="2">
      <Icon type="copy" />
      复制
    </Menu.Item>
    <Menu.Item key="3">
      <Icon type="file-excel" />
      Excel格式
    </Menu.Item>
    <Menu.Item key="4">
      <Icon type="file" />
      CSV格式
    </Menu.Item>
    <Menu.Item key="5">
      <Icon type="file-pdf" />
      PDF格式
    </Menu.Item>
  </Menu>
);
const TableList = props => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imagesViewShow, setImagesViewShow] = useState(false);
  const [radioValue, setRadioValue] = useState(0);
  const [searchParams, setSearchParams] = useState({
    current: 1,
    pageSize: defaultPageSize,
    status: '全部',
    rangePickerValue: initRangPickerValue,
    keywords: '',
  });
  const { totalCount, data, dispatch } = props;

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
    dispatch({ type: 'feedback/fetchFeedbackData' });
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, selectedRows) => {
      console.log(`keys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected) => {
      setSelectedRowKeys(
        selected
          ? [...selectedRowKeys, record.key]
          : selectedRowKeys.filter(key => key !== record.key),
      );
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      setSelectedRowKeys(
        selected
          ? [...selectedRowKeys, ...changeRows.map(i => i.key)]
          : selectedRowKeys.filter(key => !changeRows.map(i => i.key).includes(key)),
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
          <Col
            span={10}
            offset={8}
            style={{
              textAlign: 'right',
            }}
          >
            <Button type="primary" onClick={() => setVisible(true)}>
              {formatMessage({ id: 'remote-sensing.approval' })}
            </Button>
            <Divider type="vertical" />
            <Dropdown overlay={menu}>
              <Button icon="download">
                导出 <Icon type="down" />
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
              handleRangePickerChange={rangeValue => fetchRemoteData({ current: 1, rangeValue })}
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
          rowKey={({ properties }) => properties.TBBM}
          rowSelection={rowSelection}
          expandedRowRender={record => (
            <FeedbackList
              handleImagesClick={images => {
                setSelectedImages(images);
                setImagesViewShow(true);
              }}
              record={record}
            />
          )}
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
      <ApprovalModal
        visible={visible}
        setVisible={setVisible}
        radioValue={radioValue}
        setRadioValue={setRadioValue}
      />
      <ImagesPreview
        images={selectedImages}
        visible={imagesViewShow}
        handleCloseClick={() => setImagesViewShow(false)}
      />
    </PageHeaderWrapper>
  );
};

export default connect(({ remoteSensing }) => {
  const { totalCount, data } =
    remoteSensing && remoteSensing.remoteSensingData ? remoteSensing.remoteSensingData : {};
  return {
    totalCount,
    data,
  };
})(TableList);
// })(Form.create()(TableList));

// import ProTable from '@ant-design/pro-table';
// import { FormattedMessage } from 'umi-plugin-react/locale';
// import CreateForm from './components/CreateForm';
// import UpdateForm from './components/UpdateForm';
// import { queryRemoteData } from './service';
// import { queryRemoteData, updateRule, addRule, removeRule } from './service';

// const [createModalVisible, handleModalVisible] = useState(false);
// const [updateModalVisible, handleUpdateModalVisible] = useState(false);
// const [stepFormValues, setStepFormValues] = useState({});
// const [actionRef, setActionRef] = useState();

/**
 * 添加节点
 * @param fields
 */
// const handleAdd = async fields => {
//   const hide = message.loading('正在添加');

//   try {
//     await addRule({
//       desc: fields.desc,
//     });
//     hide();
//     message.success('添加成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('添加失败请重试！');
//     return false;
//   }
// };
/**
 * 更新节点
 * @param fields
 */

// const handleUpdate = async fields => {
//   const hide = message.loading('正在配置');

//   try {
//     await updateRule({
//       name: fields.name,
//       desc: fields.desc,
//       key: fields.key,
//     });
//     hide();
//     message.success('配置成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('配置失败请重试！');
//     return false;
//   }
// };

/**
 *  删除节点
 * @param selectedRows
 */

// const handleRemove = async selectedRows => {
//   const hide = message.loading('正在删除');
//   if (!selectedRows) return true;

//   try {
//     await removeRule({
//       key: selectedRows.map(row => row.key),
//     });
//     hide();
//     message.success('删除成功，即将刷新');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('删除失败，请重试');
//     return false;
//   }
// };

/* <Input
  loading={loading}
  placeholder="查询..."
  prefix={
    <Icon
      onClick={() => fetchRemoteData({ current: 1, keywords: inputValue })}
      type="search"
      style={{ color: 'rgba(0,0,0,.25)' }}
    />
  }
  suffix={<Icon type="ellipsis" style={{ color: 'rgba(0,0,0,.45)' }} />}
  onChange={({ target: { value: inputVal } }) => {
    inputValue = inputVal;
  }}
  onPressEnter={({ target: { value: keywords } }) =>
    fetchRemoteData({ current: 1, keywords })
  }
/> */

/* <ProTable
  style={{ marginTop: '24px' }}
  headerTitle={<FormattedMessage id="menu.list.table-list" defaultMessage="Sales Ranking" />}
  onInit={setActionRef}
  rowKey="key"
  rowSelection={rowSelection}
  expandedRowRender={record => <FeedbackList record={record} />}
  toolBarRender={(action, { selectedRows }) => [
    <Button icon="plus" type="primary" onClick={() => handleModalVisible(true)}>
      新增
    </Button>,
    selectedRows && selectedRows.length > 0 && (
      <Dropdown
        overlay={
          <Menu
            onClick={async e => {
              if (e.key === 'remove') {
                await handleRemove(selectedRows);
                action.reload();
              }
            }}
            selectedKeys={[]}
          >
            <Menu.Item key="approval">批量归档</Menu.Item>
            <Menu.Item key="remove">批量分发</Menu.Item>
          </Menu>
        }
      >
        <Button>
          批量操作 <Icon type="down" />
        </Button>
      </Dropdown>
    ),
  ]}
  tableAlertRender={(keys, selectedRows) => (
    <div>
      已选择{' '}
      <a
        style={{
          fontWeight: 600,
        }}
      >
        {keys.length}
      </a>{' '}
      项&nbsp;&nbsp;
      <span>
        服务调用次数总计 {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} 万
      </span>
    </div>
  )}
  request={params => queryRemoteData(params)}
  columns={columns}
/> */

/* <CreateForm
  onSubmit={async value => {
    const success = await handleAdd(value);

    if (success) {
      handleModalVisible(false);
      actionRef.reload();
    }
  }}
  onCancel={() => handleModalVisible(false)}
  modalVisible={createModalVisible}
/>
{stepFormValues && Object.keys(stepFormValues).length ? (
  <UpdateForm
    onSubmit={async value => {
      const success = await handleUpdate(value);

      if (success) {
        handleModalVisible(false);
        setStepFormValues({});
        actionRef.reload();
      }
    }}
    onCancel={() => {
      handleUpdateModalVisible(false);
      setStepFormValues({});
    }}
    updateModalVisible={updateModalVisible}
    values={stepFormValues}
  />
) : null} */
