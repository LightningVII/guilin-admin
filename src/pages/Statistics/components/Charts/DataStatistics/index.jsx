import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';
import autoHeight from '../autoHeight';

const cols = {
  percent: {
    formatter: val => `${(val * 100).toFixed(1)}%`,
  },
};

function getXY(c, { index: idx = 0, field = 'percent', radius = 0.5 }) {
  const d = c.get('data');
  if (idx > d.length) return null;
  const scales = c.get('scales');
  let sum = 0;
  for (let i = 0; i < idx + 1; i += 1) {
    let val = d[i][field];
    if (i === idx) {
      val /= 2;
    }
    sum += val;
  }
  const pt = {
    y: scales[field].scale(sum),
    x: radius,
  };
  const coord = c.get('coord');
  const xy = coord.convert(pt);
  return xy;
}

const Labelline = props => {
  const { data } = props;
  const { DataView } = DataSet;
  const dv = new DataView();

  dv.source(data).transform({
    type: 'percent',
    field: 'count',
    dimension: 'item',
    as: 'percent',
  });

  return (
    <div>
      <Chart
        height={180}
        data={dv}
        scale={cols}
        padding={[0, 30, 0, 0]}
        forceFit
        onGetG2Instance={c => {
          const xy = getXY(c, { index: 0 });
          c.showTooltip(xy);
        }}
      >
        <Coord type="theta" radius={0.75} />
        <Axis name="percent" />
        <Legend position="right-center" offsetX={-60} />
        <Tooltip
          showTitle={false}
          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        />
        <Geom
          type="intervalStack"
          position="percent"
          color="item"
          tooltip={[
            'item*count*percent',
            (item, count, percent) => ({
              name: item,
              value: `${(percent * 100).toFixed(1)}%`,
              count,
            }),
          ]}
          style={{
            lineWidth: 1,
            stroke: '#fff',
          }}
        >
          <Label
            content="percent"
            formatter={(val, item) => `${item.point.item}: ${item.point.count}`}
          />
        </Geom>
      </Chart>
    </div>
  );
};

export default autoHeight()(Labelline);
