import React from 'react';
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

export default ({ value, setValue, employeeList }) => (
  <TreeSelect
    style={{ width: '50%' }}
    value={value}
    placeholder="请选择人员"
    allowClear
    multiple
    treeCheckable
    treeDefaultExpandAll
    showCheckedStrategy={SHOW_PARENT}
    onChange={val => setValue(val)}
  >
    {employeeList?.map(({ value: pv, title, children }) => (
      <TreeNode
        selectable={false}
        checkable={false}
        key={`${pv}pv`}
        value={`${pv}pv`}
        title={title}
      >
        {children?.map(({ key: ck, value: cv, title: ct }) => (
          <TreeNode key={`${pv}-${ck}`} value={`${pv}-${cv}`} title={ct} />
        ))}
      </TreeNode>
    ))}
  </TreeSelect>
);
