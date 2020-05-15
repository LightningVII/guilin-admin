import React from 'react';
import { debounce } from 'lodash';
import ReactDOM from 'react-dom';
import { Form, Select, DatePicker, Button, Drawer } from 'antd';
import DataSet from '@antv/data-set';
import { connect } from 'dva';
import G2 from '@antv/g2';
import moment from 'moment';
import { loadModules } from 'esri-loader';
import style from './css/style.css';

import { xzqFeature } from './json/treeData';
import { heatMapUrl } from './json/xuzhouJSON';

let EsriFeatureLayer;
let EsriGeoJSONLayer;
let xzqLayer = null;
let fLayer = null;
let charts = [];
let legend = null;
let maxNum = 0;

const transField = {
    TASKNUM: '任务数量',
    AREA: '变化面积',
    BHLXNUM: '类型数量',
};

const histogram = [
    { value: 'TASKNUM', text: '任务数量', key: '0' },
    { value: 'AREA', text: '变化面积', key: '1' },
    { value: 'BHLXNUM', text: '类型数量', key: '2' },
];

const pieChart = [{ value: 'TASKNUM', text: '任务类型/数量', key: '0' }];

class GISStastic extends React.Component {
    formStasticRef = React.createRef();

    constructor(props) {
        super(props);
        this.createChartToMap = debounce(this.createChartToMap, 200); // 防抖函数
        // 设置 initial state
        this.state = {
            renderLegend: false,
            legendTitle: '统计图',
            selectOptions: histogram,
        };
        const { dispatch } = props;

        dispatch({
            type: 'remoteSensing/fetchChangespotTBCount',
        });

        dispatch({
            type: 'remoteSensing/fetchChangespotBZTTJ',
        });

        dispatch({
            type: 'remoteSensing/fetchChangespotGeoJson',
            payload: { qsx: '', hsx: '' },
        });

        loadModules(['esri/layers/FeatureLayer', "esri/layers/GeoJSONLayer",]).then(([FeatureLayer, GeoJSONLayer]) => {
            EsriFeatureLayer = FeatureLayer;
            EsriGeoJSONLayer = GeoJSONLayer
        });
    }

    componentWillUnmount() {
        this.removeAll();
    }

    removeAll = () => {
        this.removeLegend();
        this.removeChart();
        if (xzqLayer) {
            this.props.view.map.remove(xzqLayer);
            xzqLayer = null;
        }
    };

    createChartToMap = (data, refObj, callback) => {
        charts = [];
        maxNum = 0;
        ReactDOM.unmountComponentAtNode(document.getElementById('container'));
        const eleDiv = (
            <>
                {data.map((item, index) => {
                    if (refObj.chartType === 'histogram' && item[refObj.field] > maxNum)
                        maxNum = item[refObj.field];
                    const pos = this.mapPointToPosition(item.LNG, item.LAT); // 经纬度坐标转换成屏幕位置
                    return (
                        <div
                            className={style.chart}
                            style={{ top: pos.y + 30, left: pos.x - 30 }}
                            id={`chart'+${index}`}
                        />
                    );
                })}
            </>
        );
        ReactDOM.render(eleDiv, document.getElementById('container'));
        data.forEach((item, index) => {
            const chart = callback(refObj, maxNum, item, index);
            if (chart) charts.push(chart);
        });
    };

    // 创建柱状图
    creatHistorgramChart = (refObj, num, item, index) => {
        const ds = new DataSet();
        const dv = ds.createView().source([item]);
        dv.transform({
            type: 'rename',
            map: transField,
        });
        const chart = new G2.Chart({
            container: `chart'+${index}`,
            forceFit: true,
            height: 100,
            padding: 0,
        });
        chart.source(dv);
        chart.legend(false);
        chart.scale(transField[refObj.field], {
            tickInterval: num,
        });
        chart.tooltip({
            inPlot: false,
            itemTpl:
                '<li style="width:100px"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
        });
        chart.interval().position(`COUNTY*${transField[refObj.field]}`);
        chart.render();
        return chart;
    };

    // 创建饼状图
    creatPieChart = (refObj, num, item, index) => {
        const ds = new DataSet();
        const dv = ds.createView().source(item.DETAIL);
        dv.transform({
            type: 'map',
            callback(row) {
                const r = row;
                r.BHLX = `${r.QSXDLMC} / ${r.HSXDLMC}`;
                return r;
            },
        });
        const chart = new G2.Chart({
            container: `chart'+${index}`,
            forceFit: true,
            height: 60,
            padding: 0,
        });
        chart.source(dv);
        chart.legend(false);
        chart.tooltip(true, {
            showTitle: true,
            inPlot: false,
            itemTpl:
                '<li style="width:160px"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
        });
        chart.coord('theta');
        chart
            .intervalStack()
            .position(`${item.COUNTY}*COUNT`)
            .color('BHLX')
            .style({
                stroke: 'white',
                lineWidth: 1,
            })
            .label('QSXDLMC');
        chart.render();
        return chart;
    };

