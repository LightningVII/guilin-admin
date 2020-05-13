import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Popconfirm, Form } from 'antd';
import { connect } from 'dva';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  children,
  menuList,
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

const MenuView = ({ data, dispatch }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  console.log('data', data);

  useEffect(() => {
    dispatch({ type: 'employee/fetchEmployeeData' });
  }, []);

  const isEditing = record => record.menuid === editingKey;

  const edit = record => {
    form.setFieldsValue(record);
    setEditingKey(record.menuid);
  };

  const cancel = () => {
    dispatch({ type: 'employee/cancelEditMenu' });
    setEditingKey('');
  };

  const remove = key =>
    dispatch({
      type: 'employee/fetchMenuDelete',
      payload: { ids: [key] },
    });

  const add = () => {
    const payload = {
      menuid: 'new-menuid',
      menuname: '',
      remark: '',
    };
    dispatch({
      type: 'employee/addMenu',
      payload,
    });
    edit(payload);
  };

  const save = async key => {
    const row = await form.validateFields();
    dispatch({
      type: 'employee/fetchMenuSave',
      payload: { menuid: key, menuname: row.menuname, remark: row.remark },
    }).then(() => dispatch({ type: 'employee/fetchEmployeeData' }));
    setEditingKey('');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'menuid',
      editable: true,
    },
    {
      title: '角色名称',
      dataIndex: 'menuname',
      editable: true,
    },
    {
      title: '授权',
      dataIndex: 'perms',
      editable: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      editable: true,
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      editable: true,
    },
    {
      title: '父菜单ID',
      dataIndex: 'pid',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record.menuid)} style={{ marginRight: 8 }}>
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
            <Popconfirm title="确定删除此条记录吗?" onConfirm={() => remove(record.menuid)}>
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
          rowKey="menuid"
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
  data: employee.menuList || [],
}))(MenuView);
