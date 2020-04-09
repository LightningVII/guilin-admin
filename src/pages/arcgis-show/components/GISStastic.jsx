import React from 'react';
import { debounce } from 'lodash'
import ReactDOM from 'react-dom';
import { Form, Select, DatePicker, Button, Drawer } from 'antd';
import G2 from '@antv/g2';

import { loadModules } from 'esri-loader';
import style from './css/style.css';

import { xzqFeature } from './json/treeData'
import { renderData } from './json/xuzhouJSON'

let EsriFeatureLayer;
let xzqLayer = null;
let charts = [];
let legend = null;
let maxNum = 0;


class GISStastic extends React.Component {

    formStasticRef = React.createRef();

    constructor(props) {
        super(props);
        this.createChartToMap = debounce(this.createChartToMap, 200);// 防抖函数
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

    removeAll = () => {
        this.removeLegend()
        this.removeChart()
        if (xzqLayer) {
            this.props.view.map.remove(xzqLayer)
            xzqLayer = null
        }
    }

    createChartToMap = data => {
        charts = [];
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        const refObj = this.formStasticRef.current.getFieldsValue();
        maxNum = 0;
        const eleDiv = (
            <>
                {
                    data.map((item, index) => {
                        if (item[refObj.field] > maxNum) maxNum = item[refObj.field]
                        const pos = this.mapPointToPosition(item.LNG, item.LAT); // 经纬度坐标转换成屏幕位置
                        return <div className={style.chart} style={{ top: pos.y, left: pos.x }} id={`chart'+${index}`} />
                    })
                }

            </>
        )

        ReactDOM.render(eleDiv, document.getElementById('container'));
        data.forEach((item, index) => {
            const chart = this.creatHistorgramChart(refObj, maxNum, item, index)
            charts.push(chart)
        })
    }

    // 创建柱状图
    creatHistorgramChart = (refObj, num, item, index) => {
        const chart = new G2.Chart({
            container: `chart'+${index}`,
            forceFit: true,
            height: 100,
            padding: 0
        });
        chart.source([item]);
        chart.scale(refObj.field, {
            tickInterval: num
        });
        chart.interval().position(`COUNTY*${refObj.field}`);
        chart.render();
        return chart
    }

    // 创建饼状图
    creatPieChart = () => {

    }

    // 生成图例
    creatLegend = () => {
        if (!legend)
            legend = new G2.Chart({
                container: 'legend',
                height: 360,
                width: 260,
                padding: [20, 20, 20, 50]
            })
        legend.source(renderData);
        const refObj = this.formStasticRef.current.getFieldsValue();
        legend.scale(refObj.field, {
            tickInterval: maxNum
        });
        legend.axis('COUNTY', {
            label: {
                offset: 12
            }
        });
        legend.coord().transpose();
        legend.interval().position(`COUNTY*${refObj.field}`);
        legend.render();
    }

    mapPointToPosition = (xLNG, yLAT) => {
        const mapPoint = {
            x: xLNG,
            y: yLAT,
            spatialReference: {
                wkid: 4326
            }
        };
        const screenPoint = this.props.view.toScreen(mapPoint); // 屏幕坐标
        const position = {
            x: screenPoint.x - 20,
            y: screenPoint.y - 110
        } // 实际位置偏移

        return position
    }



    renderChart = () => {

        if (!xzqLayer) {
            xzqLayer = new EsriFeatureLayer({ url: xzqFeature.layerUrl, id: xzqFeature.key })
            this.props.view.map.add(xzqLayer)
        }

        if (this.mapExtentChange) this.mapExtentChange.remove();
        this.mapExtentChange = this.props.view.watch('extent', () => {
            charts.forEach(item => {
                item.clear();
            })
            this.createChartToMap(renderData);
        })

        this.props.view.extent = xzqFeature.extent;
        setTimeout(() => {
            this.removeLegend()
            this.creatLegend();
        }, 500)

    }

    removeChart = () => {
        charts = [];
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        if (this.mapExtentChange) this.mapExtentChange.remove();
    }

    removeLegend = () => {
        if (legend) legend.clear();
    }

    render() {
        return (
            <>
                <Drawer
                    title="统计分析"
                    placement="right"
                    mask={false}
                    onClose={() => {
                        this.removeAll()
                        legend=null;
                        this.props.onClose()
                    }}
                    visible={this.props.visible}
                    width={320}
                >
                    <Form
                        layout='horizontal'
                        ref={this.formStasticRef}
                        initialValues={{
                            field: 'TASKNUM',
                            pattern: 'XZQ',
                            chartType: 'histogram'
                        }}
                    >
                        <Form.Item name='field' label="统计字段">
                            <Select style={{ width: 200 }} >
                                <Select.Option value="TASKNUM">任务数量</Select.Option>
                                <Select.Option value="AREA">变化面积</Select.Option>
                                <Select.Option value="BHLXNUM">类型数量</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="pattern" label="统计方式">
                            <Select value='XZQ' style={{ width: 200 }} >
                                <Select.Option value="XZQ">按行政区统计</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="chartType" label="图表类型">
                            <Select style={{ width: 200 }} >
                                <Select.Option value="histogram">柱状图</Select.Option>
                                <Select.Option value="pieChart">饼状图</Select.Option>
                                <Select.Option value="color">颜色渲染</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="datePicker" label="时间范围" >
                            <DatePicker.RangePicker style={{ width: 200 }} picker="month" />
                        </Form.Item>
                        <Form.Item style={{ textAlign: "center" }} >
                            <Button type="primary" htmlType="submit" onClick={() => {
                                this.renderChart()
                            }}>
                                地图渲染
                        </Button>
                            &#12288;
                        <Button type="danger" onClick={() => {
                                this.removeChart()
                                this.removeLegend()
                            }}>
                                移除图表
                        </Button>
                        </Form.Item>
                    </Form>
                    <div style={{ overflowY: "hidden" }}>
                        <div id='legend' />

                    </div>
                </Drawer>

            </>
        )
    }
}


export default GISStastic;