    // 生成柱状图图例
    creatHistorgramLegend = refObj => {
        if (!legend)
            legend = new G2.Chart({
                container: 'legend',
                height: 360,
                width: 260,
                padding: 'auto',
            });
        const ds = new DataSet();
        const dv = ds.createView().source(this.props.tbcount);
        dv.transform({
            type: 'rename',
            map: transField,
        });
        legend.source(dv);
        legend.scale(transField[refObj.field], {
            tickInterval: maxNum,
        });
        legend.axis('COUNTY', {
            label: {
                offset: 12,
            },
        });
        legend.tooltip({
            inPlot: false,
        });
        legend.coord().transpose();
        legend.interval().position(`COUNTY*${transField[refObj.field]}`);
        legend.render();
        this.setState({
            renderLegend: true,
            legendTitle: `各县区${transField[refObj.field]}柱状图`,
        });
    };

    // 创建热力图
    creatHeatMap = () => {
        const renderer = {
            type: 'heatmap',
            colorStops: [
                { ratio: 0, color: 'rgba(0, 255, 150, 0)' },
                { ratio: 0.6, color: 'rgb(250, 250, 0)' },
                { ratio: 0.85, color: 'rgb(250, 150, 0)' },
                { ratio: 0.95, color: 'rgb(255, 50, 0)' },
                { ratio: 1, color: 'rgb(255, 0, 0)' },
            ],
            maxPixelIntensity: 25,
            minPixelIntensity: 0,
        };
        fLayer = new EsriFeatureLayer({
            url: heatMapUrl,
            renderer,
        });

        const renderer2 = {
            type: "simple",
            field: "mag",
            symbol: {
                type: "simple-marker",
                color: "orange",
                outline: {
                    color: "white"
                }
            },
            visualVariables: [
                {
                    type: "size",
                    field: "mag",
                    stops: [
                        {
                            value: 2.5,
                            size: "4px"
                        },
                        {
                            value: 8,
                            size: "40px"
                        }
                    ]
                }
            ]
        };

        fLayer = new EsriGeoJSONLayer({
            url: '/strapi/changespot/geojson?qsx=202001&hsx=202002',
            renderer: renderer2

        })
        this.props.view.map.add(fLayer);
    };

    // 创建热力图图例
    creatHeatLegend = () => {
        // const legend2 = new EsriLegend({
        //     view: this.props.view,
        //     container:'legend'
        // })
    };

    // 创建饼图图例
    creatPieLegend = () => {
        if (!legend)
            legend = new G2.Chart({
                container: 'legend',
                height: 360,
                width: 260,
                padding: [20, 20, 20, 50],
            });
        const ds = new DataSet();
        const dv = ds.createView().source(this.props.tbcount);
        dv.transform({
            type: 'rename',
            map: transField,
        });
        legend.source(dv);
        legend.coord('theta', {
            radius: 0.75,
        });
        legend.tooltip({
            showTitle: false,
            itemTpl:
                '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
        });

        legend
            .intervalStack()
            .position('任务数量')
            .color('COUNTY')
            .label('COUNTY')
            .tooltip('任务数量')
            .style({
                lineWidth: 1,
                stroke: '#fff',
            });
        legend.render();
        this.setState({
            renderLegend: true,
            legendTitle: '各县区任务数量饼状图',
        });
    };

    mapPointToPosition = (xLNG, yLAT) => {
        const mapPoint = {
            x: xLNG,
            y: yLAT,
            spatialReference: {
                wkid: 4326,
            },
        };
        const screenPoint = this.props.view.toScreen(mapPoint); // 屏幕坐标
        const position = {
            x: screenPoint.x - 20,
            y: screenPoint.y - 110,
        }; // 实际位置偏移
        return position;
    };

