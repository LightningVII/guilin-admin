import React, { useState } from 'react';
import { getTimeDistance } from '@/utils/utils';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, DatePicker } from 'antd';
import styles from './style.less';

const { RangePicker } = DatePicker;

export default ({ handleRangePickerChange, initRangPickerValue }) => {
  const [rangePickerValue, setRangePickerValue] = useState(
    initRangPickerValue || getTimeDistance('year'),
  );
  const selectDate = type => {
    const rangeValue = getTimeDistance(type);
    setRangePickerValue(rangeValue);
    if (handleRangePickerChange) handleRangePickerChange(rangeValue);
  };

  const handleRangeChange = rangeValue => {
    setRangePickerValue(rangeValue);
    if (handleRangePickerChange) handleRangePickerChange(rangeValue);
  };

  const isActive = type => {
    const value = getTimeDistance(type);

    if (!rangePickerValue[0] || !rangePickerValue[1]) return '';

    if (rangePickerValue[0].isSame(value[0], 'day') && rangePickerValue[1].isSame(value[1], 'day'))
      return styles.currentDate;

    return '';
  };

  return (
    <div className={styles.salesExtraWrap}>
      <div className={styles.salesExtra}>
        <Button className={isActive('today')} onClick={() => selectDate('today')} type="link">
          <FormattedMessage id="dashboardanalysis.analysis.all-day" defaultMessage="All Day" />
        </Button>
        <Button className={isActive('week')} onClick={() => selectDate('week')} type="link">
          <FormattedMessage id="dashboardanalysis.analysis.all-week" defaultMessage="All Week" />
        </Button>
        <Button className={isActive('month')} onClick={() => selectDate('month')} type="link">
          <FormattedMessage id="dashboardanalysis.analysis.all-month" defaultMessage="All Month" />
        </Button>
        <Button className={isActive('year')} onClick={() => selectDate('year')} type="link">
          <FormattedMessage id="dashboardanalysis.analysis.all-year" defaultMessage="All Year" />
        </Button>
      </div>
      <RangePicker value={rangePickerValue} onChange={handleRangeChange} style={{ width: 256 }} />
    </div>
  );
};
