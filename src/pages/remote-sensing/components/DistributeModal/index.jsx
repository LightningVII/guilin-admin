import React, { useEffect } from 'react';
import { Radio, Modal } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import EmployeeSelect from '../EmployeeSelect';

const { Group: RadioGroup } = Radio;

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

export default connect(({ employee }) => ({
  deptList: employee.deptList,
}))(
  ({
    handleCloseClick,
    visible,
    handleOkClick,
    deptid,
    setDeptid,
    userIds,
    setUserIds,
    dispatch,
    deptList,
  }) => {
    useEffect(() => {
      if (dispatch) {
        dispatch({
          type: 'employee/fetchEmployeeData',
        });
      }
    }, []);

    return (
      <Modal
        title={formatMessage({ id: 'remote-sensing.approval' })}
        visible={visible}
        onOk={handleOkClick}
        onCancel={handleCloseClick}
      >
        <RadioGroup onChange={e => setDeptid(e.target.value)} value={deptid}>
          {[...deptList, { deptname: '自定义', deptid: 'customdeptid' }].map(
            ({ deptname, deptid: id }) => (
              <Radio style={radioStyle} value={id} key={id}>
                {deptname}
              </Radio>
            ),
          )}
        </RadioGroup>
        {deptid === 'customdeptid' ? (
          <EmployeeSelect value={userIds} setValue={setUserIds} />
        ) : null}
        {/* <EmployeeSelect /> */}
      </Modal>
    );
  },
);