    renderChart = () => {
        // 清除/添加行政区图层
        if (!xzqLayer) {
            xzqLayer = new EsriFeatureLayer({ url: xzqFeature.layerUrl, id: xzqFeature.key });
            this.props.view.map.add(xzqLayer);
        }

        // 获取表单数据
        const refObj = this.formStasticRef.current.getFieldsValue();
        this.removeHeatLayer(refObj.chartType);
        let data;
        let callback;
        let legendCallback;
        // 根据表单判断图形类别，选择数据源
        switch (refObj.chartType) {
            case 'histogram':
                data = this.props.tbcount;
                callback = this.creatHistorgramChart;
                legendCallback = this.creatHistorgramLegend;
                this.setState({
                    selectOptions: histogram,
                });
                break;
            case 'pieChart':
                data = this.props.bzttj;
                callback = this.creatPieChart;
                legendCallback = this.creatPieLegend;
                this.setState({
                    selectOptions: pieChart,
                });
                break;
            case 'heatMap':
                data = null;
                this.creatHeatMap();
                callback = null;
                legendCallback = this.creatHeatLegend;
                break;
            default:
                data = null;
                break;
        }

        // 清除/重设地图extentChange事件
        if (this.mapExtentChange) this.mapExtentChange.remove();
        this.mapExtentChange = this.props.view.watch('extent', () => {
            // 清除上次绘制
            charts.forEach(item => {
                item.clear();
            });
            // 绘制图形
            if (data) this.createChartToMap(data, refObj, callback);
        });

        // 创建图例部分的图形
        this.props.view.extent = xzqFeature.extent;
        setTimeout(() => {
            this.removeLegend();
            if (legendCallback) legendCallback(refObj);
        }, 600);
    };

    removeChart = () => {
        charts = [];
        ReactDOM.unmountComponentAtNode(document.getElementById('container'));
        if (this.mapExtentChange) this.mapExtentChange.remove();
        if (fLayer) {
            this.props.view.map.remove(fLayer);
            fLayer = null;
        }
    };

    removeHeatLayer = type => {
        switch (type) {
            case 'heatMap':
                if (fLayer) {
                    this.props.view.map.remove(fLayer);
                    fLayer = null;
                }
                break;
            default:
                if (fLayer) {
                    this.props.view.map.remove(fLayer);
                    fLayer = null;
                }

                break;
        }
    };

    removeLegend = () => {
        if (legend) legend.clear();
        this.setState({
            renderLegend: false,
        });
    };

    setDateToday = type => {
        let date;
        const d = new Date();
        switch (type) {
            case 'pre':
                date = `${d.getFullYear()}0${d.getMonth()}`;
                break;
            case 'today':
                date = `${d.getFullYear()}0${d.getMonth() + 1}`;
                break;
            default:
                break;
        }
        return date;
    };

    render() {
        console.log(this.props.geoJson);

        return (
            <>
                <Drawer
                    title="统计分析"
                    placement="right"
                    mask={false}
                    onClose={() => {
                        this.removeAll();
                        legend = null;
                        this.props.onClose();
                    }}
                    visible={this.props.visible}
                    width={320}
                >
                    <Form
                        layout="horizontal"
                        ref={this.formStasticRef}
                        initialValues={{
                            field: 'TASKNUM',
                            chartType: 'histogram',
                        }}
                    >
                        <Form.Item name="chartType" label="图表类型">
                            <Select
                                style={{ width: 200 }}
                                onChange={() => {
                                    const refObj = this.formStasticRef.current.getFieldsValue();
                                    switch (refObj.chartType) {
                                        case 'histogram':
                                            this.setState({
                                                selectOptions: histogram,
                                            });
                                            this.formStasticRef.current.setFieldsValue({
                                                field: 'TASKNUM',
                                            });
                                            break;
                                        case 'pieChart':
                                            this.setState({
                                                selectOptions: pieChart,
                                            });
                                            this.formStasticRef.current.setFieldsValue({
                                                field: 'TASKNUM',
                                            });
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                            >
                                <Select.Option value="histogram">柱状图</Select.Option>
                                <Select.Option value="pieChart">饼状图</Select.Option>
                                <Select.Option value="heatMap">热力图</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="field" label="统计字段">
                            <Select style={{ width: 200 }}>
                                {this.state.selectOptions.map(item => (
                                    <Select.Option key={item.key} value={item.value}>
                                        {item.text}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="datePicker" label="时间范围">
                            <DatePicker.RangePicker
                                defaultValue={[
                                    moment(this.setDateToday('pre'), 'YYYYMM'),
                                    moment(this.setDateToday('today'), 'YYYYMM'),
                                ]}
                                format="YYYYMM"
                                style={{ width: 200 }}
                                picker="month"
                            />
                        </Form.Item>

                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={() => {
                                    this.renderChart();
                                }}
                            >
                                开始统计
              </Button>
              &#12288;
              <Button
                                type="danger"
                                onClick={() => {
                                    this.removeChart();
                                    this.removeLegend();
                                }}
                            >
                                移除图表
              </Button>
                        </Form.Item>
                    </Form>
                    <div style={{ overflow: 'hidden' }}>
                        <div id="legend" />
                        {this.state.renderLegend ? (
                            <h4 style={{ textAlign: 'center' }}>{this.state.legendTitle}</h4>
                        ) : null}
                    </div>
                </Drawer>
            </>
        );
    }
}

export default connect(({ remoteSensing }) => ({
    tbcount: remoteSensing.tbcount,
    bzttj: remoteSensing.bzttj,
    geoJson: remoteSensing.geoJson,
}))(GISStastic);
