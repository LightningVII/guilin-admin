import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Popconfirm, Form } from 'antd';
import { connect } from 'dva';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  children,
  deptList,
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

const DeptView = ({ data, dispatch }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    dispatch({ type: 'employee/fetchEmployeeData' });
  }, []);

  const isEditing = record => record.deptid === editingKey;

  const edit = record => {
    form.setFieldsValue(record);
    setEditingKey(record.deptid);
  };

  const cancel = () => {
    dispatch({ type: 'employee/cancelEditDept' });
    setEditingKey('');
  };

  const remove = key =>
    dispatch({
      type: 'employee/fetchDeptDelete',
      payload: { ids: [key] },
    });

  const add = () => {
    const payload = {
      deptid: 'new-deptid',
      deptname: '',
      address: '',
    };
    dispatch({
      type: 'employee/addDept',
      payload,
    });
    edit(payload);
  };

  const save = async key => {
    const row = await form.validateFields();
    dispatch({
      type: 'employee/fetchDeptSave',
      payload: { deptid: key, deptname: row.deptname, address: row.address },
    }).then(() => dispatch({ type: 'employee/fetchEmployeeData' }));
    setEditingKey('');
  };

  const columns = [
    {
      title: '部门名称',
      dataIndex: 'deptname',
      editable: true,
    },
    {
      title: '地址',
      dataIndex: 'address',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record.deptid)} style={{ marginRight: 8 }}>
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
            <Popconfirm title="确定删除此条记录吗?" onConfirm={() => remove(record.deptid)}>
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
        新增部门
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          rowKey="deptid"
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
  data: employee.deptList || [],
}))(DeptView);
