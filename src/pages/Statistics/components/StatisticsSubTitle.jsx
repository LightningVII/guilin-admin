import React from 'react';
import { Button, Divider, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from '../style.less';

const StatisticsSubTitle = () => (
  <div className={styles.pageHeader}>
    <div
      style={{
        float: 'left',
      }}
    >
      {' '}
      <span>`本月新增 110 块图斑`</span>
      <Divider type="vertical" />
      <span>`系统共计 110 块图斑`</span>
    </div>
    <div
      style={{
        float: 'right',
      }}
    >
      <Button type="primary">当月</Button> <Button>全年</Button>{' '}
      <DatePicker type="primary" defaultValue={moment()} format="今天 YYYY-MM-DD" />
    </div>
  </div>
);

export default connect(({ dashboardAnalysis }) => ({
  dashboardAnalysis,
}))(StatisticsSubTitle);
