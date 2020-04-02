import { Tag, Table, Col, DatePicker, Row, Card, Tabs } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React from 'react';
import styles from '../style.less';
// import MyBasemap from '../../arcgis-show/components/MyBasemap';
// import MyFeatureLayer from '../../arcgis-show/components/MyFeatureLayer';
import MapCharts from '../../arcgis-show/components/charts/MapCharts';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const rankingListData = [];

for (let i = 0; i < 5; i += 1) {
  rankingListData.push({
    key: i,
    title: formatMessage(
      {
        id: 'dashboardanalysis.analysis.test',
      },
      {
        no: i,
      },
    ),
    age: Math.floor(Math.random() * 1000),
    address: '徐州市云龙区',
    type: '类型',
    status: Math.floor(Math.random() * 10) % 4,
  });
}

const tags = [
  <Tag color="cyan">状态1</Tag>,
  <Tag color="blue">状态2</Tag>,
  <Tag color="geekblue">状态3</Tag>,
  <Tag color="purple">状态4</Tag>,
];

const columns = [
  {
    title: '图斑名称',
    dataIndex: 'title',
  },
  {
    title: '位置',
    dataIndex: 'address',
  },
  {
    title: '应用',
    dataIndex: 'age',
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: record => tags[record],
  },
  {
    title: '类型',
    dataIndex: 'type',
  },
];

const SalesCard = ({
  rangePickerValue,
  isActive,
  handleRangePickerChange,
  loading,
  selectDate,
}) => (
  <Card
    loading={loading}
    bordered={false}
    bodyStyle={{
      padding: 0,
    }}
    style={{ width: '100%' }}
    title={
      <FormattedMessage id="dashboardanalysis.analysis.graph-comparison" defaultMessage="Sales" />
    }
    extra={
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={isActive('today')} onClick={() => selectDate('today')}>
            <FormattedMessage id="dashboardanalysis.analysis.all-day" defaultMessage="All Day" />
          </a>
          <a className={isActive('week')} onClick={() => selectDate('week')}>
            <FormattedMessage id="dashboardanalysis.analysis.all-week" defaultMessage="All Week" />
          </a>
          <a className={isActive('month')} onClick={() => selectDate('month')}>
            <FormattedMessage
              id="dashboardanalysis.analysis.all-month"
              defaultMessage="All Month"
            />
          </a>
          <a className={isActive('year')} onClick={() => selectDate('year')}>
            <FormattedMessage id="dashboardanalysis.analysis.all-year" defaultMessage="All Year" />
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={handleRangePickerChange}
          style={{
            width: 256,
          }}
        />
      </div>
    }
  >
    <Row type="flex" style={{ padding: '24px' }}>
      <Col style={{ paddingRight: '24px' }} xl={16} lg={12} md={12} sm={24} xs={24}>
        <MapCharts height="328px">
          {/* <MyFeatureLayer /> */}
        </MapCharts>
      </Col>
      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <h4
          style={{
            position: 'absolute',
            top: '15px',
          }}
        >
          <FormattedMessage
            id="dashboardanalysis.analysis.graph-comparison-list"
            defaultMessage="Sales Ranking"
          />
        </h4>
        <Tabs className={styles.tabs} defaultActiveKey="1" onChange={() => {}}>
          <TabPane
            style={{
              float: 'right',
            }}
            tab="最新"
            key="1"
          >
            <Table columns={columns} dataSource={rankingListData} size="small" />
          </TabPane>
          <TabPane
            style={{
              float: 'right',
            }}
            tab="所有"
            key="2"
          >
            <Table columns={columns} dataSource={rankingListData} size="small" />
          </TabPane>
        </Tabs>
        {/* <ul className={styles.rankingList}>
            {rankingListData.map((item, i) => (
              <li key={item.title}>
                <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                  {i + 1}
                </span>
                <span className={styles.rankingItemTitle} title={item.title}>
                  {item.title}
                </span>
                <span className={styles.rankingItemValue}>{numeral(item.total).format('0,0')}</span>
              </li>
            ))}
          </ul> */}
      </Col>
    </Row>
  </Card>
);

export default SalesCard;
