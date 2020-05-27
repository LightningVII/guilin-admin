import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Popconfirm, Form } from 'antd';
import { connect } from 'dva';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  children,
  roleList,
  dispatch,
  ...restProps
}) => (
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
        <Input />
      </Form.Item>
    ) : (
      children
    )}
  </td>
);

const RoleView = ({ data, dispatch }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    dispatch({ type: 'employee/fetchEmployeeData' });
  }, []);

  const isEditing = record => record.roleid === editingKey;

  const edit = record => {
    form.setFieldsValue(record);
    setEditingKey(record.roleid);
  };

  const cancel = () => {
    dispatch({ type: 'employee/cancelEditRole' });
    setEditingKey('');
  };

  const remove = key =>
    dispatch({
      type: 'employee/fetchRoleDelete',
      payload: { roleIds: [key] },
    });

  const add = () => {
    const payload = {
      roleid: 'new-roleid',
      rolename: '',
      remark: '',
      rolecode: '',
    };
    dispatch({
      type: 'employee/addRole',
      payload,
    });
    edit(payload);
  };

  const save = async key => {
    const row = await form.validateFields();
    dispatch({
      type: 'employee/fetchRoleSave',
      payload: { roleid: key, rolename: row.rolename, remark: row.remark, rolecode: row.rolecode },
    }).then(() => dispatch({ type: 'employee/fetchEmployeeData' }));
    setEditingKey('');
  };

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'rolename',
      editable: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      editable: true,
    },
    {
      title: 'CODE',
      dataIndex: 'rolecode',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record.roleid)} style={{ marginRight: 8 }}>
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
            <Popconfirm title="确定删除此条记录吗?" onConfirm={() => remove(record.roleid)}>
              <a>删除</a>
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
        新增角色
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          rowKey="roleid"
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

export default connect(({ employee }) => ({
  data: employee.roleList || [],
}))(RoleView);
