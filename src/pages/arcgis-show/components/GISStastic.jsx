import React from 'react';
import { debounce } from 'lodash'
import ReactDOM from 'react-dom';
import { Form, Select, DatePicker, Button, Drawer } from 'antd';
import DataSet from '@antv/data-set';
import G2 from '@antv/g2';
import moment from 'moment';
import { loadModules } from 'esri-loader';
import style from './css/style.css';

import { xzqFeature } from './json/treeData'
import { renderData } from './json/xuzhouJSON'

let EsriFeatureLayer;
let xzqLayer = null;
let charts = [];
let legend = null;
let maxNum = 0;

const transField = {
    TASKNUM: '任务数量',
    AREA: '变化面积',
    BHLXNUM: '类型数量'
}


class GISStastic extends React.Component {

    formStasticRef = React.createRef();

    constructor(props) {
        super(props);
        this.createChartToMap = debounce(this.createChartToMap, 200);// 防抖函数
        // 设置 initial state
        this.state = {
            renderLegend:false,
            legendTitle:'统计图'
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
        this.removeAll()
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
        const ds = new DataSet();
        const dv = ds.createView().source([item]);
        dv.transform({
            type: 'rename',
            map: transField
        });
        const chart = new G2.Chart({
            container: `chart'+${index}`,
            forceFit: true,
            height: 100,
            padding: 0
        });
        chart.source(dv);
        chart.scale(transField[refObj.field], {
            tickInterval: num
        });
        chart.tooltip({
            inPlot: false
        })
        chart.interval().position(`COUNTY*${transField[refObj.field]}`);
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
        const ds = new DataSet();
        const dv = ds.createView().source(renderData);
        dv.transform({
            type: 'rename',
            map: transField
        });

        legend.source(dv);
        const refObj = this.formStasticRef.current.getFieldsValue();
        legend.scale(transField[refObj.field], {
            tickInterval: maxNum
        });
        legend.axis('COUNTY', {
            label: {
                offset: 12
            }
        });
        legend.tooltip({
            inPlot: false
        })
        legend.coord().transpose();
        legend.interval().position(`COUNTY*${transField[refObj.field]}`);
        legend.render();
        this.setState({
            renderLegend:true,
            legendTitle:`${transField[refObj.field]}统计图`
        })
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
        this.setState({
            renderLegend:false
        })
    }

    setDateToday = type => {
        let date = '202001'
        const d = new Date();
        switch (type) {
            case "pre":
                date = `${d.getFullYear()}0${d.getMonth()}`;
                break;
            case "today":
                date = `${d.getFullYear()}0${d.getMonth()+1}`;
                break;
            default:
                break;
        }
        return date;
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
                        legend = null;
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
                            chartType: 'histogram'
                        }}
                    >
                        <Form.Item name="chartType" label="图表类型">
                            <Select style={{ width: 200 }} >
                                <Select.Option value="histogram">柱状图</Select.Option>
                                <Select.Option value="pieChart">饼状图</Select.Option>
                                <Select.Option value="heatMap">热力图</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name='field' label="统计字段">
                            <Select style={{ width: 200 }} >
                                <Select.Option value="TASKNUM">任务数量</Select.Option>
                                <Select.Option value="AREA">变化面积</Select.Option>
                                <Select.Option value="BHLXNUM">类型数量</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="datePicker" label="时间范围" >
                            <DatePicker.RangePicker defaultValue={[moment(this.setDateToday('pre'), "YYYYMM"), moment(this.setDateToday('today'), "YYYYMM")]}
                                format="YYYYMM" style={{ width: 200 }} picker="month" />
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
                    <div style={{ overflow: "hidden" }}>
                        <div id='legend' />
                        {this.state.renderLegend?<h4 style={{ textAlign: 'center' }}>{this.state.legendTitle}</h4>:null}
                    </div>
                </Drawer>

            </>
        )
    }
}


export default GISStastic;
