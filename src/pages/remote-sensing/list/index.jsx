import {
  Badge,
  Card,
  Table,
  Tabs,
  Button,
  Divider,
  Dropdown,
  // Form,
  Input,
  Icon,
  Menu,
  // message,
  Radio,
  Modal,
  Row,
  Col,
} from 'antd';

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getTimeDistance } from '@/utils/utils';
// import ProTable from '@ant-design/pro-table';
import router from 'umi/router';
import RangeDataSelectDistance from '@/components/RangeDataSelectDistance';
// import { FormattedMessage } from 'umi-plugin-react/locale';
// import CreateForm from './components/CreateForm';
// import UpdateForm from './components/UpdateForm';
import FeedbackList from './components/FeedbackList';
import EmployeeSelect from './components/EmployeeSelect';

// import { queryRemoteData } from './service';
// import { queryRemoteData, updateRule, addRule, removeRule } from './service';

const { TabPane } = Tabs;
const { Group: RadioGroup } = Radio;
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};
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

const TabsEnum = [
  { tab: '全部', index: 0 },
  { tab: '未开始', index: 1 },
  { tab: '正在进行', index: 2 },
  { tab: '已结束', index: 3 },
];

const valueEnum = {
  0: {
    text: '关闭',
    status: 'default',
  },
  1: {
    text: '运行中',
    status: 'processing',
  },
  2: {
    text: '已上线',
    status: 'success',
  },
  3: {
    text: '异常',
    status: 'error',
  },
};
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

const TableList = props => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [radioValue, setRadioValue] = useState(1);
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
  }, []);

  const columns = [
    {
      title: '批次号',
      dataIndex: 'properties.BATCH',
    },
    {
      title: '县区',
      dataIndex: 'properties.COUNTY',
    },
    {
      title: '位置',
      dataIndex: 'properties.LOCATION',
    },
    {
      title: '变动前',
      dataIndex: 'properties.QSXDLMC',
    },
    {
      title: '变动后',
      dataIndex: 'properties.HSXDLMC',
    },
    {
      title: '占地面积',
      dataIndex: 'properties.SHAPE_AREA',
      render: val => `${val.toFixed(1)}平方米`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: record => {
        const { text, status } = valueEnum[record];
        return <Badge text={text} status={status} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'right',
      render: () => (
        <>
          <a onClick={() => router.push('/remote-sensing/details')}>查看详情</a>
          <Divider type="vertical" />
          <a onClick={() => router.push('/remote-sensing/details/arcgis-show')}>地图查看</a>
          {/* <Divider type="vertical" />
          <a onClick={() => router.push('/feedback/create')}>填写报告</a> */}
        </>
      ),
    },
  ];

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

  console.log('data :', data);

  return (
    <PageHeaderWrapper title={false}>
      <Card bordered={false} style={{ marginBottom: '24px' }}>
        <Row>
          <Col span={6}>
            {/* <Input
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
            /> */}
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
            <Button type="primary" icon="plus" onClick={() => setVisible(true)}>
              审批
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
          rowKey="key"
          rowSelection={rowSelection}
          expandedRowRender={record => <FeedbackList record={record} />}
          pagination={{
            current: searchParams.current,
            defaultPageSize,
            total: totalCount,
          }}
          columns={columns}
          dataSource={data}
          onChange={handleTableChange}
        />
      </Card>
      <Modal
        title="审批"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <RadioGroup onChange={e => setRadioValue(e.target.value)} value={radioValue}>
          {[
            { name: '第一大队', index: 0 },
            { name: '第二大队', index: 1 },
            { name: '第三大队', index: 2 },
            { name: '自定义', index: 3 },
          ].map(({ name, index }) => (
            <Radio style={radioStyle} value={index} key={index}>
              {name}
            </Radio>
          ))}
        </RadioGroup>

        {radioValue === 3 ? <EmployeeSelect /> : null}

        {/* <EmployeeSelect /> */}
      </Modal>
    </PageHeaderWrapper>
  );
};

export default connect(({ remoteSensing }) => {
  const { totalCount, data } =
    remoteSensing && remoteSensing.remoteData ? remoteSensing.remoteData : {};
  return {
    totalCount,
    data,
  };
})(TableList);
// })(Form.create()(TableList));

// const [createModalVisible, handleModalVisible] = useState(false);
// const [updateModalVisible, handleUpdateModalVisible] = useState(false);
// const [stepFormValues, setStepFormValues] = useState({});
// const [actionRef, setActionRef] = useState();

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
