import React from 'react';
import moment from 'moment';
import { Empty, Timeline, Typography } from 'antd';

const { Text, Paragraph } = Typography;

const TimelineAlternate = ({ logsInfo }) =>
  logsInfo && logsInfo.length ? (
    <div id="components-timeline-demo-alternate">
      <Timeline mode="alternate">
        {logsInfo?.map(({ SPOTID, DESC, REPORTTYPE, CREATE_TIME, REPORTER }) => (
          <Timeline.Item key={SPOTID}>
            <Text strong>{`${REPORTTYPE}-${REPORTER}`}</Text>
            <br />
            <Paragraph ellipsis={{ rows: 1, expandable: true }}>{DESC}</Paragraph>
            <Text type="warning">{moment(CREATE_TIME).format('YYYY-MM-DD')}</Text>
          </Timeline.Item>
        ))}
        <Timeline.Item color="gray"></Timeline.Item>
      </Timeline>
    </div>
  ) : (
    <Empty />
  );

export default TimelineAlternate;
