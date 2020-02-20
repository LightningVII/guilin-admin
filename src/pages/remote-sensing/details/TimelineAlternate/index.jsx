import React, { useEffect } from 'react';
import moment from 'moment';
import { Empty, Timeline, Typography } from 'antd';
import { connect } from 'dva';

const { Text, Paragraph } = Typography;

const TimelineAlternate = ({ logsInfo, TBBM, dispatch }) => {
  useEffect(() => {
    dispatch({
      type: 'logInfo/fetchlogsInfo',
      payload: { TBBM },
    });
  }, []);

  return logsInfo && logsInfo.length ? (
    <div id="components-timeline-demo-alternate">
      <Timeline mode="alternate">
        {logsInfo?.map(({ id, desc, reportType, time, reporter }) => (
          <Timeline.Item key={id}>
            <Text strong>{`${reportType}-${reporter.username}`}</Text>
            <br />
            <Paragraph ellipsis={{ rows: 1, expandable: true }}>{desc}</Paragraph>
            <Text type="warning">{moment(+time).format('YYYY-MM-DD')}</Text>
          </Timeline.Item>
        ))}
        <Timeline.Item color="gray"></Timeline.Item>
      </Timeline>
    </div>
  ) : (
    <Empty />
  );
};

export default connect(({ logInfo }) => ({
  logsInfo: logInfo?.logsInfo,
}))(TimelineAlternate);
