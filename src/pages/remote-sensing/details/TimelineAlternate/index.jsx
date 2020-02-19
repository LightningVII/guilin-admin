import React, { useEffect } from 'react';
import moment from 'moment';
import { Timeline, Typography } from 'antd';
import { connect } from 'dva';

const { Text, Paragraph } = Typography;

/* <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
<Timeline.Item color="green">Solve initial network problems 2015-09-01</Timeline.Item>
<Timeline.Item
  dot={
    <Icon
      type="clock-circle-o"
      style={{
        fontSize: '16px',
      }}
    />
  }
>
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
  laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
  architecto beatae vitae dicta sunt explicabo.
</Timeline.Item>
<Timeline.Item color="red">Network problems being solved 2015-09-01</Timeline.Item>
<Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
<Timeline.Item
  dot={
    <Icon
      type="clock-circle-o"
      style={{
        fontSize: '16px',
      }}
    />
  }
>
  Technical testing 2015-09-01
</Timeline.Item> */

const TimelineAlternate = ({ logsInfo, TBBM, dispatch }) => {
  useEffect(() => {
    dispatch({
      type: 'logInfo/fetchlogsInfo',
      payload: { TBBM },
    });
  }, []);

  return (
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
  );
};

export default connect(({ logInfo }) => ({
  logsInfo: logInfo?.logsInfo,
}))(TimelineAlternate);
