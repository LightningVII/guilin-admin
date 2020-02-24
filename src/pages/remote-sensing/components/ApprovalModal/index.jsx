import React from 'react';
import { Radio, Modal } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import EmployeeSelect from '../EmployeeSelect';

const { Group: RadioGroup } = Radio;

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

export default ({ visible, setVisible, radioValue, setRadioValue }) => (
  <Modal
    title={formatMessage({ id: 'remote-sensing.approval' })}
    visible={visible}
    onOk={setVisible}
    onCancel={setVisible}
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
);
