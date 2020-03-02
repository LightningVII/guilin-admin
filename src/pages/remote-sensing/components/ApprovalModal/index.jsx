import React from 'react';
import { Modal, Input, Button } from 'antd';

const { TextArea } = Input;

export default ({
  visible,
  content,
  handleYesClick,
  handleNoClick,
  handleCloseClick,
  handleChange,
}) => (
  <Modal
    title="审核"
    visible={visible}
    //   onOk={handleOkClick}
    onCancel={handleCloseClick}
    footer={[
      <Button key="back" onClick={handleNoClick}>
        不通过
      </Button>,
      <Button key="submit" type="primary" onClick={handleYesClick}>
        通过
      </Button>,
    ]}
  >
    <TextArea
      value={content}
      onChange={handleChange}
      style={{ height: '200px' }}
      placeholder="审核意见"
    />
  </Modal>
);
