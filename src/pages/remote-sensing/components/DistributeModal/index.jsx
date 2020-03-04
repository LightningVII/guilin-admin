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

export default connect(({ employee, user }) => ({
  deptList: employee.deptList,
  user: user.currentUser,
  employeeList: employee.employeeList,
}))(
  ({
    handleCloseClick,
    visible,
    handleOkClick,
    deptid,
    setDeptid,
    user,
    userIds,
    setUserIds,
    dispatch,
    deptList,
    employeeList,
  }) => {
    useEffect(() => {
      if (dispatch) {
        dispatch({
          type: 'employee/fetchEmployeeData',
        });
      }
    }, []);

    const isXTGLY = user.roles[0].rolecode === 'XTGLY';
    const isZFDDZ = user.roles[0].rolecode === 'ZFDDZ';

    return (
      <Modal
        title={formatMessage({ id: 'remote-sensing.approval' })}
        visible={visible}
        onOk={handleOkClick}
        onCancel={handleCloseClick}
      >
        {isXTGLY && (
          <RadioGroup onChange={e => setDeptid(e.target.value)} value={deptid}>
            {[...deptList, { deptname: '自定义', deptid: 'customdeptid' }].map(
              ({ deptname, deptid: id }) => (
                <Radio style={radioStyle} value={id} key={id}>
                  {deptname}
                </Radio>
              ),
            )}
          </RadioGroup>
        )}
        {(!isXTGLY || deptid === 'customdeptid') && (
          <EmployeeSelect
            employeeList={
              isZFDDZ
                ? employeeList.filter(({ value }) => value === user?.depts?.[0]?.deptid)
                : employeeList
            }
            value={userIds}
            setValue={setUserIds}
          />
        )}
      </Modal>
    );
  },
);
