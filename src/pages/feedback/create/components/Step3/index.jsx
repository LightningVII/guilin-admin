import { Button, Result, Descriptions, Statistic } from 'antd';
import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

const Step3 = props => {
  const { data, dispatch } = props;

  if (!data) {
    return null;
  }

  const { payAccount, receiverAccount, receiverName, amount } = data;

  const onFinish = () => {
    if (dispatch) {
      dispatch({
        type: 'feedback/saveCurrentStep',
        payload: 'info',
      });
    }
  };

  const information = (
    <div className={styles.information}>
      <Descriptions column={1}>
        <Descriptions.Item label="付款账户"> {payAccount}</Descriptions.Item>
        <Descriptions.Item label="收款账户"> {receiverAccount}</Descriptions.Item>
        <Descriptions.Item label="收款人姓名"> {receiverName}</Descriptions.Item>
        <Descriptions.Item label="转账金额">
          <Statistic value={amount} suffix="元" />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
  const extra = (
    <>
      <Button type="primary" onClick={onFinish}>
        再转一笔
      </Button>
      <Button>查看账单</Button>
    </>
  );
  return (
    <Result
      status="success"
      title="操作成功"
      subTitle="预计两小时内到账"
      extra={extra}
      className={styles.result}
    >
      {information}
    </Result>
  );
};

export default connect(({ feedback }) => ({
  data: feedback.step,
}))(Step3);
