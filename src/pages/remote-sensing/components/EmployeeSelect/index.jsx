import React from 'react';
import { connect } from 'dva';
import { TreeSelect } from 'antd';
/* import { Select } from 'antd';

const { Option, OptGroup } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}

export default () => (
  <Select defaultValue="lucy" style={{ width: 200 }} onChange={handleChange}>
    <OptGroup label="第一大队人员">
      <Option value="jack">Jack</Option>
      <Option value="lucy">Lucy</Option>
    </OptGroup>
    <OptGroup label="第二大队人员">
      <Option value="Yiminghe">yiminghe</Option>
    </OptGroup>
    <OptGroup label="第三大队人员">
      <Option value="San">san</Option>
    </OptGroup>
  </Select>
); */

const { SHOW_PARENT } = TreeSelect;

export default connect(({ employee }) => ({
  employeeList: employee.employeeList,
}))(({ value, setValue, employeeList }) => {
  const tProps = {
    treeData: employeeList,
    value,
    onChange: val => setValue(val),
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    searchPlaceholder: '请选择人员',
    style: { width: '50%' },
  };
  return <TreeSelect {...tProps} />;
});

// array\<{value, title, children, [disabled, disableCheckbox, selectable, checkable]}>
