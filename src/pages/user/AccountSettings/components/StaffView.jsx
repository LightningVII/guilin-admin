import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Select, Popconfirm, Form, Tag, message } from 'antd';
import { connect } from 'dva';

const { Option } = Select;
const colors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
  '#f50',
  '#2db7f5',
  '#87d068',
  '#108ee9',
];

const EditableCell = connect(({ employee }) => ({
  deptList: employee.deptList,
  roleList: employee.roleList,
}))(
  ({ editing, dataIndex, title, record, children, deptList, roleList, dispatch, ...restProps }) => {
    const inputType = {
      depts: (
        <Select mode="multiple" placeholder="请选择部门">
          {deptList?.map(item => (
            <Option key={item.deptid}>{item.deptname}</Option>
          ))}
        </Select>
      ),
      roles: (
        <Select mode="multiple" placeholder="请选择角色">
          {roleList?.map(item => (
            <Option key={item.roleid}>{item.rolename}</Option>
          ))}
        </Select>
      ),
    };

    const inputNode = inputType[dataIndex] || <Input />;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  },
);

const StaffView = ({ data, dispatch }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [password, setPassword] = useState('888888');

  useEffect(() => {
    dispatch({
      type: 'user/fetchStaffList',
      payload: { pageNum: 1, pageSize: 10 },
    });
    dispatch({
      type: 'employee/fetchEmployeeData',
    });
  }, []);

  const isEditing = record => record.userid === editingKey;

  const edit = record => {
    form.setFieldsValue({
      ...record,
      depts: record.depts.map(({ deptid }) => deptid),
      roles: record.roles.map(({ roleid }) => roleid),
    });
    setEditingKey(record.userid);
  };

  const cancel = () => {
    dispatch({ type: 'user/cancelEditStaff' });
    setEditingKey('');
  };

  const remove = payload => dispatch({ type: 'user/fetchStaffDelete', payload });

  const add = () => {
    const payload = {
      userid: 'new-userid',
      usercode: '',
      username: '',
      phone: '',
      depts: [],
      roles: [],
    };
    dispatch({
      type: 'user/addStaff',
      payload,
    });
    edit(payload);
  };

  const save = async userid => {
    const row = await form.validateFields();
    dispatch({
      type: 'user/fetchUserSave',
      payload: {
        userid,
        usercode: row.usercode,
        username: row.username,
        phone: row.phone,
        deptIds: row.depts,
        roleIds: row.roles,
        unsave: row.unsave,
      },
    });
    setEditingKey('');
  };

  const columns = [
    {
      title: '账户名',
      dataIndex: 'usercode',
      editable: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      editable: true,
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      editable: true,
    },
    {
      title: '所属部门',
      dataIndex: 'depts',
      width: '20%',
      editable: true,
      render: _ =>
        _?.map((item, index) => (
          <Tag key={index.toString()} color={colors[index] || 'magenta'}>
            {item.deptname}
          </Tag>
        )),
    },
    {
      title: '角色',
      dataIndex: 'roles',
      width: '20%',
      editable: true,
      render: _ =>
        _?.map((item, index) => (
          <Tag key={index.toString()} color={colors[index] || 'magenta'}>
            {item.rolename}
          </Tag>
        )),
    },
    {
      title: '',
      dataIndex: 'operation',
      align: 'center',
      width: '180px',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record.userid)} style={{ marginRight: 8 }}>
              保存
            </a>
            <Popconfirm title="确定取消此次操作吗?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <a disabled={editingKey !== ''} onClick={() => edit(record)} style={{ marginRight: 8 }}>
              编辑
            </a>
            <Popconfirm title="确定删除此条记录吗?" onConfirm={() => remove(record.userid)}>
              <a disabled={editingKey !== ''} style={{ marginRight: 8 }}>
                删除
              </a>
            </Popconfirm>
            <Popconfirm
              onConfirm={() =>
                dispatch({
                  type: 'login/updatePassword',
                  payload: {
                    userid: record.userid,
                    newpassword: password,
                  },
                }).then(({ code, message: msg }) => {
                  if (code === 200) message.success('密码重置成功');
                  else message.error(msg || '密码修改失败');
                })
              }
              title={
                <Input.Password
                  addonBefore="重置密码"
                  style={{ marginTop: '-5px' }}
                  onChange={e => setPassword(e.currentTarget.value)}
                  value={password}
                />
              }
            >
              <a disabled={editingKey !== ''}>重置密码</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        // inputType: col.dataIndex, // ['depts', 'roles'].includes(col.dataIndex) ? 'select' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      <Button
        disabled={editingKey !== ''}
        onClick={add}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        录入员工
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          rowKey="userid"
          dataSource={[...data]}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};

export default connect(({ user }) => ({
  data: user.staffList?.list || [],
}))(StaffView);
