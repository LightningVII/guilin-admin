import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Select, DatePicker, Button } from 'antd';
import G2 from '@antv/g2';
import { loadModules } from 'esri-loader';
import style from './css/style.css';

import { xzqFeature } from './json/treeData'
import { renderData } from './json/xuzhouJSON'

let EsriFeatureLayer;
let xzqLayer = null;

class GISStastic extends React.Component {

    chartRef = React.createRef();

    constructor(props) {
        super(props);
        // 设置 initial state
        this.state = {
        };
    }

    componentDidMount() {
        loadModules(['esri/layers/FeatureLayer']).then(
            ([FeatureLayer]) => {
                EsriFeatureLayer = FeatureLayer
            },
        );
    }

    componentWillUnmount() {
        if (xzqLayer)
            this.props.view.map.remove(xzqLayer)
    }

    renderChart = () => {
        if (!xzqLayer) {
            xzqLayer = new EsriFeatureLayer({ url: xzqFeature.layerUrl, id: xzqFeature.key })
            this.props.view.map.add(xzqLayer)
        }
        this.props.view.extent = xzqFeature.extent;

        this.creatChart(renderData);

    }


    creatChart = data => {

        const title = React.createElement("div", { className: style.chart, id: 'chart1' });
        ReactDOM.render(title, document.getElementById('container'));

        setTimeout(() => {
            const chart = new G2.Chart({
                container: 'chart1',
                forceFit: true,
                height: 30,
                width:40
            });

            chart.source(data[0]);
            chart.scale('value', {
                alias: '销售额(万)'
            });

            chart.axis('name', {
                label: {
                    textStyle: {
                        fill: '#aaaaaa'
                    }
                },
                tickLine: {
                    alignWithLabel: false,
                    length: 0
                }
            });
            chart.axis('count', {
                label: {
                    textStyle: {
                        fill: '#aaaaaa'
                    }
                }
            });

            chart.interval().position('name*count')
                .opacity('time', val => {
                    if (val === '13:00-14:00') {
                        return 0.4;
                    }
                    return 1;
                })
                .style('time', {
                    lineWidth: val => {
                        if (val === '13:00-14:00') {
                            return 1;
                        }
                        return 0;
                    },
                    stroke: '#636363',
                    lineDash: [3, 2]
                });
            chart.render();

        }, 1000)

    }




    render() {
        return (
            <>
                <Form layout='horizontal'>
                    <Form.Item label="统计字段">
                        <Select style={{ width: 200 }} >
                            <Select.Option value="COUNT">任务数量</Select.Option>
                            <Select.Option value="ARAE">变化面积</Select.Option>
                            <Select.Option value="BHLX">类型数量</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="统计方式">
                        <Select style={{ width: 200 }} >
                            <Select.Option value="XZQ">按行政区统计</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="图表类型">
                        <Select style={{ width: 200 }} >
                            <Select.Option value="histogram">柱状图</Select.Option>
                            <Select.Option value="pieChart">饼状图</Select.Option>
                            <Select.Option value="pieChart">颜色渲染</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="date-picker" label="时间范围" >
                        <DatePicker.RangePicker style={{ width: 200 }} picker="month" />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit" onClick={() => {
                            this.renderChart()
                        }}>
                            地图显示
                        </Button>
                    </Form.Item>
                </Form>
            </>
        )
    }
}


export default GISStastic;
