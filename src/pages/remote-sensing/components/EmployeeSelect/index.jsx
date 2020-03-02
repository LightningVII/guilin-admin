import React from 'react';
import { connect } from 'dva';
import { TreeSelect } from 'antd';

const { TreeNode } = TreeSelect;
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
}))(
  ({ value, setValue, employeeList }) => (
    <TreeSelect
      showSearch
      style={{ width: '50%' }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择人员"
      allowClear
      multiple
      treeCheckable
      treeDefaultExpandAll
      showCheckedStrategy={SHOW_PARENT}
      onChange={val => setValue(val)}
    >
      {employeeList?.map(({ value: pv, title, children }) => (
        <TreeNode checkable={false} key={`${pv}pv`} value={`${pv}pv`} title={title}>
          {children?.map(({ key: ck, value: cv, title: ct }) => (
            <TreeNode key={`${pv}-${ck}`} value={`${pv}-${cv}`} title={ct} />
          ))}
        </TreeNode>
      ))}
    </TreeSelect>
  ),

  /* const tProps = {
    treeData: employeeList,
    treeCheckable: true,
    value,
    onChange: val => setValue(val),
    allowClear: true,
    multiple: true,
    treeIcon: true,
    // treeDefaultExpandAll: true,
    // showCheckedStrategy: SHOW_PARENT,
    placeholder: '请选择人员',
    style: { width: '50%' },
  };
  return <TreeSelect {...tProps} />; */
);

// array\<{value, title, children, [disabled, disableCheckbox, selectable, checkable]}>
