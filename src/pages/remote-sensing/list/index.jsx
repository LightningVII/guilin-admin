import {
  Badge,
  Card,
  Table,
  Tabs,
  Button,
  Divider,
  Dropdown,
  Form,
  Input,
  Icon,
  Menu,
  // message,
  Radio,
  Modal,
  DatePicker,
  Row,
  Col,
} from 'antd';

import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import ProTable from '@ant-design/pro-table';
import router from 'umi/router';
import { FormattedMessage } from 'umi-plugin-react/locale';
// import CreateForm from './components/CreateForm';
// import UpdateForm from './components/UpdateForm';
import FeedbackList from './components/FeedbackList';
import { queryRule } from './service';
// import { queryRule, updateRule, addRule, removeRule } from './service';
import styles from './style.less';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Group } = Radio;
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

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

const operations = (
  <div className={styles.salesExtraWrap}>
    <div className={styles.salesExtra}>
      <Button type="link" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
        <FormattedMessage id="dashboardanalysis.analysis.all-day" defaultMessage="All Day" />
      </Button>
      <Button type="link" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
        <FormattedMessage id="dashboardanalysis.analysis.all-week" defaultMessage="All Week" />
      </Button>
      <Button type="link" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
        <FormattedMessage id="dashboardanalysis.analysis.all-month" defaultMessage="All Month" />
      </Button>
      <Button type="link" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
        <FormattedMessage id="dashboardanalysis.analysis.all-year" defaultMessage="All Year" />
      </Button>
    </div>
    <RangePicker
      // value={rangePickerValue}
      // onChange={handleRangePickerChange}
      style={{
        width: 256,
      }}
    />
  </div>
);
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

const TableList = () => {
  // const [createModalVisible, handleModalVisible] = useState(false);
  // const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  // const [stepFormValues, setStepFormValues] = useState({});
  // const [actionRef, setActionRef] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([1042]);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(1);

  const fetch = (params = {}) => {
    setLoading(true);
    queryRule(params).then(d => {
      setPagination({
        total: d.totalCount,
      });
      setLoading(false);
      setData(d.data);
    });
  };

  const handleTableChange = (p, filters, sorter) => {
    console.log('pagination, filters, sorter :', p, filters, sorter);
    // const pager = { ...this.state.pagination };
    // pager.current = pagination.current;
    // this.setState({
    //   pagination: pager,
    // });
    // this.fetch({
    //   results: pagination.pageSize,
    //   page: pagination.current,
    //   sortField: sorter.field,
    //   sortOrder: sorter.order,
    //   ...filters,
    // });
  };

  useEffect(() => {
    fetch({ current: 1, pageSize: 10 });
  }, []);

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '服务调用次数',
      dataIndex: 'callNo',
      sorter: true,
      renderText: val => `${val} 万`,
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
      title: '上次调度时间',
      dataIndex: 'updatedAt',
      sorter: true,
      valueType: 'dateTime',
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
          <Divider type="vertical" />
          <a onClick={() => router.push('/feedback/create')}>填写报告</a>
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
      console.log(selected, selectedRows, changeRows);
    },
  };

  return (
    <PageHeaderWrapper
      content="获取到的遥感数据, 功能分发（市操作员、县操作员），
    查看详情（市操作员、县操作员），查看地图（市操作员、县操作员），查看反馈报告（市操作员、县操作员、具体勘查人员），归档（市操作员、县操作员），
    reopen（市操作员、县操作员），填写反馈报告（具体勘查人员）"
    >
      <Card bordered={false} style={{ marginBottom: '24px' }}>
        <Row>
          <Col span={6}>
            <Input
              placeholder="查询..."
              prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix={<Icon type="ellipsis" style={{ color: 'rgba(0,0,0,.45)' }} />}
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
        <Tabs tabBarExtraContent={operations}>
          <TabPane tab="未开始" key="1">
            <Table
              loading={loading}
              rowKey="key"
              rowSelection={rowSelection}
              expandedRowRender={record => <FeedbackList record={record} />}
              pagination={pagination}
              columns={columns}
              dataSource={data}
              onChange={handleTableChange}
            />
          </TabPane>
          <TabPane tab="正在进行" key="2">
            正在开发中...
          </TabPane>
          <TabPane tab="已结束" key="3">
            正在开发中...
          </TabPane>
        </Tabs>
      </Card>
      <Modal
        title="审批"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <Group onChange={e => setValue(e.target.value)} value={value}>
          <Radio style={radioStyle} value={1}>
            根据行政区规划（默认）
          </Radio>
          <Radio style={radioStyle} value={2}>
            自定义
          </Radio>
        </Group>
      </Modal>
      {/* <ProTable
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
        request={params => queryRule(params)}
        columns={columns}
      /> */}

      {/* <CreateForm
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
      ) : null} */}
    </PageHeaderWrapper>
  );
};

export default Form.create()(TableList);
